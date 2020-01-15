package finbarre.web.rest.forUsers;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URISyntaxException;
import java.util.ArrayList;
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

import finbarre.domain.Product;
import finbarre.domain.ProductDelivered;
import finbarre.domain.ProductOnStock;
import finbarre.domain.ProductOrdered;
import finbarre.domain.ProductSold;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.ProductDeliveredRepository;
import finbarre.repository.ProductOnStockRepository;
import finbarre.repository.ProductOrderedRepository;
import finbarre.repository.ProductRepository;
import finbarre.repository.ProductSoldRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import finbarre.service.serviceForUsers.AdditionalHeaderUtil;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing Stock.
 */
@RestController
@RequestMapping("/api")
public class StockResource {
	private final Logger log = LoggerFactory.getLogger(StockResource.class);

	private static final String ENTITY_NAME = "productOnStock";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

	@Autowired
	private ProductSoldRepository productSoldRepository;

	@Autowired
	private ProductDeliveredRepository productDeliveredRepository;

	@Autowired
	private ProductOrderedRepository productOrderedRepository;

	@Autowired
	private ProductOnStockRepository productOnStockRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private UserToRestaurantRepository userToRestaurantRepository;

	private ProductOnStock temp;
	private ProductOnStock temp2;
	private int tempQuantity = 0;
	private int listSize;
	private Long index;

