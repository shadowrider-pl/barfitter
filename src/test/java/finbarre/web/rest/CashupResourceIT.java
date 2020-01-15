package finbarre.web.rest;

import finbarre.BarfitterApp;
import finbarre.domain.Cashup;
import finbarre.repository.CashupRepository;
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
 * Integration tests for the {@link CashupResource} REST controller.
 */
@SpringBootTest(classes = BarfitterApp.class)
public class CashupResourceIT {

    private static final ZonedDateTime DEFAULT_BARMAN_LOGIN_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_BARMAN_LOGIN_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_CASHUP_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CASHUP_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final BigDecimal DEFAULT_START_CASH = new BigDecimal(1);
    private static final BigDecimal UPDATED_START_CASH = new BigDecimal(2);

    private static final BigDecimal DEFAULT_END_CASH = new BigDecimal(1);
    private static final BigDecimal UPDATED_END_CASH = new BigDecimal(2);

    private static final BigDecimal DEFAULT_TOTAL_SALE = new BigDecimal(1);
    private static final BigDecimal UPDATED_TOTAL_SALE = new BigDecimal(2);

    private static final BigDecimal DEFAULT_CASH_TAKEN_BY_MANAGER = new BigDecimal(1);
    private static final BigDecimal UPDATED_CASH_TAKEN_BY_MANAGER = new BigDecimal(2);

    private static final BigDecimal DEFAULT_CASH_TAKEN_BY_BOSS = new BigDecimal(1);
    private static final BigDecimal UPDATED_CASH_TAKEN_BY_BOSS = new BigDecimal(2);

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    @Autowired
    private CashupRepository cashupRepository;

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

    private MockMvc restCashupMockMvc;

