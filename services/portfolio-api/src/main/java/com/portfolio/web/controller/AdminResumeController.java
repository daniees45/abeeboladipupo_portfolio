package com.portfolio.web.controller;

import com.portfolio.application.service.ResumeService;
import com.portfolio.infrastructure.config.SecurityActorResolver;
import com.portfolio.web.dto.ResumeDtos.ResumeDocumentDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/resumes")
@Tag(name = "Admin Resumes", description = "CMS administration endpoints for resume uploads and publishing")
@SecurityRequirement(name = "oauth2")
public class AdminResumeController {

    private final ResumeService resumeService;
    private final SecurityActorResolver actorResolver;

    public AdminResumeController(ResumeService resumeService, SecurityActorResolver actorResolver) {
        this.resumeService = resumeService;
        this.actorResolver = actorResolver;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "List all uploaded resume versions", operationId = "listAllResumes")
    public ResponseEntity<List<ResumeDocumentDto>> listAllResumes() {
        return ResponseEntity.ok(resumeService.listAllResumes());
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "Upload a new resume file", operationId = "uploadResume")
    public ResponseEntity<ResumeDocumentDto> uploadResume(
        @RequestParam("file") MultipartFile file,
        @RequestParam(value = "versionTag", required = false) String versionTag,
        @RequestParam(value = "targetTrack", required = false) String targetTrack,
        @RequestParam(value = "publish", defaultValue = "false") boolean publish,
        HttpServletRequest request
    ) throws IOException {
        UUID actorId = actorResolver.resolveActorId();
        String requestId = request.getHeader("X-Request-Id");
        ResumeDocumentDto dto = resumeService.uploadResume(file, versionTag, targetTrack, publish, actorId, requestId);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PutMapping("/{id}/publish")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "Set resume as the active public version", operationId = "publishResume")
    public ResponseEntity<ResumeDocumentDto> publishResume(
        @PathVariable UUID id,
        HttpServletRequest request
    ) {
        UUID actorId = actorResolver.resolveActorId();
        String requestId = request.getHeader("X-Request-Id");
        return ResponseEntity.ok(resumeService.publishResume(id, actorId, requestId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "Delete resume version", operationId = "deleteResume")
    public ResponseEntity<Void> deleteResume(
        @PathVariable UUID id,
        HttpServletRequest request
    ) {
        UUID actorId = actorResolver.resolveActorId();
        String requestId = request.getHeader("X-Request-Id");
        resumeService.deleteResume(id, actorId, requestId);
        return ResponseEntity.noContent().build();
    }
}
