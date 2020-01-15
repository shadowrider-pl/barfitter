package finbarre.web.rest.forUsers;

import java.net.URISyntaxException;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.Cashup;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.CashupRepository;
import finbarre.repository.UserRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import finbarre.service.serviceForUsers.AdditionalHeaderUtil;
import finbarre.web.rest.CashupResource;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing TakeCash.
 */
@RestController
@RequestMapping("/api")
public class TakeCashResource {

	private final Logger log = LoggerFactory.getLogger(CashupResource.class);

	private static final String ENTITY_NAME = "cashup";

	private final CashupRepository cashupRepository;
	// fu
	private final UserToRestaurantRepository userToRestaurantRepository;

	private final UserRepository userRepository;

	public TakeCashResource(UserRepository userRepository, CashupRepository cashupRepository,
			UserToRestaurantRepository userToRestaurantRepository) {
		this.cashupRepository = cashupRepository;
		this.userToRestaurantRepository = userToRestaurantRepository;
		this.userRepository = userRepository;
	}

	/**
	 * PUT /take-cash : Updates an existing cashup.
	 *
	 * @param cashup
	 *            the cashup to update
	 * @return the ResponseEntity with status 200 (OK) and with body the updated
	 *         cashup, or with status 400 (Bad Request) if the cashup is not
	 *         valid, or with status 500 (Internal Server Error) if the cashup
	 *         couldn't be updated
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PutMapping("/take-cash")
	public synchronized ResponseEntity<Cashup> updateCashupTakeCash(@Valid @RequestBody Cashup cashup) throws URISyntaxException {
		log.debug("REST request to take cash : {}", cashup);
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		if(cashup.getRestaurant().getId()!=restaurant.getId()) {
			cashup=null;
		}
		final Cashup result = cashupRepository.save(cashup);
		return ResponseEntity.ok()
				.headers(AdditionalHeaderUtil.cashTakenAlert(ENTITY_NAME, cashup.getId().toString())).body(result);
	}

	/**
	 * GET /cashups/:id : get the "id" cashup.
	 *
	 * @param id
	 *            the id of the cashup to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the cashup,
	 *         or with status 404 (Not Found)
	 */
	@GetMapping("/take-cash")
	public synchronized ResponseEntity<Cashup> getLastCashup() {
		log.debug("REST request to get LastCashup : {}");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		Cashup lastCashup = cashupRepository.findFirstByRestaurantOrderByIdDesc(restaurant);
		 if(lastCashup==null){
		 final Cashup firstCashup = new Cashup();
		 firstCashup.comment("**********");
		 lastCashup= firstCashup;
		 }
//		 log.debug("lastCashup.getComment: "+lastCashup.getComment());
		return ResponseUtil.wrapOrNotFound(Optional.ofNullable(lastCashup));
	}
}
