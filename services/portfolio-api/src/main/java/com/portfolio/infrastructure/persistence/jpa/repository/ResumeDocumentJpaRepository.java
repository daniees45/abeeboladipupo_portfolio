package com.portfolio.infrastructure.persistence.jpa.repository;

import com.portfolio.infrastructure.persistence.jpa.entity.ResumeDocumentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResumeDocumentJpaRepository extends JpaRepository<ResumeDocumentJpaEntity, UUID> {

    @Query("SELECT r FROM ResumeDocumentJpaEntity r WHERE r.isPublished = true AND r.deletedAt IS NULL ORDER BY r.uploadedAt DESC LIMIT 1")
    Optional<ResumeDocumentJpaEntity> findActivePublishedResume();

    List<ResumeDocumentJpaEntity> findAllByDeletedAtIsNullOrderByUploadedAtDesc();

    Optional<ResumeDocumentJpaEntity> findByIdAndDeletedAtIsNull(UUID id);

    @Modifying
    @Query("UPDATE ResumeDocumentJpaEntity r SET r.isPublished = false WHERE r.id != :activeId")
    void unpublishAllExcept(UUID activeId);
}
