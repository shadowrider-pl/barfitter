package finbarre.web.rest.forUsers;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.OrderOpened;
import finbarre.domain.Product;
import finbarre.domain.ProductOnStock;
import finbarre.domain.ProductOrdered;
import finbarre.domain.Restaurant;
import finbarre.domain.User;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.OrderClosedRepository;
import finbarre.repository.OrderOpenedRepository;
import finbarre.repository.ProductOnStockRepository;
import finbarre.repository.ProductOrderedRepository;
import finbarre.repository.UserRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import finbarre.service.serviceForUsers.OrderWithProducts;
import finbarre.web.rest.ProductOnStockResource;
import finbarre.web.websocket.alarms.KichenAlarm;
import io.github.jhipster.web.util.HeaderUtil;
// import io.advantageous.boon.core.Sys;
import io.github.jhipster.web.util.ResponseUtil;

@RestController
@RequestMapping("/api")
public class OrderWithProductsResource {

	private final Logger log = LoggerFactory.getLogger(OrderWithProductsResource.class);

	private final OrderOpenedRepository orderOpenedRepository;

	private final OrderClosedRepository orderClosedRepository;

	private static final String ENTITY_NAME = "orderOpened";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

	// fu
	private final UserToRestaurantRepository userToRestaurantRepository;

	private final ProductOnStockRepository productOnStockRepository;

	private final ProductOnStockResource productOnStockResource;

	private final ProductOrderedRepository productOrderedRepository;

	private final UserRepository userRepository;

	@Autowired
	private KichenAlarm alarm;

