package finbarre.web.rest.forUsers;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import finbarre.domain.Favorite;
import finbarre.domain.Product;
import finbarre.domain.ProductOnStock;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.FavoriteRepository;
import finbarre.repository.ProductOnStockRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;
import finbarre.service.serviceForUsers.ProductOnStockWithOrderedQuantity;
import finbarre.service.serviceForUsers.ProductsOfCategoryWithOrderedQuantity;
import finbarre.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing Favorite.
 */
@RestController
@RequestMapping("/api")
public class FavoritesResource {

    private final Logger log = LoggerFactory.getLogger(FavoritesResource.class);

    private static final String ENTITY_NAME = "favorite";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FavoriteRepository favoriteRepository;
    
    //fu
    private final UserToRestaurantRepository userToRestaurantRepository;
    private final ProductOnStockRepository productOnStockRepository;

    public FavoritesResource(FavoriteRepository favoriteRepository,  UserToRestaurantRepository userToRestaurantRepository,
    		ProductOnStockRepository productOnStockRepository) {
        this.favoriteRepository = favoriteRepository;
        //fu
        this.userToRestaurantRepository=userToRestaurantRepository;
        this.productOnStockRepository=productOnStockRepository;
    }

    /**
     * POST  /favorites : Create a new favorite.
     *
     * @param favorite the favorite to create
     * @return the ResponseEntity with status 201 (Created) and with body the new favorite, or with status 400 (Bad Request) if the favorite has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/m-favorites")
    public synchronized ResponseEntity<Favorite> createFavorite(@RequestBody Favorite favorite) throws URISyntaxException {
        log.debug("REST request to save Favorite : {}", favorite);
        if (favorite.getId() != null) {
            throw new BadRequestAlertException("A new favorite cannot already have an ID", ENTITY_NAME, "idexists");
        }
        
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        favorite.setRestaurant(restaurant);
        Favorite result = favoriteRepository.save(favorite);
        return ResponseEntity.created(new URI("/api/favorites/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                .body(result);
    }

    /**
     * PUT  /favorites : Updates an existing favorite.
     *
     * @param favorite the favorite to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated favorite,
     * or with status 400 (Bad Request) if the favorite is not valid,
     * or with status 500 (Internal Server Error) if the favorite couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/m-favorites")
    public synchronized ResponseEntity<Favorite> updateFavorite(@RequestBody Favorite favorite) throws URISyntaxException {
        log.debug("REST request to update Favorite : {}", favorite);
        if (favorite.getId() == null) {
            return createFavorite(favorite);
        }
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        if(favorite.getRestaurant().getId()!=restaurant.getId()) {
        	favorite = null;
        }
        Favorite result = favoriteRepository.save(favorite);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, favorite.getId().toString()))
                .body(result);
    }

    /**
     * GET  /favorites : get all the favorites.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of favorites in body
     */
    @GetMapping("/m-favorites")
    public synchronized ResponseEntity<List<Favorite>> getAllFavorites(Pageable pageable) {
        log.debug("REST request to get a page of Favorites");
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Long restaurantId=userToRestaurant.getRestaurant().getId();
        Page<Favorite> page = favoriteRepository.findAllByRestaurantId(restaurantId, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /favorites : get all the favorites.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of favorites in body
     */
    @GetMapping("/b-favorites")
    public synchronized ProductsOfCategoryWithOrderedQuantity getFavoritesForBarman() {
        log.debug("REST request to get all Favorites for barman");
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();

        final List<Favorite> favorities = favoriteRepository.findAllByRestaurant(restaurant);

        ProductsOfCategoryWithOrderedQuantity pocwoq = new ProductsOfCategoryWithOrderedQuantity();
        List<ProductOnStockWithOrderedQuantity> productsOfCategory = new ArrayList<>();
        for(Favorite favorite : favorities) {
        	final Product product = favorite.getProduct();
        	List<ProductOnStock> productOnStocks = productOnStockRepository.findAllByProduct(product);
        	for(ProductOnStock pos:productOnStocks){
    	        ProductOnStockWithOrderedQuantity poswoq=new ProductOnStockWithOrderedQuantity();
    			poswoq.setOrderedQuantity(0);
    			poswoq.setQuantity(pos.getQuantity());
    			poswoq.setId(pos.getId());
    			poswoq.setDeliveryDate(pos.getDeliveryDate());
    			poswoq.setProduct(pos.getProduct());
    			poswoq.setPurchPriceGross(pos.getPurchPriceGross());
    			poswoq.setPurchPriceNet(pos.getPurchPriceGross());
    			poswoq.setPurchVatValue(pos.getPurchVatValue());
    			poswoq.setSellPriceGross(pos.getSellPriceGross());
    			poswoq.setSellPriceNet(pos.getSellPriceNet());
    			poswoq.setSellVatValue(pos.getSellVatValue());
    			productsOfCategory.add(poswoq);
    		}
    		pocwoq.setProductsOfCategory(findProductsOfCategory(productsOfCategory));
        }
		return pocwoq;
    }

    /**
     * GET  /favorites/:id : get the "id" favorite.
     *
     * @param id the id of the favorite to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the favorite, or with status 404 (Not Found)
     */
    @GetMapping("/m-favorites/{id}")
    public synchronized ResponseEntity<Favorite> getFavorite(@PathVariable Long id) {
        log.debug("REST request to get Favorite : {}", id);
        Optional<Favorite> favorite = favoriteRepository.findById(id);
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        if(favorite != null && favorite.get().getRestaurant().getId()!=restaurant.getId()) {
        	favorite = null;
        }
        return ResponseUtil.wrapOrNotFound(favorite);
    }

    /**
     * DELETE  /favorites/:id : delete the "id" favorite.
     *
     * @param id the id of the favorite to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/m-favorites/{id}")
    public synchronized ResponseEntity<Void> deleteFavorite(@PathVariable Long id) {
        log.debug("REST request to delete Favorite : {}", id);
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        final Optional<Favorite> favorite = favoriteRepository.findById(id);
        if(favorite != null && favorite.get().getRestaurant().getId()!=restaurant.getId()) {
        	id = null;
        }
        favoriteRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil
        		.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
        
    }

    private synchronized List<ProductOnStockWithOrderedQuantity> findProductsOfCategory(List<ProductOnStockWithOrderedQuantity> entryList){

    	int listSize = entryList.size();
		List<ProductOnStockWithOrderedQuantity> Stock = new ArrayList<ProductOnStockWithOrderedQuantity>();
		long index = 0L;
		int tempQuantity = 0;
		ProductOnStockWithOrderedQuantity temp = null;
		for (ProductOnStockWithOrderedQuantity pos : entryList) {
			index++;
			if (temp == null) { 
				temp = pos;
			} else {
				if (!(pos.getProduct().getId() == (temp.getProduct().getId()))) {
					Stock.add(temp);
					temp = pos;
					temp.setId(index);
					tempQuantity = 0;

				} else {
					tempQuantity=temp.getQuantity()+pos.getQuantity();
					temp.setQuantity(tempQuantity);
				}
			}

			if (index == listSize) {
				temp.setId(index);
				Stock.add(temp);
			}
		}
		return Stock;	
    }
    
}
