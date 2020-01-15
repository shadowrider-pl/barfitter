package finbarre.web.rest;

import finbarre.domain.OrderedProductStatus;
import finbarre.repository.OrderedProductStatusRepository;
import finbarre.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link finbarre.domain.OrderedProductStatus}.
 */
@RestController
@RequestMapping("/api")
public class OrderedProductStatusResource {

    private final Logger log = LoggerFactory.getLogger(OrderedProductStatusResource.class);

    private static final String ENTITY_NAME = "orderedProductStatus";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrderedProductStatusRepository orderedProductStatusRepository;

    public OrderedProductStatusResource(OrderedProductStatusRepository orderedProductStatusRepository) {
        this.orderedProductStatusRepository = orderedProductStatusRepository;
    }

    /**
     * {@code POST  /ordered-product-statuses} : Create a new orderedProductStatus.
     *
     * @param orderedProductStatus the orderedProductStatus to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderedProductStatus, or with status {@code 400 (Bad Request)} if the orderedProductStatus has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ordered-product-statuses")
    public ResponseEntity<OrderedProductStatus> createOrderedProductStatus(@Valid @RequestBody OrderedProductStatus orderedProductStatus) throws URISyntaxException {
        log.debug("REST request to save OrderedProductStatus : {}", orderedProductStatus);
        if (orderedProductStatus.getId() != null) {
            throw new BadRequestAlertException("A new orderedProductStatus cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrderedProductStatus result = orderedProductStatusRepository.save(orderedProductStatus);
        return ResponseEntity.created(new URI("/api/ordered-product-statuses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ordered-product-statuses} : Updates an existing orderedProductStatus.
     *
     * @param orderedProductStatus the orderedProductStatus to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderedProductStatus,
     * or with status {@code 400 (Bad Request)} if the orderedProductStatus is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orderedProductStatus couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ordered-product-statuses")
    public ResponseEntity<OrderedProductStatus> updateOrderedProductStatus(@Valid @RequestBody OrderedProductStatus orderedProductStatus) throws URISyntaxException {
        log.debug("REST request to update OrderedProductStatus : {}", orderedProductStatus);
        if (orderedProductStatus.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        OrderedProductStatus result = orderedProductStatusRepository.save(orderedProductStatus);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderedProductStatus.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /ordered-product-statuses} : get all the orderedProductStatuses.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderedProductStatuses in body.
     */
    @GetMapping("/ordered-product-statuses")
    public List<OrderedProductStatus> getAllOrderedProductStatuses() {
        log.debug("REST request to get all OrderedProductStatuses");
        return orderedProductStatusRepository.findAll();
    }

    /**
     * {@code GET  /ordered-product-statuses/:id} : get the "id" orderedProductStatus.
     *
     * @param id the id of the orderedProductStatus to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderedProductStatus, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ordered-product-statuses/{id}")
    public ResponseEntity<OrderedProductStatus> getOrderedProductStatus(@PathVariable Long id) {
        log.debug("REST request to get OrderedProductStatus : {}", id);
        Optional<OrderedProductStatus> orderedProductStatus = orderedProductStatusRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(orderedProductStatus);
    }

    /**
     * {@code DELETE  /ordered-product-statuses/:id} : delete the "id" orderedProductStatus.
     *
     * @param id the id of the orderedProductStatus to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ordered-product-statuses/{id}")
    public ResponseEntity<Void> deleteOrderedProductStatus(@PathVariable Long id) {
        log.debug("REST request to delete OrderedProductStatus : {}", id);
        orderedProductStatusRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
