package finbarre.web.rest;

import finbarre.domain.Vat;
import finbarre.repository.VatRepository;
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
 * REST controller for managing {@link finbarre.domain.Vat}.
 */
@RestController
@RequestMapping("/api")
public class VatResource {

    private final Logger log = LoggerFactory.getLogger(VatResource.class);

    private static final String ENTITY_NAME = "vat";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VatRepository vatRepository;

    public VatResource(VatRepository vatRepository) {
        this.vatRepository = vatRepository;
    }

    /**
     * {@code POST  /vats} : Create a new vat.
     *
     * @param vat the vat to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new vat, or with status {@code 400 (Bad Request)} if the vat has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/vats")
    public ResponseEntity<Vat> createVat(@Valid @RequestBody Vat vat) throws URISyntaxException {
        log.debug("REST request to save Vat : {}", vat);
        if (vat.getId() != null) {
            throw new BadRequestAlertException("A new vat cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Vat result = vatRepository.save(vat);
        return ResponseEntity.created(new URI("/api/vats/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /vats} : Updates an existing vat.
     *
     * @param vat the vat to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vat,
     * or with status {@code 400 (Bad Request)} if the vat is not valid,
     * or with status {@code 500 (Internal Server Error)} if the vat couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/vats")
    public ResponseEntity<Vat> updateVat(@Valid @RequestBody Vat vat) throws URISyntaxException {
        log.debug("REST request to update Vat : {}", vat);
        if (vat.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Vat result = vatRepository.save(vat);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vat.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /vats} : get all the vats.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of vats in body.
     */
    @GetMapping("/vats")
    public ResponseEntity<List<Vat>> getAllVats(Pageable pageable) {
        log.debug("REST request to get a page of Vats");
        Page<Vat> page = vatRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /vats/:id} : get the "id" vat.
     *
     * @param id the id of the vat to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the vat, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/vats/{id}")
    public ResponseEntity<Vat> getVat(@PathVariable Long id) {
        log.debug("REST request to get Vat : {}", id);
        Optional<Vat> vat = vatRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(vat);
    }

    /**
     * {@code DELETE  /vats/:id} : delete the "id" vat.
     *
     * @param id the id of the vat to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/vats/{id}")
    public ResponseEntity<Void> deleteVat(@PathVariable Long id) {
        log.debug("REST request to delete Vat : {}", id);
        vatRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
