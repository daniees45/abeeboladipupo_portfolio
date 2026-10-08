package com.portfolio.infrastructure.persistence.jpa.repository;

import com.portfolio.infrastructure.persistence.jpa.entity.ProjectJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectJpaRepository extends JpaRepository<ProjectJpaEntity, UUID> {

    Optional<ProjectJpaEntity> findBySlugAndDeletedAtIsNull(String slug);

    Optional<ProjectJpaEntity> findByIdAndDeletedAtIsNull(UUID id);

    @Query("SELECT p FROM ProjectJpaEntity p WHERE p.published = true AND p.deletedAt IS NULL ORDER BY p.featured DESC, p.displayOrder ASC, p.updatedAt DESC")
    Page<ProjectJpaEntity> findPublicProjects(Pageable pageable);

    @Query("SELECT p FROM ProjectJpaEntity p WHERE p.published = true AND p.featured = true AND p.deletedAt IS NULL ORDER BY p.displayOrder ASC, p.updatedAt DESC")
    Page<ProjectJpaEntity> findFeaturedPublicProjects(Pageable pageable);

    boolean existsBySlugAndDeletedAtIsNull(@Param("slug") String slug);
}
