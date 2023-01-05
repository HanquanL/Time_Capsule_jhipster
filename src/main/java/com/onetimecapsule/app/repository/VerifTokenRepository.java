package com.onetimecapsule.app.repository;

import com.onetimecapsule.app.domain.VerifToken;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the VerifToken entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VerifTokenRepository extends JpaRepository<VerifToken, Long> {}
