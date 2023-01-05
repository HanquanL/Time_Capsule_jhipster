package com.onetimecapsule.app.web.rest;

import static com.onetimecapsule.app.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.onetimecapsule.app.IntegrationTest;
import com.onetimecapsule.app.domain.VerifToken;
import com.onetimecapsule.app.repository.VerifTokenRepository;
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
 * Integration tests for the {@link VerifTokenResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VerifTokenResourceIT {

    private static final UUID DEFAULT_TOKENID = UUID.randomUUID();
    private static final UUID UPDATED_TOKENID = UUID.randomUUID();

    private static final String DEFAULT_TOKEN = "AAAAAAAAAA";
    private static final String UPDATED_TOKEN = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_EXPIRYDATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_EXPIRYDATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/verif-tokens";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VerifTokenRepository verifTokenRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVerifTokenMockMvc;

    private VerifToken verifToken;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VerifToken createEntity(EntityManager em) {
        VerifToken verifToken = new VerifToken().tokenid(DEFAULT_TOKENID).token(DEFAULT_TOKEN).expirydate(DEFAULT_EXPIRYDATE);
        return verifToken;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VerifToken createUpdatedEntity(EntityManager em) {
        VerifToken verifToken = new VerifToken().tokenid(UPDATED_TOKENID).token(UPDATED_TOKEN).expirydate(UPDATED_EXPIRYDATE);
        return verifToken;
    }

    @BeforeEach
    public void initTest() {
        verifToken = createEntity(em);
    }

    @Test
    @Transactional
    void createVerifToken() throws Exception {
        int databaseSizeBeforeCreate = verifTokenRepository.findAll().size();
        // Create the VerifToken
        restVerifTokenMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(verifToken)))
            .andExpect(status().isCreated());

        // Validate the VerifToken in the database
        List<VerifToken> verifTokenList = verifTokenRepository.findAll();
        assertThat(verifTokenList).hasSize(databaseSizeBeforeCreate + 1);
        VerifToken testVerifToken = verifTokenList.get(verifTokenList.size() - 1);
        assertThat(testVerifToken.getTokenid()).isEqualTo(DEFAULT_TOKENID);
        assertThat(testVerifToken.getToken()).isEqualTo(DEFAULT_TOKEN);
        assertThat(testVerifToken.getExpirydate()).isEqualTo(DEFAULT_EXPIRYDATE);
    }

    @Test
    @Transactional
    void createVerifTokenWithExistingId() throws Exception {
        // Create the VerifToken with an existing ID
        verifToken.setId(1L);

        int databaseSizeBeforeCreate = verifTokenRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVerifTokenMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(verifToken)))
            .andExpect(status().isBadRequest());

        // Validate the VerifToken in the database
        List<VerifToken> verifTokenList = verifTokenRepository.findAll();
        assertThat(verifTokenList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVerifTokens() throws Exception {
        // Initialize the database
        verifTokenRepository.saveAndFlush(verifToken);

        // Get all the verifTokenList
        restVerifTokenMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(verifToken.getId().intValue())))
            .andExpect(jsonPath("$.[*].tokenid").value(hasItem(DEFAULT_TOKENID.toString())))
            .andExpect(jsonPath("$.[*].token").value(hasItem(DEFAULT_TOKEN)))
            .andExpect(jsonPath("$.[*].expirydate").value(hasItem(sameInstant(DEFAULT_EXPIRYDATE))));
    }

    @Test
    @Transactional
    void getVerifToken() throws Exception {
        // Initialize the database
        verifTokenRepository.saveAndFlush(verifToken);

        // Get the verifToken
        restVerifTokenMockMvc
            .perform(get(ENTITY_API_URL_ID, verifToken.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(verifToken.getId().intValue()))
            .andExpect(jsonPath("$.tokenid").value(DEFAULT_TOKENID.toString()))
            .andExpect(jsonPath("$.token").value(DEFAULT_TOKEN))
            .andExpect(jsonPath("$.expirydate").value(sameInstant(DEFAULT_EXPIRYDATE)));
    }

    @Test
    @Transactional
    void getNonExistingVerifToken() throws Exception {
        // Get the verifToken
        restVerifTokenMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVerifToken() throws Exception {
        // Initialize the database
        verifTokenRepository.saveAndFlush(verifToken);

        int databaseSizeBeforeUpdate = verifTokenRepository.findAll().size();

        // Update the verifToken
        VerifToken updatedVerifToken = verifTokenRepository.findById(verifToken.getId()).get();
        // Disconnect from session so that the updates on updatedVerifToken are not directly saved in db
        em.detach(updatedVerifToken);
        updatedVerifToken.tokenid(UPDATED_TOKENID).token(UPDATED_TOKEN).expirydate(UPDATED_EXPIRYDATE);

        restVerifTokenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVerifToken.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVerifToken))
            )
            .andExpect(status().isOk());

        // Validate the VerifToken in the database
        List<VerifToken> verifTokenList = verifTokenRepository.findAll();
        assertThat(verifTokenList).hasSize(databaseSizeBeforeUpdate);
        VerifToken testVerifToken = verifTokenList.get(verifTokenList.size() - 1);
        assertThat(testVerifToken.getTokenid()).isEqualTo(UPDATED_TOKENID);
        assertThat(testVerifToken.getToken()).isEqualTo(UPDATED_TOKEN);
        assertThat(testVerifToken.getExpirydate()).isEqualTo(UPDATED_EXPIRYDATE);
    }

    @Test
    @Transactional
    void putNonExistingVerifToken() throws Exception {
        int databaseSizeBeforeUpdate = verifTokenRepository.findAll().size();
        verifToken.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVerifTokenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, verifToken.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(verifToken))
            )
            .andExpect(status().isBadRequest());

        // Validate the VerifToken in the database
        List<VerifToken> verifTokenList = verifTokenRepository.findAll();
        assertThat(verifTokenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVerifToken() throws Exception {
        int databaseSizeBeforeUpdate = verifTokenRepository.findAll().size();
        verifToken.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVerifTokenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(verifToken))
            )
            .andExpect(status().isBadRequest());

        // Validate the VerifToken in the database
        List<VerifToken> verifTokenList = verifTokenRepository.findAll();
        assertThat(verifTokenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVerifToken() throws Exception {
        int databaseSizeBeforeUpdate = verifTokenRepository.findAll().size();
        verifToken.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVerifTokenMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(verifToken)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the VerifToken in the database
        List<VerifToken> verifTokenList = verifTokenRepository.findAll();
        assertThat(verifTokenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVerifTokenWithPatch() throws Exception {
        // Initialize the database
        verifTokenRepository.saveAndFlush(verifToken);

        int databaseSizeBeforeUpdate = verifTokenRepository.findAll().size();

        // Update the verifToken using partial update
        VerifToken partialUpdatedVerifToken = new VerifToken();
        partialUpdatedVerifToken.setId(verifToken.getId());

        partialUpdatedVerifToken.tokenid(UPDATED_TOKENID).expirydate(UPDATED_EXPIRYDATE);

        restVerifTokenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVerifToken.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVerifToken))
            )
            .andExpect(status().isOk());

        // Validate the VerifToken in the database
        List<VerifToken> verifTokenList = verifTokenRepository.findAll();
        assertThat(verifTokenList).hasSize(databaseSizeBeforeUpdate);
        VerifToken testVerifToken = verifTokenList.get(verifTokenList.size() - 1);
        assertThat(testVerifToken.getTokenid()).isEqualTo(UPDATED_TOKENID);
        assertThat(testVerifToken.getToken()).isEqualTo(DEFAULT_TOKEN);
        assertThat(testVerifToken.getExpirydate()).isEqualTo(UPDATED_EXPIRYDATE);
    }

    @Test
    @Transactional
    void fullUpdateVerifTokenWithPatch() throws Exception {
        // Initialize the database
        verifTokenRepository.saveAndFlush(verifToken);

        int databaseSizeBeforeUpdate = verifTokenRepository.findAll().size();

        // Update the verifToken using partial update
        VerifToken partialUpdatedVerifToken = new VerifToken();
        partialUpdatedVerifToken.setId(verifToken.getId());

        partialUpdatedVerifToken.tokenid(UPDATED_TOKENID).token(UPDATED_TOKEN).expirydate(UPDATED_EXPIRYDATE);

        restVerifTokenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVerifToken.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVerifToken))
            )
            .andExpect(status().isOk());

        // Validate the VerifToken in the database
        List<VerifToken> verifTokenList = verifTokenRepository.findAll();
        assertThat(verifTokenList).hasSize(databaseSizeBeforeUpdate);
        VerifToken testVerifToken = verifTokenList.get(verifTokenList.size() - 1);
        assertThat(testVerifToken.getTokenid()).isEqualTo(UPDATED_TOKENID);
        assertThat(testVerifToken.getToken()).isEqualTo(UPDATED_TOKEN);
        assertThat(testVerifToken.getExpirydate()).isEqualTo(UPDATED_EXPIRYDATE);
    }

    @Test
    @Transactional
    void patchNonExistingVerifToken() throws Exception {
        int databaseSizeBeforeUpdate = verifTokenRepository.findAll().size();
        verifToken.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVerifTokenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, verifToken.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(verifToken))
            )
            .andExpect(status().isBadRequest());

        // Validate the VerifToken in the database
        List<VerifToken> verifTokenList = verifTokenRepository.findAll();
        assertThat(verifTokenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVerifToken() throws Exception {
        int databaseSizeBeforeUpdate = verifTokenRepository.findAll().size();
        verifToken.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVerifTokenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(verifToken))
            )
            .andExpect(status().isBadRequest());

        // Validate the VerifToken in the database
        List<VerifToken> verifTokenList = verifTokenRepository.findAll();
        assertThat(verifTokenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVerifToken() throws Exception {
        int databaseSizeBeforeUpdate = verifTokenRepository.findAll().size();
        verifToken.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVerifTokenMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(verifToken))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VerifToken in the database
        List<VerifToken> verifTokenList = verifTokenRepository.findAll();
        assertThat(verifTokenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVerifToken() throws Exception {
        // Initialize the database
        verifTokenRepository.saveAndFlush(verifToken);

        int databaseSizeBeforeDelete = verifTokenRepository.findAll().size();

        // Delete the verifToken
        restVerifTokenMockMvc
            .perform(delete(ENTITY_API_URL_ID, verifToken.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<VerifToken> verifTokenList = verifTokenRepository.findAll();
        assertThat(verifTokenList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
