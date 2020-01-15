package finbarre.web.rest.forUsers.active;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.domain.Vat;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.repository.VatRepository;
import finbarre.security.SecurityUtils;

/**
 * REST controller for managing Vat.
 */
@RestController
@RequestMapping("/api")
public class ActiveVat {

    private final Logger log = LoggerFactory.getLogger(ActiveVat.class);

    private static final String ENTITY_NAME = "vat";

    private final VatRepository vatRepository;
    private final UserToRestaurantRepository userToRestaurantRepository;

    public ActiveVat(VatRepository vatRepository,
    		UserToRestaurantRepository userToRestaurantRepository) {
        this.vatRepository = vatRepository;
        this.userToRestaurantRepository=userToRestaurantRepository;
    }


    /**
     * GET  /vats : get all the vats.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of vats in body
     */
    @GetMapping("/active-vats")
    public synchronized List<Vat> getAllActiveVats() {
        log.debug("REST request to get Active Vats");
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        List<Vat> vats = vatRepository.findAllByActiveTrueAndRestaurant(restaurant);
        return vats;
    }


}
