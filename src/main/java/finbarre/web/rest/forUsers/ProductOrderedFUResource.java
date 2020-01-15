package finbarre.web.rest.forUsers;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
import finbarre.domain.ProductOrdered;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.OrderOpenedRepository;
import finbarre.repository.OrderedProductStatusRepository;
import finbarre.repository.ProductOrderedRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import finbarre.service.serviceForUsers.AdditionalHeaderUtil;
import finbarre.service.serviceForUsers.ProductsOrdered;
import finbarre.web.websocket.alarms.KichenAlarm;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing ProductOrdered.
 */
@RestController
@RequestMapping("/api")
public class ProductOrderedFUResource {

	private final Logger log = LoggerFactory.getLogger(ProductOrderedFUResource.class);

	private static final String ENTITY_NAME = "productOrdered";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

	private final ProductOrderedRepository productOrderedRepository;

	private final OrderedProductStatusRepository orderedProductStatusRepository;
	private final OrderOpenedRepository orderOpenedRepository;

	// fu
	private final UserToRestaurantRepository userToRestaurantRepository;

	@Autowired
	private KichenAlarm alarm;

	public ProductOrderedFUResource(ProductOrderedRepository productOrderedRepository,
			OrderedProductStatusRepository orderedProductStatusRepository,
			UserToRestaurantRepository userToRestaurantRepository, OrderOpenedRepository orderOpenedRepository) {
		this.productOrderedRepository = productOrderedRepository;
		this.orderedProductStatusRepository = orderedProductStatusRepository;
		// fu
		this.userToRestaurantRepository = userToRestaurantRepository;
		this.orderOpenedRepository = orderOpenedRepository;
	}

