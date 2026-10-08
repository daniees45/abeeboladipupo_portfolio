package com.portfolio.application.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.infrastructure.cache.CacheService;
import com.portfolio.infrastructure.persistence.jpa.entity.ProjectJpaEntity;
import com.portfolio.infrastructure.persistence.jpa.repository.ProjectJpaRepository;
import com.portfolio.web.dto.ProjectDtos.Project;
import com.portfolio.web.dto.ProjectDtos.ProjectCreate;
import com.portfolio.web.dto.ProjectDtos.ProjectPage;
import com.portfolio.web.dto.ProjectDtos.ProjectUpdate;
import com.portfolio.web.error.Exceptions.ResourceConflictException;
import com.portfolio.web.error.Exceptions.ResourceNotFoundException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {

    private final ProjectJpaRepository projectRepository;
    private final CacheService cacheService;
    private final AuditService auditService;
    private final ObjectMapper objectMapper;

    public ProjectService(
        ProjectJpaRepository projectRepository,
        CacheService cacheService,
        AuditService auditService,
        ObjectMapper objectMapper
    ) {
        this.projectRepository = projectRepository;
        this.cacheService = cacheService;
        this.auditService = auditService;
        this.objectMapper = objectMapper;
    }

    public ProjectPage listPublicProjects(int page, int size, Boolean featured) {
        String cacheKey = "projects:list:featured:" + featured + ":page:" + page + ":size:" + size;
        String cached = cacheService.get(cacheKey);
        if (cached != null) {
            try {
                return objectMapper.readValue(cached, ProjectPage.class);
            } catch (Exception ignored) {}
        }

        PageRequest pageRequest = PageRequest.of(page, size);
        Page<ProjectJpaEntity> entities = Boolean.TRUE.equals(featured)
            ? projectRepository.findFeaturedPublicProjects(pageRequest)
            : projectRepository.findPublicProjects(pageRequest);

        List<Project> dtoList = entities.getContent().stream().map(this::toDto).toList();
        ProjectPage result = new ProjectPage(dtoList, entities.getNumber(), entities.getSize(), entities.getTotalElements());

        try {
            cacheService.put(cacheKey, objectMapper.writeValueAsString(result), Duration.ofMinutes(15));
        } catch (Exception ignored) {}

        return result;
    }

    public Project getPublicProjectBySlug(String slug) {
        String cacheKey = "projects:slug:" + slug;
        String cached = cacheService.get(cacheKey);
        if (cached != null) {
            try {
                return objectMapper.readValue(cached, Project.class);
            } catch (Exception ignored) {}
        }

        ProjectJpaEntity entity = projectRepository.findBySlugAndDeletedAtIsNull(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found with slug: " + slug));

        if (!entity.isPublished()) {
            throw new ResourceNotFoundException("Project not found with slug: " + slug);
        }

        Project dto = toDto(entity);
        try {
            cacheService.put(cacheKey, objectMapper.writeValueAsString(dto), Duration.ofMinutes(30));
        } catch (Exception ignored) {}

        return dto;
    }

    @Transactional
    public Project createProject(ProjectCreate req, UUID actorId, String requestId) {
        if (projectRepository.existsBySlugAndDeletedAtIsNull(req.slug())) {
            throw new ResourceConflictException("Active project already exists with slug: " + req.slug());
        }

        ProjectJpaEntity entity = new ProjectJpaEntity();
        applyProperties(entity, req.slug(), req.title(), req.summary(), req.contentMarkdown(),
            req.repositoryUrl(), req.liveUrl(), req.demoUrl(), req.published(), req.featured(), req.displayOrder());
        entity.setCreatedBy(actorId);
        entity.setUpdatedBy(actorId);

        ProjectJpaEntity saved = projectRepository.save(entity);

        auditService.record(actorId, "CREATE_PROJECT", "PROJECT", saved.getId(), null, toDto(saved), requestId);
        cacheService.evictProjectCaches(saved.getSlug());

        return toDto(saved);
    }

    @Transactional
    public Project updateProject(UUID id, ProjectUpdate req, UUID actorId, String requestId) {
        ProjectJpaEntity entity = projectRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        if (entity.getVersion() != req.version()) {
            throw new OptimisticLockingFailureException("Version mismatch. Expected: " + entity.getVersion() + ", got: " + req.version());
        }

        Project beforeSnapshot = toDto(entity);

        applyProperties(entity, req.slug(), req.title(), req.summary(), req.contentMarkdown(),
            req.repositoryUrl(), req.liveUrl(), req.demoUrl(), req.published(), req.featured(), req.displayOrder());
        entity.setUpdatedBy(actorId);
        entity.setUpdatedAt(Instant.now());

        ProjectJpaEntity updated = projectRepository.save(entity);

        auditService.record(actorId, "UPDATE_PROJECT", "PROJECT", updated.getId(), beforeSnapshot, toDto(updated), requestId);
        cacheService.evictProjectCaches(updated.getSlug());

        return toDto(updated);
    }

    @Transactional
    public void softDeleteProject(UUID id, UUID actorId, String requestId) {
        ProjectJpaEntity entity = projectRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        Project beforeSnapshot = toDto(entity);
        entity.setDeletedAt(Instant.now());
        entity.setUpdatedBy(actorId);
        projectRepository.save(entity);

        auditService.record(actorId, "SOFT_DELETE_PROJECT", "PROJECT", id, beforeSnapshot, null, requestId);
        cacheService.evictProjectCaches(entity.getSlug());
    }

    private void applyProperties(ProjectJpaEntity entity, String slug, String title, String summary,
                                 String contentMarkdown, String repositoryUrl, String liveUrl, String demoUrl,
                                 Boolean published, Boolean featured, Integer displayOrder) {
        entity.setSlug(slug);
        entity.setTitle(title);
        entity.setSummary(summary);
        entity.setContentMarkdown(contentMarkdown);
        entity.setRepositoryUrl(repositoryUrl);
        entity.setLiveUrl(liveUrl);
        entity.setDemoUrl(demoUrl);
        entity.setPublished(published != null ? published : false);
        entity.setFeatured(featured != null ? featured : false);
        entity.setDisplayOrder(displayOrder != null ? displayOrder : 0);
    }

    public Project toDto(ProjectJpaEntity entity) {
        return new Project(
            entity.getId(),
            entity.getSlug(),
            entity.getTitle(),
            entity.getSummary(),
            entity.getContentMarkdown(),
            entity.getRepositoryUrl(),
            entity.getLiveUrl(),
            entity.getDemoUrl(),
            entity.isPublished(),
            entity.isFeatured(),
            entity.getDisplayOrder(),
            entity.getVersion(),
            entity.getUpdatedAt()
        );
    }
}
