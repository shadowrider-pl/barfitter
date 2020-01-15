package finbarre.web.rest.forUsers;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.ProductOnStock;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.ProductOnStockRepository;
import finbarre.repository.ProductRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import finbarre.service.serviceForUsers.ProductOnStockWithOrderedQuantity;
import finbarre.service.serviceForUsers.ProductsOfCategoryWithOrderedQuantity;
import finbarre.web.rest.forUsers.active.ActiveProducts;

/**
 * REST controller for managing ProductsOfCategory.
 */
@RestController
@RequestMapping("/api")
public class ProductsOfCategoryResource {


    private final Logger log = LoggerFactory.getLogger(ActiveProducts.class);

    private static final String ENTITY_NAME = "product";

    private final ProductRepository productRepository;

    private final UserToRestaurantRepository userToRestaurantRepository;
    private final ProductOnStockRepository productOnStockRepository;
	private ProductOnStockWithOrderedQuantity temp;
	private int tempQuantity = 0;
	private int listSize;
	private Long index;

    public ProductsOfCategoryResource(
    		ProductRepository productRepository, 
    		UserToRestaurantRepository userToRestaurantRepository,
    		ProductOnStockRepository productOnStockRepository) {
        this.productRepository = productRepository;
        this.userToRestaurantRepository=userToRestaurantRepository;
        this.productOnStockRepository=productOnStockRepository;
    }

    /**
     * GET  /products : get all the products.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of products in body
     */
    @GetMapping("/products-of-category/{id}")
    public synchronized ProductsOfCategoryWithOrderedQuantity getProductToCategoryWithOrderedQuantity(@PathVariable Long id) {
//        log.debug("REST request to get a page of Active Products Of Category");
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
//        List<Product> products = productRepository.findAllByActiveTrueAndRestaurantAndCategoryId(restaurant, id);
//        return products;
        
        log.debug("REST request to get products-to-category : {}", id);
        ProductsOfCategoryWithOrderedQuantity pocwoq = new ProductsOfCategoryWithOrderedQuantity();
        List<ProductOnStockWithOrderedQuantity> productsOfCategory = new ArrayList<>();

		List<ProductOnStock> productOnStocks = productOnStockRepository.findAllByRestaurantAndProductCategoryIdOrderByProductNameAscId(restaurant, id);
		log.debug("findAllByCategoryIdOrderByProductName(id).size() "+productOnStocks.size()+ " restaurant: "+restaurant.getName());
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

//		log.debug("productOnStocks2.size(): " + productOnStocks.size()); 
		return pocwoq;
		
    }
    

    private synchronized List<ProductOnStockWithOrderedQuantity> findProductsOfCategory(List<ProductOnStockWithOrderedQuantity> entryList){

    	listSize = entryList.size();
		List<ProductOnStockWithOrderedQuantity> Stock = new ArrayList<ProductOnStockWithOrderedQuantity>();
		index=0L;
		tempQuantity = 0;
		temp=null;

//		for (ProductOnStockWithOrderedQuantity pos : entryList) {
//			log.debug("@pos.getProduct().getName(): " + pos.getProduct().getName());
//		}
		
		for (ProductOnStockWithOrderedQuantity pos : entryList) {
			index++;
//			log.debug("*");
//			log.debug("index: "+index+", pos.getProduct().getName(): "+pos.getProduct().getName());
			
			if (temp == null) { 
//				log.debug("1****1 pierwszy produkt z listy " + pos.getProduct().getName());
				temp = pos;
//				temp.setId(index);
//				log.debug("listSize: " + listSize);
//				log.debug("* "+tempQuantity+" temp.getQuantity(): "+temp.getQuantity());
//				log.debug("*pos.getProduct().getId(): " + pos.getProduct().getId());
			} else {
				

//				log.debug("#temp.getId(): " + temp.getId()+" pos.getProduct().getId()"+pos.getProduct().getId());

				if (!(pos.getProduct().getId() == (temp.getProduct().getId()))) {
//					log.debug("** tempQuantity"+tempQuantity+" temp.getQuantity(): "+temp.getQuantity());
//					log.debug("** temp.getProduct()" + temp.getProduct().getName());
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
    


    /**
     * GET  /desks : get all the desks.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of desks in body
     */
    @GetMapping("/products-of-category")
    public ProductsOfCategoryWithOrderedQuantity getAllDesks() {
        log.debug("REST request to get ProductsOfCategory with no id");
        return null;
    }

}
