package finbarre.web.rest.forUsers;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.OrderOpened;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.OrderOpenedRepository;
import finbarre.repository.UserRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

@RestController
@RequestMapping("/api")
public class OrdersOpenedFUResource {
	
    private final Logger log = LoggerFactory.getLogger(OrdersOpenedFUResource.class);

    private final OrderOpenedRepository orderOpenedRepository;

    private static final String ENTITY_NAME = "orderOpened";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;
    
    //fu
    private final UserToRestaurantRepository userToRestaurantRepository;

    private final UserRepository userRepository;

    public OrdersOpenedFUResource(
    		OrderOpenedRepository orderOpenedRepository, 
    		UserToRestaurantRepository userToRestaurantRepository,
    		UserRepository userRepository) {
        this.orderOpenedRepository = orderOpenedRepository;
        this.userRepository = userRepository;
        //fu
        this.userToRestaurantRepository=userToRestaurantRepository;
    }
    
    /**
     * PUT  /order-openeds : Updates an existing orderOpened.
     *
     * @param orderOpened the orderOpened to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated orderOpened,
     * or with status 400 (Bad Request) if the orderOpened is not valid,
     * or with status 500 (Internal Server Error) if the orderOpened couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/active-orders-opened")
    public synchronized ResponseEntity<OrderOpened> updateOrderOpened(@RequestBody OrderOpened orderOpened) throws URISyntaxException {
        log.debug("REST request to update OrderOpened : {}", orderOpened);
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        if (orderOpened.getId() == null || orderOpened.getRestaurant().getId()!=restaurant.getId()) {
        	orderOpened=null;
        }
        OrderOpened result = orderOpenedRepository.save(orderOpened);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderOpened.getId().toString()))
                .body(result);
    }
    
    /**
     * GET  /order-openeds : get all the orderOpeneds.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of orderOpeneds in body
     */
    @GetMapping("/active-orders-opened")
    public synchronized List<OrderOpened> getActiveOrderOpeneds() {
        log.debug("REST request to get all active OrderOpeneds");
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        List<OrderOpened> orders = orderOpenedRepository.findAllByRestaurant(restaurant);
        return orders;
    }

	/**
	 * GET /order-openeds/:id : get the "id" orderOpened.
	 *
	 * @param id
	 *            the id of the orderOpened to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the
	 *         orderOpened, or with status 404 (Not Found)
	 */
	@GetMapping("/active-orders-opened/{id}")
	public ResponseEntity<OrderOpened> getOrderOpened(@PathVariable Long id) {
		log.debug("REST request to get OrderOpened : {}", id);
		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		final Optional<OrderOpened> orderOpened = orderOpenedRepository.findById(id);
		if (orderOpened.get().getRestaurant().getId() != restaurant.getId()) {
			return ResponseUtil.wrapOrNotFound(Optional.ofNullable(null));
		} else {
			return ResponseUtil.wrapOrNotFound(orderOpened);
		}

	}

    /**
     * DELETE  /order-openeds/:id : delete the "id" orderOpened.
     *
     * @param id the id of the orderOpened to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/active-orders-opened/{id}")
    public ResponseEntity<Void> deleteOrderOpened(@PathVariable Long id) {
        log.debug("REST request to delete OrderOpened : {}", id);
		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		final Optional<OrderOpened> orderOpened = orderOpenedRepository.findById(id);
		if (orderOpened.get().getRestaurant().getId() == restaurant.getId()) {
        orderOpenedRepository.deleteById(id);
//        log.debug("usuniete");
		} else {

//	        log.debug("nieusuniete");
		}
        return ResponseEntity.noContent().headers(HeaderUtil
        		.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

}