	/**
	 * DELETE /products/:id : delete the "id" product.
	 *
	 * @param id
	 *            the id of the product to delete
	 * @return the ResponseEntity with status 200 (OK)
	 */
	@DeleteMapping("/stock/out-of-stock/{id}")
	public synchronized ResponseEntity<Void> deleteOutOfStockProduct(@PathVariable Long id) {
		log.debug("REST request to delete Product : {}", id);
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		final Optional<Product> productOptional = productRepository.findById(id);
		final Product product = productOptional.get();
		final ProductSold productSold = productSoldRepository.findOneByProduct(product);
		final ProductDelivered productDelivered = productDeliveredRepository.findOneByProduct(product);
		final ProductOrdered productOrdered = productOrderedRepository.findOneByProduct(product);
		// log.debug("product.getRestaurant().getId():
		// "+product.getRestaurant().getId());
		if (product.getRestaurant().getId() == restaurant.getId() && productSold == null && productDelivered == null
				&& productOrdered == null) {
			productRepository.deleteById(product.getId());
			return ResponseEntity.ok().headers(AdditionalHeaderUtil.productDeletedAlert(ENTITY_NAME, id.toString()))
					.build();
		} else {
			return null;
		}
	}
	/**
	 * DELETE /products/:id : delete the "id" product.
	 *
	 * @param id
	 *            the id of the product to delete
	 * @return the ResponseEntity with status 200 (OK)
	 */
	@DeleteMapping("/stock/{id}")
	public synchronized ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
		log.debug("REST request to delete Product : {}", id);
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		final ProductOnStock productOnStock = productOnStockRepository.findOneById(id);
		final Product product = productOnStock.getProduct();
		final ProductSold productSold = productSoldRepository.findOneByProduct(product);
		final ProductDelivered productDelivered = productDeliveredRepository.findOneByProduct(product);
		final ProductOrdered productOrdered = productOrderedRepository.findOneByProduct(product);
		// log.debug("product.getRestaurant().getId():
		// "+product.getRestaurant().getId());
		if (product.getRestaurant().getId() == restaurant.getId() && productSold == null && productDelivered == null
				&& productOrdered == null) {
			if (productOnStock != null) {
				productOnStockRepository.deleteById(id);
			}
			productRepository.deleteById(product.getId());
			return ResponseEntity.ok().headers(AdditionalHeaderUtil.productDeletedAlert(ENTITY_NAME, id.toString()))
					.build();
		} else {
			return null;
		}
	}

	/**
	 * PUT /product-on-stocks : Updates an existing productOnStock.
	 *
	 * @param productOnStock
	 *            the productOnStock to update
	 * @return the ResponseEntity with status 200 (OK) and with body the updated
	 *         productOnStock, or with status 400 (Bad Request) if the
	 *         productOnStock is not valid, or with status 500 (Internal Server
	 *         Error) if the productOnStock couldn't be updated
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PutMapping("/stock")
	public synchronized ResponseEntity<ProductOnStock> updateStock(@Valid @RequestBody ProductOnStock productOnStock)
			throws URISyntaxException {
		log.debug("REST request to updateStock : {}", productOnStock);
		// log.debug("productOnStock: " + productOnStock.getProduct().getName());
		final Product product = productOnStock.getProduct();
		final Product productResult = productRepository.save(product);
		// final int quantityBeforeChange =
		// productOnStockRepository.findOne(productOnStock)
		ProductOnStock productOnStockX = productOnStockRepository.findOneById(productOnStock.getId());
		if (productOnStockX.getProduct().getProductType().getId() == 1) {
log.debug("product ready");
			boolean changeSellPriceGrossBoolean = false;
			if(productOnStock.getSellPriceGross() != productOnStockX.getSellPriceGross()) {
				changeSellPriceGrossBoolean = true;
log.debug("changeSellPriceGrossBoolean = true");
			} 
			final List<ProductOnStock> productsOS = productOnStockRepository
					.findAllByProduct(productOnStockX.getProduct());
			int stockQuantity = 0;
			for (ProductOnStock pos : productsOS) {
				stockQuantity = stockQuantity + pos.getQuantity();
				if(changeSellPriceGrossBoolean) { // save new price
log.debug("	save new price");				
					final BigDecimal vat = productOnStock.getProduct().getProductSellPriceRate().getRate();
					pos.setSellPriceGross(productOnStock.getSellPriceGross());
					pos.setSellPriceNet(productOnStock.getSellPriceGross().divide(vat.add(new BigDecimal(1)), 2, RoundingMode.HALF_UP));
					pos.setSellVatValue(productOnStock.getSellPriceGross().subtract(productOnStock.getSellPriceGross().divide(vat.add(new BigDecimal(1)), 2, RoundingMode.HALF_UP)));
					productOnStockRepository.save(pos);
					product.setSellPriceGross(productOnStock.getSellPriceGross());
					product.setSellPriceNet(productOnStock.getSellPriceGross().divide(vat.add(new BigDecimal(1)), 2, RoundingMode.HALF_UP));
					product.setSellVatValue(productOnStock.getSellPriceGross().subtract(productOnStock.getSellPriceGross().divide(vat.add(new BigDecimal(1)), 2, RoundingMode.HALF_UP)));
					productRepository.save(product);
				}
//				pos.setSellPriceGross(productOnStock.getPurchPriceGross());
			}
			int endQuantity = productOnStock.getQuantity();
			if (endQuantity != stockQuantity) {
				if (productsOS.size() > 1) {
					if (endQuantity > stockQuantity) {
						log.debug("(diffQuantity > pos.getQuantity()) productsOS.get(0).getQuantity()="
								+ productsOS.get(0).getQuantity() + " stockQuantity=" + stockQuantity);
						productsOS.get(0).setQuantity(productsOS.get(0).getQuantity() + (endQuantity - stockQuantity));
						productOnStockRepository.save(productsOS.get(0));
					} else {
						int diffQuantity = stockQuantity - endQuantity;
						log.debug("diffQuantity=" + diffQuantity);
						for (ProductOnStock pos : productsOS) {
							if (diffQuantity < pos.getQuantity()) {
								log.debug("(diffQuantity < pos.getQuantity())");
								pos.setQuantity(pos.getQuantity() - diffQuantity);
								productOnStockRepository.save(pos);
								break;
							} else if (diffQuantity == pos.getQuantity()) {
								productOnStockRepository.delete(pos);
								break;
							} else {
								diffQuantity = diffQuantity - pos.getQuantity();
								productOnStockRepository.delete(pos);
							}
						}
					}
				} else {
					if (endQuantity == 0) {
						productOnStockRepository.delete(productsOS.get(0));
					} else {
						productsOS.get(0).setQuantity(endQuantity);
						productOnStockRepository.save(productsOS.get(0));
					}
				}
			}
			return ResponseEntity.ok()
	                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productOnStock.getId().toString()))
					.body(productOnStock);
		}
		// if (productOnStock.getRestaurant().getId() != restaurant.getId()) {
		// log.debug("zła restauracja " + restaurant.getName() + ' ' +
		// productOnStockX.getRestaurant().getName());
		// productOnStockX = null;
		// }
		else {
			final BigDecimal vat = productOnStock.getProduct().getProductSellPriceRate().getRate();
			productOnStock.setSellPriceNet(productOnStock.getSellPriceGross().divide(vat.add(new BigDecimal(1)), 2, RoundingMode.HALF_UP));
			productOnStock.setSellVatValue(productOnStock.getSellPriceGross().subtract(productOnStock.getSellPriceGross().divide(vat.add(new BigDecimal(1)), 2, RoundingMode.HALF_UP)));
			ProductOnStock result = productOnStockRepository.save(productOnStock);
			product.setSellPriceGross(productOnStock.getSellPriceGross());
			product.setSellPriceNet(productOnStock.getSellPriceGross().divide(vat.add(new BigDecimal(1)), 2, RoundingMode.HALF_UP));
			product.setSellVatValue(productOnStock.getSellPriceGross().subtract(productOnStock.getSellPriceGross().divide(vat.add(new BigDecimal(1)), 2, RoundingMode.HALF_UP)));
			productRepository.save(product);
			return ResponseEntity.ok()
	                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productOnStock.getId().toString()))
	                .body(result);
		}
	}

	/**
	 * GET /product-on-stocks : get all the productOnStocks.
	 *
	 * @return the ResponseEntity with status 200 (OK) and the list of
	 *         productOnStocks in body
	 */
	@GetMapping("/stock")
	public synchronized List<ProductOnStock> getReadyProducts() {
		log.debug("REST request to get all ready products");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		Long readyProductTypeId = Long.valueOf(1);
		log.debug("start");
		List<ProductOnStock> productOnStocks = productOnStockRepository
				.findAllByRestaurantAndProductProductTypeIdOrderByProductNameAscId(restaurant, readyProductTypeId);
		log.debug("restaurant=" + restaurant.getName() + " readyProductTypeId=" + readyProductTypeId
				+ " productOnStocks.size(): " + productOnStocks.size());
		return findProducts(productOnStocks);
		// return productOnStocks;

	}

	/**
	 * GET /product-on-stocks : get all the productOnStocks.
	 *
	 * @return the ResponseEntity with status 200 (OK) and the list of
	 *         productOnStocks in body
	 */
	@GetMapping("/stock/kitchen")
	public synchronized List<ProductOnStock> getKitchenProducts() {
		log.debug("REST request to get all Kitchen products");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		Long readyProductTypeId = Long.valueOf(2);
		List<ProductOnStock> productOnStocks = productOnStockRepository
				.findAllByRestaurantAndProductProductTypeIdOrderByProductNameAscId(restaurant, readyProductTypeId);
		return findProducts(productOnStocks);

	}

	/**
	 * GET /product-on-stocks : get all the productOnStocks.
	 *
	 * @return the ResponseEntity with status 200 (OK) and the list of
	 *         productOnStocks in body
	 */
	@GetMapping("/stock/bar")
	public synchronized List<ProductOnStock> getBarProducts() {
		log.debug("REST request to get all Bar products");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		Long barProductTypeId = Long.valueOf(3);
		List<ProductOnStock> productsOnStocks = productOnStockRepository
				.findAllByRestaurantAndProductProductTypeIdOrderByProductNameAscId(restaurant, barProductTypeId);
		// return findProducts(productsOnStocks);
		return productsOnStocks;

	}

	/**
	 * GET /product-on-stocks : get all the productOnStocks.
	 *
	 * @return the ResponseEntity with status 200 (OK) and the list of
	 *         productOnStocks in body
	 */
	@GetMapping("/stock/out-of-stock")
	public synchronized List<Product> getOutOfStock() {
		log.debug("REST request to get out-of-stock products");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		Long readyProductTypeId = Long.valueOf(1);
		List<ProductOnStock> productOnStocks = productOnStockRepository
				.findAllByRestaurantAndProductProductTypeIdOrderByProductNameAscId(restaurant, readyProductTypeId);
		List<ProductOnStock> productsOSFoundOnStocks = findProducts(productOnStocks);
		// List<Product> productsFoundOnStocks = new ArrayList<>();
		List<Long> productIds = new ArrayList<>();
		for (ProductOnStock productOS : productsOSFoundOnStocks) {
			Long pId = productOS.getProduct().getId();
			productIds.add(pId);
		}
		List<Product> productsOutOfStock = productRepository.findAllByRestaurantAndProductTypeIdAndIdNotInOrderByName(restaurant,
				readyProductTypeId, productIds);
		log.debug("productsOutOfStock=" + productsOutOfStock.size() + " productIds=" + productIds.size()
				+ " productsOSFoundOnStocks=" + productsOSFoundOnStocks.size());
		return productsOutOfStock;
	}

	/**
	 * GET /product-on-stocks/:id : get the "id" productOnStock.
	 *
	 * @param id
	 *            the id of the productOnStock to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the
	 *         productOnStock, or with status 404 (Not Found)
	 */
	@GetMapping("/stock/{id}")
	public synchronized ResponseEntity<ProductOnStock> getProductOnStock(@PathVariable Long id) {
		log.debug("REST request to get ProductOnStock from Stock : {}", id);
		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		ProductOnStock productOnStock = productOnStockRepository.findOneById(id);
		final List<ProductOnStock> productsOS = productOnStockRepository.findAllByProduct(productOnStock.getProduct());
		int quantity = 0;
		if (productOnStock.getProduct().getProductType().getId() == 1) {
			for (ProductOnStock pos : productsOS) {
				quantity = quantity + pos.getQuantity();
			}
			productOnStock.setQuantity(quantity);
		}
		if (productOnStock.getRestaurant().getId() != restaurant.getId()) {
			log.debug("zła restauracja " + restaurant.getName() + ' ' + productOnStock.getRestaurant().getName());
			productOnStock = null;
		}
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(productOnStock));
	}

	/**
	 * GET /product/:id : get the "id" product.
	 *
	 * @param id
	 *            the id of the productOnStock to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the
	 *         productOnStock, or with status 404 (Not Found)
	 */
	@GetMapping("/stock/out-of-stock/{id}")
	public synchronized ResponseEntity<Product> getProductOutOfStock(@PathVariable Long id) {
		log.debug("REST request to get ProductOnStock from Stock : {}", id);
		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		final Optional<Product> productOptional = productRepository.findById(id);
		Product product = productOptional.get();
		if (product.getRestaurant().getId() != restaurant.getId()) {
			log.debug("zła restauracja " + restaurant.getName() + ' ' + product.getRestaurant().getName());
			product = null;
		}
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(product));
	}

	/**
	 * GET /product/:id : get the "id" product.
	 *
	 * @param id
	 *            the id of the productOnStock to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the
	 *         productOnStock, or with status 404 (Not Found)
	 */
	@GetMapping("/stock/product-sold/{id}")
	public synchronized ProductSold getProductSold(@PathVariable Long id) {
		log.debug("REST request to get ProductSold to check if delete is possible: {}", id);
		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		ProductSold product = productSoldRepository.findFirstByProductId(id);
		if (product != null && product.getRestaurant().getId() != restaurant.getId()) {
			log.debug("zła restauracja " + restaurant.getName() + ' ' + product.getRestaurant().getName());
			product = null;
		}
		return product;
	}

	private List<ProductOnStock> findProducts(List<ProductOnStock> entryList) {
		// log.debug("findProducts");
		listSize = entryList.size();
		List<ProductOnStock> stock = new ArrayList<ProductOnStock>();
		index = 0L;
		tempQuantity = 0;
		temp = null;

		for (ProductOnStock pos : entryList) {
			index++;
			// log.debug("*");

			if (temp == null) {
				// log.debug("1****1 " + pos.getProduct().getName());
				temp = pos;
				// temp.setId(index);
				// log.debug("temp.getId(index): " + temp.getId());
			} else {

				if (!(pos.getProduct().getId() == (temp.getProduct().getId()))) {
					// log.debug("**"+tempQuantity+"temp.getQuantity():
					// "+temp.getQuantity());
					// log.debug("** " + temp.getProduct().getName());
					stock.add(temp);
					temp = pos;
					// temp.setId(index);
					tempQuantity = 0;

				} else {
					tempQuantity = temp.getQuantity() + pos.getQuantity();
					temp.setQuantity(tempQuantity);
					// log.debug("***"+tempQuantity+"temp.getQuantity():
					// "+temp.getQuantity());
				}

				// log.debug("index: "+index);

			}

			if (index == listSize) {
				// temp.setId(index);
				stock.add(temp);
				// log.debug("****"+tempQuantity+"temp.getQuantity():
				// "+temp.getQuantity());
				// log.debug("****"+"temp.getId(index): " + temp.getId());
				// log.debug("**** " + temp.getProduct().getName());
			}
		}

		// log.debug("Stock.size(): " + stock.size());
		return stock;

	}
}
