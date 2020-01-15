package finbarre.web.rest;

import finbarre.domain.Cashup;
import finbarre.repository.CashupRepository;
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

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link finbarre.domain.Cashup}.
 */
@RestController
@RequestMapping("/api")
public class CashupResource {

    private final Logger log = LoggerFactory.getLogger(CashupResource.class);

    private static final String ENTITY_NAME = "cashup";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CashupRepository cashupRepository;

    public CashupResource(CashupRepository cashupRepository) {
        this.cashupRepository = cashupRepository;
    }

    /**
     * {@code POST  /cashups} : Create a new cashup.
     *
     * @param cashup the cashup to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new cashup, or with status {@code 400 (Bad Request)} if the cashup has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/cashups")
    public ResponseEntity<Cashup> createCashup(@Valid @RequestBody Cashup cashup) throws URISyntaxException {
        log.debug("REST request to save Cashup : {}", cashup);
        if (cashup.getId() != null) {
            throw new BadRequestAlertException("A new cashup cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Cashup result = cashupRepository.save(cashup);
        return ResponseEntity.created(new URI("/api/cashups/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /cashups} : Updates an existing cashup.
     *
     * @param cashup the cashup to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cashup,
     * or with status {@code 400 (Bad Request)} if the cashup is not valid,
     * or with status {@code 500 (Internal Server Error)} if the cashup couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/cashups")
    public ResponseEntity<Cashup> updateCashup(@Valid @RequestBody Cashup cashup) throws URISyntaxException {
        log.debug("REST request to update Cashup : {}", cashup);
        if (cashup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Cashup result = cashupRepository.save(cashup);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cashup.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /cashups} : get all the cashups.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of cashups in body.
     */
    @GetMapping("/cashups")
    public ResponseEntity<List<Cashup>> getAllCashups(Pageable pageable) {
        log.debug("REST request to get a page of Cashups");
        Page<Cashup> page = cashupRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /cashups/:id} : get the "id" cashup.
     *
     * @param id the id of the cashup to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cashup, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/cashups/{id}")
    public ResponseEntity<Cashup> getCashup(@PathVariable Long id) {
        log.debug("REST request to get Cashup : {}", id);
        Optional<Cashup> cashup = cashupRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(cashup);
    }

    /**
     * {@code DELETE  /cashups/:id} : delete the "id" cashup.
     *
     * @param id the id of the cashup to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/cashups/{id}")
    public ResponseEntity<Void> deleteCashup(@PathVariable Long id) {
        log.debug("REST request to delete Cashup : {}", id);
        cashupRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
