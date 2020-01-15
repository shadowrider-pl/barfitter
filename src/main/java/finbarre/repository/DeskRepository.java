package finbarre.repository;

import finbarre.domain.Desk;
import finbarre.domain.Restaurant;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Desk entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DeskRepository extends JpaRepository<Desk, Long> {

	List<Desk> findAllByActiveTrueAndRestaurant(Restaurant restaurant);

	List<Desk> findAllByRestaurant(Restaurant restaurant);

}
