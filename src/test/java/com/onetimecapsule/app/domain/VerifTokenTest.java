package com.onetimecapsule.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.onetimecapsule.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VerifTokenTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VerifToken.class);
        VerifToken verifToken1 = new VerifToken();
        verifToken1.setId(1L);
        VerifToken verifToken2 = new VerifToken();
        verifToken2.setId(verifToken1.getId());
        assertThat(verifToken1).isEqualTo(verifToken2);
        verifToken2.setId(2L);
        assertThat(verifToken1).isNotEqualTo(verifToken2);
        verifToken1.setId(null);
        assertThat(verifToken1).isNotEqualTo(verifToken2);
    }
}
