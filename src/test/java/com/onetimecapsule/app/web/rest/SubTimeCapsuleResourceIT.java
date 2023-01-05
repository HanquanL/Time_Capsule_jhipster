package com.onetimecapsule.app.web.rest;

import static com.onetimecapsule.app.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.onetimecapsule.app.IntegrationTest;
import com.onetimecapsule.app.domain.SubTimeCapsule;
import com.onetimecapsule.app.repository.SubTimeCapsuleRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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

/**
 * Integration tests for the {@link SubTimeCapsuleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SubTimeCapsuleResourceIT {

    private static final UUID DEFAULT_SUBTIMECAPSULEID = UUID.randomUUID();
    private static final UUID UPDATED_SUBTIMECAPSULEID = UUID.randomUUID();

    private static final String DEFAULT_SUBTIMECAPSULENAME = "AAAAAAAAAA";
    private static final String UPDATED_SUBTIMECAPSULENAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATEDATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATEDATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/sub-time-capsules";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SubTimeCapsuleRepository subTimeCapsuleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSubTimeCapsuleMockMvc;

    private SubTimeCapsule subTimeCapsule;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SubTimeCapsule createEntity(EntityManager em) {
        SubTimeCapsule subTimeCapsule = new SubTimeCapsule()
            .subtimecapsuleid(DEFAULT_SUBTIMECAPSULEID)
            .subtimecapsulename(DEFAULT_SUBTIMECAPSULENAME)
            .description(DEFAULT_DESCRIPTION)
            .createdate(DEFAULT_CREATEDATE);
        return subTimeCapsule;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SubTimeCapsule createUpdatedEntity(EntityManager em) {
        SubTimeCapsule subTimeCapsule = new SubTimeCapsule()
            .subtimecapsuleid(UPDATED_SUBTIMECAPSULEID)
            .subtimecapsulename(UPDATED_SUBTIMECAPSULENAME)
            .description(UPDATED_DESCRIPTION)
            .createdate(UPDATED_CREATEDATE);
        return subTimeCapsule;
    }

    @BeforeEach
    public void initTest() {
        subTimeCapsule = createEntity(em);
    }

    @Test
    @Transactional
    void createSubTimeCapsule() throws Exception {
        int databaseSizeBeforeCreate = subTimeCapsuleRepository.findAll().size();
        // Create the SubTimeCapsule
        restSubTimeCapsuleMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(subTimeCapsule))
            )
            .andExpect(status().isCreated());

        // Validate the SubTimeCapsule in the database
        List<SubTimeCapsule> subTimeCapsuleList = subTimeCapsuleRepository.findAll();
        assertThat(subTimeCapsuleList).hasSize(databaseSizeBeforeCreate + 1);
        SubTimeCapsule testSubTimeCapsule = subTimeCapsuleList.get(subTimeCapsuleList.size() - 1);
        assertThat(testSubTimeCapsule.getSubtimecapsuleid()).isEqualTo(DEFAULT_SUBTIMECAPSULEID);
        assertThat(testSubTimeCapsule.getSubtimecapsulename()).isEqualTo(DEFAULT_SUBTIMECAPSULENAME);
        assertThat(testSubTimeCapsule.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testSubTimeCapsule.getCreatedate()).isEqualTo(DEFAULT_CREATEDATE);
    }

    @Test
    @Transactional
    void createSubTimeCapsuleWithExistingId() throws Exception {
        // Create the SubTimeCapsule with an existing ID
        subTimeCapsule.setId(1L);

        int databaseSizeBeforeCreate = subTimeCapsuleRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSubTimeCapsuleMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(subTimeCapsule))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubTimeCapsule in the database
        List<SubTimeCapsule> subTimeCapsuleList = subTimeCapsuleRepository.findAll();
        assertThat(subTimeCapsuleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSubTimeCapsules() throws Exception {
        // Initialize the database
        subTimeCapsuleRepository.saveAndFlush(subTimeCapsule);

        // Get all the subTimeCapsuleList
        restSubTimeCapsuleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(subTimeCapsule.getId().intValue())))
            .andExpect(jsonPath("$.[*].subtimecapsuleid").value(hasItem(DEFAULT_SUBTIMECAPSULEID.toString())))
            .andExpect(jsonPath("$.[*].subtimecapsulename").value(hasItem(DEFAULT_SUBTIMECAPSULENAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].createdate").value(hasItem(sameInstant(DEFAULT_CREATEDATE))));
    }

    @Test
    @Transactional
    void getSubTimeCapsule() throws Exception {
        // Initialize the database
        subTimeCapsuleRepository.saveAndFlush(subTimeCapsule);

        // Get the subTimeCapsule
        restSubTimeCapsuleMockMvc
            .perform(get(ENTITY_API_URL_ID, subTimeCapsule.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(subTimeCapsule.getId().intValue()))
            .andExpect(jsonPath("$.subtimecapsuleid").value(DEFAULT_SUBTIMECAPSULEID.toString()))
            .andExpect(jsonPath("$.subtimecapsulename").value(DEFAULT_SUBTIMECAPSULENAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.createdate").value(sameInstant(DEFAULT_CREATEDATE)));
    }

    @Test
    @Transactional
    void getNonExistingSubTimeCapsule() throws Exception {
        // Get the subTimeCapsule
        restSubTimeCapsuleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSubTimeCapsule() throws Exception {
        // Initialize the database
        subTimeCapsuleRepository.saveAndFlush(subTimeCapsule);

        int databaseSizeBeforeUpdate = subTimeCapsuleRepository.findAll().size();

        // Update the subTimeCapsule
        SubTimeCapsule updatedSubTimeCapsule = subTimeCapsuleRepository.findById(subTimeCapsule.getId()).get();
        // Disconnect from session so that the updates on updatedSubTimeCapsule are not directly saved in db
        em.detach(updatedSubTimeCapsule);
        updatedSubTimeCapsule
            .subtimecapsuleid(UPDATED_SUBTIMECAPSULEID)
            .subtimecapsulename(UPDATED_SUBTIMECAPSULENAME)
            .description(UPDATED_DESCRIPTION)
            .createdate(UPDATED_CREATEDATE);

        restSubTimeCapsuleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSubTimeCapsule.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSubTimeCapsule))
            )
            .andExpect(status().isOk());

        // Validate the SubTimeCapsule in the database
        List<SubTimeCapsule> subTimeCapsuleList = subTimeCapsuleRepository.findAll();
        assertThat(subTimeCapsuleList).hasSize(databaseSizeBeforeUpdate);
        SubTimeCapsule testSubTimeCapsule = subTimeCapsuleList.get(subTimeCapsuleList.size() - 1);
        assertThat(testSubTimeCapsule.getSubtimecapsuleid()).isEqualTo(UPDATED_SUBTIMECAPSULEID);
        assertThat(testSubTimeCapsule.getSubtimecapsulename()).isEqualTo(UPDATED_SUBTIMECAPSULENAME);
        assertThat(testSubTimeCapsule.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSubTimeCapsule.getCreatedate()).isEqualTo(UPDATED_CREATEDATE);
    }

    @Test
    @Transactional
    void putNonExistingSubTimeCapsule() throws Exception {
        int databaseSizeBeforeUpdate = subTimeCapsuleRepository.findAll().size();
        subTimeCapsule.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSubTimeCapsuleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, subTimeCapsule.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(subTimeCapsule))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubTimeCapsule in the database
        List<SubTimeCapsule> subTimeCapsuleList = subTimeCapsuleRepository.findAll();
        assertThat(subTimeCapsuleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSubTimeCapsule() throws Exception {
        int databaseSizeBeforeUpdate = subTimeCapsuleRepository.findAll().size();
        subTimeCapsule.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubTimeCapsuleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(subTimeCapsule))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubTimeCapsule in the database
        List<SubTimeCapsule> subTimeCapsuleList = subTimeCapsuleRepository.findAll();
        assertThat(subTimeCapsuleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSubTimeCapsule() throws Exception {
        int databaseSizeBeforeUpdate = subTimeCapsuleRepository.findAll().size();
        subTimeCapsule.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubTimeCapsuleMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(subTimeCapsule)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SubTimeCapsule in the database
        List<SubTimeCapsule> subTimeCapsuleList = subTimeCapsuleRepository.findAll();
        assertThat(subTimeCapsuleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSubTimeCapsuleWithPatch() throws Exception {
        // Initialize the database
        subTimeCapsuleRepository.saveAndFlush(subTimeCapsule);

        int databaseSizeBeforeUpdate = subTimeCapsuleRepository.findAll().size();

        // Update the subTimeCapsule using partial update
        SubTimeCapsule partialUpdatedSubTimeCapsule = new SubTimeCapsule();
        partialUpdatedSubTimeCapsule.setId(subTimeCapsule.getId());

        partialUpdatedSubTimeCapsule.subtimecapsuleid(UPDATED_SUBTIMECAPSULEID).description(UPDATED_DESCRIPTION);

        restSubTimeCapsuleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSubTimeCapsule.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSubTimeCapsule))
            )
            .andExpect(status().isOk());

        // Validate the SubTimeCapsule in the database
        List<SubTimeCapsule> subTimeCapsuleList = subTimeCapsuleRepository.findAll();
        assertThat(subTimeCapsuleList).hasSize(databaseSizeBeforeUpdate);
        SubTimeCapsule testSubTimeCapsule = subTimeCapsuleList.get(subTimeCapsuleList.size() - 1);
        assertThat(testSubTimeCapsule.getSubtimecapsuleid()).isEqualTo(UPDATED_SUBTIMECAPSULEID);
        assertThat(testSubTimeCapsule.getSubtimecapsulename()).isEqualTo(DEFAULT_SUBTIMECAPSULENAME);
        assertThat(testSubTimeCapsule.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSubTimeCapsule.getCreatedate()).isEqualTo(DEFAULT_CREATEDATE);
    }

    @Test
    @Transactional
    void fullUpdateSubTimeCapsuleWithPatch() throws Exception {
        // Initialize the database
        subTimeCapsuleRepository.saveAndFlush(subTimeCapsule);

        int databaseSizeBeforeUpdate = subTimeCapsuleRepository.findAll().size();

        // Update the subTimeCapsule using partial update
        SubTimeCapsule partialUpdatedSubTimeCapsule = new SubTimeCapsule();
        partialUpdatedSubTimeCapsule.setId(subTimeCapsule.getId());

        partialUpdatedSubTimeCapsule
            .subtimecapsuleid(UPDATED_SUBTIMECAPSULEID)
            .subtimecapsulename(UPDATED_SUBTIMECAPSULENAME)
            .description(UPDATED_DESCRIPTION)
            .createdate(UPDATED_CREATEDATE);

        restSubTimeCapsuleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSubTimeCapsule.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSubTimeCapsule))
            )
            .andExpect(status().isOk());

        // Validate the SubTimeCapsule in the database
        List<SubTimeCapsule> subTimeCapsuleList = subTimeCapsuleRepository.findAll();
        assertThat(subTimeCapsuleList).hasSize(databaseSizeBeforeUpdate);
        SubTimeCapsule testSubTimeCapsule = subTimeCapsuleList.get(subTimeCapsuleList.size() - 1);
        assertThat(testSubTimeCapsule.getSubtimecapsuleid()).isEqualTo(UPDATED_SUBTIMECAPSULEID);
        assertThat(testSubTimeCapsule.getSubtimecapsulename()).isEqualTo(UPDATED_SUBTIMECAPSULENAME);
        assertThat(testSubTimeCapsule.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSubTimeCapsule.getCreatedate()).isEqualTo(UPDATED_CREATEDATE);
    }

    @Test
    @Transactional
    void patchNonExistingSubTimeCapsule() throws Exception {
        int databaseSizeBeforeUpdate = subTimeCapsuleRepository.findAll().size();
        subTimeCapsule.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSubTimeCapsuleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, subTimeCapsule.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(subTimeCapsule))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubTimeCapsule in the database
        List<SubTimeCapsule> subTimeCapsuleList = subTimeCapsuleRepository.findAll();
        assertThat(subTimeCapsuleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSubTimeCapsule() throws Exception {
        int databaseSizeBeforeUpdate = subTimeCapsuleRepository.findAll().size();
        subTimeCapsule.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubTimeCapsuleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(subTimeCapsule))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubTimeCapsule in the database
        List<SubTimeCapsule> subTimeCapsuleList = subTimeCapsuleRepository.findAll();
        assertThat(subTimeCapsuleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSubTimeCapsule() throws Exception {
        int databaseSizeBeforeUpdate = subTimeCapsuleRepository.findAll().size();
        subTimeCapsule.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubTimeCapsuleMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(subTimeCapsule))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SubTimeCapsule in the database
        List<SubTimeCapsule> subTimeCapsuleList = subTimeCapsuleRepository.findAll();
        assertThat(subTimeCapsuleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSubTimeCapsule() throws Exception {
        // Initialize the database
        subTimeCapsuleRepository.saveAndFlush(subTimeCapsule);

        int databaseSizeBeforeDelete = subTimeCapsuleRepository.findAll().size();

        // Delete the subTimeCapsule
        restSubTimeCapsuleMockMvc
            .perform(delete(ENTITY_API_URL_ID, subTimeCapsule.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SubTimeCapsule> subTimeCapsuleList = subTimeCapsuleRepository.findAll();
        assertThat(subTimeCapsuleList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
