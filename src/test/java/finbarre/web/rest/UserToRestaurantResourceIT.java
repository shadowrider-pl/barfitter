package finbarre.web.rest;

import finbarre.BarfitterApp;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.UserToRestaurantRepository;
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
 * Integration tests for the {@link UserToRestaurantResource} REST controller.
 */
@SpringBootTest(classes = BarfitterApp.class)
public class UserToRestaurantResourceIT {

    @Autowired
    private UserToRestaurantRepository userToRestaurantRepository;

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

    private MockMvc restUserToRestaurantMockMvc;

    private UserToRestaurant userToRestaurant;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final UserToRestaurantResource userToRestaurantResource = new UserToRestaurantResource(userToRestaurantRepository);
        this.restUserToRestaurantMockMvc = MockMvcBuilders.standaloneSetup(userToRestaurantResource)
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
    public static UserToRestaurant createEntity(EntityManager em) {
        UserToRestaurant userToRestaurant = new UserToRestaurant();
        return userToRestaurant;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserToRestaurant createUpdatedEntity(EntityManager em) {
        UserToRestaurant userToRestaurant = new UserToRestaurant();
        return userToRestaurant;
    }

    @BeforeEach
    public void initTest() {
        userToRestaurant = createEntity(em);
    }

    @Test
    @Transactional
    public void createUserToRestaurant() throws Exception {
        int databaseSizeBeforeCreate = userToRestaurantRepository.findAll().size();

        // Create the UserToRestaurant
        restUserToRestaurantMockMvc.perform(post("/api/user-to-restaurants")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userToRestaurant)))
            .andExpect(status().isCreated());

        // Validate the UserToRestaurant in the database
        List<UserToRestaurant> userToRestaurantList = userToRestaurantRepository.findAll();
        assertThat(userToRestaurantList).hasSize(databaseSizeBeforeCreate + 1);
        UserToRestaurant testUserToRestaurant = userToRestaurantList.get(userToRestaurantList.size() - 1);
    }

    @Test
    @Transactional
    public void createUserToRestaurantWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = userToRestaurantRepository.findAll().size();

        // Create the UserToRestaurant with an existing ID
        userToRestaurant.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserToRestaurantMockMvc.perform(post("/api/user-to-restaurants")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userToRestaurant)))
            .andExpect(status().isBadRequest());

        // Validate the UserToRestaurant in the database
        List<UserToRestaurant> userToRestaurantList = userToRestaurantRepository.findAll();
        assertThat(userToRestaurantList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllUserToRestaurants() throws Exception {
        // Initialize the database
        userToRestaurantRepository.saveAndFlush(userToRestaurant);

        // Get all the userToRestaurantList
        restUserToRestaurantMockMvc.perform(get("/api/user-to-restaurants?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userToRestaurant.getId().intValue())));
    }
    
    @Test
    @Transactional
    public void getUserToRestaurant() throws Exception {
        // Initialize the database
        userToRestaurantRepository.saveAndFlush(userToRestaurant);

        // Get the userToRestaurant
        restUserToRestaurantMockMvc.perform(get("/api/user-to-restaurants/{id}", userToRestaurant.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(userToRestaurant.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingUserToRestaurant() throws Exception {
        // Get the userToRestaurant
        restUserToRestaurantMockMvc.perform(get("/api/user-to-restaurants/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateUserToRestaurant() throws Exception {
        // Initialize the database
        userToRestaurantRepository.saveAndFlush(userToRestaurant);

        int databaseSizeBeforeUpdate = userToRestaurantRepository.findAll().size();

        // Update the userToRestaurant
        UserToRestaurant updatedUserToRestaurant = userToRestaurantRepository.findById(userToRestaurant.getId()).get();
        // Disconnect from session so that the updates on updatedUserToRestaurant are not directly saved in db
        em.detach(updatedUserToRestaurant);

        restUserToRestaurantMockMvc.perform(put("/api/user-to-restaurants")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedUserToRestaurant)))
            .andExpect(status().isOk());

        // Validate the UserToRestaurant in the database
        List<UserToRestaurant> userToRestaurantList = userToRestaurantRepository.findAll();
        assertThat(userToRestaurantList).hasSize(databaseSizeBeforeUpdate);
        UserToRestaurant testUserToRestaurant = userToRestaurantList.get(userToRestaurantList.size() - 1);
    }

    @Test
    @Transactional
    public void updateNonExistingUserToRestaurant() throws Exception {
        int databaseSizeBeforeUpdate = userToRestaurantRepository.findAll().size();

        // Create the UserToRestaurant

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserToRestaurantMockMvc.perform(put("/api/user-to-restaurants")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userToRestaurant)))
            .andExpect(status().isBadRequest());

        // Validate the UserToRestaurant in the database
        List<UserToRestaurant> userToRestaurantList = userToRestaurantRepository.findAll();
        assertThat(userToRestaurantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteUserToRestaurant() throws Exception {
        // Initialize the database
        userToRestaurantRepository.saveAndFlush(userToRestaurant);

        int databaseSizeBeforeDelete = userToRestaurantRepository.findAll().size();

        // Delete the userToRestaurant
        restUserToRestaurantMockMvc.perform(delete("/api/user-to-restaurants/{id}", userToRestaurant.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserToRestaurant> userToRestaurantList = userToRestaurantRepository.findAll();
        assertThat(userToRestaurantList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserToRestaurant.class);
        UserToRestaurant userToRestaurant1 = new UserToRestaurant();
        userToRestaurant1.setId(1L);
        UserToRestaurant userToRestaurant2 = new UserToRestaurant();
        userToRestaurant2.setId(userToRestaurant1.getId());
        assertThat(userToRestaurant1).isEqualTo(userToRestaurant2);
        userToRestaurant2.setId(2L);
        assertThat(userToRestaurant1).isNotEqualTo(userToRestaurant2);
        userToRestaurant1.setId(null);
        assertThat(userToRestaurant1).isNotEqualTo(userToRestaurant2);
    }
}
