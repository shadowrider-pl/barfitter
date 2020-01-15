package finbarre.web.rest.forUsers;

import java.math.BigDecimal;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import javax.persistence.LockModeType;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import finbarre.domain.Product;
import finbarre.domain.ProductDelivered;
import finbarre.domain.ProductOnStock;
//import finbarre.domain.ProductOnStock;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.ProductDeliveredRepository;
import finbarre.repository.ProductOnStockRepository;
import finbarre.repository.ProductRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import finbarre.service.serviceForUsers.AdditionalHeaderUtil;
import finbarre.service.serviceForUsers.ProductsDelivered;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;

@RestController
@RequestMapping("/api")
public class AuthorizationResource {

	private final Logger log = LoggerFactory.getLogger(AuthorizationResource.class);

	private Integer quantity;
	private ProductOnStock foundProductOnStock;
	private ProductOnStock newOnStock;
	private Long productId;
	private Long foundProductOnStockId = null;
	private List<ProductOnStock> productOnStockList;
	private BigDecimal productDeliveredNetPrice;
	private ProductOnStock updatedProductResult;
	private LocalDate productDeliveredDate;

    private static final String ENTITY_NAME = "productDelivered";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

	@Autowired
	private ProductDeliveredRepository productDeliveredRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private ProductOnStockRepository productOnStockRepository;

	@Autowired
	private UserToRestaurantRepository userToRestaurantRepository;

