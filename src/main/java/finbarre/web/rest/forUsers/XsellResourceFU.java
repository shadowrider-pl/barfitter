package finbarre.web.rest.forUsers;

import java.net.URI;
import java.net.URISyntaxException;
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

import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.domain.Xsell;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.repository.XsellRepository;
import finbarre.security.SecurityUtils;
import finbarre.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing Xsell.
 */
@RestController
@RequestMapping("/api")
public class XsellResourceFU {

	private final Logger log = LoggerFactory.getLogger(XsellResourceFU.class);
	private static final String ENTITY_NAME = "xsell";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

	private final XsellRepository xsellRepository;
    
    //fu
	private final UserToRestaurantRepository userToRestaurantRepository;

    public XsellResourceFU(
    		XsellRepository xsellRepository,
    		UserToRestaurantRepository userToRestaurantRepository) {
        this.xsellRepository = xsellRepository;
        
        //fu
        this.userToRestaurantRepository=userToRestaurantRepository;
    }

    /**
     * POST  /xsells : Create a new xsell.
     *
     * @param xsell the xsell to create
     * @return the ResponseEntity with status 201 (Created) and with body the new xsell, or with status 400 (Bad Request) if the xsell has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/m-xsells")
    public synchronized ResponseEntity<Xsell> createXsell(@RequestBody Xsell xsell) throws URISyntaxException {
        log.debug("REST request to save Xsell : {}", xsell);
        
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        xsell.setRestaurant(restaurant);
        if (xsell.getId() != null) {
            throw new BadRequestAlertException("A new xsell cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Xsell result = xsellRepository.save(xsell);
        return ResponseEntity.created(new URI("/api/xsells/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                .body(result);
    }

    /**
     * PUT  /xsells : Updates an existing xsell.
     *
     * @param xsell the xsell to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated xsell,
     * or with status 400 (Bad Request) if the xsell is not valid,
     * or with status 500 (Internal Server Error) if the xsell couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/m-xsells")
    public synchronized ResponseEntity<Xsell> updateXsell(@RequestBody Xsell xsell) throws URISyntaxException {
        log.debug("REST request to update Xsell : {}", xsell);
        if (xsell.getId() == null) {
            return createXsell(xsell);
        }
        Xsell result = xsellRepository.save(xsell);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, xsell.getId().toString()))
                .body(result);
    }

    /**
     * GET  /xsells : get all the xsells.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of xsells in body
     */
    @GetMapping("/m-xsells")
    public synchronized ResponseEntity<List<Xsell>> getAllXsells(Pageable pageable) {
        log.debug("REST request to get a page of Xsells");
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        Page<Xsell> page = xsellRepository.findAllByRestaurant(restaurant, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /xsells/:id : get the "id" xsell.
     *
     * @param id the id of the xsell to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the xsell, or with status 404 (Not Found)
     */
    @GetMapping("/m-xsells/{id}")
    public synchronized ResponseEntity<Xsell> getXsell(@PathVariable Long id) {
        log.debug("REST request to get Xsell : {}", id);
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        final Optional<Xsell> xsellOptional = xsellRepository.findById(id);
    	Xsell xsell = xsellOptional.get();
        if(xsell.getRestaurant().getId()!=restaurant.getId()){
    		log.debug("zła restauracja "+restaurant.getName() + ' ' + xsell.getRestaurant().getName());
    		xsell=null;
    	}
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(xsell));
    }

    /**
     * DELETE  /xsells/:id : delete the "id" xsell.
     *
     * @param id the id of the xsell to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/m-xsells/{id}")
    public synchronized ResponseEntity<Void> deleteXsell(@PathVariable Long id) {
        log.debug("REST request to delete Xsell : {}", id);
        xsellRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
        
    }

}
