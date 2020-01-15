package finbarre.web.rest.forUsers;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import javax.validation.Valid;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import finbarre.config.Constants;
import finbarre.domain.Restaurant;
import finbarre.domain.User;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.UserRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.AuthoritiesConstants;
import finbarre.security.SecurityUtils;
import finbarre.service.MailService;
import finbarre.service.UserService;
import finbarre.service.dto.PasswordChangeDTO;
import finbarre.service.dto.UserDTO;
import finbarre.service.serviceForUsers.AdditionalUserService;
import finbarre.web.rest.UserResource;
import finbarre.web.rest.errors.BadRequestAlertException;
import finbarre.web.rest.errors.EmailAlreadyUsedException;
import finbarre.web.rest.errors.InvalidPasswordException;
import finbarre.web.rest.errors.LoginAlreadyUsedException;
import finbarre.web.rest.vm.ManagedUserVM;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
//import io.advantageous.boon.core.Str;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing UserFU.
 */
@RestController
@RequestMapping("/api")
public class UserFUResource {

	private final Logger log = LoggerFactory.getLogger(UserResource.class);

	private final UserRepository userRepository;

	private final UserService userService;

	private final AdditionalUserService additionalUserService;

	private final MailService mailService;

	private final UserToRestaurantRepository userToRestaurantRepository;

	private final PasswordEncoder passwordEncoder;

	private final CacheManager cacheManager;

	public UserFUResource(UserRepository userRepository, UserService userService,
			AdditionalUserService additionalUserService, MailService mailService,
			UserToRestaurantRepository userToRestaurantRepository, PasswordEncoder passwordEncoder,
			CacheManager cacheManager) {

		this.userRepository = userRepository;
		this.userService = userService;
		this.additionalUserService = additionalUserService;
		this.mailService = mailService;
		this.userToRestaurantRepository = userToRestaurantRepository;
		this.passwordEncoder = passwordEncoder;
		this.cacheManager = cacheManager;
	}

