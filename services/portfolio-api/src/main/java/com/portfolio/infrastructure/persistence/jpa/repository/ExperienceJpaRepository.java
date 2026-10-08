package com.portfolio.infrastructure.persistence.jpa.repository;

import com.portfolio.infrastructure.persistence.jpa.entity.ExperienceJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExperienceJpaRepository extends JpaRepository<ExperienceJpaEntity, UUID> {

    List<ExperienceJpaEntity> findAllByDeletedAtIsNullOrderByDisplayOrderAscStartedOnDesc();

    Optional<ExperienceJpaEntity> findByIdAndDeletedAtIsNull(UUID id);
}
