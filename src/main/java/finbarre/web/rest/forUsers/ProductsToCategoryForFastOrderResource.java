package finbarre.web.rest.forUsers;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.ProductOnStock;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.ProductOnStockRepository;
//import finbarre.web.rest.ProductsToCategoryResource.ProductOnStockWithOrderedQuantity;
//import finbarre.web.rest.ProductsToCategoryResource.ProductsOfCategoryWithOrderedQuantity;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import finbarre.service.serviceForUsers.ProductOnStockWithOrderedQuantity;
import finbarre.service.serviceForUsers.ProductsOfCategoryWithOrderedQuantity;

/**
 * REST controller for managing ProductsToCategoryForFastOrderResource.
 */
@RestController
@RequestMapping("/api")
public class ProductsToCategoryForFastOrderResource {


	private final Logger log = LoggerFactory.getLogger(ProductsToCategoryForFastOrderResource.class);

	@Autowired
	private ProductOnStockRepository productOnStockRepository;

	@Autowired
	private UserToRestaurantRepository userToRestaurantRepository;

	private ProductOnStockWithOrderedQuantity temp;
	private int tempQuantity = 0;
	private int listSize;
	private Long index;
	
    /**
     * GET  /products-to-category-for-fast-order/:id : get the "id" products-to-category-for-fast-order.
     *
     * @param id the id of the products-to-category-for-fast-order to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the products-to-category-for-fast-order, or with status 404 (Not Found)
     */
    @GetMapping("/products-to-category-for-fast-order/{id}")
    public synchronized ProductsOfCategoryWithOrderedQuantity getProductToCategoryWithOrderedQuantityForFastOrder(@PathVariable Long id) {
        log.debug("REST request to get products-to-category-for-fast-order : {}", id);
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        ProductsOfCategoryWithOrderedQuantity pocwoq = new ProductsOfCategoryWithOrderedQuantity();
        List<ProductOnStockWithOrderedQuantity> productsOfCategory = new ArrayList<>();
        final Long readyProductTypeId = Long.valueOf(2);
		List<ProductOnStock> productOnStocks = 
				productOnStockRepository.findByRestaurantAndProductCategoryIdAndProductProductTypeIdNotOrderByProductNameAscId(restaurant, id, readyProductTypeId);
//		log.debug("findAllByCategoryIdOrderByProductName(id).size()"+productOnStocks.size());
		for(ProductOnStock pos:productOnStocks){
	        ProductOnStockWithOrderedQuantity poswoq=new ProductOnStockWithOrderedQuantity();
			poswoq.setOrderedQuantity(0);
			poswoq.setQuantity(pos.getQuantity());
			poswoq.setId(pos.getId());
			poswoq.setDeliveryDate(pos.getDeliveryDate());
			poswoq.setProduct(pos.getProduct());
			poswoq.setPurchPriceGross(pos.getPurchPriceGross());
			poswoq.setPurchPriceNet(pos.getPurchPriceGross());
			poswoq.setPurchVatValue(pos.getPurchVatValue());
			poswoq.setSellPriceGross(pos.getSellPriceGross());
			poswoq.setSellPriceNet(pos.getSellPriceNet());
			poswoq.setSellVatValue(pos.getSellVatValue());
			productsOfCategory.add(poswoq);
		}

//		log.debug("ProductsOfCategory.size() "+ProductsOfCategory.size());
//		log.debug("findProductsOfCategory(ProductsOfCategory.size()) "+findProductsOfCategory(ProductsOfCategory).size());
		pocwoq.setProductsOfCategory(findProductsOfCategory(productsOfCategory));

//		log.debug("productOnStocks2.size(): " + pocwoq.getProductsOfCategory().size()); 
		return pocwoq;
		
    }
    

    private synchronized List<ProductOnStockWithOrderedQuantity> findProductsOfCategory(List<ProductOnStockWithOrderedQuantity> entryList){

    	listSize = entryList.size();
		List<ProductOnStockWithOrderedQuantity> Stock = new ArrayList<ProductOnStockWithOrderedQuantity>();
		index=0L;
		tempQuantity = 0;
		temp=null;

		for (ProductOnStockWithOrderedQuantity pos : entryList) {
			index++;
//			log.debug("*");
//			log.debug("index: "+index+", pos.getProduct().getName(): "+pos.getProduct().getName());
			
			if (temp == null) {
//				log.debug("1****1 " + pos.getProduct().getName());
				temp = pos;
//				temp.setId(index);
//				log.debug("listSize: " + listSize);
//				log.debug("* "+tempQuantity+" temp.getQuantity(): "+temp.getQuantity());
//				log.debug("*pos.getProduct().getId(): " + pos.getProduct().getId());
			} else {
				

//				log.debug("#temp.getId(index): " + temp.getId()+" pos.getProduct().getId()"+pos.getProduct().getId());
//				log.debug("#pos.getProduct().getId(): " + pos.getProduct().getId()+" pos.getProduct().getId()"+pos.getProduct().getId());

				if (!(pos.getProduct().getId() == (temp.getProduct().getId()))) {
//					log.debug("** "+tempQuantity+" temp.getQuantity(): "+temp.getQuantity());
//					log.debug("** " + temp.getProduct().getName());
					Stock.add(temp);
					temp = pos;
					temp.setId(index);
					tempQuantity = 0;

				} else {
					tempQuantity=temp.getQuantity()+pos.getQuantity();
					temp.setQuantity(tempQuantity);
//					log.debug("*** "+tempQuantity+" temp.getQuantity(): "+temp.getQuantity());
				}

				
			}

			if (index == listSize) {
				temp.setId(index);
				Stock.add(temp);
//				log.debug("**** "+tempQuantity+" temp.getQuantity(): "+temp.getQuantity());
//				log.debug("**** "+"temp.getId(index): " + temp.getId());
//				log.debug("**** " + temp.getProduct().getName());
			}
		}

//		log.debug("Stock.size(): " + Stock.size()); 
		return Stock;		
    }
}
