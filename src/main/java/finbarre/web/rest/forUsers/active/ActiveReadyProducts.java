package finbarre.web.rest.forUsers.active;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.Product;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.ProductRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;

/**
 * REST controller for managing Product.
 */
@RestController
@RequestMapping("/api")
public class ActiveReadyProducts {

    private final Logger log = LoggerFactory.getLogger(ActiveProducts.class);

    private static final String ENTITY_NAME = "product";

    private final ProductRepository productRepository;

    private final UserToRestaurantRepository userToRestaurantRepository;

    public ActiveReadyProducts(
    		ProductRepository productRepository, 
    		UserToRestaurantRepository userToRestaurantRepository) {
        this.productRepository = productRepository;
        this.userToRestaurantRepository=userToRestaurantRepository;
    }

    /**
     * GET  /products : get all the products.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of products in body
     */
    @GetMapping("/active-ready-products")
    public synchronized List<Product> getAllActiveProducts() {
        log.debug("REST request to get a page of Active Products");
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        final Long productTypeId=1L;
        List<Product> products = productRepository.findAllByActiveTrueAndRestaurantAndProductTypeIdOrderByNameAsc(restaurant, productTypeId);
        return products;
    }

}
