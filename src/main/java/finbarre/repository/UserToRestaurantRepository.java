package finbarre.repository;

import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the UserToRestaurant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserToRestaurantRepository extends JpaRepository<UserToRestaurant, Long> {

    @Query("select user_to_restaurant from UserToRestaurant user_to_restaurant where user_to_restaurant.user.login = ?#{principal.username}")
    List<UserToRestaurant> findByUserIsCurrentUser();
    
    List<UserToRestaurant> findAllByRestaurant(Restaurant restaurant);

	UserToRestaurant findOneByUserLogin(String user);

}
