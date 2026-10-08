package com.portfolio.application.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.infrastructure.cache.CacheService;
import com.portfolio.infrastructure.persistence.jpa.entity.BlogPostJpaEntity;
import com.portfolio.infrastructure.persistence.jpa.entity.ExperienceJpaEntity;
import com.portfolio.infrastructure.persistence.jpa.entity.SkillJpaEntity;
import com.portfolio.infrastructure.persistence.jpa.repository.BlogPostJpaRepository;
import com.portfolio.infrastructure.persistence.jpa.repository.ExperienceJpaRepository;
import com.portfolio.infrastructure.persistence.jpa.repository.SkillJpaRepository;
import com.portfolio.web.dto.BlogPostDtos.BlogPost;
import com.portfolio.web.dto.BlogPostDtos.BlogPostPage;
import com.portfolio.web.dto.ExperienceDto;
import com.portfolio.web.dto.SkillDto;
import com.portfolio.web.error.Exceptions.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ContentService {

    private final SkillJpaRepository skillRepository;
    private final ExperienceJpaRepository experienceRepository;
    private final BlogPostJpaRepository blogPostRepository;
    private final ProjectService projectService;
    private final ProductService productService;
    private final CacheService cacheService;
    private final AuditService auditService;
    private final ObjectMapper objectMapper;

    public ContentService(
        SkillJpaRepository skillRepository,
        ExperienceJpaRepository experienceRepository,
        BlogPostJpaRepository blogPostRepository,
        ProjectService projectService,
        ProductService productService,
        CacheService cacheService,
        AuditService auditService,
        ObjectMapper objectMapper
    ) {
        this.skillRepository = skillRepository;
        this.experienceRepository = experienceRepository;
        this.blogPostRepository = blogPostRepository;
        this.projectService = projectService;
        this.productService = productService;
        this.cacheService = cacheService;
        this.auditService = auditService;
        this.objectMapper = objectMapper;
    }

    public List<SkillDto> listSkills() {
        String cacheKey = "content:skills";
        String cached = cacheService.get(cacheKey);
        if (cached != null) {
            try {
                return objectMapper.readValue(cached, new TypeReference<List<SkillDto>>() {});
            } catch (Exception ignored) {}
        }

        List<SkillJpaEntity> entities = skillRepository.findAllByDeletedAtIsNullOrderByDisplayOrderAsc();
        List<SkillDto> dtoList = entities.stream()
            .map(e -> new SkillDto(e.getId(), e.getName(), e.getCategory(), e.getDisplayOrder()))
            .toList();

        try {
            cacheService.put(cacheKey, objectMapper.writeValueAsString(dtoList), Duration.ofHours(1));
        } catch (Exception ignored) {}

        return dtoList;
    }

    public List<ExperienceDto> listExperience() {
        String cacheKey = "content:experience";
        String cached = cacheService.get(cacheKey);
        if (cached != null) {
            try {
                return objectMapper.readValue(cached, new TypeReference<List<ExperienceDto>>() {});
            } catch (Exception ignored) {}
        }

        List<ExperienceJpaEntity> entities = experienceRepository.findAllByDeletedAtIsNullOrderByDisplayOrderAscStartedOnDesc();
        List<ExperienceDto> dtoList = entities.stream()
            .map(e -> new ExperienceDto(
                e.getId(),
                e.getCompany(),
                e.getRole(),
                e.getLocation(),
                e.getDescriptionMarkdown(),
                e.getStartedOn(),
                e.getEndedOn(),
                e.isCurrentRole()
            ))
            .toList();

        try {
            cacheService.put(cacheKey, objectMapper.writeValueAsString(dtoList), Duration.ofHours(1));
        } catch (Exception ignored) {}

        return dtoList;
    }

    public BlogPostPage listPosts(int page, int size) {
        String cacheKey = "content:posts:page:" + page + ":size:" + size;
        String cached = cacheService.get(cacheKey);
        if (cached != null) {
            try {
                return objectMapper.readValue(cached, BlogPostPage.class);
            } catch (Exception ignored) {}
        }

        PageRequest pageRequest = PageRequest.of(page, size);
        Page<BlogPostJpaEntity> entities = blogPostRepository.findPublicPosts(pageRequest);

        List<BlogPost> dtoList = entities.getContent().stream()
            .map(this::toBlogPostDto)
            .toList();

        BlogPostPage result = new BlogPostPage(dtoList, entities.getNumber(), entities.getSize(), entities.getTotalElements());

        try {
            cacheService.put(cacheKey, objectMapper.writeValueAsString(result), Duration.ofMinutes(15));
        } catch (Exception ignored) {}

        return result;
    }

    public BlogPost getPostBySlug(String slug) {
        String cacheKey = "content:post:slug:" + slug;
        String cached = cacheService.get(cacheKey);
        if (cached != null) {
            try {
                return objectMapper.readValue(cached, BlogPost.class);
            } catch (Exception ignored) {}
        }

        BlogPostJpaEntity entity = blogPostRepository.findBySlugAndDeletedAtIsNull(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with slug: " + slug));

        if (!entity.isPublished()) {
            throw new ResourceNotFoundException("Blog post not found with slug: " + slug);
        }

        BlogPost dto = toBlogPostDto(entity);
        try {
            cacheService.put(cacheKey, objectMapper.writeValueAsString(dto), Duration.ofMinutes(30));
        } catch (Exception ignored) {}

        return dto;
    }

    @Transactional
    public void softDeleteResource(String resource, UUID id, UUID actorId, String requestId) {
        switch (resource.toLowerCase()) {
            case "projects" -> projectService.softDeleteProject(id, actorId, requestId);
            case "products" -> productService.softDeleteProduct(id, actorId, requestId);
            case "skills" -> {
                SkillJpaEntity skill = skillRepository.findByIdAndDeletedAtIsNull(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
                skill.setDeletedAt(Instant.now());
                skillRepository.save(skill);
                auditService.record(actorId, "SOFT_DELETE_SKILL", "SKILL", id, skill, null, requestId);
                cacheService.evictSkillCaches();
            }
            case "experience" -> {
                ExperienceJpaEntity exp = experienceRepository.findByIdAndDeletedAtIsNull(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Experience entry not found with id: " + id));
                exp.setDeletedAt(Instant.now());
                exp.setUpdatedBy(actorId);
                experienceRepository.save(exp);
                auditService.record(actorId, "SOFT_DELETE_EXPERIENCE", "EXPERIENCE", id, exp, null, requestId);
                cacheService.evictExperienceCaches();
            }
            case "posts" -> {
                BlogPostJpaEntity post = blogPostRepository.findByIdAndDeletedAtIsNull(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));
                post.setDeletedAt(Instant.now());
                blogPostRepository.save(post);
                auditService.record(actorId, "SOFT_DELETE_BLOG_POST", "BLOG_POST", id, post, null, requestId);
                cacheService.evictPostCaches(post.getSlug());
            }
            default -> throw new ResourceNotFoundException("Unrecognized resource type: " + resource);
        }
    }

    private BlogPost toBlogPostDto(BlogPostJpaEntity e) {
        return new BlogPost(
            e.getId(),
            e.getSlug(),
            e.getTitle(),
            e.getExcerpt(),
            e.getBodyMarkdown(),
            e.getCoverImageUrl(),
            e.isPublished(),
            e.getPublishedAt()
        );
    }
}
