package finbarre.repository;

import finbarre.domain.Category;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import finbarre.domain.Restaurant;


/**
 * Spring Data  repository for the Category entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
	List<Category> findAllByRestaurant(Restaurant restaurant);

	List<Category> findAllByActiveTrueAndRestaurantOrderByName(Restaurant restaurant);

}
