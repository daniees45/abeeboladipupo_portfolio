package com.portfolio.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.infrastructure.cache.CacheService;
import com.portfolio.infrastructure.persistence.jpa.entity.SiteSettingsJpaEntity;
import com.portfolio.infrastructure.persistence.jpa.repository.SiteSettingsJpaRepository;
import com.portfolio.web.dto.SiteSettingsDtos.SiteSettingsDto;
import com.portfolio.web.dto.SiteSettingsDtos.SiteSettingsUpdate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
public class SiteSettingsService {

    private final SiteSettingsJpaRepository settingsRepository;
    private final CacheService cacheService;
    private final AuditService auditService;
    private final ObjectMapper objectMapper;

    public SiteSettingsService(
        SiteSettingsJpaRepository settingsRepository,
        CacheService cacheService,
        AuditService auditService,
        ObjectMapper objectMapper
    ) {
        this.settingsRepository = settingsRepository;
        this.cacheService = cacheService;
        this.auditService = auditService;
        this.objectMapper = objectMapper;
    }

    public SiteSettingsDto getSettings() {
        String cacheKey = "site:settings:current";
        String cached = cacheService.get(cacheKey);
        if (cached != null) {
            try {
                return objectMapper.readValue(cached, SiteSettingsDto.class);
            } catch (Exception ignored) {}
        }

        SiteSettingsJpaEntity entity = settingsRepository.findCurrentSettings()
            .orElseGet(this::createDefaultSettings);

        SiteSettingsDto dto = toDto(entity);
        try {
            cacheService.put(cacheKey, objectMapper.writeValueAsString(dto), Duration.ofHours(1));
        } catch (Exception ignored) {}

        return dto;
    }

    @Transactional
    public SiteSettingsDto updateSettings(SiteSettingsUpdate req, UUID actorId, String requestId) {
        SiteSettingsJpaEntity entity = settingsRepository.findCurrentSettings()
            .orElseGet(this::createDefaultSettings);

        SiteSettingsDto beforeSnapshot = toDto(entity);

        entity.setFullName(req.fullName());
        entity.setProfessionalTitle(req.professionalTitle());
        entity.setHeadline(req.headline());
        entity.setBio(req.bio());
        entity.setContactEmail(req.contactEmail());
        entity.setPhone(req.phone());
        entity.setLocation(req.location());
        entity.setProfileImageUrl(req.profileImageUrl());
        entity.setGithubUrl(req.githubUrl());
        entity.setLinkedinUrl(req.linkedinUrl());
        entity.setWebsiteUrl(req.websiteUrl());
        entity.setSeoTitle(req.seoTitle());
        entity.setSeoDescription(req.seoDescription());
        entity.setAvailabilityBadge(req.availabilityBadge());
        if (req.openToWork() != null) {
            entity.setOpenToWork(req.openToWork());
        }
        entity.setUpdatedAt(Instant.now());
        entity.setUpdatedBy(actorId);

        SiteSettingsJpaEntity saved = settingsRepository.save(entity);
        SiteSettingsDto afterDto = toDto(saved);

        auditService.record(actorId, "UPDATE_SETTINGS", "SITE_SETTINGS", saved.getId(), beforeSnapshot, afterDto, requestId);
        cacheService.evict("site:settings:current");

        return afterDto;
    }

    private SiteSettingsJpaEntity createDefaultSettings() {
        SiteSettingsJpaEntity entity = new SiteSettingsJpaEntity();
        entity.setFullName("Abeeb Oladipupo");
        entity.setProfessionalTitle("Software Developer | Systems & Cybersecurity");
        entity.setHeadline("I build secure, scalable software and practical technology solutions.");
        entity.setBio("Computer Science graduate focused on software development, backend systems, databases, Linux, cloud infrastructure, and cybersecurity.");
        entity.setContactEmail("abeeboladipupo@example.com");
        entity.setLocation("Accra / Open to Relocation & Remote");
        entity.setGithubUrl("https://github.com/abeeboladipupo");
        entity.setLinkedinUrl("https://linkedin.com/in/abeeboladipupo");
        entity.setWebsiteUrl("https://www.abeeboladipupo.com");
        entity.setSeoTitle("Abeeb Oladipupo | Software Developer & Cybersecurity");
        entity.setSeoDescription("Computer Science graduate focused on software development, backend systems, databases, Linux, cloud infrastructure, and cybersecurity.");
        entity.setAvailabilityBadge("🎓 Computer Science Graduate • Available for Full-Time Roles");
        entity.setOpenToWork(true);
        return settingsRepository.save(entity);
    }

    private SiteSettingsDto toDto(SiteSettingsJpaEntity e) {
        return new SiteSettingsDto(
            e.getId(),
            e.getFullName(),
            e.getProfessionalTitle(),
            e.getHeadline(),
            e.getBio(),
            e.getContactEmail(),
            e.getPhone(),
            e.getLocation(),
            e.getProfileImageUrl(),
            e.getGithubUrl(),
            e.getLinkedinUrl(),
            e.getWebsiteUrl(),
            e.getSeoTitle(),
            e.getSeoDescription(),
            e.getAvailabilityBadge(),
            e.isOpenToWork(),
            e.getUpdatedAt()
        );
    }
}
