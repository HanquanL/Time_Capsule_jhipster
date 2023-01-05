package com.onetimecapsule.app.web.rest;

import com.onetimecapsule.app.domain.VerifToken;
import com.onetimecapsule.app.repository.VerifTokenRepository;
import com.onetimecapsule.app.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.onetimecapsule.app.domain.VerifToken}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VerifTokenResource {

    private final Logger log = LoggerFactory.getLogger(VerifTokenResource.class);

    private static final String ENTITY_NAME = "verifToken";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VerifTokenRepository verifTokenRepository;

    public VerifTokenResource(VerifTokenRepository verifTokenRepository) {
        this.verifTokenRepository = verifTokenRepository;
    }

    /**
     * {@code POST  /verif-tokens} : Create a new verifToken.
     *
     * @param verifToken the verifToken to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new verifToken, or with status {@code 400 (Bad Request)} if the verifToken has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/verif-tokens")
    public ResponseEntity<VerifToken> createVerifToken(@RequestBody VerifToken verifToken) throws URISyntaxException {
        log.debug("REST request to save VerifToken : {}", verifToken);
        if (verifToken.getId() != null) {
            throw new BadRequestAlertException("A new verifToken cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VerifToken result = verifTokenRepository.save(verifToken);
        return ResponseEntity
            .created(new URI("/api/verif-tokens/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /verif-tokens/:id} : Updates an existing verifToken.
     *
     * @param id the id of the verifToken to save.
     * @param verifToken the verifToken to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated verifToken,
     * or with status {@code 400 (Bad Request)} if the verifToken is not valid,
     * or with status {@code 500 (Internal Server Error)} if the verifToken couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/verif-tokens/{id}")
    public ResponseEntity<VerifToken> updateVerifToken(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VerifToken verifToken
    ) throws URISyntaxException {
        log.debug("REST request to update VerifToken : {}, {}", id, verifToken);
        if (verifToken.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, verifToken.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!verifTokenRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        VerifToken result = verifTokenRepository.save(verifToken);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, verifToken.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /verif-tokens/:id} : Partial updates given fields of an existing verifToken, field will ignore if it is null
     *
     * @param id the id of the verifToken to save.
     * @param verifToken the verifToken to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated verifToken,
     * or with status {@code 400 (Bad Request)} if the verifToken is not valid,
     * or with status {@code 404 (Not Found)} if the verifToken is not found,
     * or with status {@code 500 (Internal Server Error)} if the verifToken couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/verif-tokens/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<VerifToken> partialUpdateVerifToken(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VerifToken verifToken
    ) throws URISyntaxException {
        log.debug("REST request to partial update VerifToken partially : {}, {}", id, verifToken);
        if (verifToken.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, verifToken.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!verifTokenRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<VerifToken> result = verifTokenRepository
            .findById(verifToken.getId())
            .map(existingVerifToken -> {
                if (verifToken.getTokenid() != null) {
                    existingVerifToken.setTokenid(verifToken.getTokenid());
                }
                if (verifToken.getToken() != null) {
                    existingVerifToken.setToken(verifToken.getToken());
                }
                if (verifToken.getExpirydate() != null) {
                    existingVerifToken.setExpirydate(verifToken.getExpirydate());
                }

                return existingVerifToken;
            })
            .map(verifTokenRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, verifToken.getId().toString())
        );
    }

    /**
     * {@code GET  /verif-tokens} : get all the verifTokens.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of verifTokens in body.
     */
    @GetMapping("/verif-tokens")
    public List<VerifToken> getAllVerifTokens() {
        log.debug("REST request to get all VerifTokens");
        return verifTokenRepository.findAll();
    }

    /**
     * {@code GET  /verif-tokens/:id} : get the "id" verifToken.
     *
     * @param id the id of the verifToken to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the verifToken, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/verif-tokens/{id}")
    public ResponseEntity<VerifToken> getVerifToken(@PathVariable Long id) {
        log.debug("REST request to get VerifToken : {}", id);
        Optional<VerifToken> verifToken = verifTokenRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(verifToken);
    }

    /**
     * {@code DELETE  /verif-tokens/:id} : delete the "id" verifToken.
     *
     * @param id the id of the verifToken to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/verif-tokens/{id}")
    public ResponseEntity<Void> deleteVerifToken(@PathVariable Long id) {
        log.debug("REST request to delete VerifToken : {}", id);
        verifTokenRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