    private Cashup cashup;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CashupResource cashupResource = new CashupResource(cashupRepository);
        this.restCashupMockMvc = MockMvcBuilders.standaloneSetup(cashupResource)
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
    public static Cashup createEntity(EntityManager em) {
        Cashup cashup = new Cashup()
            .barmanLoginTime(DEFAULT_BARMAN_LOGIN_TIME)
            .cashupTime(DEFAULT_CASHUP_TIME)
            .startCash(DEFAULT_START_CASH)
            .endCash(DEFAULT_END_CASH)
            .totalSale(DEFAULT_TOTAL_SALE)
            .cashTakenByManager(DEFAULT_CASH_TAKEN_BY_MANAGER)
            .cashTakenByBoss(DEFAULT_CASH_TAKEN_BY_BOSS)
            .comment(DEFAULT_COMMENT);
        return cashup;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cashup createUpdatedEntity(EntityManager em) {
        Cashup cashup = new Cashup()
            .barmanLoginTime(UPDATED_BARMAN_LOGIN_TIME)
            .cashupTime(UPDATED_CASHUP_TIME)
            .startCash(UPDATED_START_CASH)
            .endCash(UPDATED_END_CASH)
            .totalSale(UPDATED_TOTAL_SALE)
            .cashTakenByManager(UPDATED_CASH_TAKEN_BY_MANAGER)
            .cashTakenByBoss(UPDATED_CASH_TAKEN_BY_BOSS)
            .comment(UPDATED_COMMENT);
        return cashup;
    }

    @BeforeEach
    public void initTest() {
        cashup = createEntity(em);
    }

    @Test
    @Transactional
    public void createCashup() throws Exception {
        int databaseSizeBeforeCreate = cashupRepository.findAll().size();

        // Create the Cashup
        restCashupMockMvc.perform(post("/api/cashups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cashup)))
            .andExpect(status().isCreated());

        // Validate the Cashup in the database
        List<Cashup> cashupList = cashupRepository.findAll();
        assertThat(cashupList).hasSize(databaseSizeBeforeCreate + 1);
        Cashup testCashup = cashupList.get(cashupList.size() - 1);
        assertThat(testCashup.getBarmanLoginTime()).isEqualTo(DEFAULT_BARMAN_LOGIN_TIME);
        assertThat(testCashup.getCashupTime()).isEqualTo(DEFAULT_CASHUP_TIME);
        assertThat(testCashup.getStartCash()).isEqualTo(DEFAULT_START_CASH);
        assertThat(testCashup.getEndCash()).isEqualTo(DEFAULT_END_CASH);
        assertThat(testCashup.getTotalSale()).isEqualTo(DEFAULT_TOTAL_SALE);
        assertThat(testCashup.getCashTakenByManager()).isEqualTo(DEFAULT_CASH_TAKEN_BY_MANAGER);
        assertThat(testCashup.getCashTakenByBoss()).isEqualTo(DEFAULT_CASH_TAKEN_BY_BOSS);
        assertThat(testCashup.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    public void createCashupWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = cashupRepository.findAll().size();

        // Create the Cashup with an existing ID
        cashup.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCashupMockMvc.perform(post("/api/cashups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cashup)))
            .andExpect(status().isBadRequest());

        // Validate the Cashup in the database
        List<Cashup> cashupList = cashupRepository.findAll();
        assertThat(cashupList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkBarmanLoginTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = cashupRepository.findAll().size();
        // set the field null
        cashup.setBarmanLoginTime(null);

        // Create the Cashup, which fails.

        restCashupMockMvc.perform(post("/api/cashups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cashup)))
            .andExpect(status().isBadRequest());

        List<Cashup> cashupList = cashupRepository.findAll();
        assertThat(cashupList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCashups() throws Exception {
        // Initialize the database
        cashupRepository.saveAndFlush(cashup);

        // Get all the cashupList
        restCashupMockMvc.perform(get("/api/cashups?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cashup.getId().intValue())))
            .andExpect(jsonPath("$.[*].barmanLoginTime").value(hasItem(sameInstant(DEFAULT_BARMAN_LOGIN_TIME))))
            .andExpect(jsonPath("$.[*].cashupTime").value(hasItem(sameInstant(DEFAULT_CASHUP_TIME))))
            .andExpect(jsonPath("$.[*].startCash").value(hasItem(DEFAULT_START_CASH.intValue())))
            .andExpect(jsonPath("$.[*].endCash").value(hasItem(DEFAULT_END_CASH.intValue())))
            .andExpect(jsonPath("$.[*].totalSale").value(hasItem(DEFAULT_TOTAL_SALE.intValue())))
            .andExpect(jsonPath("$.[*].cashTakenByManager").value(hasItem(DEFAULT_CASH_TAKEN_BY_MANAGER.intValue())))
            .andExpect(jsonPath("$.[*].cashTakenByBoss").value(hasItem(DEFAULT_CASH_TAKEN_BY_BOSS.intValue())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }
    
    @Test
    @Transactional
    public void getCashup() throws Exception {
        // Initialize the database
        cashupRepository.saveAndFlush(cashup);

        // Get the cashup
        restCashupMockMvc.perform(get("/api/cashups/{id}", cashup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(cashup.getId().intValue()))
            .andExpect(jsonPath("$.barmanLoginTime").value(sameInstant(DEFAULT_BARMAN_LOGIN_TIME)))
            .andExpect(jsonPath("$.cashupTime").value(sameInstant(DEFAULT_CASHUP_TIME)))
            .andExpect(jsonPath("$.startCash").value(DEFAULT_START_CASH.intValue()))
            .andExpect(jsonPath("$.endCash").value(DEFAULT_END_CASH.intValue()))
            .andExpect(jsonPath("$.totalSale").value(DEFAULT_TOTAL_SALE.intValue()))
            .andExpect(jsonPath("$.cashTakenByManager").value(DEFAULT_CASH_TAKEN_BY_MANAGER.intValue()))
            .andExpect(jsonPath("$.cashTakenByBoss").value(DEFAULT_CASH_TAKEN_BY_BOSS.intValue()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    public void getNonExistingCashup() throws Exception {
        // Get the cashup
        restCashupMockMvc.perform(get("/api/cashups/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCashup() throws Exception {
        // Initialize the database
        cashupRepository.saveAndFlush(cashup);

        int databaseSizeBeforeUpdate = cashupRepository.findAll().size();

        // Update the cashup
        Cashup updatedCashup = cashupRepository.findById(cashup.getId()).get();
        // Disconnect from session so that the updates on updatedCashup are not directly saved in db
        em.detach(updatedCashup);
        updatedCashup
            .barmanLoginTime(UPDATED_BARMAN_LOGIN_TIME)
            .cashupTime(UPDATED_CASHUP_TIME)
            .startCash(UPDATED_START_CASH)
            .endCash(UPDATED_END_CASH)
            .totalSale(UPDATED_TOTAL_SALE)
            .cashTakenByManager(UPDATED_CASH_TAKEN_BY_MANAGER)
            .cashTakenByBoss(UPDATED_CASH_TAKEN_BY_BOSS)
            .comment(UPDATED_COMMENT);

        restCashupMockMvc.perform(put("/api/cashups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCashup)))
            .andExpect(status().isOk());

        // Validate the Cashup in the database
        List<Cashup> cashupList = cashupRepository.findAll();
        assertThat(cashupList).hasSize(databaseSizeBeforeUpdate);
        Cashup testCashup = cashupList.get(cashupList.size() - 1);
        assertThat(testCashup.getBarmanLoginTime()).isEqualTo(UPDATED_BARMAN_LOGIN_TIME);
        assertThat(testCashup.getCashupTime()).isEqualTo(UPDATED_CASHUP_TIME);
        assertThat(testCashup.getStartCash()).isEqualTo(UPDATED_START_CASH);
        assertThat(testCashup.getEndCash()).isEqualTo(UPDATED_END_CASH);
        assertThat(testCashup.getTotalSale()).isEqualTo(UPDATED_TOTAL_SALE);
        assertThat(testCashup.getCashTakenByManager()).isEqualTo(UPDATED_CASH_TAKEN_BY_MANAGER);
        assertThat(testCashup.getCashTakenByBoss()).isEqualTo(UPDATED_CASH_TAKEN_BY_BOSS);
        assertThat(testCashup.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    public void updateNonExistingCashup() throws Exception {
        int databaseSizeBeforeUpdate = cashupRepository.findAll().size();

        // Create the Cashup

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCashupMockMvc.perform(put("/api/cashups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cashup)))
            .andExpect(status().isBadRequest());

        // Validate the Cashup in the database
        List<Cashup> cashupList = cashupRepository.findAll();
        assertThat(cashupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCashup() throws Exception {
        // Initialize the database
        cashupRepository.saveAndFlush(cashup);

        int databaseSizeBeforeDelete = cashupRepository.findAll().size();

        // Delete the cashup
        restCashupMockMvc.perform(delete("/api/cashups/{id}", cashup.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Cashup> cashupList = cashupRepository.findAll();
        assertThat(cashupList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Cashup.class);
        Cashup cashup1 = new Cashup();
        cashup1.setId(1L);
        Cashup cashup2 = new Cashup();
        cashup2.setId(cashup1.getId());
        assertThat(cashup1).isEqualTo(cashup2);
        cashup2.setId(2L);
        assertThat(cashup1).isNotEqualTo(cashup2);
        cashup1.setId(null);
        assertThat(cashup1).isNotEqualTo(cashup2);
    }
}
