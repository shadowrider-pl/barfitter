package finbarre.web.rest;

import finbarre.BarfitterApp;
import finbarre.domain.ProductSold;
import finbarre.repository.ProductSoldRepository;
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
 * Integration tests for the {@link ProductSoldResource} REST controller.
 */
@SpringBootTest(classes = BarfitterApp.class)
public class ProductSoldResourceIT {

    private static final ZonedDateTime DEFAULT_ORDERED_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_ORDERED_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_ACCEPTED_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_ACCEPTED_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_FINISHED_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_FINISHED_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_TAKEN_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TAKEN_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

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

    private static final BigDecimal DEFAULT_DIFFERENCE = new BigDecimal(1);
    private static final BigDecimal UPDATED_DIFFERENCE = new BigDecimal(2);

    private static final LocalDate DEFAULT_DELIVERY_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DELIVERY_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final ZonedDateTime DEFAULT_SEND_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_SEND_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private ProductSoldRepository productSoldRepository;

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

    private MockMvc restProductSoldMockMvc;

    private ProductSold productSold;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProductSoldResource productSoldResource = new ProductSoldResource(productSoldRepository);
        this.restProductSoldMockMvc = MockMvcBuilders.standaloneSetup(productSoldResource)
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
    public static ProductSold createEntity(EntityManager em) {
        ProductSold productSold = new ProductSold()
            .orderedTime(DEFAULT_ORDERED_TIME)
            .acceptedTime(DEFAULT_ACCEPTED_TIME)
            .finishedTime(DEFAULT_FINISHED_TIME)
            .takenTime(DEFAULT_TAKEN_TIME)
            .quantity(DEFAULT_QUANTITY)
            .comment(DEFAULT_COMMENT)
            .purchPriceNet(DEFAULT_PURCH_PRICE_NET)
            .purchPriceGross(DEFAULT_PURCH_PRICE_GROSS)
            .purchVatValue(DEFAULT_PURCH_VAT_VALUE)
            .sellPriceNet(DEFAULT_SELL_PRICE_NET)
            .sellPriceGross(DEFAULT_SELL_PRICE_GROSS)
            .sellVatValue(DEFAULT_SELL_VAT_VALUE)
            .difference(DEFAULT_DIFFERENCE)
            .deliveryDate(DEFAULT_DELIVERY_DATE)
            .sendTime(DEFAULT_SEND_TIME);
        return productSold;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductSold createUpdatedEntity(EntityManager em) {
        ProductSold productSold = new ProductSold()
            .orderedTime(UPDATED_ORDERED_TIME)
            .acceptedTime(UPDATED_ACCEPTED_TIME)
            .finishedTime(UPDATED_FINISHED_TIME)
            .takenTime(UPDATED_TAKEN_TIME)
            .quantity(UPDATED_QUANTITY)
            .comment(UPDATED_COMMENT)
            .purchPriceNet(UPDATED_PURCH_PRICE_NET)
            .purchPriceGross(UPDATED_PURCH_PRICE_GROSS)
            .purchVatValue(UPDATED_PURCH_VAT_VALUE)
            .sellPriceNet(UPDATED_SELL_PRICE_NET)
            .sellPriceGross(UPDATED_SELL_PRICE_GROSS)
            .sellVatValue(UPDATED_SELL_VAT_VALUE)
            .difference(UPDATED_DIFFERENCE)
            .deliveryDate(UPDATED_DELIVERY_DATE)
            .sendTime(UPDATED_SEND_TIME);
        return productSold;
    }

    @BeforeEach
    public void initTest() {
        productSold = createEntity(em);
    }

    @Test
    @Transactional
    public void createProductSold() throws Exception {
        int databaseSizeBeforeCreate = productSoldRepository.findAll().size();

        // Create the ProductSold
        restProductSoldMockMvc.perform(post("/api/product-solds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productSold)))
            .andExpect(status().isCreated());

        // Validate the ProductSold in the database
        List<ProductSold> productSoldList = productSoldRepository.findAll();
        assertThat(productSoldList).hasSize(databaseSizeBeforeCreate + 1);
        ProductSold testProductSold = productSoldList.get(productSoldList.size() - 1);
        assertThat(testProductSold.getOrderedTime()).isEqualTo(DEFAULT_ORDERED_TIME);
        assertThat(testProductSold.getAcceptedTime()).isEqualTo(DEFAULT_ACCEPTED_TIME);
        assertThat(testProductSold.getFinishedTime()).isEqualTo(DEFAULT_FINISHED_TIME);
        assertThat(testProductSold.getTakenTime()).isEqualTo(DEFAULT_TAKEN_TIME);
        assertThat(testProductSold.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testProductSold.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testProductSold.getPurchPriceNet()).isEqualTo(DEFAULT_PURCH_PRICE_NET);
        assertThat(testProductSold.getPurchPriceGross()).isEqualTo(DEFAULT_PURCH_PRICE_GROSS);
        assertThat(testProductSold.getPurchVatValue()).isEqualTo(DEFAULT_PURCH_VAT_VALUE);
        assertThat(testProductSold.getSellPriceNet()).isEqualTo(DEFAULT_SELL_PRICE_NET);
        assertThat(testProductSold.getSellPriceGross()).isEqualTo(DEFAULT_SELL_PRICE_GROSS);
        assertThat(testProductSold.getSellVatValue()).isEqualTo(DEFAULT_SELL_VAT_VALUE);
        assertThat(testProductSold.getDifference()).isEqualTo(DEFAULT_DIFFERENCE);
        assertThat(testProductSold.getDeliveryDate()).isEqualTo(DEFAULT_DELIVERY_DATE);
        assertThat(testProductSold.getSendTime()).isEqualTo(DEFAULT_SEND_TIME);
    }

    @Test
    @Transactional
    public void createProductSoldWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productSoldRepository.findAll().size();

        // Create the ProductSold with an existing ID
        productSold.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductSoldMockMvc.perform(post("/api/product-solds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productSold)))
            .andExpect(status().isBadRequest());

        // Validate the ProductSold in the database
        List<ProductSold> productSoldList = productSoldRepository.findAll();
        assertThat(productSoldList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkOrderedTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = productSoldRepository.findAll().size();
        // set the field null
        productSold.setOrderedTime(null);

        // Create the ProductSold, which fails.

        restProductSoldMockMvc.perform(post("/api/product-solds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productSold)))
            .andExpect(status().isBadRequest());

        List<ProductSold> productSoldList = productSoldRepository.findAll();
        assertThat(productSoldList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllProductSolds() throws Exception {
        // Initialize the database
        productSoldRepository.saveAndFlush(productSold);

        // Get all the productSoldList
        restProductSoldMockMvc.perform(get("/api/product-solds?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productSold.getId().intValue())))
            .andExpect(jsonPath("$.[*].orderedTime").value(hasItem(sameInstant(DEFAULT_ORDERED_TIME))))
            .andExpect(jsonPath("$.[*].acceptedTime").value(hasItem(sameInstant(DEFAULT_ACCEPTED_TIME))))
            .andExpect(jsonPath("$.[*].finishedTime").value(hasItem(sameInstant(DEFAULT_FINISHED_TIME))))
            .andExpect(jsonPath("$.[*].takenTime").value(hasItem(sameInstant(DEFAULT_TAKEN_TIME))))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)))
            .andExpect(jsonPath("$.[*].purchPriceNet").value(hasItem(DEFAULT_PURCH_PRICE_NET.intValue())))
            .andExpect(jsonPath("$.[*].purchPriceGross").value(hasItem(DEFAULT_PURCH_PRICE_GROSS.intValue())))
            .andExpect(jsonPath("$.[*].purchVatValue").value(hasItem(DEFAULT_PURCH_VAT_VALUE.intValue())))
            .andExpect(jsonPath("$.[*].sellPriceNet").value(hasItem(DEFAULT_SELL_PRICE_NET.intValue())))
            .andExpect(jsonPath("$.[*].sellPriceGross").value(hasItem(DEFAULT_SELL_PRICE_GROSS.intValue())))
            .andExpect(jsonPath("$.[*].sellVatValue").value(hasItem(DEFAULT_SELL_VAT_VALUE.intValue())))
            .andExpect(jsonPath("$.[*].difference").value(hasItem(DEFAULT_DIFFERENCE.intValue())))
            .andExpect(jsonPath("$.[*].deliveryDate").value(hasItem(DEFAULT_DELIVERY_DATE.toString())))
            .andExpect(jsonPath("$.[*].sendTime").value(hasItem(sameInstant(DEFAULT_SEND_TIME))));
    }
    
    @Test
    @Transactional
    public void getProductSold() throws Exception {
        // Initialize the database
        productSoldRepository.saveAndFlush(productSold);

        // Get the productSold
        restProductSoldMockMvc.perform(get("/api/product-solds/{id}", productSold.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(productSold.getId().intValue()))
            .andExpect(jsonPath("$.orderedTime").value(sameInstant(DEFAULT_ORDERED_TIME)))
            .andExpect(jsonPath("$.acceptedTime").value(sameInstant(DEFAULT_ACCEPTED_TIME)))
            .andExpect(jsonPath("$.finishedTime").value(sameInstant(DEFAULT_FINISHED_TIME)))
            .andExpect(jsonPath("$.takenTime").value(sameInstant(DEFAULT_TAKEN_TIME)))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT))
            .andExpect(jsonPath("$.purchPriceNet").value(DEFAULT_PURCH_PRICE_NET.intValue()))
            .andExpect(jsonPath("$.purchPriceGross").value(DEFAULT_PURCH_PRICE_GROSS.intValue()))
            .andExpect(jsonPath("$.purchVatValue").value(DEFAULT_PURCH_VAT_VALUE.intValue()))
            .andExpect(jsonPath("$.sellPriceNet").value(DEFAULT_SELL_PRICE_NET.intValue()))
            .andExpect(jsonPath("$.sellPriceGross").value(DEFAULT_SELL_PRICE_GROSS.intValue()))
            .andExpect(jsonPath("$.sellVatValue").value(DEFAULT_SELL_VAT_VALUE.intValue()))
            .andExpect(jsonPath("$.difference").value(DEFAULT_DIFFERENCE.intValue()))
            .andExpect(jsonPath("$.deliveryDate").value(DEFAULT_DELIVERY_DATE.toString()))
            .andExpect(jsonPath("$.sendTime").value(sameInstant(DEFAULT_SEND_TIME)));
    }

    @Test
    @Transactional
    public void getNonExistingProductSold() throws Exception {
        // Get the productSold
        restProductSoldMockMvc.perform(get("/api/product-solds/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProductSold() throws Exception {
        // Initialize the database
        productSoldRepository.saveAndFlush(productSold);

        int databaseSizeBeforeUpdate = productSoldRepository.findAll().size();

        // Update the productSold
        ProductSold updatedProductSold = productSoldRepository.findById(productSold.getId()).get();
        // Disconnect from session so that the updates on updatedProductSold are not directly saved in db
        em.detach(updatedProductSold);
        updatedProductSold
            .orderedTime(UPDATED_ORDERED_TIME)
            .acceptedTime(UPDATED_ACCEPTED_TIME)
            .finishedTime(UPDATED_FINISHED_TIME)
            .takenTime(UPDATED_TAKEN_TIME)
            .quantity(UPDATED_QUANTITY)
            .comment(UPDATED_COMMENT)
            .purchPriceNet(UPDATED_PURCH_PRICE_NET)
            .purchPriceGross(UPDATED_PURCH_PRICE_GROSS)
            .purchVatValue(UPDATED_PURCH_VAT_VALUE)
            .sellPriceNet(UPDATED_SELL_PRICE_NET)
            .sellPriceGross(UPDATED_SELL_PRICE_GROSS)
            .sellVatValue(UPDATED_SELL_VAT_VALUE)
            .difference(UPDATED_DIFFERENCE)
            .deliveryDate(UPDATED_DELIVERY_DATE)
            .sendTime(UPDATED_SEND_TIME);

        restProductSoldMockMvc.perform(put("/api/product-solds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedProductSold)))
            .andExpect(status().isOk());

        // Validate the ProductSold in the database
        List<ProductSold> productSoldList = productSoldRepository.findAll();
        assertThat(productSoldList).hasSize(databaseSizeBeforeUpdate);
        ProductSold testProductSold = productSoldList.get(productSoldList.size() - 1);
        assertThat(testProductSold.getOrderedTime()).isEqualTo(UPDATED_ORDERED_TIME);
        assertThat(testProductSold.getAcceptedTime()).isEqualTo(UPDATED_ACCEPTED_TIME);
        assertThat(testProductSold.getFinishedTime()).isEqualTo(UPDATED_FINISHED_TIME);
        assertThat(testProductSold.getTakenTime()).isEqualTo(UPDATED_TAKEN_TIME);
        assertThat(testProductSold.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testProductSold.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testProductSold.getPurchPriceNet()).isEqualTo(UPDATED_PURCH_PRICE_NET);
        assertThat(testProductSold.getPurchPriceGross()).isEqualTo(UPDATED_PURCH_PRICE_GROSS);
        assertThat(testProductSold.getPurchVatValue()).isEqualTo(UPDATED_PURCH_VAT_VALUE);
        assertThat(testProductSold.getSellPriceNet()).isEqualTo(UPDATED_SELL_PRICE_NET);
        assertThat(testProductSold.getSellPriceGross()).isEqualTo(UPDATED_SELL_PRICE_GROSS);
        assertThat(testProductSold.getSellVatValue()).isEqualTo(UPDATED_SELL_VAT_VALUE);
        assertThat(testProductSold.getDifference()).isEqualTo(UPDATED_DIFFERENCE);
        assertThat(testProductSold.getDeliveryDate()).isEqualTo(UPDATED_DELIVERY_DATE);
        assertThat(testProductSold.getSendTime()).isEqualTo(UPDATED_SEND_TIME);
    }

    @Test
    @Transactional
    public void updateNonExistingProductSold() throws Exception {
        int databaseSizeBeforeUpdate = productSoldRepository.findAll().size();

        // Create the ProductSold

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductSoldMockMvc.perform(put("/api/product-solds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productSold)))
            .andExpect(status().isBadRequest());

        // Validate the ProductSold in the database
        List<ProductSold> productSoldList = productSoldRepository.findAll();
        assertThat(productSoldList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteProductSold() throws Exception {
        // Initialize the database
        productSoldRepository.saveAndFlush(productSold);

        int databaseSizeBeforeDelete = productSoldRepository.findAll().size();

        // Delete the productSold
        restProductSoldMockMvc.perform(delete("/api/product-solds/{id}", productSold.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductSold> productSoldList = productSoldRepository.findAll();
        assertThat(productSoldList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductSold.class);
        ProductSold productSold1 = new ProductSold();
        productSold1.setId(1L);
        ProductSold productSold2 = new ProductSold();
        productSold2.setId(productSold1.getId());
        assertThat(productSold1).isEqualTo(productSold2);
        productSold2.setId(2L);
        assertThat(productSold1).isNotEqualTo(productSold2);
        productSold1.setId(null);
        assertThat(productSold1).isNotEqualTo(productSold2);
    }
}
