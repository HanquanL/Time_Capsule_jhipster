package com.onetimecapsule.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.onetimecapsule.app.IntegrationTest;
import com.onetimecapsule.app.domain.UserUploadFile;
import com.onetimecapsule.app.repository.UserUploadFileRepository;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link UserUploadFileResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserUploadFileResourceIT {

    private static final UUID DEFAULT_FILEID = UUID.randomUUID();
    private static final UUID UPDATED_FILEID = UUID.randomUUID();

    private static final String DEFAULT_FILENAME = "AAAAAAAAAA";
    private static final String UPDATED_FILENAME = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENTYPE = "AAAAAAAAAA";
    private static final String UPDATED_CONTENTYPE = "BBBBBBBBBB";

    private static final String DEFAULT_FILESIZE = "AAAAAAAAAA";
    private static final String UPDATED_FILESIZE = "BBBBBBBBBB";

    private static final byte[] DEFAULT_FILEDATA = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_FILEDATA = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_FILEDATA_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_FILEDATA_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/user-upload-files";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserUploadFileRepository userUploadFileRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserUploadFileMockMvc;

    private UserUploadFile userUploadFile;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserUploadFile createEntity(EntityManager em) {
        UserUploadFile userUploadFile = new UserUploadFile()
            .fileid(DEFAULT_FILEID)
            .filename(DEFAULT_FILENAME)
            .contentype(DEFAULT_CONTENTYPE)
            .filesize(DEFAULT_FILESIZE)
            .filedata(DEFAULT_FILEDATA)
            .filedataContentType(DEFAULT_FILEDATA_CONTENT_TYPE);
        return userUploadFile;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserUploadFile createUpdatedEntity(EntityManager em) {
        UserUploadFile userUploadFile = new UserUploadFile()
            .fileid(UPDATED_FILEID)
            .filename(UPDATED_FILENAME)
            .contentype(UPDATED_CONTENTYPE)
            .filesize(UPDATED_FILESIZE)
            .filedata(UPDATED_FILEDATA)
            .filedataContentType(UPDATED_FILEDATA_CONTENT_TYPE);
        return userUploadFile;
    }

    @BeforeEach
    public void initTest() {
        userUploadFile = createEntity(em);
    }

    @Test
    @Transactional
    void createUserUploadFile() throws Exception {
        int databaseSizeBeforeCreate = userUploadFileRepository.findAll().size();
        // Create the UserUploadFile
        restUserUploadFileMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userUploadFile))
            )
            .andExpect(status().isCreated());

        // Validate the UserUploadFile in the database
        List<UserUploadFile> userUploadFileList = userUploadFileRepository.findAll();
        assertThat(userUploadFileList).hasSize(databaseSizeBeforeCreate + 1);
        UserUploadFile testUserUploadFile = userUploadFileList.get(userUploadFileList.size() - 1);
        assertThat(testUserUploadFile.getFileid()).isEqualTo(DEFAULT_FILEID);
        assertThat(testUserUploadFile.getFilename()).isEqualTo(DEFAULT_FILENAME);
        assertThat(testUserUploadFile.getContentype()).isEqualTo(DEFAULT_CONTENTYPE);
        assertThat(testUserUploadFile.getFilesize()).isEqualTo(DEFAULT_FILESIZE);
        assertThat(testUserUploadFile.getFiledata()).isEqualTo(DEFAULT_FILEDATA);
        assertThat(testUserUploadFile.getFiledataContentType()).isEqualTo(DEFAULT_FILEDATA_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createUserUploadFileWithExistingId() throws Exception {
        // Create the UserUploadFile with an existing ID
        userUploadFile.setId(1L);

        int databaseSizeBeforeCreate = userUploadFileRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserUploadFileMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userUploadFile))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserUploadFile in the database
        List<UserUploadFile> userUploadFileList = userUploadFileRepository.findAll();
        assertThat(userUploadFileList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFilenameIsRequired() throws Exception {
        int databaseSizeBeforeTest = userUploadFileRepository.findAll().size();
        // set the field null
        userUploadFile.setFilename(null);

        // Create the UserUploadFile, which fails.

        restUserUploadFileMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userUploadFile))
            )
            .andExpect(status().isBadRequest());

        List<UserUploadFile> userUploadFileList = userUploadFileRepository.findAll();
        assertThat(userUploadFileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUserUploadFiles() throws Exception {
        // Initialize the database
        userUploadFileRepository.saveAndFlush(userUploadFile);

        // Get all the userUploadFileList
        restUserUploadFileMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userUploadFile.getId().intValue())))
            .andExpect(jsonPath("$.[*].fileid").value(hasItem(DEFAULT_FILEID.toString())))
            .andExpect(jsonPath("$.[*].filename").value(hasItem(DEFAULT_FILENAME)))
            .andExpect(jsonPath("$.[*].contentype").value(hasItem(DEFAULT_CONTENTYPE)))
            .andExpect(jsonPath("$.[*].filesize").value(hasItem(DEFAULT_FILESIZE)))
            .andExpect(jsonPath("$.[*].filedataContentType").value(hasItem(DEFAULT_FILEDATA_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].filedata").value(hasItem(Base64Utils.encodeToString(DEFAULT_FILEDATA))));
    }

    @Test
    @Transactional
    void getUserUploadFile() throws Exception {
        // Initialize the database
        userUploadFileRepository.saveAndFlush(userUploadFile);

        // Get the userUploadFile
        restUserUploadFileMockMvc
            .perform(get(ENTITY_API_URL_ID, userUploadFile.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userUploadFile.getId().intValue()))
            .andExpect(jsonPath("$.fileid").value(DEFAULT_FILEID.toString()))
            .andExpect(jsonPath("$.filename").value(DEFAULT_FILENAME))
            .andExpect(jsonPath("$.contentype").value(DEFAULT_CONTENTYPE))
            .andExpect(jsonPath("$.filesize").value(DEFAULT_FILESIZE))
            .andExpect(jsonPath("$.filedataContentType").value(DEFAULT_FILEDATA_CONTENT_TYPE))
            .andExpect(jsonPath("$.filedata").value(Base64Utils.encodeToString(DEFAULT_FILEDATA)));
    }

    @Test
    @Transactional
    void getNonExistingUserUploadFile() throws Exception {
        // Get the userUploadFile
        restUserUploadFileMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserUploadFile() throws Exception {
        // Initialize the database
        userUploadFileRepository.saveAndFlush(userUploadFile);

        int databaseSizeBeforeUpdate = userUploadFileRepository.findAll().size();

        // Update the userUploadFile
        UserUploadFile updatedUserUploadFile = userUploadFileRepository.findById(userUploadFile.getId()).get();
        // Disconnect from session so that the updates on updatedUserUploadFile are not directly saved in db
        em.detach(updatedUserUploadFile);
        updatedUserUploadFile
            .fileid(UPDATED_FILEID)
            .filename(UPDATED_FILENAME)
            .contentype(UPDATED_CONTENTYPE)
            .filesize(UPDATED_FILESIZE)
            .filedata(UPDATED_FILEDATA)
            .filedataContentType(UPDATED_FILEDATA_CONTENT_TYPE);

        restUserUploadFileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserUploadFile.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserUploadFile))
            )
            .andExpect(status().isOk());

        // Validate the UserUploadFile in the database
        List<UserUploadFile> userUploadFileList = userUploadFileRepository.findAll();
        assertThat(userUploadFileList).hasSize(databaseSizeBeforeUpdate);
        UserUploadFile testUserUploadFile = userUploadFileList.get(userUploadFileList.size() - 1);
        assertThat(testUserUploadFile.getFileid()).isEqualTo(UPDATED_FILEID);
        assertThat(testUserUploadFile.getFilename()).isEqualTo(UPDATED_FILENAME);
        assertThat(testUserUploadFile.getContentype()).isEqualTo(UPDATED_CONTENTYPE);
        assertThat(testUserUploadFile.getFilesize()).isEqualTo(UPDATED_FILESIZE);
        assertThat(testUserUploadFile.getFiledata()).isEqualTo(UPDATED_FILEDATA);
        assertThat(testUserUploadFile.getFiledataContentType()).isEqualTo(UPDATED_FILEDATA_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingUserUploadFile() throws Exception {
        int databaseSizeBeforeUpdate = userUploadFileRepository.findAll().size();
        userUploadFile.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserUploadFileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userUploadFile.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userUploadFile))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserUploadFile in the database
        List<UserUploadFile> userUploadFileList = userUploadFileRepository.findAll();
        assertThat(userUploadFileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserUploadFile() throws Exception {
        int databaseSizeBeforeUpdate = userUploadFileRepository.findAll().size();
        userUploadFile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserUploadFileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userUploadFile))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserUploadFile in the database
        List<UserUploadFile> userUploadFileList = userUploadFileRepository.findAll();
        assertThat(userUploadFileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserUploadFile() throws Exception {
        int databaseSizeBeforeUpdate = userUploadFileRepository.findAll().size();
        userUploadFile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserUploadFileMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userUploadFile)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserUploadFile in the database
        List<UserUploadFile> userUploadFileList = userUploadFileRepository.findAll();
        assertThat(userUploadFileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserUploadFileWithPatch() throws Exception {
        // Initialize the database
        userUploadFileRepository.saveAndFlush(userUploadFile);

        int databaseSizeBeforeUpdate = userUploadFileRepository.findAll().size();

        // Update the userUploadFile using partial update
        UserUploadFile partialUpdatedUserUploadFile = new UserUploadFile();
        partialUpdatedUserUploadFile.setId(userUploadFile.getId());

        partialUpdatedUserUploadFile
            .contentype(UPDATED_CONTENTYPE)
            .filedata(UPDATED_FILEDATA)
            .filedataContentType(UPDATED_FILEDATA_CONTENT_TYPE);

        restUserUploadFileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserUploadFile.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserUploadFile))
            )
            .andExpect(status().isOk());

        // Validate the UserUploadFile in the database
        List<UserUploadFile> userUploadFileList = userUploadFileRepository.findAll();
        assertThat(userUploadFileList).hasSize(databaseSizeBeforeUpdate);
        UserUploadFile testUserUploadFile = userUploadFileList.get(userUploadFileList.size() - 1);
        assertThat(testUserUploadFile.getFileid()).isEqualTo(DEFAULT_FILEID);
        assertThat(testUserUploadFile.getFilename()).isEqualTo(DEFAULT_FILENAME);
        assertThat(testUserUploadFile.getContentype()).isEqualTo(UPDATED_CONTENTYPE);
        assertThat(testUserUploadFile.getFilesize()).isEqualTo(DEFAULT_FILESIZE);
        assertThat(testUserUploadFile.getFiledata()).isEqualTo(UPDATED_FILEDATA);
        assertThat(testUserUploadFile.getFiledataContentType()).isEqualTo(UPDATED_FILEDATA_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateUserUploadFileWithPatch() throws Exception {
        // Initialize the database
        userUploadFileRepository.saveAndFlush(userUploadFile);

        int databaseSizeBeforeUpdate = userUploadFileRepository.findAll().size();

        // Update the userUploadFile using partial update
        UserUploadFile partialUpdatedUserUploadFile = new UserUploadFile();
        partialUpdatedUserUploadFile.setId(userUploadFile.getId());

        partialUpdatedUserUploadFile
            .fileid(UPDATED_FILEID)
            .filename(UPDATED_FILENAME)
            .contentype(UPDATED_CONTENTYPE)
            .filesize(UPDATED_FILESIZE)
            .filedata(UPDATED_FILEDATA)
            .filedataContentType(UPDATED_FILEDATA_CONTENT_TYPE);

        restUserUploadFileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserUploadFile.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserUploadFile))
            )
            .andExpect(status().isOk());

        // Validate the UserUploadFile in the database
        List<UserUploadFile> userUploadFileList = userUploadFileRepository.findAll();
        assertThat(userUploadFileList).hasSize(databaseSizeBeforeUpdate);
        UserUploadFile testUserUploadFile = userUploadFileList.get(userUploadFileList.size() - 1);
        assertThat(testUserUploadFile.getFileid()).isEqualTo(UPDATED_FILEID);
        assertThat(testUserUploadFile.getFilename()).isEqualTo(UPDATED_FILENAME);
        assertThat(testUserUploadFile.getContentype()).isEqualTo(UPDATED_CONTENTYPE);
        assertThat(testUserUploadFile.getFilesize()).isEqualTo(UPDATED_FILESIZE);
        assertThat(testUserUploadFile.getFiledata()).isEqualTo(UPDATED_FILEDATA);
        assertThat(testUserUploadFile.getFiledataContentType()).isEqualTo(UPDATED_FILEDATA_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingUserUploadFile() throws Exception {
        int databaseSizeBeforeUpdate = userUploadFileRepository.findAll().size();
        userUploadFile.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserUploadFileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userUploadFile.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userUploadFile))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserUploadFile in the database
        List<UserUploadFile> userUploadFileList = userUploadFileRepository.findAll();
        assertThat(userUploadFileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserUploadFile() throws Exception {
        int databaseSizeBeforeUpdate = userUploadFileRepository.findAll().size();
        userUploadFile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserUploadFileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userUploadFile))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserUploadFile in the database
        List<UserUploadFile> userUploadFileList = userUploadFileRepository.findAll();
        assertThat(userUploadFileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserUploadFile() throws Exception {
        int databaseSizeBeforeUpdate = userUploadFileRepository.findAll().size();
        userUploadFile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserUploadFileMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userUploadFile))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserUploadFile in the database
        List<UserUploadFile> userUploadFileList = userUploadFileRepository.findAll();
        assertThat(userUploadFileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserUploadFile() throws Exception {
        // Initialize the database
        userUploadFileRepository.saveAndFlush(userUploadFile);

        int databaseSizeBeforeDelete = userUploadFileRepository.findAll().size();

        // Delete the userUploadFile
        restUserUploadFileMockMvc
            .perform(delete(ENTITY_API_URL_ID, userUploadFile.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserUploadFile> userUploadFileList = userUploadFileRepository.findAll();
        assertThat(userUploadFileList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
