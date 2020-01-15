package finbarre.web.rest.forUsers;

import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.ProductOnStock;
import finbarre.domain.ProductSold;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.ProductOnStockRepository;
import finbarre.repository.ProductSoldRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import finbarre.service.serviceForUsers.AdditionalHeaderUtil;
import finbarre.service.serviceForUsers.ProductAndHisSubstitute;
import finbarre.web.rest.ProductOnStockResource;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing Substitute.
 */
@RestController
@RequestMapping("/api")
public class SubstituteResource {
	

    private final Logger log = LoggerFactory.getLogger(SubstituteResource.class);
    
    @Autowired
    private ProductSoldRepository productSoldRepository;

    @Autowired
    private UserToRestaurantRepository userToRestaurantRepository;
    
    @Autowired
    private ProductOnStockRepository productOnStockRepository;
    
    @Autowired
    private ProductOnStockResource productOnStockResource;

    

    /**
     * GET  /product-solds/:id : get the "id" productSold.
     *
     * @param id the id of the productSold to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the productSold, or with status 404 (Not Found)
     */
    @GetMapping("/substitutes/{id}")
    public synchronized ResponseEntity<ProductSold> getSubstitute(@PathVariable Long id) {
        log.debug("REST request to get ProductSold : {}", id);
        Optional<ProductSold> productSold = productSoldRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(productSold);
    }
    
    /**
     * GET  /product-solds : get all the Substitutes.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of productSolds in body
     */
    @GetMapping("/substitutes")
    public synchronized List<ProductSold> getAllSubstitutes() {
        log.debug("REST request to get a page of Substitutes");
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        List<ProductSold> substitutes = productSoldRepository.findAllByProductIdAndRestaurant(1L, restaurant);
//        Page<ProductSold> page = productSoldRepository.findAll(pageable);
//        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/product-solds");
        return substitutes;
    }
    

    /**
     * PUT  /product-solds : Updates an existing Substitutes.
     *
     * @param productSold the productSold to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated productSold,
     * or with status 400 (Bad Request) if the productSold is not valid,
     * or with status 500 (Internal Server Error) if the productSold couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/substitutes")
    public synchronized ResponseEntity<ProductSold> updateSubstitute(@Valid @RequestBody ProductAndHisSubstitute productAndHisSubstitute) throws URISyntaxException {
        log.debug("REST request to update Substitutes : {}", productAndHisSubstitute);
//        if (productSold.getId() == null) {
//            return createProductSold(productSold);
//        }
//        ProductSold result = productSoldRepository.save(productSold);
//        productSoldSearchRepository.save(result);
//        return ResponseEntity.ok()
//            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, productSold.getId().toString()))
//            .body(result);
        
        

        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        final ProductOnStock productOnStock=productAndHisSubstitute.getProductOnStock();
        final ProductSold substitute=productAndHisSubstitute.getSubstitute();
		
		substitute.setProduct(productOnStock.getProduct());
		substitute.setDifference(productOnStock.getSellPriceGross().subtract(productOnStock.getSellPriceGross()));
		substitute.setPurchPriceNet(productOnStock.getPurchPriceNet());
		substitute.setProductSoldPurchPriceRate(productOnStock.getProduct().getProductPurchPriceRate());
		substitute.setPurchVatValue(productOnStock.getPurchVatValue());
		substitute.setProductSoldSellPriceRate(productOnStock.getProduct().getProductSellPriceRate());
		substitute.setRestaurant(restaurant);
		final ZonedDateTime orderedTime = productSoldRepository.findById(substitute.getId()).get().getOrderedTime(); //trzeba zamieszać bo czasy nie przechodzą
		substitute.setOrderedTime(orderedTime);
		ResponseEntity<ProductSold> response = null;
		//produkty gotowe
		if(productOnStock.getProduct().getProductType().getId()==1){
			
			final List<ProductOnStock> productOnStockList = productOnStockRepository.findAllByRestaurantAndProductOrderByDeliveryDate(restaurant, productOnStock.getProduct());
		      int countQuantity=0;
		      int orderedQuantity=substitute.getQuantity();
		      
		      for(ProductOnStock pfs : productOnStockList){
		    	  countQuantity=countQuantity+pfs.getQuantity();
		      }
		      
		      //wykonaj tylko jeśli na stanie jest wystarczająca ilość produktów
		      if(orderedQuantity<countQuantity){
		      countQuantity=0;
		      
		      	for(ProductOnStock pfs : productOnStockList){

		      		if(pfs.getQuantity()==null || (orderedQuantity-countQuantity)>=pfs.getQuantity()){
		      			
		      			countQuantity=countQuantity+pfs.getQuantity();
    					productOnStockResource.deleteProductOnStock(pfs.getId());
		      			
		      		} else {
		      			
    					pfs.setQuantity(pfs.getQuantity()-(orderedQuantity-countQuantity));
	    				productOnStockResource.updateProductOnStock(pfs);
	    				break;
		      		}
		      		
		      	}

		      	final ProductSold result = productSoldRepository.save(substitute);
				response = 
						ResponseEntity.ok()
		                .headers(AdditionalHeaderUtil.substituteAuthorizedAlert("productSold", substitute.getId().toString()))
		                .body(result); 	   

		      }
		      else { //niewystarczająca ilość produktów [tłumaczenie insufficientQuantity w global.json]
		    	  response = ResponseEntity.badRequest().headers(BarfitterHeaderUtil.createFailureAlert("productSold", "insufficientQuantity", "A new productSold cannot already have an ID")).body(null);
		      }
		}
		//produkty niegotowe
		else{

	        final ProductSold result = productSoldRepository.save(substitute);
			response = 
					ResponseEntity.ok()
	                .headers(AdditionalHeaderUtil.substituteAuthorizedAlert("productSold", substitute.getId().toString()))
	                .body(result); 
		}
		      
		return response;
    }
}
