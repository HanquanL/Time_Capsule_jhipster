package com.onetimecapsule.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.onetimecapsule.app.IntegrationTest;
import com.onetimecapsule.app.domain.Email;
import com.onetimecapsule.app.repository.EmailRepository;
import java.util.List;
import java.util.Random;
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
 * Integration tests for the {@link EmailResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EmailResourceIT {

    private static final String DEFAULT_SUBJECT = "AAAAAAAAAA";
    private static final String UPDATED_SUBJECT = "BBBBBBBBBB";

    private static final String DEFAULT_RECIPIENT = "AAAAAAAAAA";
    private static final String UPDATED_RECIPIENT = "BBBBBBBBBB";

    private static final String DEFAULT_BODY = "AAAAAAAAAA";
    private static final String UPDATED_BODY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/emails";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EmailRepository emailRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEmailMockMvc;

    private Email email;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Email createEntity(EntityManager em) {
        Email email = new Email().subject(DEFAULT_SUBJECT).recipient(DEFAULT_RECIPIENT).body(DEFAULT_BODY);
        return email;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Email createUpdatedEntity(EntityManager em) {
        Email email = new Email().subject(UPDATED_SUBJECT).recipient(UPDATED_RECIPIENT).body(UPDATED_BODY);
        return email;
    }

    @BeforeEach
    public void initTest() {
        email = createEntity(em);
    }

    @Test
    @Transactional
    void createEmail() throws Exception {
        int databaseSizeBeforeCreate = emailRepository.findAll().size();
        // Create the Email
        restEmailMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(email)))
            .andExpect(status().isCreated());

        // Validate the Email in the database
        List<Email> emailList = emailRepository.findAll();
        assertThat(emailList).hasSize(databaseSizeBeforeCreate + 1);
        Email testEmail = emailList.get(emailList.size() - 1);
        assertThat(testEmail.getSubject()).isEqualTo(DEFAULT_SUBJECT);
        assertThat(testEmail.getRecipient()).isEqualTo(DEFAULT_RECIPIENT);
        assertThat(testEmail.getBody()).isEqualTo(DEFAULT_BODY);
    }

    @Test
    @Transactional
    void createEmailWithExistingId() throws Exception {
        // Create the Email with an existing ID
        email.setId(1L);

        int databaseSizeBeforeCreate = emailRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEmailMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(email)))
            .andExpect(status().isBadRequest());

        // Validate the Email in the database
        List<Email> emailList = emailRepository.findAll();
        assertThat(emailList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEmails() throws Exception {
        // Initialize the database
        emailRepository.saveAndFlush(email);

        // Get all the emailList
        restEmailMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(email.getId().intValue())))
            .andExpect(jsonPath("$.[*].subject").value(hasItem(DEFAULT_SUBJECT)))
            .andExpect(jsonPath("$.[*].recipient").value(hasItem(DEFAULT_RECIPIENT)))
            .andExpect(jsonPath("$.[*].body").value(hasItem(DEFAULT_BODY)));
    }

    @Test
    @Transactional
    void getEmail() throws Exception {
        // Initialize the database
        emailRepository.saveAndFlush(email);

        // Get the email
        restEmailMockMvc
            .perform(get(ENTITY_API_URL_ID, email.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(email.getId().intValue()))
            .andExpect(jsonPath("$.subject").value(DEFAULT_SUBJECT))
            .andExpect(jsonPath("$.recipient").value(DEFAULT_RECIPIENT))
            .andExpect(jsonPath("$.body").value(DEFAULT_BODY));
    }

    @Test
    @Transactional
    void getNonExistingEmail() throws Exception {
        // Get the email
        restEmailMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEmail() throws Exception {
        // Initialize the database
        emailRepository.saveAndFlush(email);

        int databaseSizeBeforeUpdate = emailRepository.findAll().size();

        // Update the email
        Email updatedEmail = emailRepository.findById(email.getId()).get();
        // Disconnect from session so that the updates on updatedEmail are not directly saved in db
        em.detach(updatedEmail);
        updatedEmail.subject(UPDATED_SUBJECT).recipient(UPDATED_RECIPIENT).body(UPDATED_BODY);

        restEmailMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEmail.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEmail))
            )
            .andExpect(status().isOk());

        // Validate the Email in the database
        List<Email> emailList = emailRepository.findAll();
        assertThat(emailList).hasSize(databaseSizeBeforeUpdate);
        Email testEmail = emailList.get(emailList.size() - 1);
        assertThat(testEmail.getSubject()).isEqualTo(UPDATED_SUBJECT);
        assertThat(testEmail.getRecipient()).isEqualTo(UPDATED_RECIPIENT);
        assertThat(testEmail.getBody()).isEqualTo(UPDATED_BODY);
    }

    @Test
    @Transactional
    void putNonExistingEmail() throws Exception {
        int databaseSizeBeforeUpdate = emailRepository.findAll().size();
        email.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmailMockMvc
            .perform(
                put(ENTITY_API_URL_ID, email.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(email))
            )
            .andExpect(status().isBadRequest());

        // Validate the Email in the database
        List<Email> emailList = emailRepository.findAll();
        assertThat(emailList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEmail() throws Exception {
        int databaseSizeBeforeUpdate = emailRepository.findAll().size();
        email.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmailMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(email))
            )
            .andExpect(status().isBadRequest());

        // Validate the Email in the database
        List<Email> emailList = emailRepository.findAll();
        assertThat(emailList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEmail() throws Exception {
        int databaseSizeBeforeUpdate = emailRepository.findAll().size();
        email.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmailMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(email)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Email in the database
        List<Email> emailList = emailRepository.findAll();
        assertThat(emailList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEmailWithPatch() throws Exception {
        // Initialize the database
        emailRepository.saveAndFlush(email);

        int databaseSizeBeforeUpdate = emailRepository.findAll().size();

        // Update the email using partial update
        Email partialUpdatedEmail = new Email();
        partialUpdatedEmail.setId(email.getId());

        restEmailMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmail.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmail))
            )
            .andExpect(status().isOk());

        // Validate the Email in the database
        List<Email> emailList = emailRepository.findAll();
        assertThat(emailList).hasSize(databaseSizeBeforeUpdate);
        Email testEmail = emailList.get(emailList.size() - 1);
        assertThat(testEmail.getSubject()).isEqualTo(DEFAULT_SUBJECT);
        assertThat(testEmail.getRecipient()).isEqualTo(DEFAULT_RECIPIENT);
        assertThat(testEmail.getBody()).isEqualTo(DEFAULT_BODY);
    }

    @Test
    @Transactional
    void fullUpdateEmailWithPatch() throws Exception {
        // Initialize the database
        emailRepository.saveAndFlush(email);

        int databaseSizeBeforeUpdate = emailRepository.findAll().size();

        // Update the email using partial update
        Email partialUpdatedEmail = new Email();
        partialUpdatedEmail.setId(email.getId());

        partialUpdatedEmail.subject(UPDATED_SUBJECT).recipient(UPDATED_RECIPIENT).body(UPDATED_BODY);

        restEmailMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmail.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmail))
            )
            .andExpect(status().isOk());

        // Validate the Email in the database
        List<Email> emailList = emailRepository.findAll();
        assertThat(emailList).hasSize(databaseSizeBeforeUpdate);
        Email testEmail = emailList.get(emailList.size() - 1);
        assertThat(testEmail.getSubject()).isEqualTo(UPDATED_SUBJECT);
        assertThat(testEmail.getRecipient()).isEqualTo(UPDATED_RECIPIENT);
        assertThat(testEmail.getBody()).isEqualTo(UPDATED_BODY);
    }

    @Test
    @Transactional
    void patchNonExistingEmail() throws Exception {
        int databaseSizeBeforeUpdate = emailRepository.findAll().size();
        email.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmailMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, email.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(email))
            )
            .andExpect(status().isBadRequest());

        // Validate the Email in the database
        List<Email> emailList = emailRepository.findAll();
        assertThat(emailList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEmail() throws Exception {
        int databaseSizeBeforeUpdate = emailRepository.findAll().size();
        email.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmailMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(email))
            )
            .andExpect(status().isBadRequest());

        // Validate the Email in the database
        List<Email> emailList = emailRepository.findAll();
        assertThat(emailList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEmail() throws Exception {
        int databaseSizeBeforeUpdate = emailRepository.findAll().size();
        email.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmailMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(email)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Email in the database
        List<Email> emailList = emailRepository.findAll();
        assertThat(emailList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEmail() throws Exception {
        // Initialize the database
        emailRepository.saveAndFlush(email);

        int databaseSizeBeforeDelete = emailRepository.findAll().size();

        // Delete the email
        restEmailMockMvc
            .perform(delete(ENTITY_API_URL_ID, email.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Email> emailList = emailRepository.findAll();
        assertThat(emailList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
