package finbarre.web.rest.forUsers.active;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.Category;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.CategoryRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;

/**
 * REST controller for managing Category.
 */
@RestController
@RequestMapping("/api")
public class ActiveCategories {

    private final Logger log = LoggerFactory.getLogger(ActiveCategories.class);

    private static final String ENTITY_NAME = "category";

    private final CategoryRepository categoryRepository;

    private final UserToRestaurantRepository userToRestaurantRepository;

    public ActiveCategories(CategoryRepository categoryRepository,
    		UserToRestaurantRepository userToRestaurantRepository) {
        this.categoryRepository = categoryRepository;
        this.userToRestaurantRepository=userToRestaurantRepository;
    }


    /**
     * GET  /categories : get all the categories.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of categories in body
     */
    @GetMapping("/active-categories")
    public synchronized List<Category> getAllCategories() {
        log.debug("REST request to get a page of Categories");
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        List<Category> categories = categoryRepository.findAllByActiveTrueAndRestaurantOrderByName(restaurant);
        return categories;
    }

}
