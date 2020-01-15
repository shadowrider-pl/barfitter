package finbarre.repository;

import finbarre.domain.OrderOpened;
import finbarre.domain.Restaurant;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the OrderOpened entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderOpenedRepository extends JpaRepository<OrderOpened, Long> {

    @Query("select order_opened from OrderOpened order_opened where order_opened.barman.login = ?#{principal.username}")
    List<OrderOpened> findByBarmanIsCurrentUser();

	List<OrderOpened> findAllByRestaurant(Restaurant restaurant);

	OrderOpened findFirstByRestaurantOrderByIdDesc(Restaurant restaurant);

	OrderOpened findFirstByRestaurantOrderByOrderIdDesc(Restaurant restaurant);

	List<OrderOpened> findByRestaurantAndDeskId(Restaurant restaurant, Long id);


}
