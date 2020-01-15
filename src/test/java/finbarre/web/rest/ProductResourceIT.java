package finbarre.web.rest;

import finbarre.BarfitterApp;
import finbarre.domain.Product;
import finbarre.repository.ProductRepository;
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
import java.util.List;

import static finbarre.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link ProductResource} REST controller.
 */
@SpringBootTest(classes = BarfitterApp.class)
public class ProductResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_PURCH_PRICE_NET = new BigDecimal(1);
    private static final BigDecimal UPDATED_PURCH_PRICE_NET = new BigDecimal(2);

    private static final BigDecimal DEFAULT_SELL_PRICE_GROSS = new BigDecimal(1);
    private static final BigDecimal UPDATED_SELL_PRICE_GROSS = new BigDecimal(2);

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    private static final BigDecimal DEFAULT_PURCH_PRICE_GROSS = new BigDecimal(1);
    private static final BigDecimal UPDATED_PURCH_PRICE_GROSS = new BigDecimal(2);

    private static final BigDecimal DEFAULT_PURCH_VAT_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_PURCH_VAT_VALUE = new BigDecimal(2);

    private static final BigDecimal DEFAULT_SELL_PRICE_NET = new BigDecimal(1);
    private static final BigDecimal UPDATED_SELL_PRICE_NET = new BigDecimal(2);

    private static final BigDecimal DEFAULT_SELL_VAT_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_SELL_VAT_VALUE = new BigDecimal(2);

    @Autowired
    private ProductRepository productRepository;

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

    private MockMvc restProductMockMvc;

    private Product product;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProductResource productResource = new ProductResource(productRepository);
        this.restProductMockMvc = MockMvcBuilders.standaloneSetup(productResource)
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
    public static Product createEntity(EntityManager em) {
        Product product = new Product()
            .name(DEFAULT_NAME)
            .purchPriceNet(DEFAULT_PURCH_PRICE_NET)
            .sellPriceGross(DEFAULT_SELL_PRICE_GROSS)
            .active(DEFAULT_ACTIVE)
            .purchPriceGross(DEFAULT_PURCH_PRICE_GROSS)
            .purchVatValue(DEFAULT_PURCH_VAT_VALUE)
            .sellPriceNet(DEFAULT_SELL_PRICE_NET)
            .sellVatValue(DEFAULT_SELL_VAT_VALUE);
        return product;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Product createUpdatedEntity(EntityManager em) {
        Product product = new Product()
            .name(UPDATED_NAME)
            .purchPriceNet(UPDATED_PURCH_PRICE_NET)
            .sellPriceGross(UPDATED_SELL_PRICE_GROSS)
            .active(UPDATED_ACTIVE)
            .purchPriceGross(UPDATED_PURCH_PRICE_GROSS)
            .purchVatValue(UPDATED_PURCH_VAT_VALUE)
            .sellPriceNet(UPDATED_SELL_PRICE_NET)
            .sellVatValue(UPDATED_SELL_VAT_VALUE);
        return product;
    }

    @BeforeEach
    public void initTest() {
        product = createEntity(em);
    }

    @Test
    @Transactional
    public void createProduct() throws Exception {
        int databaseSizeBeforeCreate = productRepository.findAll().size();

        // Create the Product
        restProductMockMvc.perform(post("/api/products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(product)))
            .andExpect(status().isCreated());

        // Validate the Product in the database
        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeCreate + 1);
        Product testProduct = productList.get(productList.size() - 1);
        assertThat(testProduct.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProduct.getPurchPriceNet()).isEqualTo(DEFAULT_PURCH_PRICE_NET);
        assertThat(testProduct.getSellPriceGross()).isEqualTo(DEFAULT_SELL_PRICE_GROSS);
        assertThat(testProduct.isActive()).isEqualTo(DEFAULT_ACTIVE);
        assertThat(testProduct.getPurchPriceGross()).isEqualTo(DEFAULT_PURCH_PRICE_GROSS);
        assertThat(testProduct.getPurchVatValue()).isEqualTo(DEFAULT_PURCH_VAT_VALUE);
        assertThat(testProduct.getSellPriceNet()).isEqualTo(DEFAULT_SELL_PRICE_NET);
        assertThat(testProduct.getSellVatValue()).isEqualTo(DEFAULT_SELL_VAT_VALUE);
    }

    @Test
    @Transactional
    public void createProductWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productRepository.findAll().size();

        // Create the Product with an existing ID
        product.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductMockMvc.perform(post("/api/products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(product)))
            .andExpect(status().isBadRequest());

        // Validate the Product in the database
        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = productRepository.findAll().size();
        // set the field null
        product.setName(null);

        // Create the Product, which fails.

        restProductMockMvc.perform(post("/api/products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(product)))
            .andExpect(status().isBadRequest());

        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkSellPriceGrossIsRequired() throws Exception {
        int databaseSizeBeforeTest = productRepository.findAll().size();
        // set the field null
        product.setSellPriceGross(null);

        // Create the Product, which fails.

        restProductMockMvc.perform(post("/api/products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(product)))
            .andExpect(status().isBadRequest());

        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllProducts() throws Exception {
        // Initialize the database
        productRepository.saveAndFlush(product);

        // Get all the productList
        restProductMockMvc.perform(get("/api/products?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(product.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].purchPriceNet").value(hasItem(DEFAULT_PURCH_PRICE_NET.intValue())))
            .andExpect(jsonPath("$.[*].sellPriceGross").value(hasItem(DEFAULT_SELL_PRICE_GROSS.intValue())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].purchPriceGross").value(hasItem(DEFAULT_PURCH_PRICE_GROSS.intValue())))
            .andExpect(jsonPath("$.[*].purchVatValue").value(hasItem(DEFAULT_PURCH_VAT_VALUE.intValue())))
            .andExpect(jsonPath("$.[*].sellPriceNet").value(hasItem(DEFAULT_SELL_PRICE_NET.intValue())))
            .andExpect(jsonPath("$.[*].sellVatValue").value(hasItem(DEFAULT_SELL_VAT_VALUE.intValue())));
    }
    
    @Test
    @Transactional
    public void getProduct() throws Exception {
        // Initialize the database
        productRepository.saveAndFlush(product);

        // Get the product
        restProductMockMvc.perform(get("/api/products/{id}", product.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(product.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.purchPriceNet").value(DEFAULT_PURCH_PRICE_NET.intValue()))
            .andExpect(jsonPath("$.sellPriceGross").value(DEFAULT_SELL_PRICE_GROSS.intValue()))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()))
            .andExpect(jsonPath("$.purchPriceGross").value(DEFAULT_PURCH_PRICE_GROSS.intValue()))
            .andExpect(jsonPath("$.purchVatValue").value(DEFAULT_PURCH_VAT_VALUE.intValue()))
            .andExpect(jsonPath("$.sellPriceNet").value(DEFAULT_SELL_PRICE_NET.intValue()))
            .andExpect(jsonPath("$.sellVatValue").value(DEFAULT_SELL_VAT_VALUE.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingProduct() throws Exception {
        // Get the product
        restProductMockMvc.perform(get("/api/products/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProduct() throws Exception {
        // Initialize the database
        productRepository.saveAndFlush(product);

        int databaseSizeBeforeUpdate = productRepository.findAll().size();

        // Update the product
        Product updatedProduct = productRepository.findById(product.getId()).get();
        // Disconnect from session so that the updates on updatedProduct are not directly saved in db
        em.detach(updatedProduct);
        updatedProduct
            .name(UPDATED_NAME)
            .purchPriceNet(UPDATED_PURCH_PRICE_NET)
            .sellPriceGross(UPDATED_SELL_PRICE_GROSS)
            .active(UPDATED_ACTIVE)
            .purchPriceGross(UPDATED_PURCH_PRICE_GROSS)
            .purchVatValue(UPDATED_PURCH_VAT_VALUE)
            .sellPriceNet(UPDATED_SELL_PRICE_NET)
            .sellVatValue(UPDATED_SELL_VAT_VALUE);

        restProductMockMvc.perform(put("/api/products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedProduct)))
            .andExpect(status().isOk());

        // Validate the Product in the database
        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeUpdate);
        Product testProduct = productList.get(productList.size() - 1);
        assertThat(testProduct.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProduct.getPurchPriceNet()).isEqualTo(UPDATED_PURCH_PRICE_NET);
        assertThat(testProduct.getSellPriceGross()).isEqualTo(UPDATED_SELL_PRICE_GROSS);
        assertThat(testProduct.isActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testProduct.getPurchPriceGross()).isEqualTo(UPDATED_PURCH_PRICE_GROSS);
        assertThat(testProduct.getPurchVatValue()).isEqualTo(UPDATED_PURCH_VAT_VALUE);
        assertThat(testProduct.getSellPriceNet()).isEqualTo(UPDATED_SELL_PRICE_NET);
        assertThat(testProduct.getSellVatValue()).isEqualTo(UPDATED_SELL_VAT_VALUE);
    }

    @Test
    @Transactional
    public void updateNonExistingProduct() throws Exception {
        int databaseSizeBeforeUpdate = productRepository.findAll().size();

        // Create the Product

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductMockMvc.perform(put("/api/products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(product)))
            .andExpect(status().isBadRequest());

        // Validate the Product in the database
        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteProduct() throws Exception {
        // Initialize the database
        productRepository.saveAndFlush(product);

        int databaseSizeBeforeDelete = productRepository.findAll().size();

        // Delete the product
        restProductMockMvc.perform(delete("/api/products/{id}", product.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Product> productList = productRepository.findAll();
        assertThat(productList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Product.class);
        Product product1 = new Product();
        product1.setId(1L);
        Product product2 = new Product();
        product2.setId(product1.getId());
        assertThat(product1).isEqualTo(product2);
        product2.setId(2L);
        assertThat(product1).isNotEqualTo(product2);
        product1.setId(null);
        assertThat(product1).isNotEqualTo(product2);
    }
}
