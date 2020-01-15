package finbarre.web.rest.forUsers.active;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.Payment;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.PaymentRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;

/**
 * REST controller for managing Payment.
 */
@RestController
@RequestMapping("/api")
public class ActivePayments {

    private final Logger log = LoggerFactory.getLogger(ActivePayments.class);

    private final PaymentRepository paymentRepository;
    private final UserToRestaurantRepository userToRestaurantRepository;

    public ActivePayments(PaymentRepository paymentRepository,
    		UserToRestaurantRepository userToRestaurantRepository) {
        this.paymentRepository = paymentRepository;
        this.userToRestaurantRepository=userToRestaurantRepository;
    }

    /**
     * GET  /payments : get all the payments.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of payments in body
     */
    @GetMapping("/active-payments")
    public synchronized List<Payment> getAllPayments() {
        log.debug("REST request to get a page of Payments");
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        List<Payment> payments = new ArrayList<Payment>();
        payments.add(paymentRepository.findOneById(1L));
        payments.add(paymentRepository.findOneById(2L));
        payments.addAll(paymentRepository.findAllByActiveTrueAndRestaurant(restaurant));
        return payments;
    }


}
