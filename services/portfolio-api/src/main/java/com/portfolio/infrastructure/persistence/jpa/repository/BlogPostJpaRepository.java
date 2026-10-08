package com.portfolio.infrastructure.persistence.jpa.repository;

import com.portfolio.infrastructure.persistence.jpa.entity.BlogPostJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BlogPostJpaRepository extends JpaRepository<BlogPostJpaEntity, UUID> {

    Optional<BlogPostJpaEntity> findBySlugAndDeletedAtIsNull(String slug);

    Optional<BlogPostJpaEntity> findByIdAndDeletedAtIsNull(UUID id);

    @Query("SELECT b FROM BlogPostJpaEntity b WHERE b.published = true AND b.deletedAt IS NULL ORDER BY b.publishedAt DESC")
    Page<BlogPostJpaEntity> findPublicPosts(Pageable pageable);

    boolean existsBySlugAndDeletedAtIsNull(String slug);
}
