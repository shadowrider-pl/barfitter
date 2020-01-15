package finbarre.web.rest.forUsers;

import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.Category;
import finbarre.domain.Desk;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.CategoryRepository;
import finbarre.repository.DeskRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.repository.VatRepository;
import finbarre.security.AuthoritiesConstants;
import finbarre.security.SecurityUtils;
import finbarre.web.rest.forUsers.defaultData.DefaultData;

/**
 * REST controller for managing Category.
 */
@RestController
@RequestMapping("/api")
public class DefaultValuesResourceFU {

	private final Logger log = LoggerFactory.getLogger(DefaultValuesResourceFU.class);

//	private static final String ENTITY_NAME = "category";

	@Value("${jhipster.clientApp.name}")
	private String applicationName;

	private final CategoryRepository categoryRepository;
	private final DeskRepository deskRepository;
	private final VatRepository vatRepository;

	// fu
	private final UserToRestaurantRepository userToRestaurantRepository;

	public DefaultValuesResourceFU(CategoryRepository categoryRepository,
			UserToRestaurantRepository userToRestaurantRepository, VatRepository vatRepository,
			DeskRepository deskRepository) {
		this.categoryRepository = categoryRepository;
		// fu
		this.userToRestaurantRepository = userToRestaurantRepository;
		this.vatRepository = vatRepository;
		this.deskRepository = deskRepository;
	}

	/**
	 * POST /categoriesfu : Create a new category.
	 *
	 * @param category the category to create
	 * @return the ResponseEntity with status 201 (Created) and with body the new
	 *         category, or with status 400 (Bad Request) if the category has
	 *         already an ID
	 * @throws URISyntaxException if the Location URI syntax is incorrect
	 */
	@PostMapping("/load-defaults")
	@Secured({ AuthoritiesConstants.ADMIN, AuthoritiesConstants.BOSS, AuthoritiesConstants.MANAGER })
	public synchronized ResponseEntity<Void> createDefaultValues(@Valid @RequestBody DefaultData defaultData)
			throws URISyntaxException {
		log.debug("REST request to save DefaultValues : {}", defaultData);

		// fu
		final String user = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(user);
		final Restaurant restaurant = userToRestaurant.getRestaurant();

		defaultData.getVats().forEach(vat -> {
			vat.setRestaurant(restaurant);
			vat.setId(null);
			vatRepository.save(vat);
		});
		
		defaultData.getCategories().forEach(category -> category.setRestaurant(restaurant));

		List<Category> mainCategories = defaultData.getCategories().stream()
				.filter(category -> category.getParentId() == 0).collect(Collectors.toList());

		Map<Long, String> mainCategoriesMap = new HashMap<>();
		mainCategories.forEach(category -> {
			mainCategoriesMap.put(category.getId(),category.getName());
			category.setId(null);
		});

		List<Category> subCategories = defaultData.getCategories().stream()
				.filter(category -> category.getParentId() != 0)
				.collect(Collectors.toList());
		subCategories.forEach(category -> category.setId(null));

		List<Category> mainCategoriesResults = mainCategories.stream()
				.map(category -> categoryRepository.save(category))
				.collect(Collectors.toList());

		subCategories.forEach(category -> {
			Long parentCategoryId = findParentCategoryId(
					findParentCategoryName(category.getParentId(), mainCategoriesMap), mainCategoriesResults);
			category.setParentId(parentCategoryId.intValue());
			categoryRepository.save(category);
		});

		defaultData.getDesks().forEach(desk -> desk.setRestaurant(restaurant));

		List<Desk> mainDesks = defaultData.getDesks().stream()
				.filter(desk -> desk.getParentId() == 0)
				.collect(Collectors.toList());

		Map<Long, String> mainDesksMap = new HashMap<>();
		mainDesks.forEach(desk -> {
			mainDesksMap.put(desk.getId(),desk.getDescription());
			desk.setId(null);
		});

		List<Desk> subDesk = defaultData.getDesks().stream()
				.filter(desk -> desk.getParentId() != 0)
				.collect(Collectors.toList());
		subDesk.forEach(desk -> desk.setId(null));

		List<Desk> mainDeskResults = mainDesks.stream()
				.map(desk -> deskRepository.save(desk))
				.collect(Collectors.toList());

		subDesk.forEach(desk -> {
			Long parentDeskId = findParentDeskId(
					findParentDeskName(desk.getParentId(), mainDesksMap), mainDeskResults);
			desk.setParentId(parentDeskId);
			deskRepository.save(desk);
		});

		return ResponseEntity.noContent().build();
	}

	private String findParentCategoryName(Integer parentId, Map<Long, String> mainCategoriesMap) {
		String result = mainCategoriesMap.get(parentId.longValue());
		return result;
	}

	private Long findParentCategoryId(String name, List<Category> mainCategoriesResults) {
		Long id = mainCategoriesResults.stream()
		.filter(category->category.getName().equals(name))
		.findFirst().get().getId();
		return id;
	}

	private String findParentDeskName(Long parentId, Map<Long, String> mainDeskMap) {
		String result = mainDeskMap.get(parentId.longValue());
		return result;
	}

	private Long findParentDeskId(String name, List<Desk> mainDeskResults) {
		Long id = mainDeskResults.stream()
		.filter(desk->desk.getDescription().equals(name))
		.findFirst().get().getId();
		return id;
	}

}
