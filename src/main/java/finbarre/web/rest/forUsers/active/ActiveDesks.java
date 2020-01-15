package finbarre.web.rest.forUsers.active;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.Desk;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.DeskRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;

/**
 * REST controller for managing Desk.
 */
@RestController
@RequestMapping("/api")
public class ActiveDesks {

    private final Logger log = LoggerFactory.getLogger(ActiveDesks.class);

    private static final String ENTITY_NAME = "desk";

    private final DeskRepository deskRepository;

    private final UserToRestaurantRepository userToRestaurantRepository;

    public ActiveDesks(DeskRepository deskRepository,
    		UserToRestaurantRepository userToRestaurantRepository) {
        this.deskRepository = deskRepository;
        this.userToRestaurantRepository=userToRestaurantRepository;
    }

    /**
     * GET  /desks : get all the desks.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of desks in body
     */
    @GetMapping("/active-desks")
    public synchronized List<Desk> getAllDesks() {
        log.debug("REST request to get active- Desks");
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        List<Desk> desks = deskRepository.findAllByActiveTrueAndRestaurant(restaurant);
        return desks;
    }

}
