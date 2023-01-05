package com.onetimecapsule.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.onetimecapsule.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserUploadFileTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserUploadFile.class);
        UserUploadFile userUploadFile1 = new UserUploadFile();
        userUploadFile1.setId(1L);
        UserUploadFile userUploadFile2 = new UserUploadFile();
        userUploadFile2.setId(userUploadFile1.getId());
        assertThat(userUploadFile1).isEqualTo(userUploadFile2);
        userUploadFile2.setId(2L);
        assertThat(userUploadFile1).isNotEqualTo(userUploadFile2);
        userUploadFile1.setId(null);
        assertThat(userUploadFile1).isNotEqualTo(userUploadFile2);
    }
}
