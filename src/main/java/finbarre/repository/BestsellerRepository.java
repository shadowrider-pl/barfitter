package finbarre.repository;

import finbarre.domain.Bestseller;
import finbarre.domain.Restaurant;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Bestseller entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BestsellerRepository extends JpaRepository<Bestseller, Long> {

	List<Bestseller> findAllByRestaurant(Restaurant restaurant);

}
