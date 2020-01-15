package finbarre.repository;

import finbarre.domain.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import finbarre.domain.Vat;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Vat entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VatRepository extends JpaRepository<Vat, Long> {

//	@Query("select vat from Vat vat where ")
	Page<Vat> findAllByRestaurant(Restaurant restaurant, Pageable pageable);

	List<Vat> findAllByActiveTrueAndRestaurant(Restaurant restaurant);

	List<Vat> findAllByRestaurant(Restaurant restaurant);


}
