package com.onetimecapsule.app.repository;

import com.onetimecapsule.app.domain.SubTimeCapsule;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SubTimeCapsule entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SubTimeCapsuleRepository extends JpaRepository<SubTimeCapsule, Long> {}
