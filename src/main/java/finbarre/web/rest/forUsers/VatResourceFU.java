package finbarre.web.rest.forUsers;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

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
import finbarre.domain.Vat;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.repository.VatRepository;
import finbarre.security.SecurityUtils;
import finbarre.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing Vat.
 */
@RestController
@RequestMapping("/api")
public class VatResourceFU {

    private final Logger log = LoggerFactory.getLogger(VatResourceFU.class);

    private static final String ENTITY_NAME = "vat";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VatRepository vatRepository;
    
    //fu
    private final UserToRestaurantRepository userToRestaurantRepository;

    public VatResourceFU(VatRepository vatRepository, UserToRestaurantRepository userToRestaurantRepository) {
        this.vatRepository = vatRepository;
        
        //fu
        this.userToRestaurantRepository=userToRestaurantRepository;
    }

    /**
     * POST  /vatsfu : Create a new vat.
     *
     * @param vat the vat to create
     * @return the ResponseEntity with status 201 (Created) and with body the new vat, or with status 400 (Bad Request) if the vat has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/vatsfu")
    public synchronized ResponseEntity<Vat> createVat(@Valid @RequestBody Vat vat) throws URISyntaxException {
        log.debug("REST request to save Vat : {}", vat);
        
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        vat.setRestaurant(restaurant);
        
        if (vat.getId() != null) {
            throw new BadRequestAlertException("A new vat cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Vat result = vatRepository.save(vat);
        return ResponseEntity.created(new URI("/api/vatsfu/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                .body(result);
    }

    /**
     * PUT  /vatsfu : Updates an existing vat.
     *
     * @param vat the vat to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated vat,
     * or with status 400 (Bad Request) if the vat is not valid,
     * or with status 500 (Internal Server Error) if the vat couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/vatsfu")
    public synchronized ResponseEntity<Vat> updateVat(@Valid @RequestBody Vat vat) throws URISyntaxException {
        log.debug("REST request to update Vat : {}", vat);
        if (vat.getId() == null) {
            return createVat(vat);
        }
        Vat result = vatRepository.save(vat);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                .body(result);
    }

    /**
     * GET  /vatsfu : get all the vats.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of vats in body
     */
    @GetMapping("/vatsfu")
    public synchronized ResponseEntity<List<Vat>> getAllVats(Pageable pageable) {
        log.debug("REST request to get a page of Vats");
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        
        Page<Vat> page = vatRepository.findAllByRestaurant(restaurant, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /vatsfu/:id : get the "id" vat.
     *
     * @param id the id of the vat to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the vat, or with status 404 (Not Found)
     */
    @GetMapping("/vatsfu/{id}")
    public synchronized ResponseEntity<Vat> getVat(@PathVariable Long id) {
        log.debug("REST request to get Vat : {}", id);
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Restaurant restaurant=userToRestaurant.getRestaurant();
        final Optional<Vat> vatOptional = vatRepository.findById(id);
        Vat vat = vatOptional.get();
        	if(vat.getRestaurant().getId()!=restaurant.getId()){
        		log.debug("zła restauracja "+restaurant.getName() + ' ' + vat.getRestaurant().getName());
        		vat=null;
        	}
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(vat));
    }

    /**
     * DELETE  /vatsfu/:id : delete the "id" vat.
     *
     * @param id the id of the vat to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/vatsfu/{id}")
    public synchronized ResponseEntity<Void> deleteVat(@PathVariable Long id) {
        log.debug("REST request to delete Vat : {}", id);
        vatRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil
        		.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }


}
