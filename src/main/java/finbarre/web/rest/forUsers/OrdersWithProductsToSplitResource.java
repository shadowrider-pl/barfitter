package finbarre.web.rest.forUsers;

import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.OrderOpened;
import finbarre.domain.ProductOrdered;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.OrderClosedRepository;
import finbarre.repository.OrderOpenedRepository;
import finbarre.repository.ProductOrderedRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import finbarre.service.serviceForUsers.AdditionalHeaderUtil;
import finbarre.service.serviceForUsers.OrdersWithProductsToSplit;

@RestController
@RequestMapping("/api")
public class OrdersWithProductsToSplitResource {
	private final Logger log = LoggerFactory.getLogger(OrdersWithProductsToSplitResource.class);

	private final ProductOrderedRepository productOrderedRepository;

	private static final String ENTITY_NAME = "orderOpened";

	private final OrderClosedRepository orderClosedRepository;

	private final OrderOpenedRepository orderOpenedRepository;

	// fu
	private final UserToRestaurantRepository userToRestaurantRepository;

	public OrdersWithProductsToSplitResource(OrderOpenedRepository orderOpenedRepository,
			ProductOrderedRepository productOrderedRepository, UserToRestaurantRepository userToRestaurantRepository,
			OrderClosedRepository orderClosedRepository) {
		this.orderOpenedRepository = orderOpenedRepository;
		this.productOrderedRepository = productOrderedRepository;
		this.orderClosedRepository = orderClosedRepository;
		// fu
		this.userToRestaurantRepository = userToRestaurantRepository;
	}

	/**
	 * POST /order-openeds : Create a new orderOpened.
	 *
	 * @param orderOpened
	 *            the orderOpened to create
	 * @return the ResponseEntity with status 201 (Created) and with body the new
	 *         orderOpened, or with status 400 (Bad Request) if the orderOpened has
	 *         already an ID
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */

	@PostMapping("/split-order")
	public synchronized ResponseEntity<OrdersWithProductsToSplit> createOrderOpened(
			@RequestBody OrdersWithProductsToSplit ordersWithProductsToSplit) throws URISyntaxException {
		log.debug("REST request to create ordersWithProductsToSplit : {}", ordersWithProductsToSplit);

		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();

		BigDecimal newOrdertotal = BigDecimal.ZERO;
		BigDecimal oldOrdertotal = BigDecimal.ZERO;
		final List<ProductOrdered> productOrderedsForNewOrder = ordersWithProductsToSplit.getNewOrder()
				.getProductsToOrder();
		for (ProductOrdered po : productOrderedsForNewOrder) {
			newOrdertotal = newOrdertotal.add(po.getSellPriceGross().multiply(new BigDecimal(po.getQuantity())));
		}
		final OrderOpened newOrderOpened = new OrderOpened();
		Long lastOrderOpenedId = 0L;
		Long lastOrderClosedId = 0L;
		if (orderOpenedRepository.findFirstByRestaurantOrderByOrderIdDesc(restaurant) != null) {
			lastOrderOpenedId = orderOpenedRepository.findFirstByRestaurantOrderByOrderIdDesc(restaurant).getOrderId();
		}
		if (orderClosedRepository.findFirstByRestaurantOrderByOrderIdDesc(restaurant) != null) {
			lastOrderClosedId = orderClosedRepository.findFirstByRestaurantOrderByOrderIdDesc(restaurant).getOrderId();
			if (lastOrderOpenedId > lastOrderClosedId) {
				newOrderOpened.setOrderId(lastOrderOpenedId + 1);
			} else {
				newOrderOpened.setOrderId(lastOrderClosedId + 1);
			}
			newOrderOpened.setBarman(ordersWithProductsToSplit.getNewOrder().getBarman());
			newOrderOpened.setOpeningTime(ordersWithProductsToSplit.getNewOrder().getOpeningTime());
			newOrderOpened.setComment(ordersWithProductsToSplit.getNewOrder().getComment());
			newOrderOpened.setDesk(ordersWithProductsToSplit.getNewOrder().getDesk());
			newOrderOpened.setRestaurant(restaurant);
			newOrderOpened.setTotal(newOrdertotal);

			OrderOpened newOrderOpenedResult = orderOpenedRepository.save(newOrderOpened);
			boolean foundPreviouseQuantity = false;
			for (ProductOrdered po : productOrderedsForNewOrder) {
				ProductOrdered productOrdered = new ProductOrdered();
				if (po.getId() != null && !foundPreviouseQuantity) {
					Optional<ProductOrdered> productOrderedOptional = productOrderedRepository.findById(po.getId());
					productOrdered = productOrderedOptional.get();
					log.debug("findOne-"+productOrdered.getQuantity());
				} else {
					productOrdered = po;
					foundPreviouseQuantity = true;
					log.debug("newOne-"+productOrdered.getQuantity());
				}
				productOrdered.setOrder(newOrderOpenedResult);
				productOrderedRepository.save(productOrdered);
			}
			final List<ProductOrdered> oldOrderedProducts = productOrderedRepository
					.findAllByRestaurantAndOrderId(restaurant, ordersWithProductsToSplit.getOldOrder().getId());
			final Optional<OrderOpened> oldOrderOptional = orderOpenedRepository.findById(ordersWithProductsToSplit.getOldOrder().getId());
			final OrderOpened oldOrder = oldOrderOptional.get();
			for (ProductOrdered oldPO : oldOrderedProducts) {
				for (ProductOrdered oldFromProductsToSplit : ordersWithProductsToSplit.getOldOrder()
						.getProductsToOrder()) {
					if (oldPO.getId().equals(oldFromProductsToSplit.getId())) {
						oldPO.setQuantity(oldFromProductsToSplit.getQuantity());
						productOrderedRepository.save(oldPO);
						oldOrdertotal = oldOrdertotal
								.add(oldPO.getSellPriceGross().multiply(new BigDecimal(oldPO.getQuantity())));
					}
//					else {
//						log.debug("dupa oldPO.getId()="+oldPO.getId()+" oldFromProductsToSplit.getId()="+oldFromProductsToSplit.getId());
//					}
				}
			}
			oldOrder.setTotal(oldOrdertotal);
//			log.debug("oldOrder.getTotal()=" + oldOrder.getTotal());
			orderOpenedRepository.save(oldOrder);
		}

		return ResponseEntity.created(new URI("/api/order-openeds/"))
				.headers(AdditionalHeaderUtil.splitOrderAlert(ENTITY_NAME, null)).body(ordersWithProductsToSplit);
	}
}
