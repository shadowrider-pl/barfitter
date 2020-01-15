package finbarre.web.rest.forUsers;

import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.Cashup;
import finbarre.domain.Payment;
import finbarre.domain.PaymentToCashup;
import finbarre.domain.Restaurant;
import finbarre.domain.User;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.CashupRepository;
import finbarre.repository.PaymentRepository;
import finbarre.repository.PaymentToCashupRepository;
import finbarre.repository.UserRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import finbarre.service.serviceForUsers.OrderClosedWithProducts;
import finbarre.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing Cashup.
 */
@RestController
@RequestMapping("/api")
public class NewDayResource {

    private final Logger log = LoggerFactory.getLogger(NewDayResource.class);

    private static final String ENTITY_NAME = "cashup";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CashupRepository cashupRepository;
    
    //fu
    private final UserToRestaurantRepository userToRestaurantRepository;

    private final UserRepository userRepository;

	private final PaymentToCashupRepository paymentToCashupRepository;

	private final PaymentRepository paymentRepository;

    @Autowired
    private TodaysOrdersResource todaysOrdersResource;

    public NewDayResource(
    		CashupRepository cashupRepository, 
    		UserToRestaurantRepository userToRestaurantRepository,
    		UserRepository userRepository,
    		PaymentToCashupRepository paymentToCashupRepository,
    		PaymentRepository paymentRepository) {
        this.cashupRepository = cashupRepository;
        this.userToRestaurantRepository = userToRestaurantRepository;
        this.userRepository = userRepository;
        this.paymentToCashupRepository = paymentToCashupRepository;
        this.paymentRepository = paymentRepository;
    }

    /**
     * POST  /cashups : Create a new cashup.
     *
     * @param cashup the cashup to create
     * @return the ResponseEntity with status 201 (Created) and with body the new cashup, or with status 400 (Bad Request) if the cashup has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/new-day")
    public synchronized ResponseEntity<Cashup> createCashup(@Valid @RequestBody Cashup cashup) throws URISyntaxException {
        log.debug("REST request to save Cashup : {}", cashup);
        
        //fu
        final String userStr =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(userStr);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        cashup.setRestaurant(restaurant);
        if (cashup.getId() != null) {
            throw new BadRequestAlertException("A new cashup cannot already have an ID", ENTITY_NAME, "idexists");
        }
//        cashup.setBarmanLoginTime(ZonedDateTime.now(ZoneId.systemDefault()));
        final User user=userRepository.findOneByLogin(getCurrentUserLogin()).get();
        cashup.setOpeningUser(user);
//        Cashup lastCashup = cashupRepository.findFirstByRestaurantOrderByIdDesc(restaurant);
//        if(lastCashup.getEndCash()==null){
//            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("cashup", "idexists", "Do cashup first")).body(null);
//        }
        
        Cashup result = cashupRepository.save(cashup);
        return ResponseEntity.created(new URI("/api/home/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                .body(result);
    }

    /**
     * PUT  /cashups : Updates an existing cashup.
     *
     * @param cashup the cashup to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated cashup,
     * or with status 400 (Bad Request) if the cashup is not valid,
     * or with status 500 (Internal Server Error) if the cashup couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/new-day")
    public synchronized ResponseEntity<Cashup> updateCashup(@Valid @RequestBody Cashup cashup) throws URISyntaxException {
        log.debug("REST request to update Cashup : {}", cashup);
        if (cashup.getId() == null) {
            return createCashup(cashup);
        }
        cashup.setCashupTime(ZonedDateTime.now(ZoneId.systemDefault()));
        final User user=userRepository.findOneByLogin(getCurrentUserLogin()).get();
        cashup.setCashupUser(user);
        Cashup result = cashupRepository.save(cashup);
        	
        	//usuń paymentToCashups jeśli już były zapisane.
        	List<PaymentToCashup> paymentToCashupsToDelete = new ArrayList<>();
        	paymentToCashupsToDelete=paymentToCashupRepository.findByCashup(cashup);
        		for(PaymentToCashup paymentToCashupToDelete : paymentToCashupsToDelete){
        	        paymentToCashupRepository.delete(paymentToCashupToDelete);
        		}
        	
        	
        List<Payment> payments = new ArrayList<>();
        payments = paymentRepository.findAll();
        List<OrderClosedWithProducts> todaysOrders = new ArrayList<>();
        todaysOrders = todaysOrdersResource.getTodaysOrders();
        	
        	for(Payment payment: payments){
        		PaymentToCashup paymentToCashup = new PaymentToCashup();
        		paymentToCashup.setPayment(payment);
        		paymentToCashup.setCashup(cashup);
        		BigDecimal total=new BigDecimal(0);
        		for(OrderClosedWithProducts orderClosedWithProducts: todaysOrders){
        			if(orderClosedWithProducts.getPayment().equals(payment) && orderClosedWithProducts.getTotal() != null){
        				total=total.add(orderClosedWithProducts.getTotal());
        			}
        		}
        		paymentToCashup.setTotalPayment(total);     		
        		
        		if(!(total.equals(new BigDecimal(0)))){
        			PaymentToCashup paymentToCashupResult = paymentToCashupRepository.save(paymentToCashup);
        		}
        	}
        
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cashup.getId().toString()))
                .body(result);
    }

    /**
     * GET  /cashups/:id : get the "id" cashup.
     *
     * @param id the id of the cashup to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the cashup, or with status 404 (Not Found)
     */
    @GetMapping("/new-day")
    public synchronized ResponseEntity<Cashup> getLastCashup() {
        log.debug("REST request to get LastCashup : {}");
        //fu
        final String userStr =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(userStr);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        Cashup lastCashup = cashupRepository.findFirstByRestaurantOrderByIdDesc(restaurant);
        if(lastCashup==null){
        	final Cashup firstCashup = new Cashup();
        	firstCashup.comment("**********");
        	lastCashup= firstCashup;
        }
//        log.debug("lastCashup.getComment: "+lastCashup.getComment());
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(lastCashup));
    }

	private String getCurrentUserLogin() {
        org.springframework.security.core.context.SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        String login = null;
        if (authentication != null)
            if (authentication.getPrincipal() instanceof UserDetails)
            	login = ((UserDetails) authentication.getPrincipal()).getUsername();
            else if (authentication.getPrincipal() instanceof String)
            	login = (String) authentication.getPrincipal();
        
        return login; 
        
	}

}
