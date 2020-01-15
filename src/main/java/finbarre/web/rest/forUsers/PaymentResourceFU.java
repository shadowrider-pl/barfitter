package finbarre.web.rest.forUsers;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.Payment;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.PaymentRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import finbarre.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing Payment.
 */
@RestController
@RequestMapping("/api")
public class PaymentResourceFU {

    private final Logger log = LoggerFactory.getLogger(PaymentResourceFU.class);

    private static final String ENTITY_NAME = "payment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PaymentRepository paymentRepository;
    
    //fu
    private final UserToRestaurantRepository userToRestaurantRepository;

    public PaymentResourceFU(PaymentRepository paymentRepository, UserToRestaurantRepository userToRestaurantRepository) {
        this.paymentRepository = paymentRepository;
        
        //fu
        this.userToRestaurantRepository=userToRestaurantRepository;
    }

    /**
     * POST  /paymentsfu : Create a new payment.
     *
     * @param payment the payment to create
     * @return the ResponseEntity with status 201 (Created) and with body the new payment, or with status 400 (Bad Request) if the payment has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/paymentsfu")
    public synchronized ResponseEntity<Payment> createPayment(@Valid @RequestBody Payment payment) throws URISyntaxException {
        log.debug("REST request to save Payment : {}", payment);
        
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        payment.setRestaurant(restaurant);
        if (payment.getId() != null) {
            throw new BadRequestAlertException("A new payment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Payment result = paymentRepository.save(payment);
        return ResponseEntity.created(new URI("/api/paymentsfu/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                .body(result);
    }

    /**
     * PUT  /paymentsfu : Updates an existing payment.
     *
     * @param payment the payment to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated payment,
     * or with status 400 (Bad Request) if the payment is not valid,
     * or with status 500 (Internal Server Error) if the payment couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/paymentsfu")
    public synchronized ResponseEntity<Payment> updatePayment(@Valid @RequestBody Payment payment) throws URISyntaxException {
        log.debug("REST request to update Payment : {}", payment);
        if (payment.getId() == null) {
            return createPayment(payment);
        }
        Payment result = paymentRepository.save(payment);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, payment.getId().toString()))
                .body(result);
    }

    /**
     * GET  /paymentsfu : get all the payments.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of payments in body
     */
    @GetMapping("/paymentsfu")
    public synchronized List<Payment> getAllPayments() {
        log.debug("REST request to get a page of Payments");
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        List<Payment> payments = new ArrayList<Payment>();
        payments.add(paymentRepository.findOneById(1L));
        payments.add(paymentRepository.findOneById(2L));
        payments.addAll(paymentRepository.findAllByRestaurant(restaurant));
        return payments;
    }
    
    /**
     * GET  /paymentsfu/:id : get the "id" payment.
     *
     * @param id the id of the payment to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the payment, or with status 404 (Not Found)
     */
    @GetMapping("/paymentsfu/{id}")
    public synchronized ResponseEntity<Payment> getPayment(@PathVariable Long id) {
        log.debug("REST request to get Payment : {}", id);
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        Payment payment = paymentRepository.findOneById(id);
    	if(payment.getRestaurant().getId()!=restaurant.getId()){
    		log.debug("zła restauracja "+restaurant.getName() + ' ' + payment.getRestaurant().getName());
    		payment=null;
    	}
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(payment));
    }

    /**
     * DELETE  /paymentsfu/:id : delete the "id" payment.
     *
     * @param id the id of the payment to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/paymentsfu/{id}")
    public synchronized ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        log.debug("REST request to delete Payment : {}", id);
        paymentRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil
        		.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

}
