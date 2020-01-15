package finbarre.web.rest.forUsers;

import java.net.URI;
import java.net.URISyntaxException;
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

import finbarre.domain.Desk;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.DeskRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import finbarre.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing Desk.
 */
@RestController
@RequestMapping("/api")
public class DeskResourceFU {

	private final Logger log = LoggerFactory.getLogger(DeskResourceFU.class);

	private static final String ENTITY_NAME = "desk";

	@Value("${jhipster.clientApp.name}")
	private String applicationName;

	private final DeskRepository deskRepository;

	// fu
	private final UserToRestaurantRepository userToRestaurantRepository;

	public DeskResourceFU(DeskRepository deskRepository, UserToRestaurantRepository userToRestaurantRepository) {
		this.deskRepository = deskRepository;
		// fu
		this.userToRestaurantRepository = userToRestaurantRepository;
	}

	/**
	 * POST /desksfu : Create a new desk.
	 *
	 * @param desk the desk to create
	 * @return the ResponseEntity with status 201 (Created) and with body the new
	 *         desk, or with status 400 (Bad Request) if the desk has already an ID
	 * @throws URISyntaxException if the Location URI syntax is incorrect
	 */
	@PostMapping("/desksfu")
	public synchronized ResponseEntity<Desk> createDesk(@Valid @RequestBody Desk desk) throws URISyntaxException {
		log.debug("REST request to save Desk : {}", desk);

		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		desk.setRestaurant(restaurant);

		if (desk.getId() != null) {
			throw new BadRequestAlertException("A new desk cannot already have an ID", ENTITY_NAME, "idexists");
		}
		Desk result = deskRepository.save(desk);
		return ResponseEntity
				.created(new URI("/api/desksfu/" + result.getId())).headers(HeaderUtil
						.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
				.body(result);
	}

	/**
	 * PUT /desksfu : Updates an existing desk.
	 *
	 * @param desk the desk to update
	 * @return the ResponseEntity with status 200 (OK) and with body the updated
	 *         desk, or with status 400 (Bad Request) if the desk is not valid, or
	 *         with status 500 (Internal Server Error) if the desk couldn't be
	 *         updated
	 * @throws URISyntaxException if the Location URI syntax is incorrect
	 */
	@PutMapping("/desksfu")
	public synchronized ResponseEntity<Desk> updateDesk(@Valid @RequestBody Desk desk) throws URISyntaxException {
		log.debug("REST request to update Desk : {}", desk);
		if (desk.getId() == null) {
			return createDesk(desk);
		}
		Desk result = deskRepository.save(desk);
		return ResponseEntity.ok()
				.headers(
						HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, desk.getId().toString()))
				.body(result);
	}

	/**
	 * GET /desksfu : get all the desks.
	 *
	 * @param pageable the pagination information
	 * @return the ResponseEntity with status 200 (OK) and the list of desks in body
	 */
	@GetMapping("/desksfu")
	public synchronized List<Desk> getAllDesks() {
		log.debug("REST request to get a all Desks");
		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();

		return deskRepository.findAllByRestaurant(restaurant);
	}

	/**
	 * GET /desksfu/:id : get the "id" desk.
	 *
	 * @param id the id of the desk to retrieve
	 * @return the ResponseEntity with status 200 (OK) and with body the desk, or
	 *         with status 404 (Not Found)
	 */
	@GetMapping("/desksfu/{id}")
	public synchronized ResponseEntity<Desk> getDesk(@PathVariable Long id) {
		log.debug("REST request to get Desk : {}", id);
		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		Optional<Desk> desk = deskRepository.findById(id);
		if (desk != null && desk.get().getRestaurant().getId() != restaurant.getId()) {
			log.debug("zła restauracja " + restaurant.getName() + ' ' + desk.get().getRestaurant().getName());
			desk = null;
		}
		return ResponseUtil.wrapOrNotFound(desk);
	}

	/**
	 * DELETE /desksfu/:id : delete the "id" desk.
	 *
	 * @param id the id of the desk to delete
	 * @return the ResponseEntity with status 200 (OK)
	 */
	@DeleteMapping("/desksfu/{id}")
	public synchronized ResponseEntity<Void> deleteDesk(@PathVariable Long id) {
		log.debug("REST request to delete Desk : {}", id);
		deskRepository.deleteById(id);
		return ResponseEntity.noContent()
				.headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
				.build();
	}

}
