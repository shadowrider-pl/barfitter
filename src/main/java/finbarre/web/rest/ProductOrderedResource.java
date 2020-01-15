package finbarre.web.rest;

import finbarre.domain.ProductOrdered;
import finbarre.repository.ProductOrderedRepository;
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
 * REST controller for managing {@link finbarre.domain.ProductOrdered}.
 */
@RestController
@RequestMapping("/api")
public class ProductOrderedResource {

    private final Logger log = LoggerFactory.getLogger(ProductOrderedResource.class);

    private static final String ENTITY_NAME = "productOrdered";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductOrderedRepository productOrderedRepository;

    public ProductOrderedResource(ProductOrderedRepository productOrderedRepository) {
        this.productOrderedRepository = productOrderedRepository;
    }

    /**
     * {@code POST  /product-ordereds} : Create a new productOrdered.
     *
     * @param productOrdered the productOrdered to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productOrdered, or with status {@code 400 (Bad Request)} if the productOrdered has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/product-ordereds")
    public ResponseEntity<ProductOrdered> createProductOrdered(@Valid @RequestBody ProductOrdered productOrdered) throws URISyntaxException {
        log.debug("REST request to save ProductOrdered : {}", productOrdered);
        if (productOrdered.getId() != null) {
            throw new BadRequestAlertException("A new productOrdered cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductOrdered result = productOrderedRepository.save(productOrdered);
        return ResponseEntity.created(new URI("/api/product-ordereds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /product-ordereds} : Updates an existing productOrdered.
     *
     * @param productOrdered the productOrdered to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productOrdered,
     * or with status {@code 400 (Bad Request)} if the productOrdered is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productOrdered couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/product-ordereds")
    public ResponseEntity<ProductOrdered> updateProductOrdered(@Valid @RequestBody ProductOrdered productOrdered) throws URISyntaxException {
        log.debug("REST request to update ProductOrdered : {}", productOrdered);
        if (productOrdered.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ProductOrdered result = productOrderedRepository.save(productOrdered);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productOrdered.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /product-ordereds} : get all the productOrdereds.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productOrdereds in body.
     */
    @GetMapping("/product-ordereds")
    public ResponseEntity<List<ProductOrdered>> getAllProductOrdereds(Pageable pageable) {
        log.debug("REST request to get a page of ProductOrdereds");
        Page<ProductOrdered> page = productOrderedRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /product-ordereds/:id} : get the "id" productOrdered.
     *
     * @param id the id of the productOrdered to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productOrdered, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/product-ordereds/{id}")
    public ResponseEntity<ProductOrdered> getProductOrdered(@PathVariable Long id) {
        log.debug("REST request to get ProductOrdered : {}", id);
        Optional<ProductOrdered> productOrdered = productOrderedRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(productOrdered);
    }

    /**
     * {@code DELETE  /product-ordereds/:id} : delete the "id" productOrdered.
     *
     * @param id the id of the productOrdered to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/product-ordereds/{id}")
    public ResponseEntity<Void> deleteProductOrdered(@PathVariable Long id) {
        log.debug("REST request to delete ProductOrdered : {}", id);
        productOrderedRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
