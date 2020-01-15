package finbarre.repository;

import finbarre.domain.Cashup;
import finbarre.domain.Restaurant;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import java.time.ZonedDateTime;
import java.util.List;


/**
 * Spring Data  repository for the Cashup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CashupRepository extends JpaRepository<Cashup, Long> {

    @Query("select cashup from Cashup cashup where cashup.cashupUser.login = ?#{principal.username}")
    List<Cashup> findByCashupUserIsCurrentUser();

    @Query("select cashup from Cashup cashup where cashup.openingUser.login = ?#{principal.username}")
    List<Cashup> findByOpeningUserIsCurrentUser();

    Cashup findFirstByRestaurantOrderByIdDesc(Restaurant restaurant);

	//SELECT * FROM  cashup WHERE cashup.restaurant=1 AND cashup.barman_login_time in (select DISTINCT max(cashup.barman_login_time) from  cashup GROUP BY YEAR(cashup.barman_login_time), MONTH(cashup.barman_login_time)) ORDER BY cashup.barman_login_time DESC
	@Query("SELECT cashup FROM Cashup cashup WHERE cashup.restaurant=?1 AND cashup.barmanLoginTime in (select DISTINCT max(cashup.barmanLoginTime) from Cashup cashup GROUP BY YEAR(cashup.barmanLoginTime), MONTH(cashup.barmanLoginTime)) ORDER BY cashup.barmanLoginTime DESC")
	List<Cashup> findAllByBarmanLoginTime(Restaurant restaurant);

	List<Cashup> findByRestaurantAndBarmanLoginTimeBetween(Restaurant restaurant, ZonedDateTime start,
			ZonedDateTime end);

	List<Cashup> findAllByRestaurantOrderByBarmanLoginTimeDesc(Restaurant restaurant);

	List<Cashup> findAllByRestaurant(Restaurant restaurant);


}
