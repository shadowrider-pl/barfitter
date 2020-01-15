package finbarre.web.rest.forUsers;

import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.Bestseller;
import finbarre.domain.Cashup;
import finbarre.domain.Category;
import finbarre.domain.Desk;
import finbarre.domain.Favorite;
import finbarre.domain.OrderClosed;
import finbarre.domain.OrderOpened;
import finbarre.domain.Payment;
import finbarre.domain.PaymentToCashup;
import finbarre.domain.Product;
import finbarre.domain.ProductDelivered;
import finbarre.domain.ProductOnStock;
import finbarre.domain.ProductOrdered;
import finbarre.domain.ProductSold;
import finbarre.domain.Restaurant;
import finbarre.domain.User;
import finbarre.domain.UserToRestaurant;
import finbarre.domain.Vat;
import finbarre.domain.Xsell;
import finbarre.repository.BestsellerRepository;
import finbarre.repository.CashupRepository;
import finbarre.repository.CategoryRepository;
import finbarre.repository.DeskRepository;
import finbarre.repository.FavoriteRepository;
import finbarre.repository.OrderClosedRepository;
import finbarre.repository.OrderOpenedRepository;
import finbarre.repository.PaymentRepository;
import finbarre.repository.PaymentToCashupRepository;
import finbarre.repository.ProductDeliveredRepository;
import finbarre.repository.ProductOnStockRepository;
import finbarre.repository.ProductOrderedRepository;
import finbarre.repository.ProductRepository;
import finbarre.repository.ProductSoldRepository;
import finbarre.repository.RestaurantRepository;
import finbarre.repository.UserRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.repository.VatRepository;
import finbarre.repository.XsellRepository;
import finbarre.security.AuthoritiesConstants;
import finbarre.security.SecurityUtils;
import finbarre.service.serviceForUsers.RestaurantSummary;
import finbarre.web.rest.RestaurantResource;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing Restaurant.
 */
@RestController
@RequestMapping("/api")
public class RestaurantFUResource {

	private final Logger log = LoggerFactory.getLogger(RestaurantResource.class);

	private static final String ENTITY_NAME = "restaurant";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

	private final RestaurantRepository restaurantRepository;

	private final CashupRepository cashupRepository;

	private final ProductSoldRepository productSoldRepository;

	private final PaymentToCashupRepository paymentToCashupRepository;

	private final OrderClosedRepository orderClosedRepository;

	private final PaymentRepository paymentRepository;

	private final ProductDeliveredRepository productDeliveredRepository;

	private final OrderOpenedRepository orderOpenedRepository;

	private final ProductOnStockRepository productOnStockRepository;

	private final ProductRepository productRepository;

	private final CategoryRepository categoryRepository;

	private final DeskRepository deskRepository;

	private final VatRepository vatRepository;

	private final XsellRepository xsellRepository;

	private final BestsellerRepository bestsellerRepository;

	private final FavoriteRepository favoriteRepository;

	private final ProductOrderedRepository productOrderedRepository;

	private final UserRepository userRepository;

	// fu userRepository
	private final UserToRestaurantRepository userToRestaurantRepository;

	public RestaurantFUResource(RestaurantRepository restaurantRepository,
			UserToRestaurantRepository userToRestaurantRepository, CashupRepository cashupRepository,
			ProductSoldRepository productSoldRepository, PaymentToCashupRepository paymentToCashupRepository,
			OrderClosedRepository orderClosedRepository, PaymentRepository paymentRepository,
			ProductDeliveredRepository productDeliveredRepository, OrderOpenedRepository orderOpenedRepository,
			ProductOrderedRepository productOrderedRepository, ProductOnStockRepository productOnStockRepository,
			ProductRepository productRepository, CategoryRepository categoryRepository, DeskRepository deskRepository,
			VatRepository vatRepository, XsellRepository xsellRepository, BestsellerRepository bestsellerRepository,
			FavoriteRepository favoriteRepository, UserRepository userRepository) {
		this.restaurantRepository = restaurantRepository;
		this.userToRestaurantRepository = userToRestaurantRepository;
		this.cashupRepository = cashupRepository;
		this.productSoldRepository = productSoldRepository;
		this.paymentToCashupRepository = paymentToCashupRepository;
		this.orderClosedRepository = orderClosedRepository;
		this.paymentRepository = paymentRepository;
		this.productDeliveredRepository = productDeliveredRepository;
		this.orderOpenedRepository = orderOpenedRepository;
		this.productOrderedRepository = productOrderedRepository;
		this.productOnStockRepository = productOnStockRepository;
		this.productRepository = productRepository;
		this.categoryRepository = categoryRepository;
		this.deskRepository = deskRepository;
		this.vatRepository = vatRepository;
		this.xsellRepository = xsellRepository;
		this.bestsellerRepository = bestsellerRepository;
		this.favoriteRepository = favoriteRepository;
		this.userRepository = userRepository;
	}

