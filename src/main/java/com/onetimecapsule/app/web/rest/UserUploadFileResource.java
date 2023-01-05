package com.onetimecapsule.app.web.rest;

import com.onetimecapsule.app.domain.UserUploadFile;
import com.onetimecapsule.app.repository.UserUploadFileRepository;
import com.onetimecapsule.app.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.onetimecapsule.app.domain.UserUploadFile}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserUploadFileResource {

    private final Logger log = LoggerFactory.getLogger(UserUploadFileResource.class);

    private static final String ENTITY_NAME = "userUploadFile";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserUploadFileRepository userUploadFileRepository;

    public UserUploadFileResource(UserUploadFileRepository userUploadFileRepository) {
        this.userUploadFileRepository = userUploadFileRepository;
    }

    /**
     * {@code POST  /user-upload-files} : Create a new userUploadFile.
     *
     * @param userUploadFile the userUploadFile to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userUploadFile, or with status {@code 400 (Bad Request)} if the userUploadFile has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-upload-files")
    public ResponseEntity<UserUploadFile> createUserUploadFile(@Valid @RequestBody UserUploadFile userUploadFile)
        throws URISyntaxException {
        log.debug("REST request to save UserUploadFile : {}", userUploadFile);
        if (userUploadFile.getId() != null) {
            throw new BadRequestAlertException("A new userUploadFile cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserUploadFile result = userUploadFileRepository.save(userUploadFile);
        return ResponseEntity
            .created(new URI("/api/user-upload-files/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-upload-files/:id} : Updates an existing userUploadFile.
     *
     * @param id the id of the userUploadFile to save.
     * @param userUploadFile the userUploadFile to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userUploadFile,
     * or with status {@code 400 (Bad Request)} if the userUploadFile is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userUploadFile couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-upload-files/{id}")
    public ResponseEntity<UserUploadFile> updateUserUploadFile(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody UserUploadFile userUploadFile
    ) throws URISyntaxException {
        log.debug("REST request to update UserUploadFile : {}, {}", id, userUploadFile);
        if (userUploadFile.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userUploadFile.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userUploadFileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserUploadFile result = userUploadFileRepository.save(userUploadFile);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userUploadFile.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-upload-files/:id} : Partial updates given fields of an existing userUploadFile, field will ignore if it is null
     *
     * @param id the id of the userUploadFile to save.
     * @param userUploadFile the userUploadFile to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userUploadFile,
     * or with status {@code 400 (Bad Request)} if the userUploadFile is not valid,
     * or with status {@code 404 (Not Found)} if the userUploadFile is not found,
     * or with status {@code 500 (Internal Server Error)} if the userUploadFile couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-upload-files/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserUploadFile> partialUpdateUserUploadFile(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody UserUploadFile userUploadFile
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserUploadFile partially : {}, {}", id, userUploadFile);
        if (userUploadFile.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userUploadFile.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userUploadFileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserUploadFile> result = userUploadFileRepository
            .findById(userUploadFile.getId())
            .map(existingUserUploadFile -> {
                if (userUploadFile.getFileid() != null) {
                    existingUserUploadFile.setFileid(userUploadFile.getFileid());
                }
                if (userUploadFile.getFilename() != null) {
                    existingUserUploadFile.setFilename(userUploadFile.getFilename());
                }
                if (userUploadFile.getContentype() != null) {
                    existingUserUploadFile.setContentype(userUploadFile.getContentype());
                }
                if (userUploadFile.getFilesize() != null) {
                    existingUserUploadFile.setFilesize(userUploadFile.getFilesize());
                }
                if (userUploadFile.getFiledata() != null) {
                    existingUserUploadFile.setFiledata(userUploadFile.getFiledata());
                }
                if (userUploadFile.getFiledataContentType() != null) {
                    existingUserUploadFile.setFiledataContentType(userUploadFile.getFiledataContentType());
                }

                return existingUserUploadFile;
            })
            .map(userUploadFileRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userUploadFile.getId().toString())
        );
    }

    /**
     * {@code GET  /user-upload-files} : get all the userUploadFiles.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userUploadFiles in body.
     */
    @GetMapping("/user-upload-files")
    public List<UserUploadFile> getAllUserUploadFiles() {
        log.debug("REST request to get all UserUploadFiles");
        return userUploadFileRepository.findAll();
    }

    /**
     * {@code GET  /user-upload-files/:id} : get the "id" userUploadFile.
     *
     * @param id the id of the userUploadFile to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userUploadFile, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-upload-files/{id}")
    public ResponseEntity<UserUploadFile> getUserUploadFile(@PathVariable Long id) {
        log.debug("REST request to get UserUploadFile : {}", id);
        Optional<UserUploadFile> userUploadFile = userUploadFileRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userUploadFile);
    }

    /**
     * {@code DELETE  /user-upload-files/:id} : delete the "id" userUploadFile.
     *
     * @param id the id of the userUploadFile to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-upload-files/{id}")
    public ResponseEntity<Void> deleteUserUploadFile(@PathVariable Long id) {
        log.debug("REST request to delete UserUploadFile : {}", id);
        userUploadFileRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
