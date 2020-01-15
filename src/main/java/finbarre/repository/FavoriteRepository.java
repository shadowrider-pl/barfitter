package finbarre.repository;

import finbarre.domain.Favorite;
import finbarre.domain.Restaurant;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


/**
 * Spring Data  repository for the Favorite entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

	Page<Favorite> findAllByRestaurantId(Long restaurantId, Pageable pageable);

	List<Favorite> findAllByRestaurant(Restaurant restaurant);

}
