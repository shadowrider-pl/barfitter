package finbarre.repository;

import finbarre.domain.Product;
import finbarre.domain.ProductOrdered;
import finbarre.domain.Restaurant;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the ProductOrdered entity.
 */
@SuppressWarnings("unused")
@Repository
    public interface ProductOrderedRepository extends JpaRepository<ProductOrdered, Long> {

        @Query("select product_ordered from ProductOrdered product_ordered where product_ordered.chef.login = ?#{principal.username}")
        List<ProductOrdered> findByChefIsCurrentUser();

        List<ProductOrdered> findAllByRestaurantAndOrderId(Restaurant restaurant, Long id);

        ProductOrdered findTopByOrderIdOrderByIdDesc(Long id);

        List<ProductOrdered> findByRestaurantAndOrderedProductStatusIdIn(Restaurant restaurant, List<Long> statusList);

        ProductOrdered findOneByProduct(Product product);
        
        Long countByRestaurantAndOrderedProductStatusId(Restaurant restaurant, Long status);

		List<ProductOrdered> findAllByRestaurant(Restaurant restaurant);


}
