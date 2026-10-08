package com.portfolio.infrastructure.persistence.jpa.repository;

import com.portfolio.infrastructure.persistence.jpa.entity.EducationJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EducationJpaRepository extends JpaRepository<EducationJpaEntity, UUID> {

    List<EducationJpaEntity> findAllByDeletedAtIsNullOrderByDisplayOrderAscStartedOnDesc();

    Optional<EducationJpaEntity> findByIdAndDeletedAtIsNull(UUID id);
}
