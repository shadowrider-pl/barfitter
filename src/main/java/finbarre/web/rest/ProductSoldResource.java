package finbarre.web.rest;

import finbarre.domain.ProductSold;
import finbarre.repository.ProductSoldRepository;
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
 * REST controller for managing {@link finbarre.domain.ProductSold}.
 */
@RestController
@RequestMapping("/api")
public class ProductSoldResource {

    private final Logger log = LoggerFactory.getLogger(ProductSoldResource.class);

    private static final String ENTITY_NAME = "productSold";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductSoldRepository productSoldRepository;

    public ProductSoldResource(ProductSoldRepository productSoldRepository) {
        this.productSoldRepository = productSoldRepository;
    }

    /**
     * {@code POST  /product-solds} : Create a new productSold.
     *
     * @param productSold the productSold to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productSold, or with status {@code 400 (Bad Request)} if the productSold has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/product-solds")
    public ResponseEntity<ProductSold> createProductSold(@Valid @RequestBody ProductSold productSold) throws URISyntaxException {
        log.debug("REST request to save ProductSold : {}", productSold);
        if (productSold.getId() != null) {
            throw new BadRequestAlertException("A new productSold cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductSold result = productSoldRepository.save(productSold);
        return ResponseEntity.created(new URI("/api/product-solds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /product-solds} : Updates an existing productSold.
     *
     * @param productSold the productSold to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productSold,
     * or with status {@code 400 (Bad Request)} if the productSold is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productSold couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/product-solds")
    public ResponseEntity<ProductSold> updateProductSold(@Valid @RequestBody ProductSold productSold) throws URISyntaxException {
        log.debug("REST request to update ProductSold : {}", productSold);
        if (productSold.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ProductSold result = productSoldRepository.save(productSold);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productSold.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /product-solds} : get all the productSolds.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productSolds in body.
     */
    @GetMapping("/product-solds")
    public ResponseEntity<List<ProductSold>> getAllProductSolds(Pageable pageable) {
        log.debug("REST request to get a page of ProductSolds");
        Page<ProductSold> page = productSoldRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /product-solds/:id} : get the "id" productSold.
     *
     * @param id the id of the productSold to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productSold, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/product-solds/{id}")
    public ResponseEntity<ProductSold> getProductSold(@PathVariable Long id) {
        log.debug("REST request to get ProductSold : {}", id);
        Optional<ProductSold> productSold = productSoldRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(productSold);
    }

    /**
     * {@code DELETE  /product-solds/:id} : delete the "id" productSold.
     *
     * @param id the id of the productSold to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/product-solds/{id}")
    public ResponseEntity<Void> deleteProductSold(@PathVariable Long id) {
        log.debug("REST request to delete ProductSold : {}", id);
        productSoldRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
