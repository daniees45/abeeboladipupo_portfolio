package com.portfolio.web.controller;

import com.portfolio.application.service.ContentService;
import com.portfolio.infrastructure.config.SecurityActorResolver;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin Content", description = "Admin-only soft deletion across resources")
@SecurityRequirement(name = "oauth2")
public class AdminContentController {

    private final ContentService contentService;
    private final SecurityActorResolver actorResolver;

    public AdminContentController(ContentService contentService, SecurityActorResolver actorResolver) {
        this.contentService = contentService;
        this.actorResolver = actorResolver;
    }

    @DeleteMapping("/{resource}/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "Soft delete content resource", operationId = "softDeleteContent")
    public ResponseEntity<Void> softDeleteContent(
        @PathVariable String resource,
        @PathVariable UUID id,
        HttpServletRequest request
    ) {
        UUID actorId = actorResolver.resolveActorId();
        String requestId = request.getHeader("X-Request-Id");
        contentService.softDeleteResource(resource, id, actorId, requestId);
        return ResponseEntity.noContent().build();
    }
}
