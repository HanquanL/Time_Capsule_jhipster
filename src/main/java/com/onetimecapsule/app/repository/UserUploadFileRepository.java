package com.onetimecapsule.app.repository;

import com.onetimecapsule.app.domain.UserUploadFile;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the UserUploadFile entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserUploadFileRepository extends JpaRepository<UserUploadFile, Long> {
    @Query("select userUploadFile from UserUploadFile userUploadFile where userUploadFile.userid.login = ?#{principal.username}")
    List<UserUploadFile> findByUseridIsCurrentUser();
}
