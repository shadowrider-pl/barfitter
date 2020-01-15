package finbarre.web.rest;

import finbarre.BarfitterApp;
import finbarre.domain.PaymentToCashup;
import finbarre.repository.PaymentToCashupRepository;
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
 * Integration tests for the {@link PaymentToCashupResource} REST controller.
 */
@SpringBootTest(classes = BarfitterApp.class)
public class PaymentToCashupResourceIT {

    private static final BigDecimal DEFAULT_TOTAL_PAYMENT = new BigDecimal(1);
    private static final BigDecimal UPDATED_TOTAL_PAYMENT = new BigDecimal(2);

    @Autowired
    private PaymentToCashupRepository paymentToCashupRepository;

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

    private MockMvc restPaymentToCashupMockMvc;

    private PaymentToCashup paymentToCashup;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PaymentToCashupResource paymentToCashupResource = new PaymentToCashupResource(paymentToCashupRepository);
        this.restPaymentToCashupMockMvc = MockMvcBuilders.standaloneSetup(paymentToCashupResource)
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
    public static PaymentToCashup createEntity(EntityManager em) {
        PaymentToCashup paymentToCashup = new PaymentToCashup()
            .totalPayment(DEFAULT_TOTAL_PAYMENT);
        return paymentToCashup;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PaymentToCashup createUpdatedEntity(EntityManager em) {
        PaymentToCashup paymentToCashup = new PaymentToCashup()
            .totalPayment(UPDATED_TOTAL_PAYMENT);
        return paymentToCashup;
    }

    @BeforeEach
    public void initTest() {
        paymentToCashup = createEntity(em);
    }

    @Test
    @Transactional
    public void createPaymentToCashup() throws Exception {
        int databaseSizeBeforeCreate = paymentToCashupRepository.findAll().size();

        // Create the PaymentToCashup
        restPaymentToCashupMockMvc.perform(post("/api/payment-to-cashups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paymentToCashup)))
            .andExpect(status().isCreated());

        // Validate the PaymentToCashup in the database
        List<PaymentToCashup> paymentToCashupList = paymentToCashupRepository.findAll();
        assertThat(paymentToCashupList).hasSize(databaseSizeBeforeCreate + 1);
        PaymentToCashup testPaymentToCashup = paymentToCashupList.get(paymentToCashupList.size() - 1);
        assertThat(testPaymentToCashup.getTotalPayment()).isEqualTo(DEFAULT_TOTAL_PAYMENT);
    }

    @Test
    @Transactional
    public void createPaymentToCashupWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = paymentToCashupRepository.findAll().size();

        // Create the PaymentToCashup with an existing ID
        paymentToCashup.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPaymentToCashupMockMvc.perform(post("/api/payment-to-cashups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paymentToCashup)))
            .andExpect(status().isBadRequest());

        // Validate the PaymentToCashup in the database
        List<PaymentToCashup> paymentToCashupList = paymentToCashupRepository.findAll();
        assertThat(paymentToCashupList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllPaymentToCashups() throws Exception {
        // Initialize the database
        paymentToCashupRepository.saveAndFlush(paymentToCashup);

        // Get all the paymentToCashupList
        restPaymentToCashupMockMvc.perform(get("/api/payment-to-cashups?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(paymentToCashup.getId().intValue())))
            .andExpect(jsonPath("$.[*].totalPayment").value(hasItem(DEFAULT_TOTAL_PAYMENT.intValue())));
    }
    
    @Test
    @Transactional
    public void getPaymentToCashup() throws Exception {
        // Initialize the database
        paymentToCashupRepository.saveAndFlush(paymentToCashup);

        // Get the paymentToCashup
        restPaymentToCashupMockMvc.perform(get("/api/payment-to-cashups/{id}", paymentToCashup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(paymentToCashup.getId().intValue()))
            .andExpect(jsonPath("$.totalPayment").value(DEFAULT_TOTAL_PAYMENT.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingPaymentToCashup() throws Exception {
        // Get the paymentToCashup
        restPaymentToCashupMockMvc.perform(get("/api/payment-to-cashups/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePaymentToCashup() throws Exception {
        // Initialize the database
        paymentToCashupRepository.saveAndFlush(paymentToCashup);

        int databaseSizeBeforeUpdate = paymentToCashupRepository.findAll().size();

        // Update the paymentToCashup
        PaymentToCashup updatedPaymentToCashup = paymentToCashupRepository.findById(paymentToCashup.getId()).get();
        // Disconnect from session so that the updates on updatedPaymentToCashup are not directly saved in db
        em.detach(updatedPaymentToCashup);
        updatedPaymentToCashup
            .totalPayment(UPDATED_TOTAL_PAYMENT);

        restPaymentToCashupMockMvc.perform(put("/api/payment-to-cashups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPaymentToCashup)))
            .andExpect(status().isOk());

        // Validate the PaymentToCashup in the database
        List<PaymentToCashup> paymentToCashupList = paymentToCashupRepository.findAll();
        assertThat(paymentToCashupList).hasSize(databaseSizeBeforeUpdate);
        PaymentToCashup testPaymentToCashup = paymentToCashupList.get(paymentToCashupList.size() - 1);
        assertThat(testPaymentToCashup.getTotalPayment()).isEqualTo(UPDATED_TOTAL_PAYMENT);
    }

    @Test
    @Transactional
    public void updateNonExistingPaymentToCashup() throws Exception {
        int databaseSizeBeforeUpdate = paymentToCashupRepository.findAll().size();

        // Create the PaymentToCashup

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPaymentToCashupMockMvc.perform(put("/api/payment-to-cashups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paymentToCashup)))
            .andExpect(status().isBadRequest());

        // Validate the PaymentToCashup in the database
        List<PaymentToCashup> paymentToCashupList = paymentToCashupRepository.findAll();
        assertThat(paymentToCashupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePaymentToCashup() throws Exception {
        // Initialize the database
        paymentToCashupRepository.saveAndFlush(paymentToCashup);

        int databaseSizeBeforeDelete = paymentToCashupRepository.findAll().size();

        // Delete the paymentToCashup
        restPaymentToCashupMockMvc.perform(delete("/api/payment-to-cashups/{id}", paymentToCashup.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PaymentToCashup> paymentToCashupList = paymentToCashupRepository.findAll();
        assertThat(paymentToCashupList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PaymentToCashup.class);
        PaymentToCashup paymentToCashup1 = new PaymentToCashup();
        paymentToCashup1.setId(1L);
        PaymentToCashup paymentToCashup2 = new PaymentToCashup();
        paymentToCashup2.setId(paymentToCashup1.getId());
        assertThat(paymentToCashup1).isEqualTo(paymentToCashup2);
        paymentToCashup2.setId(2L);
        assertThat(paymentToCashup1).isNotEqualTo(paymentToCashup2);
        paymentToCashup1.setId(null);
        assertThat(paymentToCashup1).isNotEqualTo(paymentToCashup2);
    }
}
