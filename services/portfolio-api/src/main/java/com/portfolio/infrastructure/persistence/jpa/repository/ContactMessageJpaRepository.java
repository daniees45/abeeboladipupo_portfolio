package com.portfolio.infrastructure.persistence.jpa.repository;

import com.portfolio.infrastructure.persistence.jpa.entity.ContactMessageJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Collection;
import java.util.UUID;

@Repository
public interface ContactMessageJpaRepository extends JpaRepository<ContactMessageJpaEntity, UUID> {

    Page<ContactMessageJpaEntity> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Modifying
    @Query("DELETE FROM ContactMessageJpaEntity c WHERE c.status IN :statuses AND c.resolvedAt < :cutoff")
    int deleteByStatusInAndResolvedAtBefore(
        @Param("statuses") Collection<String> statuses,
        @Param("cutoff") Instant cutoff
    );

    @Modifying
    @Query("DELETE FROM ContactMessageJpaEntity c WHERE c.status = 'NEW' AND c.createdAt < :cutoff")
    int deleteStaleNewMessages(@Param("cutoff") Instant cutoff);
}
