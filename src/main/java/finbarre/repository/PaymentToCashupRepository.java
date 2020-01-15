package finbarre.repository;

import finbarre.domain.Cashup;
import finbarre.domain.Payment;
import finbarre.domain.PaymentToCashup;
import finbarre.domain.Restaurant;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the PaymentToCashup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PaymentToCashupRepository extends JpaRepository<PaymentToCashup, Long> {

	List<PaymentToCashup> findByCashup(Cashup cashup);

	List<PaymentToCashup> findAllByCashup(Cashup cashup);

}
