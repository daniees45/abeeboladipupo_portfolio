package com.portfolio.infrastructure.persistence.jpa.repository;

import com.portfolio.infrastructure.persistence.jpa.entity.CertificationJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CertificationJpaRepository extends JpaRepository<CertificationJpaEntity, UUID> {

    List<CertificationJpaEntity> findAllByDeletedAtIsNullOrderByDisplayOrderAscIssueDateDesc();

    Optional<CertificationJpaEntity> findByIdAndDeletedAtIsNull(UUID id);
}
