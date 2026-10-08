package com.portfolio.web.controller;

import com.portfolio.application.service.ProjectService;
import com.portfolio.infrastructure.config.SecurityActorResolver;
import com.portfolio.web.dto.ProjectDtos.Project;
import com.portfolio.web.dto.ProjectDtos.ProjectCreate;
import com.portfolio.web.dto.ProjectDtos.ProjectUpdate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/projects")
@Tag(name = "Admin Projects", description = "CMS administration endpoints for projects")
@SecurityRequirement(name = "oauth2")
public class AdminProjectController {

    private final ProjectService projectService;
    private final SecurityActorResolver actorResolver;

    public AdminProjectController(ProjectService projectService, SecurityActorResolver actorResolver) {
        this.projectService = projectService;
        this.actorResolver = actorResolver;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_EDITOR', 'ROLE_ADMIN', 'ROLE_EDITOR')")
    @Operation(summary = "Create a new project", operationId = "createProject")
    public ResponseEntity<Project> createProject(@Valid @RequestBody ProjectCreate req, HttpServletRequest request) {
        UUID actorId = actorResolver.resolveActorId();
        String requestId = request.getHeader("X-Request-Id");
        Project created = projectService.createProject(req, actorId, requestId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_EDITOR', 'ROLE_ADMIN', 'ROLE_EDITOR')")
    @Operation(summary = "Update an existing project", operationId = "updateProject")
    public ResponseEntity<Project> updateProject(
        @PathVariable UUID id,
        @Valid @RequestBody ProjectUpdate req,
        HttpServletRequest request
    ) {
        UUID actorId = actorResolver.resolveActorId();
        String requestId = request.getHeader("X-Request-Id");
        Project updated = projectService.updateProject(id, req, actorId, requestId);
        return ResponseEntity.ok(updated);
    }
}
