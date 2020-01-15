package finbarre.web.rest;

import finbarre.domain.OrderOpened;
import finbarre.repository.OrderOpenedRepository;
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
 * REST controller for managing {@link finbarre.domain.OrderOpened}.
 */
@RestController
@RequestMapping("/api")
public class OrderOpenedResource {

    private final Logger log = LoggerFactory.getLogger(OrderOpenedResource.class);

    private static final String ENTITY_NAME = "orderOpened";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrderOpenedRepository orderOpenedRepository;

    public OrderOpenedResource(OrderOpenedRepository orderOpenedRepository) {
        this.orderOpenedRepository = orderOpenedRepository;
    }

    /**
     * {@code POST  /order-openeds} : Create a new orderOpened.
     *
     * @param orderOpened the orderOpened to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderOpened, or with status {@code 400 (Bad Request)} if the orderOpened has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/order-openeds")
    public ResponseEntity<OrderOpened> createOrderOpened(@RequestBody OrderOpened orderOpened) throws URISyntaxException {
        log.debug("REST request to save OrderOpened : {}", orderOpened);
        if (orderOpened.getId() != null) {
            throw new BadRequestAlertException("A new orderOpened cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrderOpened result = orderOpenedRepository.save(orderOpened);
        return ResponseEntity.created(new URI("/api/order-openeds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /order-openeds} : Updates an existing orderOpened.
     *
     * @param orderOpened the orderOpened to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderOpened,
     * or with status {@code 400 (Bad Request)} if the orderOpened is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orderOpened couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/order-openeds")
    public ResponseEntity<OrderOpened> updateOrderOpened(@RequestBody OrderOpened orderOpened) throws URISyntaxException {
        log.debug("REST request to update OrderOpened : {}", orderOpened);
        if (orderOpened.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        OrderOpened result = orderOpenedRepository.save(orderOpened);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderOpened.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /order-openeds} : get all the orderOpeneds.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderOpeneds in body.
     */
    @GetMapping("/order-openeds")
    public ResponseEntity<List<OrderOpened>> getAllOrderOpeneds(Pageable pageable) {
        log.debug("REST request to get a page of OrderOpeneds");
        Page<OrderOpened> page = orderOpenedRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /order-openeds/:id} : get the "id" orderOpened.
     *
     * @param id the id of the orderOpened to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderOpened, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/order-openeds/{id}")
    public ResponseEntity<OrderOpened> getOrderOpened(@PathVariable Long id) {
        log.debug("REST request to get OrderOpened : {}", id);
        Optional<OrderOpened> orderOpened = orderOpenedRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(orderOpened);
    }

    /**
     * {@code DELETE  /order-openeds/:id} : delete the "id" orderOpened.
     *
     * @param id the id of the orderOpened to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/order-openeds/{id}")
    public ResponseEntity<Void> deleteOrderOpened(@PathVariable Long id) {
        log.debug("REST request to delete OrderOpened : {}", id);
        orderOpenedRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