	/**
	 * POST /users : Creates a new user.
	 * <p>
	 * Creates a new user if the login and email are not already used, and sends an
	 * mail with an activation link. The user needs to be activated on creation.
	 *
	 * @param userDTO the user to create
	 * @return the ResponseEntity with status 201 (Created) and with body the new
	 *         user, or with status 400 (Bad Request) if the login or email is
	 *         already in use
	 * @throws URISyntaxException       if the Location URI syntax is incorrect
	 * @throws BadRequestAlertException 400 (Bad Request) if the login or email is
	 *                                  already in use
	 */
	@PostMapping("/user")
	@Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.BOSS })
	public synchronized ResponseEntity<User> createUser(@Valid @RequestBody ManagedUserVM managedUserVM)
			throws URISyntaxException {
		log.debug("REST request to save User : {}", managedUserVM);
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();

		userRepository.findOneByLogin(managedUserVM.getLogin().toLowerCase()).ifPresent(u -> {
			throw new LoginAlreadyUsedException();
		});
		userRepository.findOneByEmailIgnoreCase(managedUserVM.getEmail()).ifPresent(u -> {
			throw new EmailAlreadyUsedException();
		});
		managedUserVM.isActivated();
//        log.debug("managedUserVM.getAuthorities(): "+managedUserVM.getAuthorities());
//        log.debug("managedUserVM.isActivated(): "+managedUserVM.isActivated());
		final User newUser = additionalUserService.registerUserForRestaurant(managedUserVM,
				managedUserVM.getPassword());
		final UserToRestaurant newUserToRestaurant = new UserToRestaurant();
		newUserToRestaurant.setRestaurant(restaurant);
		newUserToRestaurant.setUser(newUser);
		UserToRestaurant result = userToRestaurantRepository.save(newUserToRestaurant);

		return ResponseEntity.created(new URI("/api/users/" + newUser.getLogin()))
				.headers(BarfitterHeaderUtil.createAlert("userManagement.created", newUser.getLogin())).body(newUser);

	}

	/**
	 * GET /users/:login : get the "login" user.
	 *
	 * @param login the login of the user to find
	 * @return the ResponseEntity with status 200 (OK) and with body the "login"
	 *         user, or with status 404 (Not Found)
	 */
	@GetMapping("/user/{login:" + Constants.LOGIN_REGEX + "}")
	@Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.BOSS })
	public synchronized ResponseEntity<UserDTO> getUser(@PathVariable String login) {
		log.debug("REST request to get User : {}", login);
		// fu
		final String currentUserStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(currentUserStr);
		final UserToRestaurant userDTOToRestaurant = userToRestaurantRepository.findOneByUserLogin(login);
		if (userToRestaurant.getRestaurant().getId() == userDTOToRestaurant.getRestaurant().getId()) {
			return ResponseUtil.wrapOrNotFound(userService.getUserWithAuthoritiesByLogin(login).map(UserDTO::new));
		} else {
			return ResponseUtil.wrapOrNotFound(userService.getUserWithAuthoritiesByLogin(null).map(UserDTO::new));
		}
	}

	/**
	 * GET /users : get all users.
	 *
	 * @param pageable the pagination information
	 * @return the ResponseEntity with status 200 (OK) and with body all users
	 */
	@GetMapping("/user")
	@Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.BOSS })
	public synchronized ResponseEntity<List<UserDTO>> getAllRestaurantUsers(Pageable pageable) {
		log.debug("REST request to get getAllRestaurantUsers : {}");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		final List<UserToRestaurant> usersToRestaurant = userToRestaurantRepository.findAllByRestaurant(restaurant);
		final List<UserDTO> users = new ArrayList<>();
		for (UserToRestaurant restaurantUser : usersToRestaurant) {
			final String restaurantUserString = restaurantUser.getUser().getLogin();
			final UserDTO user = userService.getUserWithAuthoritiesByLogin(restaurantUserString).map(UserDTO::new)
					.get();
			users.add(user);
		}
		Page<UserDTO> page = new PageImpl<UserDTO>(users, pageable, users.size());
		HttpHeaders headers = PaginationUtil
				.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
		return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
	}

	/**
	 * PUT /users : Updates an existing User.
	 *
	 * @param userDTO the user to update
	 * @return the ResponseEntity with status 200 (OK) and with body the updated
	 *         user
	 * @throws EmailAlreadyUsedException 400 (Bad Request) if the email is already
	 *                                   in use
	 * @throws LoginAlreadyUsedException 400 (Bad Request) if the login is already
	 *                                   in use
	 */
	@PutMapping("/user")
	@Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.BOSS })
	public synchronized ResponseEntity<UserDTO> updateUser(@Valid @RequestBody UserDTO userDTO) {
		log.debug("REST request to update User : {}", userDTO);
		// fu
		final String currentUserStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(currentUserStr);
		final UserToRestaurant userDTOToRestaurant = userToRestaurantRepository.findOneByUserLogin(userDTO.getLogin());

		Optional<User> existingUser = userRepository.findOneByEmailIgnoreCase(userDTO.getEmail());
		if (existingUser.isPresent() && (!existingUser.get().getId().equals(userDTO.getId()))) {
			throw new EmailAlreadyUsedException();
		}
		existingUser = userRepository.findOneByLogin(userDTO.getLogin().toLowerCase());
		if (existingUser.isPresent() && (!existingUser.get().getId().equals(userDTO.getId()))) {
			throw new LoginAlreadyUsedException();
		}
		if (userToRestaurant.getRestaurant().getId() == userDTOToRestaurant.getRestaurant().getId()) {
			final Optional<UserDTO> updatedUser = userService.updateUser(userDTO);
			return ResponseUtil.wrapOrNotFound(updatedUser,
					BarfitterHeaderUtil.createAlert("userManagement.updated", userDTO.getLogin()));
		} else {
			final Optional<UserDTO> updatedUser = null;
			return ResponseUtil.wrapOrNotFound(updatedUser,
					BarfitterHeaderUtil.createAlert("userManagement.updated", userDTO.getLogin()));
		}
	}

	/**
	 * DELETE /users/:login : delete the "login" User.
	 *
	 * @param login the login of the user to delete
	 * @return the ResponseEntity with status 200 (OK)
	 */
	@DeleteMapping("/user/{login:" + Constants.LOGIN_REGEX + "}")
	@Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.BOSS })
	public synchronized ResponseEntity<Void> deleteUser(@PathVariable String login) {
		log.debug("REST request to delete User and UserToRestaurant: {}", login);
		userToRestaurantRepository.delete(userToRestaurantRepository.findOneByUserLogin(login));
		return ResponseEntity.ok().headers(BarfitterHeaderUtil.createAlert("userManagement.deleted", login)).build();
	}

	/**
	 * PUT /users : Updates an existing User Password.
	 *
	 * @param userDTO the user to update
	 * @return the ResponseEntity with status 200 (OK) and with body the updated
	 *         user
	 * @throws EmailAlreadyUsedException 400 (Bad Request) if the email is already
	 *                                   in use
	 * @throws LoginAlreadyUsedException 400 (Bad Request) if the login is already
	 *                                   in use
	 */
	@Transactional
	@PutMapping("/user/change-password")
	@Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.BOSS, AuthoritiesConstants.MANAGER })
	public synchronized void updateUserPassword(@Valid @RequestBody LoginAndPasswordToChange loginAndPasswordToChange) {
		log.debug("REST request to change-password User : {}", loginAndPasswordToChange);
		// fu

		if (!checkPasswordLength(loginAndPasswordToChange.getNewPassword())) {
			throw new InvalidPasswordException();
		}

		final String managerUserStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant managerToRestaurant = userToRestaurantRepository.findOneByUserLogin(managerUserStr);
		final UserToRestaurant userToChangeDTOToRestaurant = userToRestaurantRepository
				.findOneByUserLogin(loginAndPasswordToChange.getLogin());

		Optional<User> existingUser = userRepository.findOneByLogin(userToChangeDTOToRestaurant.getUser().getLogin());

		if (existingUser.isPresent() && managerToRestaurant.getRestaurant().getId()
				.equals(userToChangeDTOToRestaurant.getRestaurant().getId())) {
			this.changePassword(loginAndPasswordToChange);
		}

	}

	private void changePassword(LoginAndPasswordToChange loginAndPasswordToChange) {
		userRepository.findOneByLogin(loginAndPasswordToChange.getLogin()).ifPresent(user -> {
			String encryptedPassword = passwordEncoder.encode(loginAndPasswordToChange.getNewPassword());
			user.setPassword(encryptedPassword);
			this.clearUserCaches(user);
			log.debug("Changed password for User: {}", user);
		});
	}

	private static boolean checkPasswordLength(String password) {
		return !StringUtils.isEmpty(password) && password.length() >= ManagedUserVM.PASSWORD_MIN_LENGTH
				&& password.length() <= ManagedUserVM.PASSWORD_MAX_LENGTH;
	}

	private void clearUserCaches(User user) {
		Objects.requireNonNull(cacheManager.getCache(UserRepository.USERS_BY_LOGIN_CACHE)).evict(user.getLogin());
		Objects.requireNonNull(cacheManager.getCache(UserRepository.USERS_BY_EMAIL_CACHE)).evict(user.getEmail());
	}
}

class LoginAndPasswordToChange {
	private String login;
	private String newPassword;

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}
}