	/**
	 * PUT /product-ordereds : Updates an existing productOrdered.
	 *
	 * @param productOrdered
	 *            the productOrdered to update
	 * @return the ResponseEntity with status 200 (OK) and with body the updated
	 *         productOrdered, or with status 400 (Bad Request) if the
	 *         productOrdered is not valid, or with status 500 (Internal Server
	 *         Error) if the productOrdered couldn't be updated
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PutMapping("/product-orderedfu")
	public synchronized ResponseEntity<ProductOrdered> updateProductOrdered(
			@Valid @RequestBody ProductOrdered productOrdered) throws URISyntaxException {
		log.debug("REST request to update ProductOrdered : {}", productOrdered);
		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();

		final BigDecimal net = productOrdered.getPurchPriceNet();
		if (net != null && productOrdered.getProductOrderedPurchPriceRate() != null) {
			final BigDecimal vat = productOrdered.getProductOrderedPurchPriceRate().getRate();
			final BigDecimal gross = net.multiply(vat.add(new BigDecimal(1))).setScale(2, RoundingMode.HALF_UP);
			final BigDecimal vatValue = gross.subtract(net);
			productOrdered.setPurchPriceGross(gross);
			productOrdered.setPurchVatValue(vatValue);
		}

		final BigDecimal gross = productOrdered.getSellPriceGross();
		if (gross != null && productOrdered.getProductOrderedPurchPriceRate() != null) {
			final BigDecimal vat = productOrdered.getProductOrderedPurchPriceRate().getRate();
			final BigDecimal net1 = gross.divide(vat.add(new BigDecimal(1)), 2, RoundingMode.HALF_UP);
			final BigDecimal vatValue = gross.subtract(net1);
			productOrdered.setSellPriceNet(net1);
			productOrdered.setSellVatValue(vatValue);
		}

		if (productOrdered.getRestaurant().getId() == restaurant.getId()) {
			final Optional<ProductOrdered> productBeforeUpdate = productOrderedRepository.findById(productOrdered.getId());
			if (productBeforeUpdate.get().getOrderedProductStatus() != productOrdered.getOrderedProductStatus()) {
				final Long status = productOrdered.getOrderedProductStatus().getId();
				final Long countSentToKitchen;
				if (status == 2) {
					countSentToKitchen = productOrderedRepository.countByRestaurantAndOrderedProductStatusId(restaurant,
							status) + 1;
					alarm.sendToKichen(countSentToKitchen);
				} else if (status == 4 || status == 5) {
					countSentToKitchen = productOrderedRepository.countByRestaurantAndOrderedProductStatusId(restaurant,
							status) + 1;
					alarm.sendToBar(countSentToKitchen);
				}
			}
			ProductOrdered result = productOrderedRepository.save(productOrdered);
			// log.debug("result.getSendTime()"+result.getSendTime());
			// log.debug("result.getSendTime()
			// *******"+productOrderedRepository.findOne(result.getId()).getSendTime());
			final Optional<OrderOpened> orderOpenedOptional = orderOpenedRepository.findById(productOrdered.getOrder().getId());
			final OrderOpened orderOpened = orderOpenedOptional.get();
			final List<ProductOrdered> productsOrdered = productOrderedRepository
					.findAllByRestaurantAndOrderId(restaurant, orderOpened.getId());
			BigDecimal total = BigDecimal.ZERO;
			for (ProductOrdered po : productsOrdered) {
				total = total.add(po.getSellPriceGross().multiply(new BigDecimal(po.getQuantity())));
			}
			orderOpened.setTotal(total);
			OrderOpened oo = orderOpenedRepository.save(orderOpened);
			return ResponseEntity.ok()
	                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productOrdered.getId().toString()))
	                .body(result);
		} else {
			return ResponseEntity.ok()
	                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productOrdered.getId().toString()))
	                .body(null);
		}
	}

	/**
	 * PUT /product-ordereds : Updates list of existing productOrdered.
	 *
	 * @param productOrdered
	 *            the productOrdered to update
	 * @return the ResponseEntity with status 200 (OK) and with body the updated
	 *         productOrdered, or with status 400 (Bad Request) if the
	 *         productOrdered is not valid, or with status 500 (Internal Server
	 *         Error) if the productOrdered couldn't be updated
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PutMapping("/products-orderedfu")
	public synchronized ResponseEntity<ProductsOrdered> updateProductsOrderedStatus(
			@Valid @RequestBody ProductsOrdered productsOrdered) throws URISyntaxException {
		log.debug("REST request to update list of ProductOrdered : {}", productsOrdered);
		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		int i = 0;
		for (ProductOrdered productOrdered : productsOrdered.getProductsOrdered()) {
			if (productOrdered.getRestaurant().getId() == restaurant.getId()) {
				ProductOrdered result = productOrderedRepository.save(productOrdered);
			if (i++ == productsOrdered.getProductsOrdered().size() - 1) {
				// Last iteration
				final Optional<ProductOrdered> productBeforeUpdate = productOrderedRepository.findById(productOrdered.getId());
				if (productBeforeUpdate.get().getOrderedProductStatus() != productOrdered.getOrderedProductStatus()) {
					final Long status = productOrdered.getOrderedProductStatus().getId();
					final Long countSentToKitchen;
					if (status == 2) {
						countSentToKitchen = productOrderedRepository
								.countByRestaurantAndOrderedProductStatusId(restaurant, status) + 1;
						alarm.sendToKichen(countSentToKitchen);
					} else if (status == 4 || status == 5) {
						countSentToKitchen = productOrderedRepository
								.countByRestaurantAndOrderedProductStatusId(restaurant, status) + 1;
						alarm.sendToBar(countSentToKitchen);
					}
				}
				final Optional<OrderOpened> orderOpenedOptional = orderOpenedRepository.findById(productOrdered.getOrder().getId());
				final OrderOpened orderOpened = orderOpenedOptional.get();
				final List<ProductOrdered> products = productOrderedRepository.findAllByRestaurantAndOrderId(restaurant,
						orderOpened.getId());
				BigDecimal total = BigDecimal.ZERO;
				for (ProductOrdered po : products) {
					total = total.add(po.getSellPriceGross().multiply(new BigDecimal(po.getQuantity())));
				}
				orderOpened.setTotal(total);
				OrderOpened oo = orderOpenedRepository.save(orderOpened);
			}
			}
		}
		return ResponseEntity.ok().headers(AdditionalHeaderUtil.productsOrderedUpdatedAlert(ENTITY_NAME, null))
				.body(null);
	}

	/**
	 * GET /product-ordereds/:id : get the "id" productOrdered.
	 *
	 * @param id
	 *            the id of the productOrdered to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the
	 *         productOrdered, or with status 404 (Not Found)
	 */
	@GetMapping("/product-orderedfu/{id}")
	public synchronized ResponseEntity<ProductOrdered> getProductOrdered(@PathVariable Long id) {
		log.debug("REST request to get ProductOrdered : {}", id);
		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		final Optional<ProductOrdered> productOrdered = productOrderedRepository.findById(id);
		if (productOrdered.get().getRestaurant().getId() != restaurant.getId()) {
			return ResponseUtil.wrapOrNotFound(Optional.ofNullable(null));
		} else {
			return ResponseUtil.wrapOrNotFound(productOrdered);
		}

	}

	/**
	 * DELETE /product-ordereds/:id : delete the "id" productOrdered.
	 *
	 * @param id
	 *            the id of the productOrdered to delete
	 * @return the ResponseEntity with status 200 (OK)
	 */
	@DeleteMapping("/product-orderedfu/{id}")
	public synchronized ResponseEntity<Void> deleteProductOrdered(@PathVariable Long id) {
		log.debug("REST request to delete ProductOrdered : {}", id);
		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		final Optional<ProductOrdered> productOrderedOptional = productOrderedRepository.findById(id);
		final ProductOrdered productOrdered = productOrderedOptional.get();
		if (productOrdered.getRestaurant().getId() == restaurant.getId()) {
			productOrderedRepository.deleteById(id);
			final Optional<OrderOpened> orderOpenedOptional = orderOpenedRepository.findById(productOrdered.getOrder().getId());
			final OrderOpened orderOpened = orderOpenedOptional.get();
			final List<ProductOrdered> productsOrdered = productOrderedRepository
					.findAllByRestaurantAndOrderId(restaurant, orderOpened.getId());
			BigDecimal total = BigDecimal.ZERO;
			for (ProductOrdered po : productsOrdered) {
				total = total.add(po.getSellPriceGross());
			}
			orderOpened.setTotal(total);

			OrderOpened oo = orderOpenedRepository.save(orderOpened);
		}
        return ResponseEntity.noContent().headers(HeaderUtil
        		.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
	}

}