	/**
	 * GET /product-delivereds : get all the productDelivereds.
	 *
	 * @param pageable
	 *            the pagination information
	 * @return the ResponseEntity with status 200 (OK) and the list of
	 *         productDelivereds in body
	 * @throws URISyntaxException
	 *             if there is an error to generate the pagination HTTP headers
	 */
	@RequestMapping(value = "/authorization", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public synchronized ResponseEntity<List<ProductDelivered>> getAllProductDeliveredsForAuthorization(
			Pageable pageable) throws URISyntaxException {
		log.debug("REST request to get a page of ProductDelivereds in AuthorizationResource");
		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		Page<ProductDelivered> page = productDeliveredRepository.findAllByRestaurant(restaurant, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
	}

	/**
	 * GET /product-delivereds/:id : get the "id" productDelivered.
	 *
	 * @param id
	 *            the id of the productDelivered to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the
	 *         productDelivered, or with status 404 (Not Found)
	 */
	@GetMapping("/authorization/{id}")
	public ResponseEntity<ProductDelivered> getProductDelivered(@PathVariable Long id) {
		log.debug("REST request to get ProductDelivered for authorization: {}", id);
		Optional<ProductDelivered> productDelivered = productDeliveredRepository.findById(id);
		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		if (productDelivered.get().getRestaurant().getId() != restaurant.getId()) {
			productDelivered = null;
		}
		return ResponseUtil.wrapOrNotFound(productDelivered);
	}

	/**
	 * PUT /product-delivereds/:id : get the "id" productDelivered.
	 *
	 * @param id
	 *            the id of the productDelivered to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the
	 *         productDelivered, or with status 404 (Not Found)
	 */
	@Transactional
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@PutMapping("/authorization")
	public synchronized ResponseEntity<ProductDelivered> updateProductDelivered(
			@Valid @RequestBody ProductDelivered productDelivered) {
		log.debug("REST request to authorize : {}", productDelivered);
		final String name = authorizeSingleProduct(productDelivered);
		return ResponseEntity.ok()
				.headers(AdditionalHeaderUtil.productsAuthorizedAlert("authorization", name.toString())).build();

	}

	/**
	 * PUT /product-delivereds/:id : get the "id" productDelivered.
	 *
	 * @param id
	 *            the id of the productDelivered to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the
	 *         productDelivered, or with status 404 (Not Found)
	 */
	@Transactional
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@PutMapping("/authorization-list")
	public synchronized ResponseEntity<ProductDelivered> updateProductDeliveredList(
			@Valid @RequestBody ProductsDelivered productsDelivered) {
		for (ProductDelivered productDelivered : productsDelivered.getProductsDelivered()) {
			authorizeSingleProduct(productDelivered);
		}
		return ResponseEntity.ok().headers(AdditionalHeaderUtil.productsAuthorizedAlert("authorization", null)).build();

	}

	/**
	 * DELETE /categories/:id : delete the "id" category.
	 *
	 * @param id
	 *            the id of the category to delete
	 * @return the ResponseEntity with status 200 (OK)
	 */
	@RequestMapping(value = "/authorization/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
	public synchronized ResponseEntity<Void> deleteProductInAuthorization(@PathVariable Long id) {
		log.debug("REST request to delete product from Authorization : {}", id);
		Optional<ProductDelivered> productDelivered = productDeliveredRepository.findById(id);
		String name;
		if (productDelivered.get().getName() != null) {
			name = productDelivered.get().getName();
		} else {
			name = productDelivered.get().getProduct().getName();
		}
		productDeliveredRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
	}

	private String authorizeSingleProduct(ProductDelivered productDelivered) {

		// ProductDelivered productDelivered = productDeliveredRepository.findOne(id);
		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();

		if (productDelivered.getName() != null) { // całkiem nowy produkt
			// log.debug("całkiem nowy produkt");
			final Product newProduct = new Product(); // nie można deklarować wcześniej
			newProduct.setName(productDelivered.getName());
			newProduct.setPurchPriceGross(productDelivered.getPurchPriceGross());
			newProduct.setSellPriceGross(productDelivered.getSellPriceGross());
			newProduct.setPurchPriceNet(productDelivered.getPurchPriceNet());
			newProduct.setPurchVatValue(productDelivered.getPurchVatValue());
			newProduct.setSellPriceNet(productDelivered.getSellPriceNet());
			newProduct.setSellVatValue(productDelivered.getSellVatValue());
			newProduct.setCategory(productDelivered.getCategory());
			newProduct.setProductPurchPriceRate(productDelivered.getProductDeliveredPurchPriceRate());
			newProduct.setProductSellPriceRate(productDelivered.getProductDeliveredSellPriceRate());
			newProduct.setActive(true);
			newProduct.setProductType(productDelivered.getProductType());
			newProduct.setRestaurant(restaurant);
			productRepository.save(newProduct);

			// log.debug("Wstawia nowy produkt na stock: "+productDelivered.getName());
			final ProductOnStock newOnStock = new ProductOnStock();
			newOnStock.setDeliveryDate(productDelivered.getDeliveryDate());
			newOnStock.setQuantity(productDelivered.getQuantity());
			newOnStock.setPurchPriceGross(productDelivered.getPurchPriceGross());
			newOnStock.setSellPriceGross(productDelivered.getSellPriceGross());
			newOnStock.setPurchPriceNet(productDelivered.getPurchPriceNet());
			newOnStock.setPurchVatValue(productDelivered.getPurchVatValue());
			newOnStock.setSellPriceNet(productDelivered.getSellPriceNet());
			newOnStock.setSellVatValue(productDelivered.getSellVatValue());
			newOnStock.setRestaurant(restaurant);
			final Product foundProduct = productRepository.findOneByNameAndRestaurant(productDelivered.getName(), productDelivered.getRestaurant());
			newOnStock.setProduct(foundProduct);
			productOnStockRepository.save(newOnStock);

		} else {

			// log.debug("Ominął całkiem nowy produkt");
			// log.debug("***");
			productId = productDelivered.getProduct().getId();
			// log.debug("****");
			productOnStockList = productOnStockRepository.findByProductId(productId);
			// log.debug("*****");
			productDeliveredNetPrice = null;
			productDeliveredDate = null;
			foundProductOnStockId = null;

			if (productOnStockList != null) { // szukaj produktów na magazynie
				// log.debug("Znalazl w magazynie");
				productDeliveredNetPrice = productDelivered.getPurchPriceNet();
				productDeliveredDate = productDelivered.getDeliveryDate();
				// log.debug("foundProductOnStockId: "+foundProductOnStockId);

				for (ProductOnStock pos : productOnStockList) {
					if (productDeliveredNetPrice.equals(pos.getPurchPriceNet())
							&& productDeliveredDate.equals(pos.getDeliveryDate())) { // jeśli znalazłeś na magazynie
																						// produkt o takiej samej cenie
																						// zakupu, dodaj ilości
						foundProductOnStockId = pos.getId();
						foundProductOnStock = productOnStockRepository.findOneById(foundProductOnStockId);
						quantity = pos.getQuantity() + productDelivered.getQuantity();
						log.debug("Znalazl taka sama cene");
						break;
					}
					pos.setSellPriceGross(productDelivered.getSellPriceGross());
					updatedProductResult = productOnStockRepository.save(pos);
				}

				// log.debug("foundProductOnStockId @: "+foundProductOnStockId);
				if (foundProductOnStockId != null) {
					// log.debug("Zmienia ilosc znalezionego produktu. foundProductOnStockId:
					// "+foundProductOnStockId+" "+foundProductOnStock.getProduct().getName());
					foundProductOnStock.setQuantity(quantity);
					updatedProductResult = productOnStockRepository.save(foundProductOnStock);
					// log.debug("Zmienia ilosc znalezionego produktu-end");
				} else {
					// log.debug("Wstawia znaleziony produkt z inna cena");
					newOnStock = new ProductOnStock();
					newOnStock.setDeliveryDate(productDelivered.getDeliveryDate());
					newOnStock.setQuantity(productDelivered.getQuantity());
					newOnStock.setPurchPriceGross(productDelivered.getPurchPriceGross());
					newOnStock.setSellPriceGross(productDelivered.getSellPriceGross());
					newOnStock.setPurchPriceNet(productDelivered.getPurchPriceNet());
					newOnStock.setPurchVatValue(productDelivered.getPurchVatValue());
					newOnStock.setSellPriceNet(productDelivered.getSellPriceNet());
					newOnStock.setSellVatValue(productDelivered.getSellVatValue());
					newOnStock.setProduct(productDelivered.getProduct());
					newOnStock.setRestaurant(restaurant);
					productOnStockRepository.save(newOnStock);
				}

				// log.debug("aktualizuje dane produktu");
				Product newProduct = new Product(); // nie można deklarować wcześniej
				newProduct = productDelivered.getProduct();
				newProduct.setProductPurchPriceRate(productDelivered.getProductDeliveredPurchPriceRate());
				newProduct.setProductSellPriceRate(productDelivered.getProductDeliveredSellPriceRate());
				newProduct.setSellPriceGross(productDelivered.getSellPriceGross());
				newProduct.setPurchPriceNet(productDelivered.getPurchPriceNet());
				productRepository.save(newProduct);
			}
		}

		// do komunikatu tylko
		String name;
		if (productDelivered.getName() != null) {
			name = productDelivered.getName();
		} else {
			name = productDelivered.getProduct().getName();
		}
		productDeliveredRepository.delete(productDelivered);

		return name;
	}
}
