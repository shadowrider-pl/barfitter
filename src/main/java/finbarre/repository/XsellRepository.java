package finbarre.repository;

import finbarre.domain.Xsell;
import finbarre.domain.Restaurant;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Xsell entity.
 */
@SuppressWarnings("unused")
@Repository
public interface XsellRepository extends JpaRepository<Xsell, Long> {
	Page<Xsell> findAllByRestaurant(Restaurant restaurant, Pageable pageable);

	List<Xsell> findAllByRestaurant(Restaurant restaurant);


}
