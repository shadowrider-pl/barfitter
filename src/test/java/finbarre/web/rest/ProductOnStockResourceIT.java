package finbarre.web.rest;

import finbarre.BarfitterApp;
import finbarre.domain.ProductOnStock;
import finbarre.repository.ProductOnStockRepository;
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
 * Integration tests for the {@link ProductOnStockResource} REST controller.
 */
@SpringBootTest(classes = BarfitterApp.class)
public class ProductOnStockResourceIT {

    private static final LocalDate DEFAULT_DELIVERY_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DELIVERY_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final BigDecimal DEFAULT_PURCH_PRICE_NET = new BigDecimal(1);
    private static final BigDecimal UPDATED_PURCH_PRICE_NET = new BigDecimal(2);

    private static final BigDecimal DEFAULT_PURCH_PRICE_GROSS = new BigDecimal(1);
    private static final BigDecimal UPDATED_PURCH_PRICE_GROSS = new BigDecimal(2);

    private static final BigDecimal DEFAULT_PURCH_VAT_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_PURCH_VAT_VALUE = new BigDecimal(2);

    private static final BigDecimal DEFAULT_SELL_PRICE_NET = new BigDecimal(1);
    private static final BigDecimal UPDATED_SELL_PRICE_NET = new BigDecimal(2);

    private static final BigDecimal DEFAULT_SELL_PRICE_GROSS = new BigDecimal(1);
    private static final BigDecimal UPDATED_SELL_PRICE_GROSS = new BigDecimal(2);

    private static final BigDecimal DEFAULT_SELL_VAT_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_SELL_VAT_VALUE = new BigDecimal(2);

    @Autowired
    private ProductOnStockRepository productOnStockRepository;

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

    private MockMvc restProductOnStockMockMvc;

