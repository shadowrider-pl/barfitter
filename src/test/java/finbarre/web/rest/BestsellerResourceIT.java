package finbarre.web.rest;

import finbarre.BarfitterApp;
import finbarre.domain.Bestseller;
import finbarre.repository.BestsellerRepository;
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
 * Integration tests for the {@link BestsellerResource} REST controller.
 */
@SpringBootTest(classes = BarfitterApp.class)
public class BestsellerResourceIT {

    @Autowired
    private BestsellerRepository bestsellerRepository;

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

    private MockMvc restBestsellerMockMvc;

    private Bestseller bestseller;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BestsellerResource bestsellerResource = new BestsellerResource(bestsellerRepository);
        this.restBestsellerMockMvc = MockMvcBuilders.standaloneSetup(bestsellerResource)
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
    public static Bestseller createEntity(EntityManager em) {
        Bestseller bestseller = new Bestseller();
        return bestseller;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bestseller createUpdatedEntity(EntityManager em) {
        Bestseller bestseller = new Bestseller();
        return bestseller;
    }

    @BeforeEach
    public void initTest() {
        bestseller = createEntity(em);
    }

    @Test
    @Transactional
    public void createBestseller() throws Exception {
        int databaseSizeBeforeCreate = bestsellerRepository.findAll().size();

        // Create the Bestseller
        restBestsellerMockMvc.perform(post("/api/bestsellers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bestseller)))
            .andExpect(status().isCreated());

        // Validate the Bestseller in the database
        List<Bestseller> bestsellerList = bestsellerRepository.findAll();
        assertThat(bestsellerList).hasSize(databaseSizeBeforeCreate + 1);
        Bestseller testBestseller = bestsellerList.get(bestsellerList.size() - 1);
    }

    @Test
    @Transactional
    public void createBestsellerWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = bestsellerRepository.findAll().size();

        // Create the Bestseller with an existing ID
        bestseller.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBestsellerMockMvc.perform(post("/api/bestsellers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bestseller)))
            .andExpect(status().isBadRequest());

        // Validate the Bestseller in the database
        List<Bestseller> bestsellerList = bestsellerRepository.findAll();
        assertThat(bestsellerList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllBestsellers() throws Exception {
        // Initialize the database
        bestsellerRepository.saveAndFlush(bestseller);

        // Get all the bestsellerList
        restBestsellerMockMvc.perform(get("/api/bestsellers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bestseller.getId().intValue())));
    }
    
    @Test
    @Transactional
    public void getBestseller() throws Exception {
        // Initialize the database
        bestsellerRepository.saveAndFlush(bestseller);

        // Get the bestseller
        restBestsellerMockMvc.perform(get("/api/bestsellers/{id}", bestseller.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(bestseller.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingBestseller() throws Exception {
        // Get the bestseller
        restBestsellerMockMvc.perform(get("/api/bestsellers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBestseller() throws Exception {
        // Initialize the database
        bestsellerRepository.saveAndFlush(bestseller);

        int databaseSizeBeforeUpdate = bestsellerRepository.findAll().size();

        // Update the bestseller
        Bestseller updatedBestseller = bestsellerRepository.findById(bestseller.getId()).get();
        // Disconnect from session so that the updates on updatedBestseller are not directly saved in db
        em.detach(updatedBestseller);

        restBestsellerMockMvc.perform(put("/api/bestsellers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedBestseller)))
            .andExpect(status().isOk());

        // Validate the Bestseller in the database
        List<Bestseller> bestsellerList = bestsellerRepository.findAll();
        assertThat(bestsellerList).hasSize(databaseSizeBeforeUpdate);
        Bestseller testBestseller = bestsellerList.get(bestsellerList.size() - 1);
    }

    @Test
    @Transactional
    public void updateNonExistingBestseller() throws Exception {
        int databaseSizeBeforeUpdate = bestsellerRepository.findAll().size();

        // Create the Bestseller

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBestsellerMockMvc.perform(put("/api/bestsellers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bestseller)))
            .andExpect(status().isBadRequest());

        // Validate the Bestseller in the database
        List<Bestseller> bestsellerList = bestsellerRepository.findAll();
        assertThat(bestsellerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteBestseller() throws Exception {
        // Initialize the database
        bestsellerRepository.saveAndFlush(bestseller);

        int databaseSizeBeforeDelete = bestsellerRepository.findAll().size();

        // Delete the bestseller
        restBestsellerMockMvc.perform(delete("/api/bestsellers/{id}", bestseller.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Bestseller> bestsellerList = bestsellerRepository.findAll();
        assertThat(bestsellerList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Bestseller.class);
        Bestseller bestseller1 = new Bestseller();
        bestseller1.setId(1L);
        Bestseller bestseller2 = new Bestseller();
        bestseller2.setId(bestseller1.getId());
        assertThat(bestseller1).isEqualTo(bestseller2);
        bestseller2.setId(2L);
        assertThat(bestseller1).isNotEqualTo(bestseller2);
        bestseller1.setId(null);
        assertThat(bestseller1).isNotEqualTo(bestseller2);
    }
}
