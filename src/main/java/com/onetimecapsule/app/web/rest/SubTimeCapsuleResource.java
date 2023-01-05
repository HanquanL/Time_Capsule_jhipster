package com.onetimecapsule.app.web.rest;

import com.onetimecapsule.app.domain.SubTimeCapsule;
import com.onetimecapsule.app.repository.SubTimeCapsuleRepository;
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
 * REST controller for managing {@link com.onetimecapsule.app.domain.SubTimeCapsule}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SubTimeCapsuleResource {

    private final Logger log = LoggerFactory.getLogger(SubTimeCapsuleResource.class);

    private static final String ENTITY_NAME = "subTimeCapsule";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SubTimeCapsuleRepository subTimeCapsuleRepository;

    public SubTimeCapsuleResource(SubTimeCapsuleRepository subTimeCapsuleRepository) {
        this.subTimeCapsuleRepository = subTimeCapsuleRepository;
    }

    /**
     * {@code POST  /sub-time-capsules} : Create a new subTimeCapsule.
     *
     * @param subTimeCapsule the subTimeCapsule to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new subTimeCapsule, or with status {@code 400 (Bad Request)} if the subTimeCapsule has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sub-time-capsules")
    public ResponseEntity<SubTimeCapsule> createSubTimeCapsule(@RequestBody SubTimeCapsule subTimeCapsule) throws URISyntaxException {
        log.debug("REST request to save SubTimeCapsule : {}", subTimeCapsule);
        if (subTimeCapsule.getId() != null) {
            throw new BadRequestAlertException("A new subTimeCapsule cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SubTimeCapsule result = subTimeCapsuleRepository.save(subTimeCapsule);
        return ResponseEntity
            .created(new URI("/api/sub-time-capsules/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sub-time-capsules/:id} : Updates an existing subTimeCapsule.
     *
     * @param id the id of the subTimeCapsule to save.
     * @param subTimeCapsule the subTimeCapsule to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated subTimeCapsule,
     * or with status {@code 400 (Bad Request)} if the subTimeCapsule is not valid,
     * or with status {@code 500 (Internal Server Error)} if the subTimeCapsule couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sub-time-capsules/{id}")
    public ResponseEntity<SubTimeCapsule> updateSubTimeCapsule(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SubTimeCapsule subTimeCapsule
    ) throws URISyntaxException {
        log.debug("REST request to update SubTimeCapsule : {}, {}", id, subTimeCapsule);
        if (subTimeCapsule.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, subTimeCapsule.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!subTimeCapsuleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SubTimeCapsule result = subTimeCapsuleRepository.save(subTimeCapsule);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, subTimeCapsule.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sub-time-capsules/:id} : Partial updates given fields of an existing subTimeCapsule, field will ignore if it is null
     *
     * @param id the id of the subTimeCapsule to save.
     * @param subTimeCapsule the subTimeCapsule to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated subTimeCapsule,
     * or with status {@code 400 (Bad Request)} if the subTimeCapsule is not valid,
     * or with status {@code 404 (Not Found)} if the subTimeCapsule is not found,
     * or with status {@code 500 (Internal Server Error)} if the subTimeCapsule couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sub-time-capsules/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SubTimeCapsule> partialUpdateSubTimeCapsule(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SubTimeCapsule subTimeCapsule
    ) throws URISyntaxException {
        log.debug("REST request to partial update SubTimeCapsule partially : {}, {}", id, subTimeCapsule);
        if (subTimeCapsule.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, subTimeCapsule.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!subTimeCapsuleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SubTimeCapsule> result = subTimeCapsuleRepository
            .findById(subTimeCapsule.getId())
            .map(existingSubTimeCapsule -> {
                if (subTimeCapsule.getSubtimecapsuleid() != null) {
                    existingSubTimeCapsule.setSubtimecapsuleid(subTimeCapsule.getSubtimecapsuleid());
                }
                if (subTimeCapsule.getSubtimecapsulename() != null) {
                    existingSubTimeCapsule.setSubtimecapsulename(subTimeCapsule.getSubtimecapsulename());
                }
                if (subTimeCapsule.getDescription() != null) {
                    existingSubTimeCapsule.setDescription(subTimeCapsule.getDescription());
                }
                if (subTimeCapsule.getCreatedate() != null) {
                    existingSubTimeCapsule.setCreatedate(subTimeCapsule.getCreatedate());
                }

                return existingSubTimeCapsule;
            })
            .map(subTimeCapsuleRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, subTimeCapsule.getId().toString())
        );
    }

    /**
     * {@code GET  /sub-time-capsules} : get all the subTimeCapsules.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of subTimeCapsules in body.
     */
    @GetMapping("/sub-time-capsules")
    public List<SubTimeCapsule> getAllSubTimeCapsules() {
        log.debug("REST request to get all SubTimeCapsules");
        return subTimeCapsuleRepository.findAll();
    }

    /**
     * {@code GET  /sub-time-capsules/:id} : get the "id" subTimeCapsule.
     *
     * @param id the id of the subTimeCapsule to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the subTimeCapsule, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sub-time-capsules/{id}")
    public ResponseEntity<SubTimeCapsule> getSubTimeCapsule(@PathVariable Long id) {
        log.debug("REST request to get SubTimeCapsule : {}", id);
        Optional<SubTimeCapsule> subTimeCapsule = subTimeCapsuleRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(subTimeCapsule);
    }

    /**
     * {@code DELETE  /sub-time-capsules/:id} : delete the "id" subTimeCapsule.
     *
     * @param id the id of the subTimeCapsule to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sub-time-capsules/{id}")
    public ResponseEntity<Void> deleteSubTimeCapsule(@PathVariable Long id) {
        log.debug("REST request to delete SubTimeCapsule : {}", id);
        subTimeCapsuleRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