	/**
	 * PUT /restaurants : Updates an existing restaurant.
	 *
	 * @param restaurant the restaurant to update
	 * @return the ResponseEntity with status 200 (OK) and with body the updated
	 *         restaurant, or with status 400 (Bad Request) if the restaurant is not
	 *         valid, or with status 500 (Internal Server Error) if the restaurant
	 *         couldn't be updated
	 * @throws URISyntaxException if the Location URI syntax is incorrect
	 */
	@PutMapping("/boss-restaurant")
	@PreAuthorize("hasRole(\"" + AuthoritiesConstants.BOSS + "\")")
	public synchronized ResponseEntity<Restaurant> updateBossRestaurant(@RequestBody Restaurant restaurant)
			throws URISyntaxException {
		log.debug("REST request to update BossRestaurant : {}", restaurant);

		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant checkedRestaurant = userToRestaurant.getRestaurant();
		if (restaurant.getId() != checkedRestaurant.getId()) {
			restaurant = null;
		}
		Restaurant result = restaurantRepository.save(restaurant);
		return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, restaurant.getId().toString()))
                .body(result);
	}

	/**
	 * GET /restaurants/:id : get the "id" restaurant.
	 *
	 * @param id the id of the restaurant to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the restaurant,
	 *         or with status 404 (Not Found)
	 */
	@GetMapping("/boss-restaurant")
	@PreAuthorize("hasRole(\"" + AuthoritiesConstants.BOSS + "\")")
	public ResponseEntity<Restaurant> getBossRestaurant() {
		log.debug("REST request to get getBossRestaurant : {}");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();

		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(restaurant));
	}

	/**
	 * GET /restaurants/:id : get the "id" restaurant.
	 *
	 * @param id the id of the restaurant to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the restaurant,
	 *         or with status 404 (Not Found)
	 */
	@GetMapping("/admin-restaurants/{id}")
	@PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
	public ResponseEntity<RestaurantSummary> getAdminRestaurant(@PathVariable Long id) {
		log.debug("REST request to get getADMINRestaurant : {}");
		Restaurant restaurant = restaurantRepository.findById(id).get();
		final RestaurantSummary restaurantSum = new RestaurantSummary();
		restaurantSum.setRestaurant(restaurant);

		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(restaurantSum));
	}

	/**
	 * GET /restaurants/:id : get the "id" restaurant.
	 *
	 * @param id the id of the restaurant to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the restaurant,
	 *         or with status 404 (Not Found)
	 */
	@GetMapping("/admin-restaurants")
	@PreAuthorize("hasRole(\"" + AuthoritiesConstants.ADMIN + "\")")
	public List<RestaurantSummary> getAdminRestaurants() {
		log.debug("REST request to get a page of Restaurants");
		List<RestaurantSummary> restaurants = new ArrayList<>();
		List<Restaurant> page = restaurantRepository.findAll();
		for (Restaurant restaurant : page) {
			RestaurantSummary restaurantSummary = new RestaurantSummary();
			restaurantSummary.setRestaurant(restaurant);
			List<UserToRestaurant> users = userToRestaurantRepository.findAllByRestaurant(restaurant);
			restaurantSummary.setActiveUsers(users.size());
			Cashup lastCashup = cashupRepository.findFirstByRestaurantOrderByIdDesc(restaurant);
			ZonedDateTime lastCashupTime = null;
			if (lastCashup == null) {
				lastCashupTime = null;
			} else {
				if (lastCashup.getCashupTime() != null) {
					lastCashupTime = lastCashup.getCashupTime();
				} else {
					lastCashupTime = lastCashup.getBarmanLoginTime();
				}
			}
			restaurantSummary.setLastCashup(lastCashupTime);
			restaurants.add(restaurantSummary);
		}
//            HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/admin-restaurants");
		return restaurants;
	}

	/**
	 * DELETE /restaurants/:id : delete the "id" restaurant.
	 *
	 * @param id the id of the restaurant to delete
	 * @return the ResponseEntity with status 200 (OK)
	 */
	@DeleteMapping("/admin-restaurants/{id}")
	@Transactional
	public ResponseEntity<Void> deleteEntireRestaurant(@PathVariable Long id) {
		log.debug("REST request to delete Restaurant : {}", id);
		Restaurant restaurant = restaurantRepository.findById(id).get();

		List<ProductSold> productsSold = productSoldRepository.findAllByRestaurant(restaurant);
		for (ProductSold productSold : productsSold) {
			productSoldRepository.deleteById(productSold.getId());
		}

		List<OrderClosed> ordersClosed = orderClosedRepository.findAllByRestaurant(restaurant);
		for (OrderClosed orderClosed : ordersClosed) {
			orderClosedRepository.deleteById(orderClosed.getId());
		}

		List<Cashup> cashups = cashupRepository.findAllByRestaurant(restaurant);
		for (Cashup cashup : cashups) {
			List<PaymentToCashup> paymentsToCashup = paymentToCashupRepository.findAllByCashup(cashup);
			for (PaymentToCashup paymentToCashup : paymentsToCashup) {
				paymentToCashupRepository.deleteById(paymentToCashup.getId());
			}
			cashupRepository.deleteById(cashup.getId());
		}

		List<Payment> payments = paymentRepository.findAllByRestaurant(restaurant);
		for (Payment payment : payments) {
			paymentRepository.deleteById(payment.getId());
		}

		List<ProductDelivered> productsDelivered = productDeliveredRepository.findAllByRestaurant(restaurant);
		for (ProductDelivered productDelivered : productsDelivered) {
			productDeliveredRepository.deleteById(productDelivered.getId());
		}

		List<ProductOrdered> productsOrdered = productOrderedRepository.findAllByRestaurant(restaurant);
		for (ProductOrdered productOrdered : productsOrdered) {
			productOrderedRepository.deleteById(productOrdered.getId());
		}

		List<OrderOpened> ordersOpened = orderOpenedRepository.findAllByRestaurant(restaurant);
		for (OrderOpened orderOpened : ordersOpened) {
			orderOpenedRepository.deleteById(orderOpened.getId());
		}

		List<ProductOnStock> productsOnStock = productOnStockRepository.findAllByRestaurant(restaurant);
		for (ProductOnStock productOnStock : productsOnStock) {
			productOnStockRepository.deleteById(productOnStock.getId());
		}

		List<Xsell> xsells = xsellRepository.findAllByRestaurant(restaurant);
		for (Xsell xsell : xsells) {
			xsellRepository.deleteById(xsell.getId());
		}

		List<Bestseller> bestsellers = bestsellerRepository.findAllByRestaurant(restaurant);
		for (Bestseller bestseller : bestsellers) {
			bestsellerRepository.deleteById(bestseller.getId());
		}

		List<Favorite> favorites = favoriteRepository.findAllByRestaurant(restaurant);
		for (Favorite favorite : favorites) {
			favoriteRepository.deleteById(favorite.getId());
		}

		List<Product> products = productRepository.findAllByRestaurant(restaurant);
		for (Product product : products) {
			productRepository.deleteById(product.getId());
		}

		List<Desk> desks = deskRepository.findAllByRestaurant(restaurant);
		for (Desk desk : desks) {
			deskRepository.deleteById(desk.getId());
		}

		List<Category> categories = categoryRepository.findAllByRestaurant(restaurant);
		for (Category category : categories) {
			categoryRepository.deleteById(category.getId());
		}

		List<Vat> vats = vatRepository.findAllByRestaurant(restaurant);
		for (Vat vat : vats) {
			vatRepository.deleteById(vat.getId());
		}

		List<UserToRestaurant> usersToRestaurant = userToRestaurantRepository.findAllByRestaurant(restaurant);
		List<User> users = new ArrayList<>();
		for (UserToRestaurant userToRestaurant : usersToRestaurant) {
			users.add(userToRestaurant.getUser());
			userToRestaurantRepository.deleteById(userToRestaurant.getId());
		}

		for (User user : users) {
			userRepository.delete(user);
		}

		restaurantRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil
        		.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
	}

	@GetMapping("/restaurant-currency")
//	@PreAuthorize("hasRole(\"" + AuthoritiesConstants.BOSS + "\")")
	public ResponseEntity<CurrencyForLocalizedCurrencyPipe> getRestaurantCurrency() {
		log.debug("REST request to get CurrencyForLocalizedCurrencyPipe : {}");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		final CurrencyForLocalizedCurrencyPipe currencyForLocalizedCurrencyPipe= new CurrencyForLocalizedCurrencyPipe();
		currencyForLocalizedCurrencyPipe.setCurrency(restaurant.getCurrency());
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(currencyForLocalizedCurrencyPipe));
	}

	class CurrencyForLocalizedCurrencyPipe {
		String currency;

		public String getCurrency() {
			return currency;
		}

		public void setCurrency(String currency) {
			this.currency = currency;
		}
	}
}
