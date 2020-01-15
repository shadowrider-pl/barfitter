package finbarre.repository;

import finbarre.domain.OrderedProductStatus;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the OrderedProductStatus entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderedProductStatusRepository extends JpaRepository<OrderedProductStatus, Long> {

}
