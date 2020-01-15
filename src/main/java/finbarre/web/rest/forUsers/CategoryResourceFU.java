package finbarre.web.rest.forUsers;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.Category;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.CategoryRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.AuthoritiesConstants;
import finbarre.security.SecurityUtils;
import finbarre.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing Category.
 */
@RestController
@RequestMapping("/api")
public class CategoryResourceFU {

    private final Logger log = LoggerFactory.getLogger(CategoryResourceFU.class);

    private static final String ENTITY_NAME = "category";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CategoryRepository categoryRepository;
    
    //fu
    private final UserToRestaurantRepository userToRestaurantRepository;

    public CategoryResourceFU(CategoryRepository categoryRepository,  UserToRestaurantRepository userToRestaurantRepository) {
        this.categoryRepository = categoryRepository;
        //fu
        this.userToRestaurantRepository=userToRestaurantRepository;
    }

    /**
     * POST  /categoriesfu : Create a new category.
     *
     * @param category the category to create
     * @return the ResponseEntity with status 201 (Created) and with body the new category, or with status 400 (Bad Request) if the category has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/categoriesfu")
	@Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.BOSS, AuthoritiesConstants.MANAGER })
    public synchronized ResponseEntity<Category> createCategory(@Valid @RequestBody Category category) throws URISyntaxException {
        log.debug("REST request to save Category : {}", category);
        
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        category.setRestaurant(restaurant);
        
        if (category.getId() != null) {
            throw new BadRequestAlertException("A new category cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Category result = categoryRepository.save(category);
        return ResponseEntity.created(new URI("/api/categoriesfu/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /categoriesfu : Updates an existing category.
     *
     * @param category the category to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated category,
     * or with status 400 (Bad Request) if the category is not valid,
     * or with status 500 (Internal Server Error) if the category couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/categoriesfu")
	@Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.BOSS, AuthoritiesConstants.MANAGER })
    public synchronized ResponseEntity<Category> updateCategory(@Valid @RequestBody Category category) throws URISyntaxException {
        log.debug("REST request to update Category : {}", category);
        if (category.getId() == null) {
            return createCategory(category);
        }
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        if(category.getRestaurant().getId()!=restaurant.getId()) {
        	category = null;
        }
        Category result = categoryRepository.save(category);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, category.getId().toString()))
            .body(result);
    }

    /**
     * GET  /categoriesfu : get all the categories.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of categories in body
     */
    @GetMapping("/categoriesfu")
    public synchronized List<Category> getAllCategories() {
        log.debug("REST request to get a page of Categories");
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        return categoryRepository.findAllByRestaurant(restaurant);
    }

    /**
     * GET  /categoriesfu/:id : get the "id" category.
     *
     * @param id the id of the category to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the category, or with status 404 (Not Found)
     */
    @GetMapping("/categoriesfu/{id}")
    public synchronized ResponseEntity<Category> getCategory(@PathVariable Long id) {
        log.debug("REST request to get Category : {}", id);
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        Optional<Category> category = categoryRepository.findById(id);
    	if(category != null && category.get().getRestaurant().getId()!=restaurant.getId()){
    		log.debug("zła restauracja "+restaurant.getName() + ' ' + category.get().getRestaurant().getName());
    		category=null;
    	}
        return ResponseUtil.wrapOrNotFound(category);
    }

    /**
     * DELETE  /categoriesfu/:id : delete the "id" category.
     *
     * @param id the id of the category to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/categoriesfu/{id}")
	@Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.BOSS, AuthoritiesConstants.MANAGER })
    public synchronized ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        log.debug("REST request to delete Category : {}", id);
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        final Optional<Category> category = categoryRepository.findById(id);
        if(category.get().getRestaurant().getId()!=restaurant.getId()) {
        	id = null;
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }


}
