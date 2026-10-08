package com.portfolio.web.controller;

import com.portfolio.application.service.ProjectService;
import com.portfolio.web.dto.ProjectDtos.Project;
import com.portfolio.web.dto.ProjectDtos.ProjectPage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v1/projects")
@Tag(name = "Public Projects", description = "Public published projects queries")
public class PublicProjectController {

    private final ProjectService projectService;

    public PublicProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    @Operation(summary = "List published projects", operationId = "listProjects")
    public ResponseEntity<ProjectPage> listProjects(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size,
        @RequestParam(required = false) Boolean featured
    ) {
        ProjectPage result = projectService.listPublicProjects(page, size, featured);
        return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(10, TimeUnit.MINUTES).cachePublic())
            .body(result);
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get project by slug", operationId = "getProjectBySlug")
    public ResponseEntity<Project> getProjectBySlug(@PathVariable String slug) {
        Project project = projectService.getPublicProjectBySlug(slug);
        return ResponseEntity.ok()
            .eTag(String.valueOf(project.version()))
            .cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES).cachePublic())
            .body(project);
    }
}
