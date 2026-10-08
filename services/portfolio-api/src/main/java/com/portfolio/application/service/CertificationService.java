package com.portfolio.application.service;

import com.portfolio.infrastructure.cache.CacheService;
import com.portfolio.infrastructure.persistence.jpa.entity.CertificationJpaEntity;
import com.portfolio.infrastructure.persistence.jpa.repository.CertificationJpaRepository;
import com.portfolio.web.dto.CertificationDtos.CertificationCreate;
import com.portfolio.web.dto.CertificationDtos.CertificationDto;
import com.portfolio.web.dto.CertificationDtos.CertificationUpdate;
import com.portfolio.web.error.Exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class CertificationService {

    private final CertificationJpaRepository certificationRepository;
    private final CacheService cacheService;
    private final AuditService auditService;

    public CertificationService(CertificationJpaRepository certificationRepository, CacheService cacheService, AuditService auditService) {
        this.certificationRepository = certificationRepository;
        this.cacheService = cacheService;
        this.auditService = auditService;
    }

    public List<CertificationDto> listCertifications() {
        return certificationRepository.findAllByDeletedAtIsNullOrderByDisplayOrderAscIssueDateDesc()
            .stream()
            .map(this::toDto)
            .toList();
    }

    @Transactional
    public CertificationDto createCertification(CertificationCreate req, UUID actorId, String requestId) {
        CertificationJpaEntity entity = new CertificationJpaEntity();
        entity.setName(req.name());
        entity.setIssuingOrganization(req.issuingOrganization());
        entity.setIssueDate(req.issueDate());
        entity.setExpirationDate(req.expirationDate());
        entity.setCredentialId(req.credentialId());
        entity.setCredentialUrl(req.credentialUrl());
        entity.setDisplayOrder(req.displayOrder() != null ? req.displayOrder() : 0);

        CertificationJpaEntity saved = certificationRepository.save(entity);
        auditService.record(actorId, "CREATE_CERTIFICATION", "CERTIFICATION", saved.getId(), null, toDto(saved), requestId);
        cacheService.evict("credentials:all");
        return toDto(saved);
    }

    @Transactional
    public CertificationDto updateCertification(UUID id, CertificationUpdate req, UUID actorId, String requestId) {
        CertificationJpaEntity entity = certificationRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Certification not found with id: " + id));

        CertificationDto before = toDto(entity);
        entity.setName(req.name());
        entity.setIssuingOrganization(req.issuingOrganization());
        entity.setIssueDate(req.issueDate());
        entity.setExpirationDate(req.expirationDate());
        entity.setCredentialId(req.credentialId());
        entity.setCredentialUrl(req.credentialUrl());
        entity.setDisplayOrder(req.displayOrder() != null ? req.displayOrder() : 0);
        entity.setUpdatedAt(Instant.now());

        CertificationJpaEntity updated = certificationRepository.save(entity);
        auditService.record(actorId, "UPDATE_CERTIFICATION", "CERTIFICATION", updated.getId(), before, toDto(updated), requestId);
        cacheService.evict("credentials:all");
        return toDto(updated);
    }

    @Transactional
    public void deleteCertification(UUID id, UUID actorId, String requestId) {
        CertificationJpaEntity entity = certificationRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Certification not found with id: " + id));

        CertificationDto before = toDto(entity);
        entity.setDeletedAt(Instant.now());
        certificationRepository.save(entity);

        auditService.record(actorId, "DELETE_CERTIFICATION", "CERTIFICATION", id, before, null, requestId);
        cacheService.evict("credentials:all");
    }

    private CertificationDto toDto(CertificationJpaEntity e) {
        return new CertificationDto(
            e.getId(),
            e.getName(),
            e.getIssuingOrganization(),
            e.getIssueDate(),
            e.getExpirationDate(),
            e.getCredentialId(),
            e.getCredentialUrl(),
            e.getDisplayOrder()
        );
    }
}
