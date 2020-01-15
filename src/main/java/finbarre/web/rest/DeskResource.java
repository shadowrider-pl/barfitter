package finbarre.web.rest;

import finbarre.domain.Desk;
import finbarre.repository.DeskRepository;
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
 * REST controller for managing {@link finbarre.domain.Desk}.
 */
@RestController
@RequestMapping("/api")
public class DeskResource {

    private final Logger log = LoggerFactory.getLogger(DeskResource.class);

    private static final String ENTITY_NAME = "desk";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DeskRepository deskRepository;

    public DeskResource(DeskRepository deskRepository) {
        this.deskRepository = deskRepository;
    }

    /**
     * {@code POST  /desks} : Create a new desk.
     *
     * @param desk the desk to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new desk, or with status {@code 400 (Bad Request)} if the desk has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/desks")
    public ResponseEntity<Desk> createDesk(@Valid @RequestBody Desk desk) throws URISyntaxException {
        log.debug("REST request to save Desk : {}", desk);
        if (desk.getId() != null) {
            throw new BadRequestAlertException("A new desk cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Desk result = deskRepository.save(desk);
        return ResponseEntity.created(new URI("/api/desks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /desks} : Updates an existing desk.
     *
     * @param desk the desk to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated desk,
     * or with status {@code 400 (Bad Request)} if the desk is not valid,
     * or with status {@code 500 (Internal Server Error)} if the desk couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/desks")
    public ResponseEntity<Desk> updateDesk(@Valid @RequestBody Desk desk) throws URISyntaxException {
        log.debug("REST request to update Desk : {}", desk);
        if (desk.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Desk result = deskRepository.save(desk);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, desk.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /desks} : get all the desks.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of desks in body.
     */
    @GetMapping("/desks")
    public ResponseEntity<List<Desk>> getAllDesks(Pageable pageable) {
        log.debug("REST request to get a page of Desks");
        Page<Desk> page = deskRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /desks/:id} : get the "id" desk.
     *
     * @param id the id of the desk to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the desk, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/desks/{id}")
    public ResponseEntity<Desk> getDesk(@PathVariable Long id) {
        log.debug("REST request to get Desk : {}", id);
        Optional<Desk> desk = deskRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(desk);
    }

    /**
     * {@code DELETE  /desks/:id} : delete the "id" desk.
     *
     * @param id the id of the desk to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/desks/{id}")
    public ResponseEntity<Void> deleteDesk(@PathVariable Long id) {
        log.debug("REST request to delete Desk : {}", id);
        deskRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
