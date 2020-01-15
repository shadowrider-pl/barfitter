package finbarre.web.rest.forUsers;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.Cashup;
import finbarre.domain.OrderClosed;
import finbarre.domain.ProductSold;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.CashupRepository;
import finbarre.repository.OrderClosedRepository;
import finbarre.repository.ProductSoldRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import finbarre.service.serviceForUsers.AdditionalHeaderUtil;
import finbarre.service.serviceForUsers.OrderClosedWithProducts;

/**
 * REST controller for managing Cashup.
 */
@RestController
@RequestMapping("/api")
public class TodaysOrdersResource {

	private final Logger log = LoggerFactory.getLogger(TodaysOrdersResource.class);

	private static final String ENTITY_NAME = "orderClosed";

	@Autowired
	private CashupRepository cashupRepository;

	@Autowired
	private OrderClosedRepository orderClosedRepository;

	@Autowired
	private ProductSoldRepository productSoldRepository;

	@Autowired
	private UserToRestaurantRepository userToRestaurantRepository;

	/**
	 * PUT /order-closeds : Updates an existing orderClosed.
	 *
	 * @param orderClosed
	 *            the orderClosed to update
	 * @return the ResponseEntity with status 200 (OK) and with body the updated
	 *         orderClosed, or with status 400 (Bad Request) if the orderClosed
	 *         is not valid, or with status 500 (Internal Server Error) if the
	 *         orderClosed couldn't be updated
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PutMapping("/todays-orders")
	public synchronized ResponseEntity<OrderClosed> updateOrderClosed(
			@Valid @RequestBody OrderClosed orderClosed) throws URISyntaxException {
		log.debug("REST request to update OrderClosed : {}", orderClosed);
		final OrderClosed result = orderClosedRepository.save(orderClosed);
		return ResponseEntity.ok()
				.headers(AdditionalHeaderUtil.paymentChangedAlert(ENTITY_NAME, orderClosed.getId().toString())).body(result);
	}

	/**
	 * GET /cashups/:id : get the "id" cashup.
	 *
	 * @param id
	 *            the id of the cashup to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the cashup,
	 *         or with status 404 (Not Found)
	 */
	@GetMapping("/todays-orders")
	public synchronized List<OrderClosedWithProducts> getTodaysOrders() {
		log.debug("REST request to get TodaysOrders : {}");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		final Cashup lastCashup = cashupRepository.findFirstByRestaurantOrderByIdDesc(restaurant);

		final List<OrderClosed> ordersClosed = orderClosedRepository.findAllByRestaurantAndCashupDayOrderByOrderId(restaurant,
				lastCashup);
		final List<OrderClosedWithProducts> owps = new ArrayList<>();

		for (OrderClosed oc : ordersClosed) {
			OrderClosedWithProducts ocwp = new OrderClosedWithProducts(oc);
			ocwp.setBarman(oc.getBarman());
			ocwp.setCashupDay(oc.getCashupDay());
			ocwp.setClosingTime(oc.getClosingTime());
			ocwp.setComment(oc.getComment());
			ocwp.setDesk(oc.getDesk());
			ocwp.setOpeningTime(oc.getOpeningTime());
			ocwp.setPayment(oc.getPayment());
			ocwp.setTotal(oc.getTotal());
			ocwp.setId(oc.getId());
			ocwp.setOrderId(oc.getOrderId());
			final List<ProductSold> productsSold = productSoldRepository
					.findAllByRestaurantAndOrderOrderByOrderedTime(restaurant, oc);
			ocwp.setProductsSold(productsSold);
			owps.add(ocwp);
		}

		return owps;
	}

	/**
	 * GET /cashups/:id : get the "id" cashup.
	 *
	 * @param id
	 *            the id of the cashup to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the cashup,
	 *         or with status 404 (Not Found)
	 */
	@GetMapping("/todays-orders/{id}")
	public synchronized ResponseEntity<OrderClosedWithProducts> getTodaysOrderClosed(@PathVariable Long id) {
		log.debug("REST request to get TodaysOrderClosed : {}");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();

		final Optional<OrderClosed> ocOptional = orderClosedRepository.findById(id);
		final OrderClosed oc = ocOptional.get();
		final OrderClosedWithProducts ocwp = new OrderClosedWithProducts(oc);
		if (oc.getRestaurant().getId() == restaurant.getId()) {
			ocwp.setBarman(oc.getBarman());
			ocwp.setCashupDay(oc.getCashupDay());
			ocwp.setClosingTime(oc.getClosingTime());
			ocwp.setComment(oc.getComment());
			ocwp.setDesk(oc.getDesk());
			ocwp.setOpeningTime(oc.getOpeningTime());
			ocwp.setPayment(oc.getPayment());
			ocwp.setTotal(oc.getTotal());
			ocwp.setId(oc.getId());
			ocwp.setOrderId(oc.getOrderId());
			List<ProductSold> productsSold = productSoldRepository
					.findAllByRestaurantAndOrderOrderByOrderedTime(restaurant, oc);
			ocwp.setProductsSold(productsSold);
		}
		return Optional.ofNullable(ocwp).map(result -> new ResponseEntity<>(result, HttpStatus.OK))
				.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}
	/**
	 * GET /cashups/:id : get the "id" cashup.
	 *
	 * @param id
	 *            the id of the cashup to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the cashup,
	 *         or with status 404 (Not Found)
	 */
	@GetMapping("/todays-orders/product/{id}")
	public synchronized ResponseEntity<ProductSold> getProduct(@PathVariable Long id) {
		log.debug("REST request to get TodaysProduct : {}");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();

		final Optional<ProductSold> productOptional = productSoldRepository.findById(id);
		ProductSold product =productOptional.get();
//		log.debug("id: "+id +" product: "+product.getProduct().getName()+" restaurant: "+product.getRestaurant().getName());
		if (product.getRestaurant().getId() != restaurant.getId()) {
			product=null;
		}
		return Optional.ofNullable(product).map(result -> new ResponseEntity<>(result, HttpStatus.OK))
				.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
