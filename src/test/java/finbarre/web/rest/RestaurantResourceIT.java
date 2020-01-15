package finbarre.web.rest;

import finbarre.BarfitterApp;
import finbarre.domain.Restaurant;
import finbarre.repository.RestaurantRepository;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static finbarre.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link RestaurantResource} REST controller.
 */
@SpringBootTest(classes = BarfitterApp.class)
public class RestaurantResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_COUNTRY = "AAAAAAAAAA";
    private static final String UPDATED_COUNTRY = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_ZIP_CODE = "AAAAAAAAAA";
    private static final String UPDATED_ZIP_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_CITY = "AAAAAAAAAA";
    private static final String UPDATED_CITY = "BBBBBBBBBB";

    private static final String DEFAULT_VAT_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_VAT_NUMBER = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_LICENCE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_LICENCE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_LICENCE_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_LICENCE_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_NEXT_LICENCE_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_NEXT_LICENCE_TYPE = "BBBBBBBBBB";

    private static final Integer DEFAULT_ADS_LEVEL = 1;
    private static final Integer UPDATED_ADS_LEVEL = 2;

    private static final String DEFAULT_CURRENCY = "AAAAAAAAAA";
    private static final String UPDATED_CURRENCY = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_CREATED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_DATE = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private RestaurantRepository restaurantRepository;

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

    private MockMvc restRestaurantMockMvc;

    private Restaurant restaurant;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final RestaurantResource restaurantResource = new RestaurantResource(restaurantRepository);
        this.restRestaurantMockMvc = MockMvcBuilders.standaloneSetup(restaurantResource)
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
    public static Restaurant createEntity(EntityManager em) {
        Restaurant restaurant = new Restaurant()
            .name(DEFAULT_NAME)
            .country(DEFAULT_COUNTRY)
            .address(DEFAULT_ADDRESS)
            .zipCode(DEFAULT_ZIP_CODE)
            .city(DEFAULT_CITY)
            .vatNumber(DEFAULT_VAT_NUMBER)
            .licenceDate(DEFAULT_LICENCE_DATE)
            .licenceType(DEFAULT_LICENCE_TYPE)
            .nextLicenceType(DEFAULT_NEXT_LICENCE_TYPE)
            .adsLevel(DEFAULT_ADS_LEVEL)
            .currency(DEFAULT_CURRENCY)
            .createdDate(DEFAULT_CREATED_DATE);
        return restaurant;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Restaurant createUpdatedEntity(EntityManager em) {
        Restaurant restaurant = new Restaurant()
            .name(UPDATED_NAME)
            .country(UPDATED_COUNTRY)
            .address(UPDATED_ADDRESS)
            .zipCode(UPDATED_ZIP_CODE)
            .city(UPDATED_CITY)
            .vatNumber(UPDATED_VAT_NUMBER)
            .licenceDate(UPDATED_LICENCE_DATE)
            .licenceType(UPDATED_LICENCE_TYPE)
            .nextLicenceType(UPDATED_NEXT_LICENCE_TYPE)
            .adsLevel(UPDATED_ADS_LEVEL)
            .currency(UPDATED_CURRENCY)
            .createdDate(UPDATED_CREATED_DATE);
        return restaurant;
    }

    @BeforeEach
    public void initTest() {
        restaurant = createEntity(em);
    }

    @Test
    @Transactional
    public void createRestaurant() throws Exception {
        int databaseSizeBeforeCreate = restaurantRepository.findAll().size();

        // Create the Restaurant
        restRestaurantMockMvc.perform(post("/api/restaurants")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(restaurant)))
            .andExpect(status().isCreated());

        // Validate the Restaurant in the database
        List<Restaurant> restaurantList = restaurantRepository.findAll();
        assertThat(restaurantList).hasSize(databaseSizeBeforeCreate + 1);
        Restaurant testRestaurant = restaurantList.get(restaurantList.size() - 1);
        assertThat(testRestaurant.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testRestaurant.getCountry()).isEqualTo(DEFAULT_COUNTRY);
        assertThat(testRestaurant.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testRestaurant.getZipCode()).isEqualTo(DEFAULT_ZIP_CODE);
        assertThat(testRestaurant.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testRestaurant.getVatNumber()).isEqualTo(DEFAULT_VAT_NUMBER);
        assertThat(testRestaurant.getLicenceDate()).isEqualTo(DEFAULT_LICENCE_DATE);
        assertThat(testRestaurant.getLicenceType()).isEqualTo(DEFAULT_LICENCE_TYPE);
        assertThat(testRestaurant.getNextLicenceType()).isEqualTo(DEFAULT_NEXT_LICENCE_TYPE);
        assertThat(testRestaurant.getAdsLevel()).isEqualTo(DEFAULT_ADS_LEVEL);
        assertThat(testRestaurant.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testRestaurant.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
    }

    @Test
    @Transactional
    public void createRestaurantWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = restaurantRepository.findAll().size();

        // Create the Restaurant with an existing ID
        restaurant.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRestaurantMockMvc.perform(post("/api/restaurants")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(restaurant)))
            .andExpect(status().isBadRequest());

        // Validate the Restaurant in the database
        List<Restaurant> restaurantList = restaurantRepository.findAll();
        assertThat(restaurantList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllRestaurants() throws Exception {
        // Initialize the database
        restaurantRepository.saveAndFlush(restaurant);

        // Get all the restaurantList
        restRestaurantMockMvc.perform(get("/api/restaurants?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(restaurant.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].country").value(hasItem(DEFAULT_COUNTRY)))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].zipCode").value(hasItem(DEFAULT_ZIP_CODE)))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY)))
            .andExpect(jsonPath("$.[*].vatNumber").value(hasItem(DEFAULT_VAT_NUMBER)))
            .andExpect(jsonPath("$.[*].licenceDate").value(hasItem(DEFAULT_LICENCE_DATE.toString())))
            .andExpect(jsonPath("$.[*].licenceType").value(hasItem(DEFAULT_LICENCE_TYPE)))
            .andExpect(jsonPath("$.[*].nextLicenceType").value(hasItem(DEFAULT_NEXT_LICENCE_TYPE)))
            .andExpect(jsonPath("$.[*].adsLevel").value(hasItem(DEFAULT_ADS_LEVEL)))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getRestaurant() throws Exception {
        // Initialize the database
        restaurantRepository.saveAndFlush(restaurant);

        // Get the restaurant
        restRestaurantMockMvc.perform(get("/api/restaurants/{id}", restaurant.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(restaurant.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.country").value(DEFAULT_COUNTRY))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS))
            .andExpect(jsonPath("$.zipCode").value(DEFAULT_ZIP_CODE))
            .andExpect(jsonPath("$.city").value(DEFAULT_CITY))
            .andExpect(jsonPath("$.vatNumber").value(DEFAULT_VAT_NUMBER))
            .andExpect(jsonPath("$.licenceDate").value(DEFAULT_LICENCE_DATE.toString()))
            .andExpect(jsonPath("$.licenceType").value(DEFAULT_LICENCE_TYPE))
            .andExpect(jsonPath("$.nextLicenceType").value(DEFAULT_NEXT_LICENCE_TYPE))
            .andExpect(jsonPath("$.adsLevel").value(DEFAULT_ADS_LEVEL))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingRestaurant() throws Exception {
        // Get the restaurant
        restRestaurantMockMvc.perform(get("/api/restaurants/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRestaurant() throws Exception {
        // Initialize the database
        restaurantRepository.saveAndFlush(restaurant);

        int databaseSizeBeforeUpdate = restaurantRepository.findAll().size();

        // Update the restaurant
        Restaurant updatedRestaurant = restaurantRepository.findById(restaurant.getId()).get();
        // Disconnect from session so that the updates on updatedRestaurant are not directly saved in db
        em.detach(updatedRestaurant);
        updatedRestaurant
            .name(UPDATED_NAME)
            .country(UPDATED_COUNTRY)
            .address(UPDATED_ADDRESS)
            .zipCode(UPDATED_ZIP_CODE)
            .city(UPDATED_CITY)
            .vatNumber(UPDATED_VAT_NUMBER)
            .licenceDate(UPDATED_LICENCE_DATE)
            .licenceType(UPDATED_LICENCE_TYPE)
            .nextLicenceType(UPDATED_NEXT_LICENCE_TYPE)
            .adsLevel(UPDATED_ADS_LEVEL)
            .currency(UPDATED_CURRENCY)
            .createdDate(UPDATED_CREATED_DATE);

        restRestaurantMockMvc.perform(put("/api/restaurants")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedRestaurant)))
            .andExpect(status().isOk());

        // Validate the Restaurant in the database
        List<Restaurant> restaurantList = restaurantRepository.findAll();
        assertThat(restaurantList).hasSize(databaseSizeBeforeUpdate);
        Restaurant testRestaurant = restaurantList.get(restaurantList.size() - 1);
        assertThat(testRestaurant.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testRestaurant.getCountry()).isEqualTo(UPDATED_COUNTRY);
        assertThat(testRestaurant.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testRestaurant.getZipCode()).isEqualTo(UPDATED_ZIP_CODE);
        assertThat(testRestaurant.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testRestaurant.getVatNumber()).isEqualTo(UPDATED_VAT_NUMBER);
        assertThat(testRestaurant.getLicenceDate()).isEqualTo(UPDATED_LICENCE_DATE);
        assertThat(testRestaurant.getLicenceType()).isEqualTo(UPDATED_LICENCE_TYPE);
        assertThat(testRestaurant.getNextLicenceType()).isEqualTo(UPDATED_NEXT_LICENCE_TYPE);
        assertThat(testRestaurant.getAdsLevel()).isEqualTo(UPDATED_ADS_LEVEL);
        assertThat(testRestaurant.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testRestaurant.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingRestaurant() throws Exception {
        int databaseSizeBeforeUpdate = restaurantRepository.findAll().size();

        // Create the Restaurant

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRestaurantMockMvc.perform(put("/api/restaurants")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(restaurant)))
            .andExpect(status().isBadRequest());

        // Validate the Restaurant in the database
        List<Restaurant> restaurantList = restaurantRepository.findAll();
        assertThat(restaurantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteRestaurant() throws Exception {
        // Initialize the database
        restaurantRepository.saveAndFlush(restaurant);

        int databaseSizeBeforeDelete = restaurantRepository.findAll().size();

        // Delete the restaurant
        restRestaurantMockMvc.perform(delete("/api/restaurants/{id}", restaurant.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Restaurant> restaurantList = restaurantRepository.findAll();
        assertThat(restaurantList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Restaurant.class);
        Restaurant restaurant1 = new Restaurant();
        restaurant1.setId(1L);
        Restaurant restaurant2 = new Restaurant();
        restaurant2.setId(restaurant1.getId());
        assertThat(restaurant1).isEqualTo(restaurant2);
        restaurant2.setId(2L);
        assertThat(restaurant1).isNotEqualTo(restaurant2);
        restaurant1.setId(null);
        assertThat(restaurant1).isNotEqualTo(restaurant2);
    }
}
