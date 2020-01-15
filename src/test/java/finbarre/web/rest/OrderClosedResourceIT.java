package finbarre.web.rest;

import finbarre.BarfitterApp;
import finbarre.domain.OrderClosed;
import finbarre.repository.OrderClosedRepository;
import finbarre.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static finbarre.web.rest.TestUtil.sameInstant;
import static finbarre.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link OrderClosedResource} REST controller.
 */
@SpringBootTest(classes = BarfitterApp.class)
public class OrderClosedResourceIT {

    private static final ZonedDateTime DEFAULT_OPENING_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_OPENING_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_CLOSING_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CLOSING_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final BigDecimal DEFAULT_TOTAL = new BigDecimal(1);
    private static final BigDecimal UPDATED_TOTAL = new BigDecimal(2);

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final Long DEFAULT_ORDER_ID = 1L;
    private static final Long UPDATED_ORDER_ID = 2L;

    @Autowired
    private OrderClosedRepository orderClosedRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restOrderClosedMockMvc;

    private OrderClosed orderClosed;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final OrderClosedResource orderClosedResource = new OrderClosedResource(orderClosedRepository);
        this.restOrderClosedMockMvc = MockMvcBuilders.standaloneSetup(orderClosedResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderClosed createEntity(EntityManager em) {
        OrderClosed orderClosed = new OrderClosed()
            .openingTime(DEFAULT_OPENING_TIME)
            .closingTime(DEFAULT_CLOSING_TIME)
            .total(DEFAULT_TOTAL)
            .comment(DEFAULT_COMMENT)
            .orderId(DEFAULT_ORDER_ID);
        return orderClosed;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderClosed createUpdatedEntity(EntityManager em) {
        OrderClosed orderClosed = new OrderClosed()
            .openingTime(UPDATED_OPENING_TIME)
            .closingTime(UPDATED_CLOSING_TIME)
            .total(UPDATED_TOTAL)
            .comment(UPDATED_COMMENT)
            .orderId(UPDATED_ORDER_ID);
        return orderClosed;
    }

    @BeforeEach
    public void initTest() {
        orderClosed = createEntity(em);
    }

    @Test
    @Transactional
    public void createOrderClosed() throws Exception {
        int databaseSizeBeforeCreate = orderClosedRepository.findAll().size();

        // Create the OrderClosed
        restOrderClosedMockMvc.perform(post("/api/order-closeds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(orderClosed)))
            .andExpect(status().isCreated());

        // Validate the OrderClosed in the database
        List<OrderClosed> orderClosedList = orderClosedRepository.findAll();
        assertThat(orderClosedList).hasSize(databaseSizeBeforeCreate + 1);
        OrderClosed testOrderClosed = orderClosedList.get(orderClosedList.size() - 1);
        assertThat(testOrderClosed.getOpeningTime()).isEqualTo(DEFAULT_OPENING_TIME);
        assertThat(testOrderClosed.getClosingTime()).isEqualTo(DEFAULT_CLOSING_TIME);
        assertThat(testOrderClosed.getTotal()).isEqualTo(DEFAULT_TOTAL);
        assertThat(testOrderClosed.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testOrderClosed.getOrderId()).isEqualTo(DEFAULT_ORDER_ID);
    }

    @Test
    @Transactional
    public void createOrderClosedWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = orderClosedRepository.findAll().size();

        // Create the OrderClosed with an existing ID
        orderClosed.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrderClosedMockMvc.perform(post("/api/order-closeds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(orderClosed)))
            .andExpect(status().isBadRequest());

        // Validate the OrderClosed in the database
        List<OrderClosed> orderClosedList = orderClosedRepository.findAll();
        assertThat(orderClosedList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkOpeningTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderClosedRepository.findAll().size();
        // set the field null
        orderClosed.setOpeningTime(null);

        // Create the OrderClosed, which fails.

        restOrderClosedMockMvc.perform(post("/api/order-closeds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(orderClosed)))
            .andExpect(status().isBadRequest());

        List<OrderClosed> orderClosedList = orderClosedRepository.findAll();
        assertThat(orderClosedList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkClosingTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderClosedRepository.findAll().size();
        // set the field null
        orderClosed.setClosingTime(null);

        // Create the OrderClosed, which fails.

        restOrderClosedMockMvc.perform(post("/api/order-closeds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(orderClosed)))
            .andExpect(status().isBadRequest());

        List<OrderClosed> orderClosedList = orderClosedRepository.findAll();
        assertThat(orderClosedList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllOrderCloseds() throws Exception {
        // Initialize the database
        orderClosedRepository.saveAndFlush(orderClosed);

        // Get all the orderClosedList
        restOrderClosedMockMvc.perform(get("/api/order-closeds?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderClosed.getId().intValue())))
            .andExpect(jsonPath("$.[*].openingTime").value(hasItem(sameInstant(DEFAULT_OPENING_TIME))))
            .andExpect(jsonPath("$.[*].closingTime").value(hasItem(sameInstant(DEFAULT_CLOSING_TIME))))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.intValue())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)))
            .andExpect(jsonPath("$.[*].orderId").value(hasItem(DEFAULT_ORDER_ID.intValue())));
    }
    
    @Test
    @Transactional
    public void getOrderClosed() throws Exception {
        // Initialize the database
        orderClosedRepository.saveAndFlush(orderClosed);

        // Get the orderClosed
        restOrderClosedMockMvc.perform(get("/api/order-closeds/{id}", orderClosed.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(orderClosed.getId().intValue()))
            .andExpect(jsonPath("$.openingTime").value(sameInstant(DEFAULT_OPENING_TIME)))
            .andExpect(jsonPath("$.closingTime").value(sameInstant(DEFAULT_CLOSING_TIME)))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL.intValue()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT))
            .andExpect(jsonPath("$.orderId").value(DEFAULT_ORDER_ID.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingOrderClosed() throws Exception {
        // Get the orderClosed
        restOrderClosedMockMvc.perform(get("/api/order-closeds/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOrderClosed() throws Exception {
        // Initialize the database
        orderClosedRepository.saveAndFlush(orderClosed);

        int databaseSizeBeforeUpdate = orderClosedRepository.findAll().size();

        // Update the orderClosed
        OrderClosed updatedOrderClosed = orderClosedRepository.findById(orderClosed.getId()).get();
        // Disconnect from session so that the updates on updatedOrderClosed are not directly saved in db
        em.detach(updatedOrderClosed);
        updatedOrderClosed
            .openingTime(UPDATED_OPENING_TIME)
            .closingTime(UPDATED_CLOSING_TIME)
            .total(UPDATED_TOTAL)
            .comment(UPDATED_COMMENT)
            .orderId(UPDATED_ORDER_ID);

        restOrderClosedMockMvc.perform(put("/api/order-closeds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedOrderClosed)))
            .andExpect(status().isOk());

        // Validate the OrderClosed in the database
        List<OrderClosed> orderClosedList = orderClosedRepository.findAll();
        assertThat(orderClosedList).hasSize(databaseSizeBeforeUpdate);
        OrderClosed testOrderClosed = orderClosedList.get(orderClosedList.size() - 1);
        assertThat(testOrderClosed.getOpeningTime()).isEqualTo(UPDATED_OPENING_TIME);
        assertThat(testOrderClosed.getClosingTime()).isEqualTo(UPDATED_CLOSING_TIME);
        assertThat(testOrderClosed.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testOrderClosed.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testOrderClosed.getOrderId()).isEqualTo(UPDATED_ORDER_ID);
    }

    @Test
    @Transactional
    public void updateNonExistingOrderClosed() throws Exception {
        int databaseSizeBeforeUpdate = orderClosedRepository.findAll().size();

        // Create the OrderClosed

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderClosedMockMvc.perform(put("/api/order-closeds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(orderClosed)))
            .andExpect(status().isBadRequest());

        // Validate the OrderClosed in the database
        List<OrderClosed> orderClosedList = orderClosedRepository.findAll();
        assertThat(orderClosedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteOrderClosed() throws Exception {
        // Initialize the database
        orderClosedRepository.saveAndFlush(orderClosed);

        int databaseSizeBeforeDelete = orderClosedRepository.findAll().size();

        // Delete the orderClosed
        restOrderClosedMockMvc.perform(delete("/api/order-closeds/{id}", orderClosed.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OrderClosed> orderClosedList = orderClosedRepository.findAll();
        assertThat(orderClosedList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderClosed.class);
        OrderClosed orderClosed1 = new OrderClosed();
        orderClosed1.setId(1L);
        OrderClosed orderClosed2 = new OrderClosed();
        orderClosed2.setId(orderClosed1.getId());
        assertThat(orderClosed1).isEqualTo(orderClosed2);
        orderClosed2.setId(2L);
        assertThat(orderClosed1).isNotEqualTo(orderClosed2);
        orderClosed1.setId(null);
        assertThat(orderClosed1).isNotEqualTo(orderClosed2);
    }
}
