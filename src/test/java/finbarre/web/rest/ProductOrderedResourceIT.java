package finbarre.web.rest;

import finbarre.BarfitterApp;
import finbarre.domain.ProductOrdered;
import finbarre.repository.ProductOrderedRepository;
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
 * Integration tests for the {@link ProductOrderedResource} REST controller.
 */
@SpringBootTest(classes = BarfitterApp.class)
public class ProductOrderedResourceIT {

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

    private static final Integer DEFAULT_ORDER_POSITION = 1;
    private static final Integer UPDATED_ORDER_POSITION = 2;

    private static final ZonedDateTime DEFAULT_SEND_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_SEND_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private ProductOrderedRepository productOrderedRepository;

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

    private MockMvc restProductOrderedMockMvc;

    private ProductOrdered productOrdered;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProductOrderedResource productOrderedResource = new ProductOrderedResource(productOrderedRepository);
        this.restProductOrderedMockMvc = MockMvcBuilders.standaloneSetup(productOrderedResource)
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
    public static ProductOrdered createEntity(EntityManager em) {
        ProductOrdered productOrdered = new ProductOrdered()
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
            .orderPosition(DEFAULT_ORDER_POSITION)
            .sendTime(DEFAULT_SEND_TIME);
        return productOrdered;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductOrdered createUpdatedEntity(EntityManager em) {
        ProductOrdered productOrdered = new ProductOrdered()
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
            .orderPosition(UPDATED_ORDER_POSITION)
            .sendTime(UPDATED_SEND_TIME);
        return productOrdered;
    }

    @BeforeEach
    public void initTest() {
        productOrdered = createEntity(em);
    }

    @Test
    @Transactional
    public void createProductOrdered() throws Exception {
        int databaseSizeBeforeCreate = productOrderedRepository.findAll().size();

        // Create the ProductOrdered
        restProductOrderedMockMvc.perform(post("/api/product-ordereds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productOrdered)))
            .andExpect(status().isCreated());

        // Validate the ProductOrdered in the database
        List<ProductOrdered> productOrderedList = productOrderedRepository.findAll();
        assertThat(productOrderedList).hasSize(databaseSizeBeforeCreate + 1);
        ProductOrdered testProductOrdered = productOrderedList.get(productOrderedList.size() - 1);
        assertThat(testProductOrdered.getOrderedTime()).isEqualTo(DEFAULT_ORDERED_TIME);
        assertThat(testProductOrdered.getAcceptedTime()).isEqualTo(DEFAULT_ACCEPTED_TIME);
        assertThat(testProductOrdered.getFinishedTime()).isEqualTo(DEFAULT_FINISHED_TIME);
        assertThat(testProductOrdered.getTakenTime()).isEqualTo(DEFAULT_TAKEN_TIME);
        assertThat(testProductOrdered.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testProductOrdered.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testProductOrdered.getPurchPriceNet()).isEqualTo(DEFAULT_PURCH_PRICE_NET);
        assertThat(testProductOrdered.getPurchPriceGross()).isEqualTo(DEFAULT_PURCH_PRICE_GROSS);
        assertThat(testProductOrdered.getPurchVatValue()).isEqualTo(DEFAULT_PURCH_VAT_VALUE);
        assertThat(testProductOrdered.getSellPriceNet()).isEqualTo(DEFAULT_SELL_PRICE_NET);
        assertThat(testProductOrdered.getSellPriceGross()).isEqualTo(DEFAULT_SELL_PRICE_GROSS);
        assertThat(testProductOrdered.getSellVatValue()).isEqualTo(DEFAULT_SELL_VAT_VALUE);
        assertThat(testProductOrdered.getDifference()).isEqualTo(DEFAULT_DIFFERENCE);
        assertThat(testProductOrdered.getDeliveryDate()).isEqualTo(DEFAULT_DELIVERY_DATE);
        assertThat(testProductOrdered.getOrderPosition()).isEqualTo(DEFAULT_ORDER_POSITION);
        assertThat(testProductOrdered.getSendTime()).isEqualTo(DEFAULT_SEND_TIME);
    }

    @Test
    @Transactional
    public void createProductOrderedWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productOrderedRepository.findAll().size();

        // Create the ProductOrdered with an existing ID
        productOrdered.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductOrderedMockMvc.perform(post("/api/product-ordereds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productOrdered)))
            .andExpect(status().isBadRequest());

        // Validate the ProductOrdered in the database
        List<ProductOrdered> productOrderedList = productOrderedRepository.findAll();
        assertThat(productOrderedList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkOrderedTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = productOrderedRepository.findAll().size();
        // set the field null
        productOrdered.setOrderedTime(null);

        // Create the ProductOrdered, which fails.

        restProductOrderedMockMvc.perform(post("/api/product-ordereds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productOrdered)))
            .andExpect(status().isBadRequest());

        List<ProductOrdered> productOrderedList = productOrderedRepository.findAll();
        assertThat(productOrderedList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllProductOrdereds() throws Exception {
        // Initialize the database
        productOrderedRepository.saveAndFlush(productOrdered);

        // Get all the productOrderedList
        restProductOrderedMockMvc.perform(get("/api/product-ordereds?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productOrdered.getId().intValue())))
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
            .andExpect(jsonPath("$.[*].orderPosition").value(hasItem(DEFAULT_ORDER_POSITION)))
            .andExpect(jsonPath("$.[*].sendTime").value(hasItem(sameInstant(DEFAULT_SEND_TIME))));
    }
    
    @Test
    @Transactional
    public void getProductOrdered() throws Exception {
        // Initialize the database
        productOrderedRepository.saveAndFlush(productOrdered);

        // Get the productOrdered
        restProductOrderedMockMvc.perform(get("/api/product-ordereds/{id}", productOrdered.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(productOrdered.getId().intValue()))
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
            .andExpect(jsonPath("$.orderPosition").value(DEFAULT_ORDER_POSITION))
            .andExpect(jsonPath("$.sendTime").value(sameInstant(DEFAULT_SEND_TIME)));
    }

    @Test
    @Transactional
    public void getNonExistingProductOrdered() throws Exception {
        // Get the productOrdered
        restProductOrderedMockMvc.perform(get("/api/product-ordereds/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProductOrdered() throws Exception {
        // Initialize the database
        productOrderedRepository.saveAndFlush(productOrdered);

        int databaseSizeBeforeUpdate = productOrderedRepository.findAll().size();

        // Update the productOrdered
        ProductOrdered updatedProductOrdered = productOrderedRepository.findById(productOrdered.getId()).get();
        // Disconnect from session so that the updates on updatedProductOrdered are not directly saved in db
        em.detach(updatedProductOrdered);
        updatedProductOrdered
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
            .orderPosition(UPDATED_ORDER_POSITION)
            .sendTime(UPDATED_SEND_TIME);

        restProductOrderedMockMvc.perform(put("/api/product-ordereds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedProductOrdered)))
            .andExpect(status().isOk());

        // Validate the ProductOrdered in the database
        List<ProductOrdered> productOrderedList = productOrderedRepository.findAll();
        assertThat(productOrderedList).hasSize(databaseSizeBeforeUpdate);
        ProductOrdered testProductOrdered = productOrderedList.get(productOrderedList.size() - 1);
        assertThat(testProductOrdered.getOrderedTime()).isEqualTo(UPDATED_ORDERED_TIME);
        assertThat(testProductOrdered.getAcceptedTime()).isEqualTo(UPDATED_ACCEPTED_TIME);
        assertThat(testProductOrdered.getFinishedTime()).isEqualTo(UPDATED_FINISHED_TIME);
        assertThat(testProductOrdered.getTakenTime()).isEqualTo(UPDATED_TAKEN_TIME);
        assertThat(testProductOrdered.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testProductOrdered.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testProductOrdered.getPurchPriceNet()).isEqualTo(UPDATED_PURCH_PRICE_NET);
        assertThat(testProductOrdered.getPurchPriceGross()).isEqualTo(UPDATED_PURCH_PRICE_GROSS);
        assertThat(testProductOrdered.getPurchVatValue()).isEqualTo(UPDATED_PURCH_VAT_VALUE);
        assertThat(testProductOrdered.getSellPriceNet()).isEqualTo(UPDATED_SELL_PRICE_NET);
        assertThat(testProductOrdered.getSellPriceGross()).isEqualTo(UPDATED_SELL_PRICE_GROSS);
        assertThat(testProductOrdered.getSellVatValue()).isEqualTo(UPDATED_SELL_VAT_VALUE);
        assertThat(testProductOrdered.getDifference()).isEqualTo(UPDATED_DIFFERENCE);
        assertThat(testProductOrdered.getDeliveryDate()).isEqualTo(UPDATED_DELIVERY_DATE);
        assertThat(testProductOrdered.getOrderPosition()).isEqualTo(UPDATED_ORDER_POSITION);
        assertThat(testProductOrdered.getSendTime()).isEqualTo(UPDATED_SEND_TIME);
    }

    @Test
    @Transactional
    public void updateNonExistingProductOrdered() throws Exception {
        int databaseSizeBeforeUpdate = productOrderedRepository.findAll().size();

        // Create the ProductOrdered

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductOrderedMockMvc.perform(put("/api/product-ordereds")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productOrdered)))
            .andExpect(status().isBadRequest());

        // Validate the ProductOrdered in the database
        List<ProductOrdered> productOrderedList = productOrderedRepository.findAll();
        assertThat(productOrderedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteProductOrdered() throws Exception {
        // Initialize the database
        productOrderedRepository.saveAndFlush(productOrdered);

        int databaseSizeBeforeDelete = productOrderedRepository.findAll().size();

        // Delete the productOrdered
        restProductOrderedMockMvc.perform(delete("/api/product-ordereds/{id}", productOrdered.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductOrdered> productOrderedList = productOrderedRepository.findAll();
        assertThat(productOrderedList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductOrdered.class);
        ProductOrdered productOrdered1 = new ProductOrdered();
        productOrdered1.setId(1L);
        ProductOrdered productOrdered2 = new ProductOrdered();
        productOrdered2.setId(productOrdered1.getId());
        assertThat(productOrdered1).isEqualTo(productOrdered2);
        productOrdered2.setId(2L);
        assertThat(productOrdered1).isNotEqualTo(productOrdered2);
        productOrdered1.setId(null);
        assertThat(productOrdered1).isNotEqualTo(productOrdered2);
    }
}
