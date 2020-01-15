package finbarre.web.rest.forUsers;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.ProductOrdered;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.ProductOrderedRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;

/**
 * REST controller for managing ProductOrdered to kitchen.
 */
@RestController
@RequestMapping("/api")
public class ProductsForChefResource {


    private final Logger log = LoggerFactory.getLogger(ProductsForChefResource.class);
        
    @Autowired
    private ProductOrderedRepository productOrderedRepository;

    @Autowired
    private UserToRestaurantRepository userToRestaurantRepository;

//    @Autowired
//    private KichenAlarm alarm;
    

    /**
     * GET  /product-ordereds : get productOrdereds to kitchen.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of productOrdereds in body
     */
    @RequestMapping(value = "/products-for-chef",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public synchronized List<ProductOrdered> getAllProductOrderedsToKitchen() {
        log.debug("REST request to get all ProductOrdereds to kitchen");
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        Long sendToKitchenStatus=2L;
        Long acceptedOnKitchenStatus=3L;
        final List<Long> statusList = new ArrayList<>();
        statusList.add(acceptedOnKitchenStatus);
        statusList.add(sendToKitchenStatus);
        List<ProductOrdered> productOrdereds = productOrderedRepository.findByRestaurantAndOrderedProductStatusIdIn(restaurant, statusList);
        return productOrdereds;
    }
}
