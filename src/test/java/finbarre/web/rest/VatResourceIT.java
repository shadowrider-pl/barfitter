package finbarre.web.rest;

import finbarre.BarfitterApp;
import finbarre.domain.Vat;
import finbarre.repository.VatRepository;
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
 * Integration tests for the {@link VatResource} REST controller.
 */
@SpringBootTest(classes = BarfitterApp.class)
public class VatResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_RATE = new BigDecimal(1);
    private static final BigDecimal UPDATED_RATE = new BigDecimal(2);

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    @Autowired
    private VatRepository vatRepository;

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

    private MockMvc restVatMockMvc;

    private Vat vat;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final VatResource vatResource = new VatResource(vatRepository);
        this.restVatMockMvc = MockMvcBuilders.standaloneSetup(vatResource)
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
    public static Vat createEntity(EntityManager em) {
        Vat vat = new Vat()
            .description(DEFAULT_DESCRIPTION)
            .rate(DEFAULT_RATE)
            .active(DEFAULT_ACTIVE);
        return vat;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vat createUpdatedEntity(EntityManager em) {
        Vat vat = new Vat()
            .description(UPDATED_DESCRIPTION)
            .rate(UPDATED_RATE)
            .active(UPDATED_ACTIVE);
        return vat;
    }

    @BeforeEach
    public void initTest() {
        vat = createEntity(em);
    }

    @Test
    @Transactional
    public void createVat() throws Exception {
        int databaseSizeBeforeCreate = vatRepository.findAll().size();

        // Create the Vat
        restVatMockMvc.perform(post("/api/vats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(vat)))
            .andExpect(status().isCreated());

        // Validate the Vat in the database
        List<Vat> vatList = vatRepository.findAll();
        assertThat(vatList).hasSize(databaseSizeBeforeCreate + 1);
        Vat testVat = vatList.get(vatList.size() - 1);
        assertThat(testVat.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testVat.getRate()).isEqualTo(DEFAULT_RATE);
        assertThat(testVat.isActive()).isEqualTo(DEFAULT_ACTIVE);
    }

    @Test
    @Transactional
    public void createVatWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = vatRepository.findAll().size();

        // Create the Vat with an existing ID
        vat.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restVatMockMvc.perform(post("/api/vats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(vat)))
            .andExpect(status().isBadRequest());

        // Validate the Vat in the database
        List<Vat> vatList = vatRepository.findAll();
        assertThat(vatList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = vatRepository.findAll().size();
        // set the field null
        vat.setDescription(null);

        // Create the Vat, which fails.

        restVatMockMvc.perform(post("/api/vats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(vat)))
            .andExpect(status().isBadRequest());

        List<Vat> vatList = vatRepository.findAll();
        assertThat(vatList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkRateIsRequired() throws Exception {
        int databaseSizeBeforeTest = vatRepository.findAll().size();
        // set the field null
        vat.setRate(null);

        // Create the Vat, which fails.

        restVatMockMvc.perform(post("/api/vats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(vat)))
            .andExpect(status().isBadRequest());

        List<Vat> vatList = vatRepository.findAll();
        assertThat(vatList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllVats() throws Exception {
        // Initialize the database
        vatRepository.saveAndFlush(vat);

        // Get all the vatList
        restVatMockMvc.perform(get("/api/vats?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vat.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].rate").value(hasItem(DEFAULT_RATE.intValue())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getVat() throws Exception {
        // Initialize the database
        vatRepository.saveAndFlush(vat);

        // Get the vat
        restVatMockMvc.perform(get("/api/vats/{id}", vat.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(vat.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.rate").value(DEFAULT_RATE.intValue()))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingVat() throws Exception {
        // Get the vat
        restVatMockMvc.perform(get("/api/vats/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateVat() throws Exception {
        // Initialize the database
        vatRepository.saveAndFlush(vat);

        int databaseSizeBeforeUpdate = vatRepository.findAll().size();

        // Update the vat
        Vat updatedVat = vatRepository.findById(vat.getId()).get();
        // Disconnect from session so that the updates on updatedVat are not directly saved in db
        em.detach(updatedVat);
        updatedVat
            .description(UPDATED_DESCRIPTION)
            .rate(UPDATED_RATE)
            .active(UPDATED_ACTIVE);

        restVatMockMvc.perform(put("/api/vats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedVat)))
            .andExpect(status().isOk());

        // Validate the Vat in the database
        List<Vat> vatList = vatRepository.findAll();
        assertThat(vatList).hasSize(databaseSizeBeforeUpdate);
        Vat testVat = vatList.get(vatList.size() - 1);
        assertThat(testVat.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testVat.getRate()).isEqualTo(UPDATED_RATE);
        assertThat(testVat.isActive()).isEqualTo(UPDATED_ACTIVE);
    }

    @Test
    @Transactional
    public void updateNonExistingVat() throws Exception {
        int databaseSizeBeforeUpdate = vatRepository.findAll().size();

        // Create the Vat

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVatMockMvc.perform(put("/api/vats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(vat)))
            .andExpect(status().isBadRequest());

        // Validate the Vat in the database
        List<Vat> vatList = vatRepository.findAll();
        assertThat(vatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteVat() throws Exception {
        // Initialize the database
        vatRepository.saveAndFlush(vat);

        int databaseSizeBeforeDelete = vatRepository.findAll().size();

        // Delete the vat
        restVatMockMvc.perform(delete("/api/vats/{id}", vat.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Vat> vatList = vatRepository.findAll();
        assertThat(vatList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Vat.class);
        Vat vat1 = new Vat();
        vat1.setId(1L);
        Vat vat2 = new Vat();
        vat2.setId(vat1.getId());
        assertThat(vat1).isEqualTo(vat2);
        vat2.setId(2L);
        assertThat(vat1).isNotEqualTo(vat2);
        vat1.setId(null);
        assertThat(vat1).isNotEqualTo(vat2);
    }
}
