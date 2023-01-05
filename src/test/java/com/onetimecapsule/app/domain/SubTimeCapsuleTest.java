package com.onetimecapsule.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.onetimecapsule.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SubTimeCapsuleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SubTimeCapsule.class);
        SubTimeCapsule subTimeCapsule1 = new SubTimeCapsule();
        subTimeCapsule1.setId(1L);
        SubTimeCapsule subTimeCapsule2 = new SubTimeCapsule();
        subTimeCapsule2.setId(subTimeCapsule1.getId());
        assertThat(subTimeCapsule1).isEqualTo(subTimeCapsule2);
        subTimeCapsule2.setId(2L);
        assertThat(subTimeCapsule1).isNotEqualTo(subTimeCapsule2);
        subTimeCapsule1.setId(null);
        assertThat(subTimeCapsule1).isNotEqualTo(subTimeCapsule2);
    }
}
