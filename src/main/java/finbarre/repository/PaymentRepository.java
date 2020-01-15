package finbarre.repository;

import finbarre.domain.Payment;
import finbarre.domain.Restaurant;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Payment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

	List<Payment> findAllByRestaurant(Restaurant restaurant);

	Payment findOneById(long l);

	List<Payment> findAllByActiveTrueAndRestaurant(Restaurant restaurant);

}
