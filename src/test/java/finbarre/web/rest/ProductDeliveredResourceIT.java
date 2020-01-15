package finbarre.web.rest;

import finbarre.BarfitterApp;
import finbarre.domain.ProductDelivered;
import finbarre.repository.ProductDeliveredRepository;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static finbarre.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link ProductDeliveredResource} REST controller.
 */
@SpringBootTest(classes = BarfitterApp.class)
public class ProductDeliveredResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DELIVERY_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DELIVERY_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final BigDecimal DEFAULT_PURCH_PRICE_GROSS = new BigDecimal(1);
    private static final BigDecimal UPDATED_PURCH_PRICE_GROSS = new BigDecimal(2);

    private static final BigDecimal DEFAULT_SELL_PRICE_GROSS = new BigDecimal(1);
    private static final BigDecimal UPDATED_SELL_PRICE_GROSS = new BigDecimal(2);

    private static final BigDecimal DEFAULT_PURCH_PRICE_NET = new BigDecimal(1);
    private static final BigDecimal UPDATED_PURCH_PRICE_NET = new BigDecimal(2);

    private static final BigDecimal DEFAULT_PURCH_VAT_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_PURCH_VAT_VALUE = new BigDecimal(2);

    private static final BigDecimal DEFAULT_SELL_PRICE_NET = new BigDecimal(1);
    private static final BigDecimal UPDATED_SELL_PRICE_NET = new BigDecimal(2);

    private static final BigDecimal DEFAULT_SELL_VAT_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_SELL_VAT_VALUE = new BigDecimal(2);

    @Autowired
    private ProductDeliveredRepository productDeliveredRepository;

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

    private MockMvc restProductDeliveredMockMvc;

    private ProductDelivered productDelivered;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProductDeliveredResource productDeliveredResource = new ProductDeliveredResource(productDeliveredRepository);
        this.restProductDeliveredMockMvc = MockMvcBuilders.standaloneSetup(productDeliveredResource)
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
    public static ProductDelivered createEntity(EntityManager em) {
        ProductDelivered productDelivered = new ProductDelivered()
            .name(DEFAULT_NAME)
            .deliveryDate(DEFAULT_DELIVERY_DATE)
            .quantity(DEFAULT_QUANTITY)
            .purchPriceGross(DEFAULT_PURCH_PRICE_GROSS)
            .sellPriceGross(DEFAULT_SELL_PRICE_GROSS)
            .purchPriceNet(DEFAULT_PURCH_PRICE_NET)
            .purchVatValue(DEFAULT_PURCH_VAT_VALUE)
            .sellPriceNet(DEFAULT_SELL_PRICE_NET)
            .sellVatValue(DEFAULT_SELL_VAT_VALUE);
        return productDelivered;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductDelivered createUpdatedEntity(EntityManager em) {
        ProductDelivered productDelivered = new ProductDelivered()
            .name(UPDATED_NAME)
            .deliveryDate(UPDATED_DELIVERY_DATE)
            .quantity(UPDATED_QUANTITY)
            .purchPriceGross(UPDATED_PURCH_PRICE_GROSS)
            .sellPriceGross(UPDATED_SELL_PRICE_GROSS)
            .purchPriceNet(UPDATED_PURCH_PRICE_NET)
            .purchVatValue(UPDATED_PURCH_VAT_VALUE)
            .sellPriceNet(UPDATED_SELL_PRICE_NET)
            .sellVatValue(UPDATED_SELL_VAT_VALUE);
        return productDelivered;
    }

    @BeforeEach
    public void initTest() {
        productDelivered = createEntity(em);
    }

    @Test
    @Transactional
    public void createProductDelivered() throws Exception {
        int databaseSizeBeforeCreate = productDeliveredRepository.findAll().size();

        // Create the ProductDelivered
        restProductDeliveredMockMvc.perform(post("/api/product-delivereds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productDelivered)))
            .andExpect(status().isCreated());

        // Validate the ProductDelivered in the database
        List<ProductDelivered> productDeliveredList = productDeliveredRepository.findAll();
        assertThat(productDeliveredList).hasSize(databaseSizeBeforeCreate + 1);
        ProductDelivered testProductDelivered = productDeliveredList.get(productDeliveredList.size() - 1);
        assertThat(testProductDelivered.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProductDelivered.getDeliveryDate()).isEqualTo(DEFAULT_DELIVERY_DATE);
        assertThat(testProductDelivered.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testProductDelivered.getPurchPriceGross()).isEqualTo(DEFAULT_PURCH_PRICE_GROSS);
        assertThat(testProductDelivered.getSellPriceGross()).isEqualTo(DEFAULT_SELL_PRICE_GROSS);
        assertThat(testProductDelivered.getPurchPriceNet()).isEqualTo(DEFAULT_PURCH_PRICE_NET);
        assertThat(testProductDelivered.getPurchVatValue()).isEqualTo(DEFAULT_PURCH_VAT_VALUE);
        assertThat(testProductDelivered.getSellPriceNet()).isEqualTo(DEFAULT_SELL_PRICE_NET);
        assertThat(testProductDelivered.getSellVatValue()).isEqualTo(DEFAULT_SELL_VAT_VALUE);
    }

    @Test
    @Transactional
    public void createProductDeliveredWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productDeliveredRepository.findAll().size();

        // Create the ProductDelivered with an existing ID
        productDelivered.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductDeliveredMockMvc.perform(post("/api/product-delivereds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productDelivered)))
            .andExpect(status().isBadRequest());

        // Validate the ProductDelivered in the database
        List<ProductDelivered> productDeliveredList = productDeliveredRepository.findAll();
        assertThat(productDeliveredList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkSellPriceGrossIsRequired() throws Exception {
        int databaseSizeBeforeTest = productDeliveredRepository.findAll().size();
        // set the field null
        productDelivered.setSellPriceGross(null);

        // Create the ProductDelivered, which fails.

        restProductDeliveredMockMvc.perform(post("/api/product-delivereds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productDelivered)))
            .andExpect(status().isBadRequest());

        List<ProductDelivered> productDeliveredList = productDeliveredRepository.findAll();
        assertThat(productDeliveredList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllProductDelivereds() throws Exception {
        // Initialize the database
        productDeliveredRepository.saveAndFlush(productDelivered);

        // Get all the productDeliveredList
        restProductDeliveredMockMvc.perform(get("/api/product-delivereds?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productDelivered.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].deliveryDate").value(hasItem(DEFAULT_DELIVERY_DATE.toString())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].purchPriceGross").value(hasItem(DEFAULT_PURCH_PRICE_GROSS.intValue())))
            .andExpect(jsonPath("$.[*].sellPriceGross").value(hasItem(DEFAULT_SELL_PRICE_GROSS.intValue())))
            .andExpect(jsonPath("$.[*].purchPriceNet").value(hasItem(DEFAULT_PURCH_PRICE_NET.intValue())))
            .andExpect(jsonPath("$.[*].purchVatValue").value(hasItem(DEFAULT_PURCH_VAT_VALUE.intValue())))
            .andExpect(jsonPath("$.[*].sellPriceNet").value(hasItem(DEFAULT_SELL_PRICE_NET.intValue())))
            .andExpect(jsonPath("$.[*].sellVatValue").value(hasItem(DEFAULT_SELL_VAT_VALUE.intValue())));
    }
    
    @Test
    @Transactional
    public void getProductDelivered() throws Exception {
        // Initialize the database
        productDeliveredRepository.saveAndFlush(productDelivered);

        // Get the productDelivered
        restProductDeliveredMockMvc.perform(get("/api/product-delivereds/{id}", productDelivered.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(productDelivered.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.deliveryDate").value(DEFAULT_DELIVERY_DATE.toString()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY))
            .andExpect(jsonPath("$.purchPriceGross").value(DEFAULT_PURCH_PRICE_GROSS.intValue()))
            .andExpect(jsonPath("$.sellPriceGross").value(DEFAULT_SELL_PRICE_GROSS.intValue()))
            .andExpect(jsonPath("$.purchPriceNet").value(DEFAULT_PURCH_PRICE_NET.intValue()))
            .andExpect(jsonPath("$.purchVatValue").value(DEFAULT_PURCH_VAT_VALUE.intValue()))
            .andExpect(jsonPath("$.sellPriceNet").value(DEFAULT_SELL_PRICE_NET.intValue()))
            .andExpect(jsonPath("$.sellVatValue").value(DEFAULT_SELL_VAT_VALUE.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingProductDelivered() throws Exception {
        // Get the productDelivered
        restProductDeliveredMockMvc.perform(get("/api/product-delivereds/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProductDelivered() throws Exception {
        // Initialize the database
        productDeliveredRepository.saveAndFlush(productDelivered);

        int databaseSizeBeforeUpdate = productDeliveredRepository.findAll().size();

        // Update the productDelivered
        ProductDelivered updatedProductDelivered = productDeliveredRepository.findById(productDelivered.getId()).get();
        // Disconnect from session so that the updates on updatedProductDelivered are not directly saved in db
        em.detach(updatedProductDelivered);
        updatedProductDelivered
            .name(UPDATED_NAME)
            .deliveryDate(UPDATED_DELIVERY_DATE)
            .quantity(UPDATED_QUANTITY)
            .purchPriceGross(UPDATED_PURCH_PRICE_GROSS)
            .sellPriceGross(UPDATED_SELL_PRICE_GROSS)
            .purchPriceNet(UPDATED_PURCH_PRICE_NET)
            .purchVatValue(UPDATED_PURCH_VAT_VALUE)
            .sellPriceNet(UPDATED_SELL_PRICE_NET)
            .sellVatValue(UPDATED_SELL_VAT_VALUE);

        restProductDeliveredMockMvc.perform(put("/api/product-delivereds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedProductDelivered)))
            .andExpect(status().isOk());

        // Validate the ProductDelivered in the database
        List<ProductDelivered> productDeliveredList = productDeliveredRepository.findAll();
        assertThat(productDeliveredList).hasSize(databaseSizeBeforeUpdate);
        ProductDelivered testProductDelivered = productDeliveredList.get(productDeliveredList.size() - 1);
        assertThat(testProductDelivered.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProductDelivered.getDeliveryDate()).isEqualTo(UPDATED_DELIVERY_DATE);
        assertThat(testProductDelivered.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testProductDelivered.getPurchPriceGross()).isEqualTo(UPDATED_PURCH_PRICE_GROSS);
        assertThat(testProductDelivered.getSellPriceGross()).isEqualTo(UPDATED_SELL_PRICE_GROSS);
        assertThat(testProductDelivered.getPurchPriceNet()).isEqualTo(UPDATED_PURCH_PRICE_NET);
        assertThat(testProductDelivered.getPurchVatValue()).isEqualTo(UPDATED_PURCH_VAT_VALUE);
        assertThat(testProductDelivered.getSellPriceNet()).isEqualTo(UPDATED_SELL_PRICE_NET);
        assertThat(testProductDelivered.getSellVatValue()).isEqualTo(UPDATED_SELL_VAT_VALUE);
    }

    @Test
    @Transactional
    public void updateNonExistingProductDelivered() throws Exception {
        int databaseSizeBeforeUpdate = productDeliveredRepository.findAll().size();

        // Create the ProductDelivered

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductDeliveredMockMvc.perform(put("/api/product-delivereds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productDelivered)))
            .andExpect(status().isBadRequest());

        // Validate the ProductDelivered in the database
        List<ProductDelivered> productDeliveredList = productDeliveredRepository.findAll();
        assertThat(productDeliveredList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteProductDelivered() throws Exception {
        // Initialize the database
        productDeliveredRepository.saveAndFlush(productDelivered);

        int databaseSizeBeforeDelete = productDeliveredRepository.findAll().size();

        // Delete the productDelivered
        restProductDeliveredMockMvc.perform(delete("/api/product-delivereds/{id}", productDelivered.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductDelivered> productDeliveredList = productDeliveredRepository.findAll();
        assertThat(productDeliveredList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductDelivered.class);
        ProductDelivered productDelivered1 = new ProductDelivered();
        productDelivered1.setId(1L);
        ProductDelivered productDelivered2 = new ProductDelivered();
        productDelivered2.setId(productDelivered1.getId());
        assertThat(productDelivered1).isEqualTo(productDelivered2);
        productDelivered2.setId(2L);
        assertThat(productDelivered1).isNotEqualTo(productDelivered2);
        productDelivered1.setId(null);
        assertThat(productDelivered1).isNotEqualTo(productDelivered2);
    }
}
