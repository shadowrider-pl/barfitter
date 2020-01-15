package finbarre.web.rest;

import finbarre.domain.ProductDelivered;
import finbarre.repository.ProductDeliveredRepository;
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
 * REST controller for managing {@link finbarre.domain.ProductDelivered}.
 */
@RestController
@RequestMapping("/api")
public class ProductDeliveredResource {

    private final Logger log = LoggerFactory.getLogger(ProductDeliveredResource.class);

    private static final String ENTITY_NAME = "productDelivered";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductDeliveredRepository productDeliveredRepository;

    public ProductDeliveredResource(ProductDeliveredRepository productDeliveredRepository) {
        this.productDeliveredRepository = productDeliveredRepository;
    }

    /**
     * {@code POST  /product-delivereds} : Create a new productDelivered.
     *
     * @param productDelivered the productDelivered to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productDelivered, or with status {@code 400 (Bad Request)} if the productDelivered has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/product-delivereds")
    public ResponseEntity<ProductDelivered> createProductDelivered(@Valid @RequestBody ProductDelivered productDelivered) throws URISyntaxException {
        log.debug("REST request to save ProductDelivered : {}", productDelivered);
        if (productDelivered.getId() != null) {
            throw new BadRequestAlertException("A new productDelivered cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductDelivered result = productDeliveredRepository.save(productDelivered);
        return ResponseEntity.created(new URI("/api/product-delivereds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /product-delivereds} : Updates an existing productDelivered.
     *
     * @param productDelivered the productDelivered to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productDelivered,
     * or with status {@code 400 (Bad Request)} if the productDelivered is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productDelivered couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/product-delivereds")
    public ResponseEntity<ProductDelivered> updateProductDelivered(@Valid @RequestBody ProductDelivered productDelivered) throws URISyntaxException {
        log.debug("REST request to update ProductDelivered : {}", productDelivered);
        if (productDelivered.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ProductDelivered result = productDeliveredRepository.save(productDelivered);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productDelivered.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /product-delivereds} : get all the productDelivereds.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productDelivereds in body.
     */
    @GetMapping("/product-delivereds")
    public ResponseEntity<List<ProductDelivered>> getAllProductDelivereds(Pageable pageable) {
        log.debug("REST request to get a page of ProductDelivereds");
        Page<ProductDelivered> page = productDeliveredRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /product-delivereds/:id} : get the "id" productDelivered.
     *
     * @param id the id of the productDelivered to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productDelivered, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/product-delivereds/{id}")
    public ResponseEntity<ProductDelivered> getProductDelivered(@PathVariable Long id) {
        log.debug("REST request to get ProductDelivered : {}", id);
        Optional<ProductDelivered> productDelivered = productDeliveredRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(productDelivered);
    }

    /**
     * {@code DELETE  /product-delivereds/:id} : delete the "id" productDelivered.
     *
     * @param id the id of the productDelivered to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/product-delivereds/{id}")
    public ResponseEntity<Void> deleteProductDelivered(@PathVariable Long id) {
        log.debug("REST request to delete ProductDelivered : {}", id);
        productDeliveredRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
