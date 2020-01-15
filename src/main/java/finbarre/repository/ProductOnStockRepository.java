package finbarre.repository;

import finbarre.domain.Product;
import finbarre.domain.ProductOnStock;
import finbarre.domain.Restaurant;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ProductOnStock entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductOnStockRepository extends JpaRepository<ProductOnStock, Long> {

	List<ProductOnStock> findByProductId(Long productId);

	ProductOnStock findOneById(Long foundProductOnStockId);

	List<ProductOnStock> findAllByRestaurantAndProductCategoryIdOrderByProductNameAscId(Restaurant restaurant, Long id);

	List<ProductOnStock> findAllByRestaurant(Restaurant restaurant);

	List<ProductOnStock> findAllByRestaurantAndProductProductTypeIdOrderByProductNameAscId(Restaurant restaurant,
			Long readyProductTypeId);

	List<ProductOnStock> findAllByProduct(Product product);

	List<ProductOnStock> findByRestaurantAndProductCategoryIdAndProductProductTypeIdNotOrderByProductNameAscId(
			Restaurant restaurant, Long id, Long readyProductTypeId);

//	List<ProductOnStock> findAllByRestaurantProductOrderByDeliveryDate(Restaurant restaurant, Product product);

	List<ProductOnStock> findAllByRestaurantAndProductOrderByDeliveryDate(Restaurant restaurant, Product product);


}
