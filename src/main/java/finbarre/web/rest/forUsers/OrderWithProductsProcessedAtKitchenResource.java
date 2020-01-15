package finbarre.web.rest.forUsers;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.OrderOpened;
import finbarre.domain.ProductOrdered;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.OrderOpenedRepository;
import finbarre.repository.ProductOnStockRepository;
import finbarre.repository.ProductOrderedRepository;
import finbarre.repository.UserRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import finbarre.service.serviceForUsers.OrderWithProducts;
import finbarre.web.rest.ProductOnStockResource;

@RestController
@RequestMapping("/api")
public class OrderWithProductsProcessedAtKitchenResource {

	private final Logger log = LoggerFactory.getLogger(OrderWithProductsResource.class);

	private final OrderOpenedRepository orderOpenedRepository;

	private static final String ENTITY_NAME = "orderOpened";

	// fu
	private final UserToRestaurantRepository userToRestaurantRepository;

	private final ProductOnStockRepository productOnStockRepository;

	private final ProductOnStockResource productOnStockResource;

	private final ProductOrderedRepository productOrderedRepository;

	private final UserRepository userRepository;

	public OrderWithProductsProcessedAtKitchenResource(OrderOpenedRepository orderOpenedRepository,
			UserToRestaurantRepository userToRestaurantRepository, ProductOnStockRepository productOnStockRepository,
			ProductOnStockResource productOnStockResource, ProductOrderedRepository productOrderedRepository,
			UserRepository userRepository) {
		this.orderOpenedRepository = orderOpenedRepository;
		this.productOnStockRepository = productOnStockRepository;
		this.productOnStockResource = productOnStockResource;
		this.productOrderedRepository = productOrderedRepository;
		this.userRepository = userRepository;
		// fu
		this.userToRestaurantRepository = userToRestaurantRepository;
	}

	/**
	 * GET /product-ordereds : get all the productOrdereds.
	 *
	 * @return the ResponseEntity with status 200 (OK) and the list of
	 *         productOrdereds in body
	 */
	@GetMapping("/products-processed-at-kitchen")
	public synchronized List<OrderWithProducts> getOrdersWithProductsProcessedAtKitchen() {
		log.debug("REST request to get all ProductsProcessedAtKitchen");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		final List<OrderOpened> orderOpeneds = orderOpenedRepository.findAllByRestaurant(restaurant);
		final List<OrderWithProducts> owps = new ArrayList<>();
		for (OrderOpened order : orderOpeneds) {
			BigDecimal total = BigDecimal.ZERO;
			final List<ProductOrdered> productOrdereds = productOrderedRepository
					.findAllByRestaurantAndOrderId(restaurant, order.getId());
			final List<ProductOrdered> productOrderedsCorrectedView = new ArrayList<>();
			int orderPosition = 0;
			boolean foundReadyProduct = false;
			for (ProductOrdered po : productOrdereds) {
				if (po.getOrderedProductStatus()!=null && 
						(po.getOrderedProductStatus().getId() == 4 || po.getOrderedProductStatus().getId() == 5)) {
					foundReadyProduct = true;
				}
				total = total.add(po.getSellPriceGross().multiply(new BigDecimal(po.getQuantity())));
				if (orderPosition != po.getOrderPosition()) {
					orderPosition = po.getOrderPosition();
					productOrderedsCorrectedView.add(po);
				} else {
					int index = productOrderedsCorrectedView.size();
					ProductOrdered previous = productOrderedsCorrectedView.get(index - 1);
					previous.setQuantity(previous.getQuantity() + po.getQuantity());
				}
			}
			order.setTotal(total);
			final OrderWithProducts owp = new OrderWithProducts(order);
			owp.setComment(order.getComment());
			owp.setDesk(order.getDesk());
			owp.setId(order.getId());
			owp.setOpeningTime(order.getOpeningTime());
			owp.setPayment(order.getPayment());
			owp.setTotal(total);
			owp.setBarman(order.getBarman());
			owp.setProductsToOrder(productOrderedsCorrectedView);
			if (foundReadyProduct) {
				owps.add(owp);
			}
		}
		return owps;
	}

}
