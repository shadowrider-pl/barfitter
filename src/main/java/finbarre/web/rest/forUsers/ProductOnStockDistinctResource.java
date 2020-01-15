package finbarre.web.rest.forUsers;

import java.util.Comparator;
import java.util.List;
import java.util.TreeSet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.ProductOnStock;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.ProductOnStockRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;

/**
 * REST controller for managing ProductOnStock.
 */
@RestController
@RequestMapping("/api")
public class ProductOnStockDistinctResource {

    private final Logger log = LoggerFactory.getLogger(ProductOnStockDistinctResource.class);
        
    @Autowired
    private ProductOnStockRepository productOnStockRepository;

    @Autowired
    private UserToRestaurantRepository userToRestaurantRepository;
    
    
    
    
    class ProductNameComparator implements Comparator<ProductOnStock>{

		@Override
		public int compare(ProductOnStock o1, ProductOnStock o2) {
			return o1.getProduct().getName().compareTo(o2.getProduct().getName());
		}
    	
    }
    
    
    
    
    /**
     * GET  /product-on-stocks : get all the distinct productOnStocks.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of productOnStocks in body
     */
    @GetMapping("/product-on-stocks-distinct")
    public synchronized TreeSet<ProductOnStock> getDistinctProductOnStocks() {
        log.debug("REST request to get DistinctProductOnStocks");
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        List<ProductOnStock> productOnStocks = productOnStockRepository.findAllByRestaurant(restaurant);
        TreeSet<ProductOnStock> productOnStocksDistinct= new TreeSet<>(new ProductNameComparator());
        productOnStocksDistinct.addAll(productOnStocks);
        
//        log.debug("productOnStocksDistinct: "+productOnStocksDistinct);
        return productOnStocksDistinct;
    }
}
