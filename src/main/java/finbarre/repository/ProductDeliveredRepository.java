package finbarre.repository;

import finbarre.domain.Product;
import finbarre.domain.ProductDelivered;
import finbarre.domain.Restaurant;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ProductDelivered entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductDeliveredRepository extends JpaRepository<ProductDelivered, Long> {


	List<ProductDelivered> findAllByRestaurant(Restaurant restaurant);

	Page<ProductDelivered> findAllByRestaurant(Restaurant restaurant, Pageable pageable);

	ProductDelivered findOneByProduct(Product product);

}
