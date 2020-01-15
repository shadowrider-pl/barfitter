package finbarre.repository;

import finbarre.domain.Product;
import finbarre.domain.Restaurant;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Product entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

	Product findOneByName(String name);
	Product findOneByNameAndRestaurant(String name, Restaurant restaurant);

	List<Product> findAllByActiveTrueAndRestaurantAndProductTypeIdOrderByNameAsc(Restaurant restaurant,
			Long productTypeId);

	List<Product> findAllByActiveTrueAndRestaurantOrderByName(Restaurant restaurant);

	List<Product> findAllByRestaurantAndProductTypeIdAndIdNotInOrderByName(Restaurant restaurant,
			Long readyProductTypeId, List<Long> productIds);

	List<Product> findAllByRestaurant(Restaurant restaurant);

}
