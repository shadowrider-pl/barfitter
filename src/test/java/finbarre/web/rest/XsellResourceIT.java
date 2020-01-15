package finbarre.web.rest;

import finbarre.BarfitterApp;
import finbarre.domain.Xsell;
import finbarre.repository.XsellRepository;
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
 * Integration tests for the {@link XsellResource} REST controller.
 */
@SpringBootTest(classes = BarfitterApp.class)
public class XsellResourceIT {

    @Autowired
    private XsellRepository xsellRepository;

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

    private MockMvc restXsellMockMvc;

    private Xsell xsell;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final XsellResource xsellResource = new XsellResource(xsellRepository);
        this.restXsellMockMvc = MockMvcBuilders.standaloneSetup(xsellResource)
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
    public static Xsell createEntity(EntityManager em) {
        Xsell xsell = new Xsell();
        return xsell;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Xsell createUpdatedEntity(EntityManager em) {
        Xsell xsell = new Xsell();
        return xsell;
    }

    @BeforeEach
    public void initTest() {
        xsell = createEntity(em);
    }

    @Test
    @Transactional
    public void createXsell() throws Exception {
        int databaseSizeBeforeCreate = xsellRepository.findAll().size();

        // Create the Xsell
        restXsellMockMvc.perform(post("/api/xsells")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(xsell)))
            .andExpect(status().isCreated());

        // Validate the Xsell in the database
        List<Xsell> xsellList = xsellRepository.findAll();
        assertThat(xsellList).hasSize(databaseSizeBeforeCreate + 1);
        Xsell testXsell = xsellList.get(xsellList.size() - 1);
    }

    @Test
    @Transactional
    public void createXsellWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = xsellRepository.findAll().size();

        // Create the Xsell with an existing ID
        xsell.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restXsellMockMvc.perform(post("/api/xsells")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(xsell)))
            .andExpect(status().isBadRequest());

        // Validate the Xsell in the database
        List<Xsell> xsellList = xsellRepository.findAll();
        assertThat(xsellList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllXsells() throws Exception {
        // Initialize the database
        xsellRepository.saveAndFlush(xsell);

        // Get all the xsellList
        restXsellMockMvc.perform(get("/api/xsells?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(xsell.getId().intValue())));
    }
    
    @Test
    @Transactional
    public void getXsell() throws Exception {
        // Initialize the database
        xsellRepository.saveAndFlush(xsell);

        // Get the xsell
        restXsellMockMvc.perform(get("/api/xsells/{id}", xsell.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(xsell.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingXsell() throws Exception {
        // Get the xsell
        restXsellMockMvc.perform(get("/api/xsells/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateXsell() throws Exception {
        // Initialize the database
        xsellRepository.saveAndFlush(xsell);

        int databaseSizeBeforeUpdate = xsellRepository.findAll().size();

        // Update the xsell
        Xsell updatedXsell = xsellRepository.findById(xsell.getId()).get();
        // Disconnect from session so that the updates on updatedXsell are not directly saved in db
        em.detach(updatedXsell);

        restXsellMockMvc.perform(put("/api/xsells")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedXsell)))
            .andExpect(status().isOk());

        // Validate the Xsell in the database
        List<Xsell> xsellList = xsellRepository.findAll();
        assertThat(xsellList).hasSize(databaseSizeBeforeUpdate);
        Xsell testXsell = xsellList.get(xsellList.size() - 1);
    }

    @Test
    @Transactional
    public void updateNonExistingXsell() throws Exception {
        int databaseSizeBeforeUpdate = xsellRepository.findAll().size();

        // Create the Xsell

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restXsellMockMvc.perform(put("/api/xsells")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(xsell)))
            .andExpect(status().isBadRequest());

        // Validate the Xsell in the database
        List<Xsell> xsellList = xsellRepository.findAll();
        assertThat(xsellList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteXsell() throws Exception {
        // Initialize the database
        xsellRepository.saveAndFlush(xsell);

        int databaseSizeBeforeDelete = xsellRepository.findAll().size();

        // Delete the xsell
        restXsellMockMvc.perform(delete("/api/xsells/{id}", xsell.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Xsell> xsellList = xsellRepository.findAll();
        assertThat(xsellList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Xsell.class);
        Xsell xsell1 = new Xsell();
        xsell1.setId(1L);
        Xsell xsell2 = new Xsell();
        xsell2.setId(xsell1.getId());
        assertThat(xsell1).isEqualTo(xsell2);
        xsell2.setId(2L);
        assertThat(xsell1).isNotEqualTo(xsell2);
        xsell1.setId(null);
        assertThat(xsell1).isNotEqualTo(xsell2);
    }
}