	public OrderWithProductsResource(OrderOpenedRepository orderOpenedRepository,
			OrderClosedRepository orderClosedRepository, UserToRestaurantRepository userToRestaurantRepository,
			ProductOnStockRepository productOnStockRepository, ProductOnStockResource productOnStockResource,
			ProductOrderedRepository productOrderedRepository, UserRepository userRepository) {
		this.orderOpenedRepository = orderOpenedRepository;
		this.orderClosedRepository = orderClosedRepository;
		this.productOnStockRepository = productOnStockRepository;
		this.productOnStockResource = productOnStockResource;
		this.productOrderedRepository = productOrderedRepository;
		this.userRepository = userRepository;
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

	@PostMapping("/order-opened-with-products")
	public synchronized ResponseEntity<OrderOpened> createOrderOpened(@RequestBody OrderWithProducts orderWithProducts)
			throws URISyntaxException {
		log.debug("REST request to create orderWithProducts : {}", orderWithProducts);

		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();

		final OrderOpened orderOpened = new OrderOpened();
		final User user = userRepository.findOneByLogin(getCurrentUserLogin()).get();

		Long lastOrderOpenedId = 0L;
		Long lastOrderClosedId = 0L;
		if (orderOpenedRepository.findFirstByRestaurantOrderByOrderIdDesc(restaurant) != null) {
			lastOrderOpenedId = orderOpenedRepository.findFirstByRestaurantOrderByOrderIdDesc(restaurant).getOrderId();
			// log.debug("lastOrderOpenedId="
			// +
			// orderOpenedRepository.findFirstByRestaurantOrderByOrderIdDesc(restaurant).getId());
		}
		if (orderClosedRepository.findFirstByRestaurantOrderByOrderIdDesc(restaurant) != null) {
			lastOrderClosedId = orderClosedRepository.findFirstByRestaurantOrderByOrderIdDesc(restaurant).getOrderId();
			// log.debug("lastOrderClosedId="
			// +
			// orderClosedRepository.findFirstByRestaurantOrderByOrderIdDesc(restaurant).getId());
		}
		// log.debug("lastOrderOpenedId=" + lastOrderOpenedId);
		if (lastOrderOpenedId > lastOrderClosedId) {
			orderOpened.setOrderId(lastOrderOpenedId + 1);
		} else {
			orderOpened.setOrderId(lastOrderClosedId + 1);
		}

		orderOpened.setBarman(user);
		orderOpened.setDesk(orderWithProducts.getDesk());
		// orderOpened.setOpeningTime(ZonedDateTime.now(ZoneId.systemDefault()));
		orderOpened.setOpeningTime(orderWithProducts.getOpeningTime());
		orderOpened.setComment(orderWithProducts.getComment());
		orderOpened.setTotal(orderWithProducts.getTotal());
		orderOpened.setPayment(orderWithProducts.getPayment());
		orderOpened.setRestaurant(restaurant);

		final OrderOpened orderOpenedResult = orderOpenedRepository.save(orderOpened);

		final List<ProductOrdered> productsOrdered = orderWithProducts.getProductsToOrder();
		// log.debug("productsOrdered="+productsOrdered.toString());
		boolean sendTokitchen = false;

		for (ProductOrdered productOrdered : productsOrdered) {
			if (productOrdered.getProduct().getId() == 1) { // substitute
				productOrdered.setOrder(orderOpenedResult);
				productOrdered.setRestaurant(restaurant);
				productOrderedRepository.save(productOrdered);
			} else {
				if (productOrdered.getOrderedProductStatus() != null
						&& productOrdered.getOrderedProductStatus().getId() == 2L) {
					sendTokitchen = true;
				}

				final Product product = productOrdered.getProduct();
				// log.debug("product = "+productOrdered.getProduct().getName());
				// Object productOnStockRepository;
				final List<ProductOnStock> productOnStockList = productOnStockRepository
						.findAllByRestaurantAndProductOrderByDeliveryDate(restaurant, product);
				if (productOrdered.getProduct().getId() == 1) { // found Substitute
					productOnStockList.add(productOnStockRepository.findOneById(1L));
				}
				final List<ProductOrdered> productOrderedList = new ArrayList<>();
				final int orderedQuantity = productOrdered.getQuantity();
				int countQuantity = 0;
				// log.debug("start for");
				for (ProductOnStock pfs : productOnStockList) {
					// log.debug("pfs = "+pfs.getProduct().getName());
					// log.debug("started for");
					final ProductOrdered po = new ProductOrdered();
					po.setOrder(orderOpenedResult);
					po.setOrderPosition(productOrdered.getOrderPosition());
					po.setProduct(productOrdered.getProduct());
					po.setDeliveryDate(pfs.getDeliveryDate());
					if (!((pfs.getSellPriceGross()).subtract(productOrdered.getSellPriceGross())
							.compareTo(BigDecimal.ZERO) == 0)) {
						po.setDifference((productOrdered.getSellPriceGross()).subtract(pfs.getSellPriceGross()));
					}
					po.setOrderedTime(productOrdered.getOrderedTime());
					po.setProductOrderedPurchPriceRate(pfs.getProduct().getProductPurchPriceRate());
					po.setPurchPriceNet(pfs.getProduct().getPurchPriceNet());
					po.setPurchVatValue(pfs.getPurchVatValue());
					po.setPurchPriceGross(pfs.getPurchPriceGross());
					po.setProductOrderedSellPriceRate(pfs.getProduct().getProductSellPriceRate());
					po.setSellPriceGross(productOrdered.getSellPriceGross());
					po.setComment(productOrdered.getComment());
					po.setSendTime(productOrdered.getSendTime());
					po.setOrderedProductStatus(productOrdered.getOrderedProductStatus());
					po.setRestaurant(restaurant);

					final BigDecimal net = po.getPurchPriceNet();
					if (net != null && po.getProductOrderedPurchPriceRate() != null) {
						final BigDecimal vat = po.getProductOrderedPurchPriceRate().getRate();
						final BigDecimal gross = net.multiply(vat.add(new BigDecimal(1))).setScale(2,
								RoundingMode.HALF_UP);
						final BigDecimal vatValue = gross.subtract(net);
						po.setPurchPriceGross(gross);
						po.setPurchVatValue(vatValue);
					}

					final BigDecimal gross = po.getSellPriceGross();
					if (gross != null && po.getProductOrderedPurchPriceRate() != null) {
						final BigDecimal vat = po.getProductOrderedPurchPriceRate().getRate();
						final BigDecimal net1 = gross.divide(vat.add(new BigDecimal(1)), 2, RoundingMode.HALF_UP);
						final BigDecimal vatValue = gross.subtract(net1);
						po.setSellPriceNet(net1);
						po.setSellVatValue(vatValue);
					}

					if (pfs.getQuantity() != null && (orderedQuantity - countQuantity) >= pfs.getQuantity()) {
						if (pfs.getProduct().getProductType().getId() == 1) {
							countQuantity = countQuantity + pfs.getQuantity();
							po.setQuantity(pfs.getQuantity());
							productOnStockResource.deleteProductOnStock(pfs.getId());
						} else {
							countQuantity = orderedQuantity;
							po.setQuantity(orderedQuantity);
						}
					} else {
						po.setQuantity(orderedQuantity - countQuantity);
						if (pfs.getProduct().getProductType() != null
								&& pfs.getProduct().getProductType().getId() == 1) {
							pfs.setQuantity(pfs.getQuantity() - (orderedQuantity - countQuantity));
							productOnStockResource.updateProductOnStock(pfs);
						}
						countQuantity = countQuantity + po.getQuantity();
					}
//					log.debug("po=" + po.getProduct().getName());
					productOrderedList.add(po);

					if (orderedQuantity == countQuantity) {
						break;
					}
				}
				for (ProductOrdered productAdded : productOrderedList) {
//					log.debug("productAdded=" + productAdded.getProduct().getName());
					ProductOrdered result = productOrderedRepository.save(productAdded);

				}

				// log.debug("productOrderedList: "+productOrderedList.size());
			}
		}
		if (sendTokitchen) {
			final Long countSentToKitchen;
			final Long status = 2L;
			countSentToKitchen = productOrderedRepository.countByRestaurantAndOrderedProductStatusId(restaurant, status)
					+ 1;
			alarm.sendToKichen(countSentToKitchen);
		}
		return ResponseEntity.created(new URI("/api/order-openeds/" + orderOpenedResult.getId()))
        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, orderOpenedResult.getId().toString()))
        .body(orderOpenedResult);
	}

	/**
	 * GET /product-ordereds : get all the productOrdereds.
	 *
	 * @return the ResponseEntity with status 200 (OK) and the list of
	 *         productOrdereds in body
	 */
	@GetMapping("/order-opened-with-products")
	public synchronized List<OrderWithProducts> getOrdersWithProducts() {
		log.debug("REST request to get all product-to-order");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		final List<OrderOpened> orderOpeneds = orderOpenedRepository.findAllByRestaurant(restaurant);
		// log.debug("orderOpenedRepository.findAll(): "+orderOpeneds.size());
		final List<OrderWithProducts> owps = new ArrayList<>();
		// List<ProductOrdered> productOrdereds =
		// productOrderedRepository.findAllByOrderId(id);
		for (OrderOpened order : orderOpeneds) {
			BigDecimal total = BigDecimal.ZERO;
			final List<ProductOrdered> productOrdereds = productOrderedRepository
					.findAllByRestaurantAndOrderId(restaurant, order.getId());
			final List<ProductOrdered> productOrderedsCorrectedView = new ArrayList<>();
			int orderPosition = 0;
//			 log.debug("productOrdereds.size():" +productOrdereds.size());
			for (ProductOrdered po : productOrdereds) {
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
			// final OrderOpened result = orderOpenedRepository.save(order);
			// orderOpenedSearchRepository.save(result);
			// log.debug("findAllByOrderId(order.getId():
			// "+productOrdereds.size());
			// log.debug("Order: "+order.getId());
			final OrderWithProducts owp = new OrderWithProducts(order);
			owp.setComment(order.getComment());
			owp.setDesk(order.getDesk());
			owp.setId(order.getId());
			owp.setOpeningTime(order.getOpeningTime());
			owp.setPayment(order.getPayment());
			owp.setTotal(total);
			owp.setBarman(order.getBarman());
			owp.setProductsToOrder(productOrderedsCorrectedView);
			owp.setOrderId(order.getOrderId());

			// log.debug("OrderWithProducts(order): "+owp.getId());
			// log.debug("owp.setProductsToOrder(productOrdereds):
			// "+owp.getId());
			// log.debug("owp.setProductsToOrder: "+owp.get());
			owps.add(owp);
		}
		return owps;
	}

	/**
	 * GET /product-types/:id : get the "id" productType.
	 *
	 * @param id
	 *            the id of the productType to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the
	 *         productType, or with status 404 (Not Found)
	 */
	@GetMapping("/order-opened-with-products/{id}")
	public synchronized ResponseEntity<OrderWithProducts> getOrderWithProducts(@PathVariable Long id) {
		log.debug("REST request to get OrderWithProducts : {}", id);
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		final Optional<OrderOpened> orderOpenedOptional = orderOpenedRepository.findById(id);
		final OrderOpened orderOpened = orderOpenedOptional.get();
		final List<ProductOrdered> productOrdereds = productOrderedRepository.findAllByRestaurantAndOrderId(restaurant,
				orderOpened.getId());
		final List<ProductOrdered> productOrderedsCorrectedView = new ArrayList<>();
		int orderPosition = 0;
		// log.debug("productOrderedRepository.findAllByOrderId(order.getId()):
		// "+productOrdereds.size());
		for (ProductOrdered po : productOrdereds) {
			if (orderPosition != po.getOrderPosition()) {
				orderPosition = po.getOrderPosition();
				productOrderedsCorrectedView.add(po);
			} else {
				int index = productOrderedsCorrectedView.size();
				ProductOrdered previous = productOrderedsCorrectedView.get(index - 1);
				previous.setQuantity(previous.getQuantity() + po.getQuantity());
			}
		}
		final OrderWithProducts owp = new OrderWithProducts(orderOpened);
		if (orderOpened.getRestaurant().getId() == restaurant.getId()) {
			owp.setComment(orderOpened.getComment());
			owp.setDesk(orderOpened.getDesk());
			owp.setId(orderOpened.getId());
			owp.setOpeningTime(orderOpened.getOpeningTime());
			owp.setPayment(orderOpened.getPayment());
			owp.setTotal(orderOpened.getTotal());
			owp.setBarman(orderOpened.getBarman());
			owp.setProductsToOrder(productOrderedsCorrectedView);
			owp.setOrderId(orderOpened.getOrderId());
		}
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(owp));
	}

	/**
	 * PUT /order-openeds : Updates an existing orderOpened.
	 *
	 * @param orderOpened
	 *            the orderOpened to update
	 * @return the ResponseEntity with status 200 (OK) and with body the updated
	 *         orderOpened, or with status 400 (Bad Request) if the orderOpened is
	 *         not valid, or with status 500 (Internal Server Error) if the
	 *         orderOpened couldn't be updated
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PutMapping("/order-opened-with-products")
	public synchronized ResponseEntity<OrderOpened> updateOrderOpenedWithProducts(
			@RequestBody OrderWithProducts orderWithProducts) throws URISyntaxException {
		log.debug("REST request to update orderWithProducts : {}", orderWithProducts);
		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		BigDecimal total = BigDecimal.ZERO;
		boolean sendTokitchen = false;
		if (orderWithProducts.getId() != null || orderWithProducts.getRestaurant().getId() == restaurant.getId()) {
			ProductOrdered lastOrderedProduct = productOrderedRepository
					.findTopByOrderIdOrderByIdDesc(orderWithProducts.getId());
			int lastOrderedPosition = 1;
			if (lastOrderedProduct != null) {
				lastOrderedPosition = lastOrderedProduct.getOrderPosition() + 1;
			}
			// log.debug("lastOrderedPosition: "+lastOrderedPosition + "
			// lastOrderedProduct.getId(): "+lastOrderedProduct.getId());
			final List<ProductOrdered> productsOrdered = orderWithProducts.getProductsToOrder();
			// log.debug("productsOrdered.size(): " + productsOrdered.size());
			for (ProductOrdered productOrdered : productsOrdered) {
				if (productOrdered.getOrderedProductStatus() != null
						&& productOrdered.getOrderedProductStatus().getId() == 2L) {
					sendTokitchen = true;
				}
				productOrdered.setRestaurant(restaurant);

				Product product = productOrdered.getProduct();

				List<ProductOnStock> productOnStockList = productOnStockRepository
						.findAllByRestaurantAndProductOrderByDeliveryDate(restaurant, product);
				List<ProductOrdered> productOrderedList = new ArrayList<>();
				int orderedQuantity = productOrdered.getQuantity();
				int countQuantity = 0;

				for (ProductOnStock pfs : productOnStockList) {
					// log.debug("pfs="+pfs.getProduct().getName());
					ProductOrdered po = new ProductOrdered();
					po.setOrder(productOrdered.getOrder());
					po.setOrderPosition(lastOrderedPosition);
					po.setProduct(productOrdered.getProduct());
					po.setDeliveryDate(pfs.getDeliveryDate());
					if (!((pfs.getSellPriceGross()).subtract(productOrdered.getSellPriceGross())
							.compareTo(BigDecimal.ZERO) == 0)) {
						po.setDifference((productOrdered.getSellPriceGross()).subtract(pfs.getSellPriceGross()));
					}
					po.setOrderedTime(ZonedDateTime.now(ZoneId.systemDefault()));
					po.setProductOrderedPurchPriceRate(pfs.getProduct().getProductPurchPriceRate());
					po.setPurchPriceNet(pfs.getProduct().getPurchPriceNet());
					po.setPurchVatValue(pfs.getPurchVatValue());
					po.setPurchPriceGross(pfs.getPurchPriceGross());
					po.setProductOrderedSellPriceRate(pfs.getProduct().getProductSellPriceRate());
					po.setSellPriceGross(productOrdered.getSellPriceGross());
					po.setComment(productOrdered.getComment());
					po.setRestaurant(restaurant);

					final BigDecimal net = po.getPurchPriceNet();
					if (net != null && po.getProductOrderedPurchPriceRate() != null) {
						final BigDecimal vat = po.getProductOrderedPurchPriceRate().getRate();
						final BigDecimal gross = net.multiply(vat.add(new BigDecimal(1))).setScale(2,
								RoundingMode.HALF_UP);
						final BigDecimal vatValue = gross.subtract(net);
						po.setPurchPriceGross(gross);
						po.setPurchVatValue(vatValue);
					}

					final BigDecimal gross = po.getSellPriceGross();
					if (gross != null && po.getProductOrderedPurchPriceRate() != null) {
						final BigDecimal vat = po.getProductOrderedPurchPriceRate().getRate();
						final BigDecimal net1 = gross.divide(vat.add(new BigDecimal(1)), 2, RoundingMode.HALF_UP);
						final BigDecimal vatValue = gross.subtract(net1);
						po.setSellPriceNet(net1);
						po.setSellVatValue(vatValue);
					}

					if (productOrdered.getOrderedProductStatus() != null
							&& productOrdered.getOrderedProductStatus().getId() == 2) {
						po.setOrderedProductStatus(productOrdered.getOrderedProductStatus());
						po.sendTime(productOrdered.getSendTime());
					}
					if (pfs.getQuantity() == null || (orderedQuantity - countQuantity) >= pfs.getQuantity()) {
						if (pfs.getProduct().getProductType() != null
								&& pfs.getProduct().getProductType().getId() == 1) {
							countQuantity = countQuantity + pfs.getQuantity();
							po.setQuantity(pfs.getQuantity());
							productOnStockResource.deleteProductOnStock(pfs.getId());
						} else {
							countQuantity = orderedQuantity;
							po.setQuantity(orderedQuantity);
						}
					} else {
						po.setQuantity(orderedQuantity - countQuantity);
						if (pfs.getProduct().getProductType().getId() == 1) {
							pfs.setQuantity(pfs.getQuantity() - (orderedQuantity - countQuantity));
							productOnStockResource.updateProductOnStock(pfs);
						}
						countQuantity = countQuantity + po.getQuantity();
					}

					productOrderedList.add(po);

					if (orderedQuantity == countQuantity) {
						break;
					}
				}

				for (ProductOrdered productAdded : productOrderedList) {
					ProductOrdered result = productOrderedRepository.save(productAdded);
					// total=total.add(productAdded.getSellPriceGross());

				}
				lastOrderedPosition++;

				if (productOrdered.getProduct().getId() == 1) { // substitute
					productOrderedRepository.save(productOrdered);
				}
			}
		}
		final Optional<OrderOpened> orderOpenedOptional = orderOpenedRepository.findById(orderWithProducts.getId());
		final OrderOpened orderOpened = orderOpenedOptional.get();
		final List<ProductOrdered> productsOrdered = productOrderedRepository.findAllByRestaurantAndOrderId(restaurant,
				orderOpened.getId());
		for (ProductOrdered productOrdered : productsOrdered) {
			total = total.add(productOrdered.getSellPriceGross());
		}
		orderOpened.setTotal(total);

		OrderOpened result = orderOpenedRepository.save(orderOpened);
		if (sendTokitchen) {
			log.debug("alarm sendTokitchen");
			final Long countSentToKitchen;
			final Long status = 2L;
			countSentToKitchen = productOrderedRepository.countByRestaurantAndOrderedProductStatusId(restaurant, status);
			alarm.sendToKichen(countSentToKitchen);
		}
		return ResponseEntity.ok()
	            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderOpened.getId().toString()))
	            .body(result);
	}

	private String getCurrentUserLogin() {
		org.springframework.security.core.context.SecurityContext securityContext = SecurityContextHolder.getContext();
		Authentication authentication = securityContext.getAuthentication();
		String login = null;
		if (authentication != null)
			if (authentication.getPrincipal() instanceof UserDetails)
				login = ((UserDetails) authentication.getPrincipal()).getUsername();
			else if (authentication.getPrincipal() instanceof String)
				login = (String) authentication.getPrincipal();

		return login;

	}

}
