package com.portfolio.infrastructure.persistence.jpa.repository;

import com.portfolio.infrastructure.persistence.jpa.entity.ProductJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductJpaRepository extends JpaRepository<ProductJpaEntity, UUID> {

    @Query("SELECT p FROM ProductJpaEntity p WHERE p.active = true AND p.deletedAt IS NULL ORDER BY p.displayOrder ASC, p.updatedAt DESC")
    List<ProductJpaEntity> findActiveProducts();

    Optional<ProductJpaEntity> findBySlugAndDeletedAtIsNull(String slug);

    Optional<ProductJpaEntity> findByIdAndDeletedAtIsNull(UUID id);

    boolean existsBySlugAndDeletedAtIsNull(String slug);
}
