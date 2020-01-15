package finbarre.web.rest;

import finbarre.domain.OrderClosed;
import finbarre.repository.OrderClosedRepository;
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
 * REST controller for managing {@link finbarre.domain.OrderClosed}.
 */
@RestController
@RequestMapping("/api")
public class OrderClosedResource {

    private final Logger log = LoggerFactory.getLogger(OrderClosedResource.class);

    private static final String ENTITY_NAME = "orderClosed";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrderClosedRepository orderClosedRepository;

    public OrderClosedResource(OrderClosedRepository orderClosedRepository) {
        this.orderClosedRepository = orderClosedRepository;
    }

    /**
     * {@code POST  /order-closeds} : Create a new orderClosed.
     *
     * @param orderClosed the orderClosed to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderClosed, or with status {@code 400 (Bad Request)} if the orderClosed has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/order-closeds")
    public ResponseEntity<OrderClosed> createOrderClosed(@Valid @RequestBody OrderClosed orderClosed) throws URISyntaxException {
        log.debug("REST request to save OrderClosed : {}", orderClosed);
        if (orderClosed.getId() != null) {
            throw new BadRequestAlertException("A new orderClosed cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrderClosed result = orderClosedRepository.save(orderClosed);
        return ResponseEntity.created(new URI("/api/order-closeds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /order-closeds} : Updates an existing orderClosed.
     *
     * @param orderClosed the orderClosed to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderClosed,
     * or with status {@code 400 (Bad Request)} if the orderClosed is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orderClosed couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/order-closeds")
    public ResponseEntity<OrderClosed> updateOrderClosed(@Valid @RequestBody OrderClosed orderClosed) throws URISyntaxException {
        log.debug("REST request to update OrderClosed : {}", orderClosed);
        if (orderClosed.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        OrderClosed result = orderClosedRepository.save(orderClosed);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderClosed.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /order-closeds} : get all the orderCloseds.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderCloseds in body.
     */
    @GetMapping("/order-closeds")
    public ResponseEntity<List<OrderClosed>> getAllOrderCloseds(Pageable pageable) {
        log.debug("REST request to get a page of OrderCloseds");
        Page<OrderClosed> page = orderClosedRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /order-closeds/:id} : get the "id" orderClosed.
     *
     * @param id the id of the orderClosed to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderClosed, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/order-closeds/{id}")
    public ResponseEntity<OrderClosed> getOrderClosed(@PathVariable Long id) {
        log.debug("REST request to get OrderClosed : {}", id);
        Optional<OrderClosed> orderClosed = orderClosedRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(orderClosed);
    }

    /**
     * {@code DELETE  /order-closeds/:id} : delete the "id" orderClosed.
     *
     * @param id the id of the orderClosed to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/order-closeds/{id}")
    public ResponseEntity<Void> deleteOrderClosed(@PathVariable Long id) {
        log.debug("REST request to delete OrderClosed : {}", id);
        orderClosedRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