    private ProductOnStock productOnStock;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProductOnStockResource productOnStockResource = new ProductOnStockResource(productOnStockRepository);
        this.restProductOnStockMockMvc = MockMvcBuilders.standaloneSetup(productOnStockResource)
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
    public static ProductOnStock createEntity(EntityManager em) {
        ProductOnStock productOnStock = new ProductOnStock()
            .deliveryDate(DEFAULT_DELIVERY_DATE)
            .quantity(DEFAULT_QUANTITY)
            .purchPriceNet(DEFAULT_PURCH_PRICE_NET)
            .purchPriceGross(DEFAULT_PURCH_PRICE_GROSS)
            .purchVatValue(DEFAULT_PURCH_VAT_VALUE)
            .sellPriceNet(DEFAULT_SELL_PRICE_NET)
            .sellPriceGross(DEFAULT_SELL_PRICE_GROSS)
            .sellVatValue(DEFAULT_SELL_VAT_VALUE);
        return productOnStock;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductOnStock createUpdatedEntity(EntityManager em) {
        ProductOnStock productOnStock = new ProductOnStock()
            .deliveryDate(UPDATED_DELIVERY_DATE)
            .quantity(UPDATED_QUANTITY)
            .purchPriceNet(UPDATED_PURCH_PRICE_NET)
            .purchPriceGross(UPDATED_PURCH_PRICE_GROSS)
            .purchVatValue(UPDATED_PURCH_VAT_VALUE)
            .sellPriceNet(UPDATED_SELL_PRICE_NET)
            .sellPriceGross(UPDATED_SELL_PRICE_GROSS)
            .sellVatValue(UPDATED_SELL_VAT_VALUE);
        return productOnStock;
    }

    @BeforeEach
    public void initTest() {
        productOnStock = createEntity(em);
    }

    @Test
    @Transactional
    public void createProductOnStock() throws Exception {
        int databaseSizeBeforeCreate = productOnStockRepository.findAll().size();

        // Create the ProductOnStock
        restProductOnStockMockMvc.perform(post("/api/product-on-stocks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productOnStock)))
            .andExpect(status().isCreated());

        // Validate the ProductOnStock in the database
        List<ProductOnStock> productOnStockList = productOnStockRepository.findAll();
        assertThat(productOnStockList).hasSize(databaseSizeBeforeCreate + 1);
        ProductOnStock testProductOnStock = productOnStockList.get(productOnStockList.size() - 1);
        assertThat(testProductOnStock.getDeliveryDate()).isEqualTo(DEFAULT_DELIVERY_DATE);
        assertThat(testProductOnStock.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testProductOnStock.getPurchPriceNet()).isEqualTo(DEFAULT_PURCH_PRICE_NET);
        assertThat(testProductOnStock.getPurchPriceGross()).isEqualTo(DEFAULT_PURCH_PRICE_GROSS);
        assertThat(testProductOnStock.getPurchVatValue()).isEqualTo(DEFAULT_PURCH_VAT_VALUE);
        assertThat(testProductOnStock.getSellPriceNet()).isEqualTo(DEFAULT_SELL_PRICE_NET);
        assertThat(testProductOnStock.getSellPriceGross()).isEqualTo(DEFAULT_SELL_PRICE_GROSS);
        assertThat(testProductOnStock.getSellVatValue()).isEqualTo(DEFAULT_SELL_VAT_VALUE);
    }

    @Test
    @Transactional
    public void createProductOnStockWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productOnStockRepository.findAll().size();

        // Create the ProductOnStock with an existing ID
        productOnStock.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductOnStockMockMvc.perform(post("/api/product-on-stocks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productOnStock)))
            .andExpect(status().isBadRequest());

        // Validate the ProductOnStock in the database
        List<ProductOnStock> productOnStockList = productOnStockRepository.findAll();
        assertThat(productOnStockList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkSellPriceGrossIsRequired() throws Exception {
        int databaseSizeBeforeTest = productOnStockRepository.findAll().size();
        // set the field null
        productOnStock.setSellPriceGross(null);

        // Create the ProductOnStock, which fails.

        restProductOnStockMockMvc.perform(post("/api/product-on-stocks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productOnStock)))
            .andExpect(status().isBadRequest());

        List<ProductOnStock> productOnStockList = productOnStockRepository.findAll();
        assertThat(productOnStockList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllProductOnStocks() throws Exception {
        // Initialize the database
        productOnStockRepository.saveAndFlush(productOnStock);

        // Get all the productOnStockList
        restProductOnStockMockMvc.perform(get("/api/product-on-stocks?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productOnStock.getId().intValue())))
            .andExpect(jsonPath("$.[*].deliveryDate").value(hasItem(DEFAULT_DELIVERY_DATE.toString())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].purchPriceNet").value(hasItem(DEFAULT_PURCH_PRICE_NET.intValue())))
            .andExpect(jsonPath("$.[*].purchPriceGross").value(hasItem(DEFAULT_PURCH_PRICE_GROSS.intValue())))
            .andExpect(jsonPath("$.[*].purchVatValue").value(hasItem(DEFAULT_PURCH_VAT_VALUE.intValue())))
            .andExpect(jsonPath("$.[*].sellPriceNet").value(hasItem(DEFAULT_SELL_PRICE_NET.intValue())))
            .andExpect(jsonPath("$.[*].sellPriceGross").value(hasItem(DEFAULT_SELL_PRICE_GROSS.intValue())))
            .andExpect(jsonPath("$.[*].sellVatValue").value(hasItem(DEFAULT_SELL_VAT_VALUE.intValue())));
    }
    
    @Test
    @Transactional
    public void getProductOnStock() throws Exception {
        // Initialize the database
        productOnStockRepository.saveAndFlush(productOnStock);

        // Get the productOnStock
        restProductOnStockMockMvc.perform(get("/api/product-on-stocks/{id}", productOnStock.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(productOnStock.getId().intValue()))
            .andExpect(jsonPath("$.deliveryDate").value(DEFAULT_DELIVERY_DATE.toString()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY))
            .andExpect(jsonPath("$.purchPriceNet").value(DEFAULT_PURCH_PRICE_NET.intValue()))
            .andExpect(jsonPath("$.purchPriceGross").value(DEFAULT_PURCH_PRICE_GROSS.intValue()))
            .andExpect(jsonPath("$.purchVatValue").value(DEFAULT_PURCH_VAT_VALUE.intValue()))
            .andExpect(jsonPath("$.sellPriceNet").value(DEFAULT_SELL_PRICE_NET.intValue()))
            .andExpect(jsonPath("$.sellPriceGross").value(DEFAULT_SELL_PRICE_GROSS.intValue()))
            .andExpect(jsonPath("$.sellVatValue").value(DEFAULT_SELL_VAT_VALUE.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingProductOnStock() throws Exception {
        // Get the productOnStock
        restProductOnStockMockMvc.perform(get("/api/product-on-stocks/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProductOnStock() throws Exception {
        // Initialize the database
        productOnStockRepository.saveAndFlush(productOnStock);

        int databaseSizeBeforeUpdate = productOnStockRepository.findAll().size();

        // Update the productOnStock
        ProductOnStock updatedProductOnStock = productOnStockRepository.findById(productOnStock.getId()).get();
        // Disconnect from session so that the updates on updatedProductOnStock are not directly saved in db
        em.detach(updatedProductOnStock);
        updatedProductOnStock
            .deliveryDate(UPDATED_DELIVERY_DATE)
            .quantity(UPDATED_QUANTITY)
            .purchPriceNet(UPDATED_PURCH_PRICE_NET)
            .purchPriceGross(UPDATED_PURCH_PRICE_GROSS)
            .purchVatValue(UPDATED_PURCH_VAT_VALUE)
            .sellPriceNet(UPDATED_SELL_PRICE_NET)
            .sellPriceGross(UPDATED_SELL_PRICE_GROSS)
            .sellVatValue(UPDATED_SELL_VAT_VALUE);

        restProductOnStockMockMvc.perform(put("/api/product-on-stocks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedProductOnStock)))
            .andExpect(status().isOk());

        // Validate the ProductOnStock in the database
        List<ProductOnStock> productOnStockList = productOnStockRepository.findAll();
        assertThat(productOnStockList).hasSize(databaseSizeBeforeUpdate);
        ProductOnStock testProductOnStock = productOnStockList.get(productOnStockList.size() - 1);
        assertThat(testProductOnStock.getDeliveryDate()).isEqualTo(UPDATED_DELIVERY_DATE);
        assertThat(testProductOnStock.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testProductOnStock.getPurchPriceNet()).isEqualTo(UPDATED_PURCH_PRICE_NET);
        assertThat(testProductOnStock.getPurchPriceGross()).isEqualTo(UPDATED_PURCH_PRICE_GROSS);
        assertThat(testProductOnStock.getPurchVatValue()).isEqualTo(UPDATED_PURCH_VAT_VALUE);
        assertThat(testProductOnStock.getSellPriceNet()).isEqualTo(UPDATED_SELL_PRICE_NET);
        assertThat(testProductOnStock.getSellPriceGross()).isEqualTo(UPDATED_SELL_PRICE_GROSS);
        assertThat(testProductOnStock.getSellVatValue()).isEqualTo(UPDATED_SELL_VAT_VALUE);
    }

    @Test
    @Transactional
    public void updateNonExistingProductOnStock() throws Exception {
        int databaseSizeBeforeUpdate = productOnStockRepository.findAll().size();

        // Create the ProductOnStock

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductOnStockMockMvc.perform(put("/api/product-on-stocks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productOnStock)))
            .andExpect(status().isBadRequest());

        // Validate the ProductOnStock in the database
        List<ProductOnStock> productOnStockList = productOnStockRepository.findAll();
        assertThat(productOnStockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteProductOnStock() throws Exception {
        // Initialize the database
        productOnStockRepository.saveAndFlush(productOnStock);

        int databaseSizeBeforeDelete = productOnStockRepository.findAll().size();

        // Delete the productOnStock
        restProductOnStockMockMvc.perform(delete("/api/product-on-stocks/{id}", productOnStock.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductOnStock> productOnStockList = productOnStockRepository.findAll();
        assertThat(productOnStockList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductOnStock.class);
        ProductOnStock productOnStock1 = new ProductOnStock();
        productOnStock1.setId(1L);
        ProductOnStock productOnStock2 = new ProductOnStock();
        productOnStock2.setId(productOnStock1.getId());
        assertThat(productOnStock1).isEqualTo(productOnStock2);
        productOnStock2.setId(2L);
        assertThat(productOnStock1).isNotEqualTo(productOnStock2);
        productOnStock1.setId(null);
        assertThat(productOnStock1).isNotEqualTo(productOnStock2);
    }
}
