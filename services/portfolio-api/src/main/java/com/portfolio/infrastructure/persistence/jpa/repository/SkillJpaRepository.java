package com.portfolio.infrastructure.persistence.jpa.repository;

import com.portfolio.infrastructure.persistence.jpa.entity.SkillJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SkillJpaRepository extends JpaRepository<SkillJpaEntity, UUID> {

    List<SkillJpaEntity> findAllByDeletedAtIsNullOrderByDisplayOrderAsc();

    Optional<SkillJpaEntity> findByIdAndDeletedAtIsNull(UUID id);
}
