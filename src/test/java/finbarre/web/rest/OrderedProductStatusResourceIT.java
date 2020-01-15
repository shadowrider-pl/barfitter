package finbarre.web.rest;

import finbarre.BarfitterApp;
import finbarre.domain.OrderedProductStatus;
import finbarre.repository.OrderedProductStatusRepository;
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
import java.util.List;

import static finbarre.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link OrderedProductStatusResource} REST controller.
 */
@SpringBootTest(classes = BarfitterApp.class)
public class OrderedProductStatusResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    @Autowired
    private OrderedProductStatusRepository orderedProductStatusRepository;

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

    private MockMvc restOrderedProductStatusMockMvc;

    private OrderedProductStatus orderedProductStatus;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final OrderedProductStatusResource orderedProductStatusResource = new OrderedProductStatusResource(orderedProductStatusRepository);
        this.restOrderedProductStatusMockMvc = MockMvcBuilders.standaloneSetup(orderedProductStatusResource)
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
    public static OrderedProductStatus createEntity(EntityManager em) {
        OrderedProductStatus orderedProductStatus = new OrderedProductStatus()
            .description(DEFAULT_DESCRIPTION)
            .active(DEFAULT_ACTIVE);
        return orderedProductStatus;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderedProductStatus createUpdatedEntity(EntityManager em) {
        OrderedProductStatus orderedProductStatus = new OrderedProductStatus()
            .description(UPDATED_DESCRIPTION)
            .active(UPDATED_ACTIVE);
        return orderedProductStatus;
    }

    @BeforeEach
    public void initTest() {
        orderedProductStatus = createEntity(em);
    }

    @Test
    @Transactional
    public void createOrderedProductStatus() throws Exception {
        int databaseSizeBeforeCreate = orderedProductStatusRepository.findAll().size();

        // Create the OrderedProductStatus
        restOrderedProductStatusMockMvc.perform(post("/api/ordered-product-statuses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(orderedProductStatus)))
            .andExpect(status().isCreated());

        // Validate the OrderedProductStatus in the database
        List<OrderedProductStatus> orderedProductStatusList = orderedProductStatusRepository.findAll();
        assertThat(orderedProductStatusList).hasSize(databaseSizeBeforeCreate + 1);
        OrderedProductStatus testOrderedProductStatus = orderedProductStatusList.get(orderedProductStatusList.size() - 1);
        assertThat(testOrderedProductStatus.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testOrderedProductStatus.isActive()).isEqualTo(DEFAULT_ACTIVE);
    }

    @Test
    @Transactional
    public void createOrderedProductStatusWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = orderedProductStatusRepository.findAll().size();

        // Create the OrderedProductStatus with an existing ID
        orderedProductStatus.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrderedProductStatusMockMvc.perform(post("/api/ordered-product-statuses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(orderedProductStatus)))
            .andExpect(status().isBadRequest());

        // Validate the OrderedProductStatus in the database
        List<OrderedProductStatus> orderedProductStatusList = orderedProductStatusRepository.findAll();
        assertThat(orderedProductStatusList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderedProductStatusRepository.findAll().size();
        // set the field null
        orderedProductStatus.setDescription(null);

        // Create the OrderedProductStatus, which fails.

        restOrderedProductStatusMockMvc.perform(post("/api/ordered-product-statuses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(orderedProductStatus)))
            .andExpect(status().isBadRequest());

        List<OrderedProductStatus> orderedProductStatusList = orderedProductStatusRepository.findAll();
        assertThat(orderedProductStatusList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllOrderedProductStatuses() throws Exception {
        // Initialize the database
        orderedProductStatusRepository.saveAndFlush(orderedProductStatus);

        // Get all the orderedProductStatusList
        restOrderedProductStatusMockMvc.perform(get("/api/ordered-product-statuses?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderedProductStatus.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getOrderedProductStatus() throws Exception {
        // Initialize the database
        orderedProductStatusRepository.saveAndFlush(orderedProductStatus);

        // Get the orderedProductStatus
        restOrderedProductStatusMockMvc.perform(get("/api/ordered-product-statuses/{id}", orderedProductStatus.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(orderedProductStatus.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingOrderedProductStatus() throws Exception {
        // Get the orderedProductStatus
        restOrderedProductStatusMockMvc.perform(get("/api/ordered-product-statuses/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOrderedProductStatus() throws Exception {
        // Initialize the database
        orderedProductStatusRepository.saveAndFlush(orderedProductStatus);

        int databaseSizeBeforeUpdate = orderedProductStatusRepository.findAll().size();

        // Update the orderedProductStatus
        OrderedProductStatus updatedOrderedProductStatus = orderedProductStatusRepository.findById(orderedProductStatus.getId()).get();
        // Disconnect from session so that the updates on updatedOrderedProductStatus are not directly saved in db
        em.detach(updatedOrderedProductStatus);
        updatedOrderedProductStatus
            .description(UPDATED_DESCRIPTION)
            .active(UPDATED_ACTIVE);

        restOrderedProductStatusMockMvc.perform(put("/api/ordered-product-statuses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedOrderedProductStatus)))
            .andExpect(status().isOk());

        // Validate the OrderedProductStatus in the database
        List<OrderedProductStatus> orderedProductStatusList = orderedProductStatusRepository.findAll();
        assertThat(orderedProductStatusList).hasSize(databaseSizeBeforeUpdate);
        OrderedProductStatus testOrderedProductStatus = orderedProductStatusList.get(orderedProductStatusList.size() - 1);
        assertThat(testOrderedProductStatus.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testOrderedProductStatus.isActive()).isEqualTo(UPDATED_ACTIVE);
    }

    @Test
    @Transactional
    public void updateNonExistingOrderedProductStatus() throws Exception {
        int databaseSizeBeforeUpdate = orderedProductStatusRepository.findAll().size();

        // Create the OrderedProductStatus

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderedProductStatusMockMvc.perform(put("/api/ordered-product-statuses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(orderedProductStatus)))
            .andExpect(status().isBadRequest());

        // Validate the OrderedProductStatus in the database
        List<OrderedProductStatus> orderedProductStatusList = orderedProductStatusRepository.findAll();
        assertThat(orderedProductStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteOrderedProductStatus() throws Exception {
        // Initialize the database
        orderedProductStatusRepository.saveAndFlush(orderedProductStatus);

        int databaseSizeBeforeDelete = orderedProductStatusRepository.findAll().size();

        // Delete the orderedProductStatus
        restOrderedProductStatusMockMvc.perform(delete("/api/ordered-product-statuses/{id}", orderedProductStatus.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OrderedProductStatus> orderedProductStatusList = orderedProductStatusRepository.findAll();
        assertThat(orderedProductStatusList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderedProductStatus.class);
        OrderedProductStatus orderedProductStatus1 = new OrderedProductStatus();
        orderedProductStatus1.setId(1L);
        OrderedProductStatus orderedProductStatus2 = new OrderedProductStatus();
        orderedProductStatus2.setId(orderedProductStatus1.getId());
        assertThat(orderedProductStatus1).isEqualTo(orderedProductStatus2);
        orderedProductStatus2.setId(2L);
        assertThat(orderedProductStatus1).isNotEqualTo(orderedProductStatus2);
        orderedProductStatus1.setId(null);
        assertThat(orderedProductStatus1).isNotEqualTo(orderedProductStatus2);
    }
}
