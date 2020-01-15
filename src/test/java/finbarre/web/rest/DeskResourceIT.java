package finbarre.web.rest;

import finbarre.BarfitterApp;
import finbarre.domain.Desk;
import finbarre.repository.DeskRepository;
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
 * Integration tests for the {@link DeskResource} REST controller.
 */
@SpringBootTest(classes = BarfitterApp.class)
public class DeskResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    private static final Long DEFAULT_PARENT_ID = 1L;
    private static final Long UPDATED_PARENT_ID = 2L;

    @Autowired
    private DeskRepository deskRepository;

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

    private MockMvc restDeskMockMvc;

    private Desk desk;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DeskResource deskResource = new DeskResource(deskRepository);
        this.restDeskMockMvc = MockMvcBuilders.standaloneSetup(deskResource)
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
    public static Desk createEntity(EntityManager em) {
        Desk desk = new Desk()
            .description(DEFAULT_DESCRIPTION)
            .active(DEFAULT_ACTIVE)
            .parentId(DEFAULT_PARENT_ID);
        return desk;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Desk createUpdatedEntity(EntityManager em) {
        Desk desk = new Desk()
            .description(UPDATED_DESCRIPTION)
            .active(UPDATED_ACTIVE)
            .parentId(UPDATED_PARENT_ID);
        return desk;
    }

    @BeforeEach
    public void initTest() {
        desk = createEntity(em);
    }

    @Test
    @Transactional
    public void createDesk() throws Exception {
        int databaseSizeBeforeCreate = deskRepository.findAll().size();

        // Create the Desk
        restDeskMockMvc.perform(post("/api/desks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(desk)))
            .andExpect(status().isCreated());

        // Validate the Desk in the database
        List<Desk> deskList = deskRepository.findAll();
        assertThat(deskList).hasSize(databaseSizeBeforeCreate + 1);
        Desk testDesk = deskList.get(deskList.size() - 1);
        assertThat(testDesk.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testDesk.isActive()).isEqualTo(DEFAULT_ACTIVE);
        assertThat(testDesk.getParentId()).isEqualTo(DEFAULT_PARENT_ID);
    }

    @Test
    @Transactional
    public void createDeskWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = deskRepository.findAll().size();

        // Create the Desk with an existing ID
        desk.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDeskMockMvc.perform(post("/api/desks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(desk)))
            .andExpect(status().isBadRequest());

        // Validate the Desk in the database
        List<Desk> deskList = deskRepository.findAll();
        assertThat(deskList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = deskRepository.findAll().size();
        // set the field null
        desk.setDescription(null);

        // Create the Desk, which fails.

        restDeskMockMvc.perform(post("/api/desks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(desk)))
            .andExpect(status().isBadRequest());

        List<Desk> deskList = deskRepository.findAll();
        assertThat(deskList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllDesks() throws Exception {
        // Initialize the database
        deskRepository.saveAndFlush(desk);

        // Get all the deskList
        restDeskMockMvc.perform(get("/api/desks?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(desk.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].parentId").value(hasItem(DEFAULT_PARENT_ID.intValue())));
    }
    
    @Test
    @Transactional
    public void getDesk() throws Exception {
        // Initialize the database
        deskRepository.saveAndFlush(desk);

        // Get the desk
        restDeskMockMvc.perform(get("/api/desks/{id}", desk.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(desk.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()))
            .andExpect(jsonPath("$.parentId").value(DEFAULT_PARENT_ID.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingDesk() throws Exception {
        // Get the desk
        restDeskMockMvc.perform(get("/api/desks/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDesk() throws Exception {
        // Initialize the database
        deskRepository.saveAndFlush(desk);

        int databaseSizeBeforeUpdate = deskRepository.findAll().size();

        // Update the desk
        Desk updatedDesk = deskRepository.findById(desk.getId()).get();
        // Disconnect from session so that the updates on updatedDesk are not directly saved in db
        em.detach(updatedDesk);
        updatedDesk
            .description(UPDATED_DESCRIPTION)
            .active(UPDATED_ACTIVE)
            .parentId(UPDATED_PARENT_ID);

        restDeskMockMvc.perform(put("/api/desks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDesk)))
            .andExpect(status().isOk());

        // Validate the Desk in the database
        List<Desk> deskList = deskRepository.findAll();
        assertThat(deskList).hasSize(databaseSizeBeforeUpdate);
        Desk testDesk = deskList.get(deskList.size() - 1);
        assertThat(testDesk.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDesk.isActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testDesk.getParentId()).isEqualTo(UPDATED_PARENT_ID);
    }

    @Test
    @Transactional
    public void updateNonExistingDesk() throws Exception {
        int databaseSizeBeforeUpdate = deskRepository.findAll().size();

        // Create the Desk

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDeskMockMvc.perform(put("/api/desks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(desk)))
            .andExpect(status().isBadRequest());

        // Validate the Desk in the database
        List<Desk> deskList = deskRepository.findAll();
        assertThat(deskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteDesk() throws Exception {
        // Initialize the database
        deskRepository.saveAndFlush(desk);

        int databaseSizeBeforeDelete = deskRepository.findAll().size();

        // Delete the desk
        restDeskMockMvc.perform(delete("/api/desks/{id}", desk.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Desk> deskList = deskRepository.findAll();
        assertThat(deskList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Desk.class);
        Desk desk1 = new Desk();
        desk1.setId(1L);
        Desk desk2 = new Desk();
        desk2.setId(desk1.getId());
        assertThat(desk1).isEqualTo(desk2);
        desk2.setId(2L);
        assertThat(desk1).isNotEqualTo(desk2);
        desk1.setId(null);
        assertThat(desk1).isNotEqualTo(desk2);
    }
}
