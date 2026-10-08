package com.portfolio.application.service;

import com.portfolio.infrastructure.cache.CacheService;
import com.portfolio.infrastructure.persistence.jpa.entity.EducationJpaEntity;
import com.portfolio.infrastructure.persistence.jpa.repository.EducationJpaRepository;
import com.portfolio.web.dto.EducationDtos.EducationCreate;
import com.portfolio.web.dto.EducationDtos.EducationDto;
import com.portfolio.web.dto.EducationDtos.EducationUpdate;
import com.portfolio.web.error.Exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class EducationService {

    private final EducationJpaRepository educationRepository;
    private final CacheService cacheService;
    private final AuditService auditService;

    public EducationService(EducationJpaRepository educationRepository, CacheService cacheService, AuditService auditService) {
        this.educationRepository = educationRepository;
        this.cacheService = cacheService;
        this.auditService = auditService;
    }

    public List<EducationDto> listEducation() {
        return educationRepository.findAllByDeletedAtIsNullOrderByDisplayOrderAscStartedOnDesc()
            .stream()
            .map(this::toDto)
            .toList();
    }

    @Transactional
    public EducationDto createEducation(EducationCreate req, UUID actorId, String requestId) {
        EducationJpaEntity entity = new EducationJpaEntity();
        entity.setInstitution(req.institution());
        entity.setDegree(req.degree());
        entity.setFieldOfStudy(req.fieldOfStudy());
        entity.setStartedOn(req.startedOn());
        entity.setEndedOn(req.endedOn());
        entity.setCurrentEducation(Boolean.TRUE.equals(req.currentEducation()));
        entity.setDescription(req.description());
        entity.setCredentialUrl(req.credentialUrl());
        entity.setDisplayOrder(req.displayOrder() != null ? req.displayOrder() : 0);

        EducationJpaEntity saved = educationRepository.save(entity);
        auditService.record(actorId, "CREATE_EDUCATION", "EDUCATION", saved.getId(), null, toDto(saved), requestId);
        cacheService.evict("credentials:all");
        return toDto(saved);
    }

    @Transactional
    public EducationDto updateEducation(UUID id, EducationUpdate req, UUID actorId, String requestId) {
        EducationJpaEntity entity = educationRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Education not found with id: " + id));

        EducationDto before = toDto(entity);
        entity.setInstitution(req.institution());
        entity.setDegree(req.degree());
        entity.setFieldOfStudy(req.fieldOfStudy());
        entity.setStartedOn(req.startedOn());
        entity.setEndedOn(req.endedOn());
        entity.setCurrentEducation(Boolean.TRUE.equals(req.currentEducation()));
        entity.setDescription(req.description());
        entity.setCredentialUrl(req.credentialUrl());
        entity.setDisplayOrder(req.displayOrder() != null ? req.displayOrder() : 0);
        entity.setUpdatedAt(Instant.now());

        EducationJpaEntity updated = educationRepository.save(entity);
        auditService.record(actorId, "UPDATE_EDUCATION", "EDUCATION", updated.getId(), before, toDto(updated), requestId);
        cacheService.evict("credentials:all");
        return toDto(updated);
    }

    @Transactional
    public void deleteEducation(UUID id, UUID actorId, String requestId) {
        EducationJpaEntity entity = educationRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Education not found with id: " + id));

        EducationDto before = toDto(entity);
        entity.setDeletedAt(Instant.now());
        educationRepository.save(entity);

        auditService.record(actorId, "DELETE_EDUCATION", "EDUCATION", id, before, null, requestId);
        cacheService.evict("credentials:all");
    }

    private EducationDto toDto(EducationJpaEntity e) {
        return new EducationDto(
            e.getId(),
            e.getInstitution(),
            e.getDegree(),
            e.getFieldOfStudy(),
            e.getStartedOn(),
            e.getEndedOn(),
            e.isCurrentEducation(),
            e.getDescription(),
            e.getCredentialUrl(),
            e.getDisplayOrder()
        );
    }
}
