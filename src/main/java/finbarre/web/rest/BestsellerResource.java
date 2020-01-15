package finbarre.web.rest;

import finbarre.domain.Bestseller;
import finbarre.repository.BestsellerRepository;
import finbarre.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link finbarre.domain.Bestseller}.
 */
@RestController
@RequestMapping("/api")
public class BestsellerResource {

    private final Logger log = LoggerFactory.getLogger(BestsellerResource.class);

    private static final String ENTITY_NAME = "bestseller";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BestsellerRepository bestsellerRepository;

    public BestsellerResource(BestsellerRepository bestsellerRepository) {
        this.bestsellerRepository = bestsellerRepository;
    }

    /**
     * {@code POST  /bestsellers} : Create a new bestseller.
     *
     * @param bestseller the bestseller to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bestseller, or with status {@code 400 (Bad Request)} if the bestseller has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bestsellers")
    public ResponseEntity<Bestseller> createBestseller(@RequestBody Bestseller bestseller) throws URISyntaxException {
        log.debug("REST request to save Bestseller : {}", bestseller);
        if (bestseller.getId() != null) {
            throw new BadRequestAlertException("A new bestseller cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Bestseller result = bestsellerRepository.save(bestseller);
        return ResponseEntity.created(new URI("/api/bestsellers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bestsellers} : Updates an existing bestseller.
     *
     * @param bestseller the bestseller to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bestseller,
     * or with status {@code 400 (Bad Request)} if the bestseller is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bestseller couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bestsellers")
    public ResponseEntity<Bestseller> updateBestseller(@RequestBody Bestseller bestseller) throws URISyntaxException {
        log.debug("REST request to update Bestseller : {}", bestseller);
        if (bestseller.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Bestseller result = bestsellerRepository.save(bestseller);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bestseller.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /bestsellers} : get all the bestsellers.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bestsellers in body.
     */
    @GetMapping("/bestsellers")
    public ResponseEntity<List<Bestseller>> getAllBestsellers(Pageable pageable) {
        log.debug("REST request to get a page of Bestsellers");
        Page<Bestseller> page = bestsellerRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /bestsellers/:id} : get the "id" bestseller.
     *
     * @param id the id of the bestseller to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bestseller, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bestsellers/{id}")
    public ResponseEntity<Bestseller> getBestseller(@PathVariable Long id) {
        log.debug("REST request to get Bestseller : {}", id);
        Optional<Bestseller> bestseller = bestsellerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bestseller);
    }

    /**
     * {@code DELETE  /bestsellers/:id} : delete the "id" bestseller.
     *
     * @param id the id of the bestseller to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bestsellers/{id}")
    public ResponseEntity<Void> deleteBestseller(@PathVariable Long id) {
        log.debug("REST request to delete Bestseller : {}", id);
        bestsellerRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
