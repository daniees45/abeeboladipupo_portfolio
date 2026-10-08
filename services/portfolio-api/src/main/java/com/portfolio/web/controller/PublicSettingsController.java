package com.portfolio.web.controller;

import com.portfolio.application.service.SiteSettingsService;
import com.portfolio.web.dto.SiteSettingsDtos.SiteSettingsDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v1/settings")
@Tag(name = "Settings", description = "Public site settings, personal bio and social links")
public class PublicSettingsController {

    private final SiteSettingsService settingsService;

    public PublicSettingsController(SiteSettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    @Operation(summary = "Get public site settings", operationId = "getSiteSettings")
    public ResponseEntity<SiteSettingsDto> getSiteSettings() {
        SiteSettingsDto settings = settingsService.getSettings();
        return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
            .body(settings);
    }
}
