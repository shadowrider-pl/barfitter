package finbarre.web.rest.forUsers;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.UserToRestaurant;
import finbarre.repository.UserToRestaurantRepository;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing UserToRestaurant.
 */
@RestController
@RequestMapping("/api")
public class UserToRestaurantFUResource {

    private final Logger log = LoggerFactory.getLogger(UserToRestaurantFUResource.class);

//    private static final String ENTITY_NAME = "userToRestaurant";

    private final UserToRestaurantRepository userToRestaurantRepository;

//    private final UserToRestaurantSearchRepository userToRestaurantSearchRepository;

    public UserToRestaurantFUResource(UserToRestaurantRepository userToRestaurantRepository) {
        this.userToRestaurantRepository = userToRestaurantRepository;
//        this.userToRestaurantSearchRepository = userToRestaurantSearchRepository;
    }


    /**
     * GET  /user-to-restaurants/:id : get the "id" userToRestaurant.
     *
     * @param id the id of the userToRestaurant to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the userToRestaurant, or with status 404 (Not Found)
     */
    @GetMapping("/user-to-restaurant-fu/{login}")
    public synchronized ResponseEntity<UserToRestaurant> getUserToRestaurant(@PathVariable String login) {
        log.debug("REST request to get UserToRestaurant : {}", login);
        UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(login);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(userToRestaurant));
    }

}
