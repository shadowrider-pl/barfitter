package finbarre.web.rest.forUsers;

import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Currency;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.Authority;
import finbarre.domain.Restaurant;
import finbarre.domain.User;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.AuthorityRepository;
import finbarre.repository.RestaurantRepository;
import finbarre.repository.UserRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.AuthoritiesConstants;
import finbarre.service.MailService;
import finbarre.service.UserService;
import finbarre.service.dto.UserDTO;
import finbarre.service.serviceForUsers.Country;
import finbarre.service.serviceForUsers.RestaurantRegistration;
import finbarre.service.util.RandomUtil;
import finbarre.web.rest.errors.BadRequestAlertException;
import finbarre.web.rest.errors.EmailAlreadyUsedException;
import finbarre.web.rest.errors.InvalidPasswordException;
import finbarre.web.rest.errors.LoginAlreadyUsedException;
import finbarre.web.rest.vm.ManagedUserVM;

/**
 * REST controller for managing RestaurantRegistration.
 */
@RestController
@RequestMapping("/api")
public class RestaurantRegistrationResource {

	private final Logger log = LoggerFactory.getLogger(RestaurantRegistrationResource.class);

	private static final String ENTITY_NAME = "restaurant";
	// fu
	private final UserToRestaurantRepository userToRestaurantRepository;
	private final RestaurantRepository restaurantRepository;

	private final UserRepository userRepository;

	private final UserService userService;

	private final MailService mailService;

	private final AuthorityRepository authorityRepository;

	private final PasswordEncoder passwordEncoder;

	private final CacheManager cacheManager;

	public RestaurantRegistrationResource(UserRepository userRepository, PasswordEncoder passwordEncoder,
			AuthorityRepository authorityRepository, UserToRestaurantRepository userToRestaurantRepository,
			RestaurantRepository restaurantRepository, UserService userService, MailService mailService,
			CacheManager cacheManager) {
		this.userToRestaurantRepository = userToRestaurantRepository;
		this.restaurantRepository = restaurantRepository;
		this.userRepository = userRepository;
		this.userService = userService;
		this.mailService = mailService;
		this.authorityRepository = authorityRepository;
		this.passwordEncoder = passwordEncoder;
		this.cacheManager = cacheManager;
	}

	/**
	 * POST /restaurants : Create a new restaurant.
	 *
	 * @param restaurantRegistration
	 *            the restaurant to create
	 * @return the ResponseEntity with status 201 (Created) and with body the new
	 *         restaurant, or with status 400 (Bad Request) if the restaurant has
	 *         already an ID
	 * @throws URISyntaxException
	 *             if the Location URI syntax is incorrect
	 */
	@PostMapping("/register-restaurant")
	@ResponseStatus(HttpStatus.CREATED)
	public synchronized void registerRestaurant(@RequestBody RestaurantRegistration restaurantRegistration)
			throws URISyntaxException {
		log.debug("REST request to save Restaurant : {}", restaurantRegistration);

		if (!checkPasswordLength(restaurantRegistration.getUser().getPassword())) {
			throw new InvalidPasswordException();
		}

		if (restaurantRegistration.getRestaurant().getId() != null) {
			throw new BadRequestAlertException("A new restaurant cannot already have an ID", ENTITY_NAME, "idexists");
		}

		userRepository.findOneByLogin(restaurantRegistration.getUser().getLogin().toLowerCase()).ifPresent(u -> {
			throw new LoginAlreadyUsedException();
		});
		userRepository.findOneByEmailIgnoreCase(restaurantRegistration.getUser().getEmail()).ifPresent(u -> {
			throw new EmailAlreadyUsedException();
		});

		final User user = registerBoss(restaurantRegistration.getUser(),
				restaurantRegistration.getUser().getPassword());
		mailService.sendActivationEmail(user);

		restaurantRegistration.setCreateDate(LocalDate.now());
		final Restaurant restaurant = restaurantRepository.save(restaurantRegistration.getRestaurant());

		final UserToRestaurant userToRestaurant = new UserToRestaurant();
		userToRestaurant.setRestaurant(restaurant);
		userToRestaurant.setUser(user);
		userToRestaurantRepository.save(userToRestaurant);

	}

	@GetMapping("/countries")
	public List<Country> getAllCountries() {
		log.debug("REST request to get all Countries");

		// Get all available locales
		List<Locale> availableLocales = Arrays.asList(Locale.getAvailableLocales());

		// Get all available ISO countries
		String[] countryCodes = Locale.getISOCountries();

		// Create a collection of all available countries
		List<Country> countries = new ArrayList<Country>();

		// Map ISO countries to custom country object
		for (String countryCode : countryCodes) {

			Optional<Locale> candidate = availableLocales.stream().filter(l -> l.getCountry().equals(countryCode))
					.collect(Collectors.reducing((a, b) -> null));

			Locale locale = new Locale("", countryCode);
			if (candidate.isPresent()) {
				locale = candidate.get();
			}
			// else {
			// System.out.println("could not find resource for: " + countryCode + " mapping
			// default lang");
			// locale = new Locale("", countryCode);
			// }

			// String iso = locale.getISO3Country();
			String currency = null;
			if (locale != null  
					&& Currency.getInstance(locale) != null) {
				currency = Currency.getInstance(locale).getSymbol(locale);
			}
			String code = locale.getCountry();
			String countryN = locale.getDisplayCountry(locale);
			Country country = new Country();
			country.setCountryCode(code);
			country.setCountryName(countryN);
			country.setCurrency(currency);

			countries.add(country);
		}

		// Sort countries
		Collections.sort(countries, new Comparator<Country>() {
			public int compare(Country s1, Country s2) {
				return s1.getCountryName().compareTo(s2.getCountryName());
			}
		});

		// for(Country c:countries){
		// System.out.println(c.getCountryName());
		// }

		return countries;
	}

	private static boolean checkPasswordLength(String password) {
		return !StringUtils.isEmpty(password) && password.length() >= ManagedUserVM.PASSWORD_MIN_LENGTH
				&& password.length() <= ManagedUserVM.PASSWORD_MAX_LENGTH;
	}

	public User registerBoss(UserDTO userDTO, String password) {

		User newUser = new User();
		Authority authority = authorityRepository.findOneByName(AuthoritiesConstants.BOSS);
		Set<Authority> authorities = new HashSet<>();
		String encryptedPassword = passwordEncoder.encode(password);
		newUser.setLogin(userDTO.getLogin());
		// new user gets initially a generated password
		newUser.setPassword(encryptedPassword);
		newUser.setFirstName(userDTO.getFirstName());
		newUser.setLastName(userDTO.getLastName());
		newUser.setEmail(userDTO.getEmail());
		newUser.setImageUrl(userDTO.getImageUrl());
		newUser.setLangKey(userDTO.getLangKey());
		// new user is not active
		newUser.setActivated(false);
		// new user gets registration key
		newUser.setActivationKey(RandomUtil.generateActivationKey());
		authorities.add(authority);
		newUser.setAuthorities(authorities);
		userRepository.save(newUser);
		cacheManager.getCache(UserRepository.USERS_BY_LOGIN_CACHE).evict(newUser.getLogin());
		cacheManager.getCache(UserRepository.USERS_BY_EMAIL_CACHE).evict(newUser.getEmail());
		log.debug("Created Information for User: {}", newUser);
		return newUser;
	}
}
