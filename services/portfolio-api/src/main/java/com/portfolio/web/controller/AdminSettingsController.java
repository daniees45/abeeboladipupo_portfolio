package com.portfolio.web.controller;

import com.portfolio.application.service.SiteSettingsService;
import com.portfolio.infrastructure.config.SecurityActorResolver;
import com.portfolio.web.dto.SiteSettingsDtos.SiteSettingsDto;
import com.portfolio.web.dto.SiteSettingsDtos.SiteSettingsUpdate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/settings")
@Tag(name = "Admin Settings", description = "CMS administration endpoints for site settings")
@SecurityRequirement(name = "oauth2")
public class AdminSettingsController {

    private final SiteSettingsService settingsService;
    private final SecurityActorResolver actorResolver;

    public AdminSettingsController(SiteSettingsService settingsService, SecurityActorResolver actorResolver) {
        this.settingsService = settingsService;
        this.actorResolver = actorResolver;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "Get site settings for editing", operationId = "getAdminSettings")
    public ResponseEntity<SiteSettingsDto> getAdminSettings() {
        return ResponseEntity.ok(settingsService.getSettings());
    }

    @PutMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "Update site settings", operationId = "updateAdminSettings")
    public ResponseEntity<SiteSettingsDto> updateAdminSettings(
        @Valid @RequestBody SiteSettingsUpdate req,
        HttpServletRequest request
    ) {
        UUID actorId = actorResolver.resolveActorId();
        String requestId = request.getHeader("X-Request-Id");
        SiteSettingsDto updated = settingsService.updateSettings(req, actorId, requestId);
        return ResponseEntity.ok(updated);
    }
}
