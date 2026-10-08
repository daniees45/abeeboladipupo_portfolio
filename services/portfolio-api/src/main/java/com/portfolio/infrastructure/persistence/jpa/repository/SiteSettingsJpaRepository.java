package com.portfolio.infrastructure.persistence.jpa.repository;

import com.portfolio.infrastructure.persistence.jpa.entity.SiteSettingsJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SiteSettingsJpaRepository extends JpaRepository<SiteSettingsJpaEntity, UUID> {

    @Query("SELECT s FROM SiteSettingsJpaEntity s ORDER BY s.updatedAt DESC LIMIT 1")
    Optional<SiteSettingsJpaEntity> findCurrentSettings();
}
