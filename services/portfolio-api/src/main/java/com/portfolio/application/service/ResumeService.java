package com.portfolio.application.service;

import com.portfolio.infrastructure.cache.CacheService;
import com.portfolio.infrastructure.persistence.jpa.entity.ResumeDocumentJpaEntity;
import com.portfolio.infrastructure.persistence.jpa.repository.ResumeDocumentJpaRepository;
import com.portfolio.web.dto.ResumeDtos.ActiveResumeDto;
import com.portfolio.web.dto.ResumeDtos.ResumeDocumentDto;
import com.portfolio.web.error.Exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ResumeService {

    private final ResumeDocumentJpaRepository resumeRepository;
    private final CacheService cacheService;
    private final AuditService auditService;

    public ResumeService(ResumeDocumentJpaRepository resumeRepository, CacheService cacheService, AuditService auditService) {
        this.resumeRepository = resumeRepository;
        this.cacheService = cacheService;
        this.auditService = auditService;
    }

    public ActiveResumeDto getActivePublishedResume() {
        ResumeDocumentJpaEntity entity = resumeRepository.findActivePublishedResume()
            .orElseThrow(() -> new ResourceNotFoundException("No published resume document is currently available."));

        return new ActiveResumeDto(
            entity.getId(),
            entity.getFileName(),
            entity.getContentType(),
            entity.getFileSizeBytes(),
            entity.getVersionTag(),
            "/api/v1/resume/download/" + entity.getId(),
            entity.getUploadedAt()
        );
    }

    public ResumeDocumentJpaEntity getResumeFile(UUID id) {
        return resumeRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Resume file not found with id: " + id));
    }

    public List<ResumeDocumentDto> listAllResumes() {
        return resumeRepository.findAllByDeletedAtIsNullOrderByUploadedAtDesc()
            .stream()
            .map(this::toDto)
            .toList();
    }

    @Transactional
    public ResumeDocumentDto uploadResume(
        MultipartFile file,
        String versionTag,
        String targetTrack,
        boolean publish,
        UUID actorId,
        String requestId
    ) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file.");
        }

        String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf";

        ResumeDocumentJpaEntity entity = new ResumeDocumentJpaEntity();
        entity.setFileName(originalFilename);
        entity.setContentType(contentType);
        entity.setFileSizeBytes(file.getSize());
        entity.setFileData(file.getBytes());
        entity.setVersionTag(versionTag != null && !versionTag.isBlank() ? versionTag : "v" + System.currentTimeMillis());
        entity.setTargetTrack(targetTrack != null && !targetTrack.isBlank() ? targetTrack : "GENERAL");
        entity.setPublished(publish);

        ResumeDocumentJpaEntity saved = resumeRepository.save(entity);

        if (publish) {
            resumeRepository.unpublishAllExcept(saved.getId());
        }

        auditService.record(actorId, "UPLOAD_RESUME", "RESUME_DOCUMENT", saved.getId(), null, toDto(saved), requestId);
        cacheService.evict("resume:active");

        return toDto(saved);
    }

    @Transactional
    public ResumeDocumentDto publishResume(UUID id, UUID actorId, String requestId) {
        ResumeDocumentJpaEntity entity = resumeRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + id));

        resumeRepository.unpublishAllExcept(entity.getId());
        entity.setPublished(true);
        entity.setUpdatedAt(Instant.now());

        ResumeDocumentJpaEntity updated = resumeRepository.save(entity);
        auditService.record(actorId, "PUBLISH_RESUME", "RESUME_DOCUMENT", updated.getId(), null, toDto(updated), requestId);
        cacheService.evict("resume:active");

        return toDto(updated);
    }

    @Transactional
    public void deleteResume(UUID id, UUID actorId, String requestId) {
        ResumeDocumentJpaEntity entity = resumeRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + id));

        ResumeDocumentDto before = toDto(entity);
        entity.setDeletedAt(Instant.now());
        entity.setPublished(false);
        resumeRepository.save(entity);

        auditService.record(actorId, "DELETE_RESUME", "RESUME_DOCUMENT", id, before, null, requestId);
        cacheService.evict("resume:active");
    }

    private ResumeDocumentDto toDto(ResumeDocumentJpaEntity e) {
        return new ResumeDocumentDto(
            e.getId(),
            e.getFileName(),
            e.getContentType(),
            e.getFileSizeBytes(),
            e.getVersionTag(),
            e.getTargetTrack(),
            e.isPublished(),
            e.getUploadedAt()
        );
    }
}
