package finbarre.web.rest.forUsers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
import finbarre.service.serviceForUsers.OrderClosedWithProducts;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing DailyReport.
 */
@RestController
@RequestMapping("/api")
public class DailyReportResource {


    private final Logger log = LoggerFactory.getLogger(DailyReportResource.class);

    @Autowired
    private CashupRepository cashupRepository;

    @Autowired
    private OrderClosedRepository orderClosedRepository;

    @Autowired
    private ProductSoldRepository productSoldRepository;

	@Autowired
	private UserToRestaurantRepository userToRestaurantRepository;

	@Autowired
	private TodaysOrdersResource todaysOrdersResource;



	/**
	 * GET /cashups/:id : get the "id" cashup.
	 *
	 * @param id
	 *            the id of the cashup to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the cashup,
	 *         or with status 404 (Not Found)
	 */
	@GetMapping("/daily-orders-report")
	public synchronized List<OrderClosedWithProducts> getDailyReportOrders() {
		log.debug("REST request to get getDailyReportOrders : {}");
		List<OrderClosedWithProducts> owps = todaysOrdersResource.getTodaysOrders();

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
	@GetMapping("/daily-orders-report/{id}")
	public synchronized List<OrderClosedWithProducts> getDailyReportOrdersById(@PathVariable Long id) {
		log.debug("REST request to getDailyReportOrdersById : {}");
//		List<OrderClosedWithProducts> owps = todaysOrdersResource.getTodaysOrders();
		// fu
				final String userStr = SecurityUtils.getCurrentUserLogin().get();
				final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
				final Restaurant restaurant = userToRestaurant.getRestaurant();
				Cashup cashup = cashupRepository.findById(id).get();

				final List<OrderClosed> ordersClosed = orderClosedRepository.findAllByRestaurantAndCashupDayOrderByOrderId(restaurant,
						cashup);
				log.debug("ordersClosed.size()="+ordersClosed.size());
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
	 * GET /daily-orders-report/:id : get the "id" orderClosed.
	 *
	 * @param id
	 *            the id of the cashup to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the cashup,
	 *         or with status 404 (Not Found)
	 */
	@GetMapping("/daily-orders-report/order/{id}")
    public synchronized ResponseEntity<OrderClosedWithProducts> getOrderClosedWithProducts(@PathVariable Long id) {
        log.debug("REST request to get OrderClosed : {}", id);
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
        
		Optional<OrderClosed> orderClosedOptional = orderClosedRepository.findById(id);
		OrderClosed orderClosed = orderClosedOptional.get();
        if(orderClosed.getRestaurant().getId() 
        		!= restaurant.getId()) {
        	orderClosed=null;
        }
		final List<ProductSold> productsSold = productSoldRepository
				.findAllByRestaurantAndOrderOrderByOrderedTime(restaurant, orderClosed);
		OrderClosedWithProducts ocwp = new OrderClosedWithProducts(orderClosed);
		ocwp.setBarman(orderClosed.getBarman());
		ocwp.setCashupDay(orderClosed.getCashupDay());
		ocwp.setClosingTime(orderClosed.getClosingTime());
		ocwp.setComment(orderClosed.getComment());
		ocwp.setDesk(orderClosed.getDesk());
		ocwp.setOpeningTime(orderClosed.getOpeningTime());
		ocwp.setPayment(orderClosed.getPayment());
		ocwp.setTotal(orderClosed.getTotal());
		ocwp.setId(orderClosed.getId());
		ocwp.setOrderId(orderClosed.getOrderId());
		ocwp.setProductsSold(productsSold);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(ocwp));
    }

	/**
	 * GET /daily-orders-report: get cashups.
	 *
	 * @param id
	 *            the id of the cashup to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the cashup,
	 *         or with status 404 (Not Found)
	 */
	@GetMapping("/daily-orders-report/cashups")
	public synchronized List<Cashup> getDailyReports() {
		log.debug("REST request to get DailyReports : {}");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		final List<Cashup> cashups = cashupRepository.findAllByRestaurantOrderByBarmanLoginTimeDesc(restaurant);

		return cashups;
	}
}
