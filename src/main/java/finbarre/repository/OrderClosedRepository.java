package finbarre.repository;

import finbarre.domain.Cashup;
import finbarre.domain.OrderClosed;
import finbarre.domain.Restaurant;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the OrderClosed entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderClosedRepository extends JpaRepository<OrderClosed, Long> {

    @Query("select order_closed from OrderClosed order_closed where order_closed.barman.login = ?#{principal.username}")
    List<OrderClosed> findByBarmanIsCurrentUser();

	OrderClosed findFirstByRestaurantOrderByIdDesc(Restaurant restaurant);

	OrderClosed findFirstByRestaurantOrderByOrderIdDesc(Restaurant restaurant);

	List<OrderClosed> findAllByRestaurantAndCashupDayOrderByOrderId(Restaurant restaurant, Cashup lastCashup);

	List<OrderClosed> findAllByCashupDay(Cashup cashup);

	List<OrderClosed> findAllByRestaurant(Restaurant restaurant);

}
