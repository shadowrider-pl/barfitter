package finbarre.web.rest.forUsers;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import finbarre.domain.ProductDelivered;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.ProductDeliveredRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import finbarre.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing ProductDelivered.
 */
@RestController
@RequestMapping("/api")
public class DeliveryResourceFU {

	private final Logger log = LoggerFactory.getLogger(DeliveryResourceFU.class);

	private static final String ENTITY_NAME = "productDelivered";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

	private final ProductDeliveredRepository productDeliveredRepository;

	private final UserToRestaurantRepository userToRestaurantRepository;

	public DeliveryResourceFU(ProductDeliveredRepository productDeliveredRepository,
			UserToRestaurantRepository userToRestaurantRepository) {
		this.productDeliveredRepository = productDeliveredRepository;
		this.userToRestaurantRepository = userToRestaurantRepository;
	}

	/**
	 * POST /product-delivereds : Create a new productDelivered.
	 *
	 * @param productDelivered
	 *            the productDelivered to create
	 * @return the ResponseEntity with status 201 (Created) and with body the new
	 *         productDelivered, or with status 400 (Bad Request) if the
	 *         productDelivered has already an ID
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PostMapping("/delivery")
	public synchronized ResponseEntity<ProductDelivered> createProductDelivered(
			@Valid @RequestBody ProductDelivered productDelivered) throws URISyntaxException {
		log.debug("REST request to save ProductDelivered : {}", productDelivered);
		String name;
		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		productDelivered.setRestaurant(restaurant);
		if (productDelivered.getName() != null) {
			name = productDelivered.getName();
		} else {
			name = productDelivered.getProduct().getName();
		}
		if (productDelivered.getId() != null) {
			throw new BadRequestAlertException("A new productDelivered cannot already have an ID", ENTITY_NAME,
					"idexists");
		}

		final BigDecimal net = productDelivered.getPurchPriceNet();
		if (net != null && productDelivered.getProductDeliveredPurchPriceRate() != null) {
			final BigDecimal vat = productDelivered.getProductDeliveredPurchPriceRate().getRate();
			final BigDecimal gross = net.multiply(vat.add(new BigDecimal(1))).setScale(2, RoundingMode.HALF_UP);
			final BigDecimal vatValue = gross.subtract(net);
			productDelivered.setPurchPriceGross(gross);
			productDelivered.setPurchVatValue(vatValue);
		}
		
		final BigDecimal gross=productDelivered.getSellPriceGross();
    	if(gross!=null && 
    			productDelivered.getProductDeliveredSellPriceRate()!=null){
    		final BigDecimal vat = productDelivered.getProductDeliveredSellPriceRate().getRate();
    		final BigDecimal net1=gross.divide(vat.add(new BigDecimal(1)), 2, RoundingMode.HALF_UP);
    		final BigDecimal vatValue=gross.subtract(net1);
		productDelivered.setSellPriceNet(net1);
		productDelivered.setSellVatValue(vatValue);
    	}
    	
		ProductDelivered result = productDeliveredRepository.save(productDelivered);
		return ResponseEntity.created(new URI("/api/delivery/" + result.getId()))
	            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
	            .body(result);
	}

	/**
	 * PUT /product-delivereds : Updates an existing productDelivered.
	 *
	 * @param productDelivered
	 *            the productDelivered to update
	 * @return the ResponseEntity with status 200 (OK) and with body the updated
	 *         productDelivered, or with status 400 (Bad Request) if the
	 *         productDelivered is not valid, or with status 500 (Internal Server
	 *         Error) if the productDelivered couldn't be updated
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PutMapping("/delivery")
	public synchronized ResponseEntity<ProductDelivered> updateProductDelivered(
			@Valid @RequestBody ProductDelivered productDelivered) throws URISyntaxException {
		log.debug("REST request to update ProductDelivered : {}", productDelivered);
		if (productDelivered.getId() == null) {
			return createProductDelivered(productDelivered);
		}

		final BigDecimal net = productDelivered.getPurchPriceNet();
		if (net != null && productDelivered.getProductDeliveredPurchPriceRate() != null) {
			final BigDecimal vat = productDelivered.getProductDeliveredPurchPriceRate().getRate();
			final BigDecimal gross = net.multiply(vat.add(new BigDecimal(1))).setScale(2, RoundingMode.HALF_UP);
			final BigDecimal vatValue = gross.subtract(net);
			productDelivered.setPurchPriceGross(gross);
			productDelivered.setPurchVatValue(vatValue);
		}
		
		final BigDecimal gross=productDelivered.getSellPriceGross();
    	if(gross!=null && 
    			productDelivered.getProductDeliveredSellPriceRate()!=null){
    		final BigDecimal vat = productDelivered.getProductDeliveredSellPriceRate().getRate();
    		final BigDecimal net1=gross.divide(vat.add(new BigDecimal(1)), 2, RoundingMode.HALF_UP);
    		final BigDecimal vatValue=gross.subtract(net1);
		productDelivered.setSellPriceNet(net1);
		productDelivered.setSellVatValue(vatValue);
    	}
    	
		ProductDelivered result = productDeliveredRepository.save(productDelivered);
		return ResponseEntity.ok()
	            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productDelivered.getId().toString()))
	            .body(result);
	}

	/**
	 * GET /product-delivereds : get all the productDelivereds.
	 *
	 * @param pageable
	 *            the pagination information
	 * @return the ResponseEntity with status 200 (OK) and the list of
	 *         productDelivereds in body
	 */
	@GetMapping("/delivery")
	public synchronized ResponseEntity<List<ProductDelivered>> getAllProductDelivereds(Pageable pageable) {
		log.debug("REST request to get a page of ProductDelivereds");
		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		Page<ProductDelivered> page = productDeliveredRepository.findAllByRestaurant(restaurant, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
		return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
	}

	/**
	 * GET /product-delivereds/:id : get the "id" productDelivered.
	 *
	 * @param id
	 *            the id of the productDelivered to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the
	 *         productDelivered, or with status 404 (Not Found)
	 */
	@GetMapping("/delivery/{id}")
	public synchronized ResponseEntity<ProductDelivered> getProductDelivered(@PathVariable Long id) {
		log.debug("REST request to get ProductDelivered : {}", id);
		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		Optional<ProductDelivered> productDeliveredOptional = productDeliveredRepository.findById(id);
		ProductDelivered productDelivered =productDeliveredOptional.get();
		if (productDelivered.getRestaurant().getId() != restaurant.getId()) {
			log.debug("zła restauracja " + restaurant.getName() + ' ' + productDelivered.getRestaurant().getName());
			productDelivered = null;
		}
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(productDelivered));
	}

	/**
	 * DELETE /product-delivereds/:id : delete the "id" productDelivered.
	 *
	 * @param id
	 *            the id of the productDelivered to delete
	 * @return the ResponseEntity with status 200 (OK)
	 */
	@DeleteMapping("/delivery/{id}")
	public synchronized ResponseEntity<Void> deleteProductDelivered(@PathVariable Long id) {
		log.debug("REST request to delete ProductDelivered : {}", id);
		productDeliveredRepository.deleteById(id);
		  return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
	}

}
