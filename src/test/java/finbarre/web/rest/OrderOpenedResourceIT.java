package finbarre.web.rest;

import finbarre.BarfitterApp;
import finbarre.domain.OrderOpened;
import finbarre.repository.OrderOpenedRepository;
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
 * Integration tests for the {@link OrderOpenedResource} REST controller.
 */
@SpringBootTest(classes = BarfitterApp.class)
public class OrderOpenedResourceIT {

    private static final BigDecimal DEFAULT_TOTAL = new BigDecimal(1);
    private static final BigDecimal UPDATED_TOTAL = new BigDecimal(2);

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_OPENING_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_OPENING_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_CLOSING_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CLOSING_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Long DEFAULT_ORDER_ID = 1L;
    private static final Long UPDATED_ORDER_ID = 2L;

    @Autowired
    private OrderOpenedRepository orderOpenedRepository;

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

    private MockMvc restOrderOpenedMockMvc;

    private OrderOpened orderOpened;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final OrderOpenedResource orderOpenedResource = new OrderOpenedResource(orderOpenedRepository);
        this.restOrderOpenedMockMvc = MockMvcBuilders.standaloneSetup(orderOpenedResource)
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
    public static OrderOpened createEntity(EntityManager em) {
        OrderOpened orderOpened = new OrderOpened()
            .total(DEFAULT_TOTAL)
            .comment(DEFAULT_COMMENT)
            .openingTime(DEFAULT_OPENING_TIME)
            .closingTime(DEFAULT_CLOSING_TIME)
            .orderId(DEFAULT_ORDER_ID);
        return orderOpened;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderOpened createUpdatedEntity(EntityManager em) {
        OrderOpened orderOpened = new OrderOpened()
            .total(UPDATED_TOTAL)
            .comment(UPDATED_COMMENT)
            .openingTime(UPDATED_OPENING_TIME)
            .closingTime(UPDATED_CLOSING_TIME)
            .orderId(UPDATED_ORDER_ID);
        return orderOpened;
    }

    @BeforeEach
    public void initTest() {
        orderOpened = createEntity(em);
    }

    @Test
    @Transactional
    public void createOrderOpened() throws Exception {
        int databaseSizeBeforeCreate = orderOpenedRepository.findAll().size();

        // Create the OrderOpened
        restOrderOpenedMockMvc.perform(post("/api/order-openeds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(orderOpened)))
            .andExpect(status().isCreated());

        // Validate the OrderOpened in the database
        List<OrderOpened> orderOpenedList = orderOpenedRepository.findAll();
        assertThat(orderOpenedList).hasSize(databaseSizeBeforeCreate + 1);
        OrderOpened testOrderOpened = orderOpenedList.get(orderOpenedList.size() - 1);
        assertThat(testOrderOpened.getTotal()).isEqualTo(DEFAULT_TOTAL);
        assertThat(testOrderOpened.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testOrderOpened.getOpeningTime()).isEqualTo(DEFAULT_OPENING_TIME);
        assertThat(testOrderOpened.getClosingTime()).isEqualTo(DEFAULT_CLOSING_TIME);
        assertThat(testOrderOpened.getOrderId()).isEqualTo(DEFAULT_ORDER_ID);
    }

    @Test
    @Transactional
    public void createOrderOpenedWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = orderOpenedRepository.findAll().size();

        // Create the OrderOpened with an existing ID
        orderOpened.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrderOpenedMockMvc.perform(post("/api/order-openeds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(orderOpened)))
            .andExpect(status().isBadRequest());

        // Validate the OrderOpened in the database
        List<OrderOpened> orderOpenedList = orderOpenedRepository.findAll();
        assertThat(orderOpenedList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllOrderOpeneds() throws Exception {
        // Initialize the database
        orderOpenedRepository.saveAndFlush(orderOpened);

        // Get all the orderOpenedList
        restOrderOpenedMockMvc.perform(get("/api/order-openeds?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderOpened.getId().intValue())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.intValue())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)))
            .andExpect(jsonPath("$.[*].openingTime").value(hasItem(sameInstant(DEFAULT_OPENING_TIME))))
            .andExpect(jsonPath("$.[*].closingTime").value(hasItem(sameInstant(DEFAULT_CLOSING_TIME))))
            .andExpect(jsonPath("$.[*].orderId").value(hasItem(DEFAULT_ORDER_ID.intValue())));
    }
    
    @Test
    @Transactional
    public void getOrderOpened() throws Exception {
        // Initialize the database
        orderOpenedRepository.saveAndFlush(orderOpened);

        // Get the orderOpened
        restOrderOpenedMockMvc.perform(get("/api/order-openeds/{id}", orderOpened.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(orderOpened.getId().intValue()))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL.intValue()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT))
            .andExpect(jsonPath("$.openingTime").value(sameInstant(DEFAULT_OPENING_TIME)))
            .andExpect(jsonPath("$.closingTime").value(sameInstant(DEFAULT_CLOSING_TIME)))
            .andExpect(jsonPath("$.orderId").value(DEFAULT_ORDER_ID.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingOrderOpened() throws Exception {
        // Get the orderOpened
        restOrderOpenedMockMvc.perform(get("/api/order-openeds/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOrderOpened() throws Exception {
        // Initialize the database
        orderOpenedRepository.saveAndFlush(orderOpened);

        int databaseSizeBeforeUpdate = orderOpenedRepository.findAll().size();

        // Update the orderOpened
        OrderOpened updatedOrderOpened = orderOpenedRepository.findById(orderOpened.getId()).get();
        // Disconnect from session so that the updates on updatedOrderOpened are not directly saved in db
        em.detach(updatedOrderOpened);
        updatedOrderOpened
            .total(UPDATED_TOTAL)
            .comment(UPDATED_COMMENT)
            .openingTime(UPDATED_OPENING_TIME)
            .closingTime(UPDATED_CLOSING_TIME)
            .orderId(UPDATED_ORDER_ID);

        restOrderOpenedMockMvc.perform(put("/api/order-openeds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedOrderOpened)))
            .andExpect(status().isOk());

        // Validate the OrderOpened in the database
        List<OrderOpened> orderOpenedList = orderOpenedRepository.findAll();
        assertThat(orderOpenedList).hasSize(databaseSizeBeforeUpdate);
        OrderOpened testOrderOpened = orderOpenedList.get(orderOpenedList.size() - 1);
        assertThat(testOrderOpened.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testOrderOpened.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testOrderOpened.getOpeningTime()).isEqualTo(UPDATED_OPENING_TIME);
        assertThat(testOrderOpened.getClosingTime()).isEqualTo(UPDATED_CLOSING_TIME);
        assertThat(testOrderOpened.getOrderId()).isEqualTo(UPDATED_ORDER_ID);
    }

    @Test
    @Transactional
    public void updateNonExistingOrderOpened() throws Exception {
        int databaseSizeBeforeUpdate = orderOpenedRepository.findAll().size();

        // Create the OrderOpened

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderOpenedMockMvc.perform(put("/api/order-openeds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(orderOpened)))
            .andExpect(status().isBadRequest());

        // Validate the OrderOpened in the database
        List<OrderOpened> orderOpenedList = orderOpenedRepository.findAll();
        assertThat(orderOpenedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteOrderOpened() throws Exception {
        // Initialize the database
        orderOpenedRepository.saveAndFlush(orderOpened);

        int databaseSizeBeforeDelete = orderOpenedRepository.findAll().size();

        // Delete the orderOpened
        restOrderOpenedMockMvc.perform(delete("/api/order-openeds/{id}", orderOpened.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OrderOpened> orderOpenedList = orderOpenedRepository.findAll();
        assertThat(orderOpenedList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderOpened.class);
        OrderOpened orderOpened1 = new OrderOpened();
        orderOpened1.setId(1L);
        OrderOpened orderOpened2 = new OrderOpened();
        orderOpened2.setId(orderOpened1.getId());
        assertThat(orderOpened1).isEqualTo(orderOpened2);
        orderOpened2.setId(2L);
        assertThat(orderOpened1).isNotEqualTo(orderOpened2);
        orderOpened1.setId(null);
        assertThat(orderOpened1).isNotEqualTo(orderOpened2);
    }
}
