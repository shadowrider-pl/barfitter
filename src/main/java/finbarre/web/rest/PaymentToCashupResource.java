package finbarre.web.rest;

import finbarre.domain.PaymentToCashup;
import finbarre.repository.PaymentToCashupRepository;
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
 * REST controller for managing {@link finbarre.domain.PaymentToCashup}.
 */
@RestController
@RequestMapping("/api")
public class PaymentToCashupResource {

    private final Logger log = LoggerFactory.getLogger(PaymentToCashupResource.class);

    private static final String ENTITY_NAME = "paymentToCashup";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PaymentToCashupRepository paymentToCashupRepository;

    public PaymentToCashupResource(PaymentToCashupRepository paymentToCashupRepository) {
        this.paymentToCashupRepository = paymentToCashupRepository;
    }

    /**
     * {@code POST  /payment-to-cashups} : Create a new paymentToCashup.
     *
     * @param paymentToCashup the paymentToCashup to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new paymentToCashup, or with status {@code 400 (Bad Request)} if the paymentToCashup has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/payment-to-cashups")
    public ResponseEntity<PaymentToCashup> createPaymentToCashup(@RequestBody PaymentToCashup paymentToCashup) throws URISyntaxException {
        log.debug("REST request to save PaymentToCashup : {}", paymentToCashup);
        if (paymentToCashup.getId() != null) {
            throw new BadRequestAlertException("A new paymentToCashup cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PaymentToCashup result = paymentToCashupRepository.save(paymentToCashup);
        return ResponseEntity.created(new URI("/api/payment-to-cashups/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /payment-to-cashups} : Updates an existing paymentToCashup.
     *
     * @param paymentToCashup the paymentToCashup to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated paymentToCashup,
     * or with status {@code 400 (Bad Request)} if the paymentToCashup is not valid,
     * or with status {@code 500 (Internal Server Error)} if the paymentToCashup couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/payment-to-cashups")
    public ResponseEntity<PaymentToCashup> updatePaymentToCashup(@RequestBody PaymentToCashup paymentToCashup) throws URISyntaxException {
        log.debug("REST request to update PaymentToCashup : {}", paymentToCashup);
        if (paymentToCashup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PaymentToCashup result = paymentToCashupRepository.save(paymentToCashup);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, paymentToCashup.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /payment-to-cashups} : get all the paymentToCashups.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of paymentToCashups in body.
     */
    @GetMapping("/payment-to-cashups")
    public ResponseEntity<List<PaymentToCashup>> getAllPaymentToCashups(Pageable pageable) {
        log.debug("REST request to get a page of PaymentToCashups");
        Page<PaymentToCashup> page = paymentToCashupRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /payment-to-cashups/:id} : get the "id" paymentToCashup.
     *
     * @param id the id of the paymentToCashup to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the paymentToCashup, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/payment-to-cashups/{id}")
    public ResponseEntity<PaymentToCashup> getPaymentToCashup(@PathVariable Long id) {
        log.debug("REST request to get PaymentToCashup : {}", id);
        Optional<PaymentToCashup> paymentToCashup = paymentToCashupRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(paymentToCashup);
    }

    /**
     * {@code DELETE  /payment-to-cashups/:id} : delete the "id" paymentToCashup.
     *
     * @param id the id of the paymentToCashup to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/payment-to-cashups/{id}")
    public ResponseEntity<Void> deletePaymentToCashup(@PathVariable Long id) {
        log.debug("REST request to delete PaymentToCashup : {}", id);
        paymentToCashupRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
