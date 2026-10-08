package com.portfolio.web.controller;

import com.portfolio.application.service.CertificationService;
import com.portfolio.application.service.ContentService;
import com.portfolio.application.service.EducationService;
import com.portfolio.infrastructure.config.SecurityActorResolver;
import com.portfolio.infrastructure.persistence.jpa.entity.SkillJpaEntity;
import com.portfolio.infrastructure.persistence.jpa.repository.SkillJpaRepository;
import com.portfolio.web.dto.CertificationDtos.CertificationCreate;
import com.portfolio.web.dto.CertificationDtos.CertificationDto;
import com.portfolio.web.dto.CertificationDtos.CertificationUpdate;
import com.portfolio.web.dto.EducationDtos.EducationCreate;
import com.portfolio.web.dto.EducationDtos.EducationDto;
import com.portfolio.web.dto.EducationDtos.EducationUpdate;
import com.portfolio.web.dto.SkillDto;
import com.portfolio.web.error.Exceptions.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin Credentials", description = "CMS administration endpoints for education, certifications and skills")
@SecurityRequirement(name = "oauth2")
public class AdminCredentialsController {

    private final EducationService educationService;
    private final CertificationService certificationService;
    private final SkillJpaRepository skillRepository;
    private final ContentService contentService;
    private final SecurityActorResolver actorResolver;

    public AdminCredentialsController(
        EducationService educationService,
        CertificationService certificationService,
        SkillJpaRepository skillRepository,
        ContentService contentService,
        SecurityActorResolver actorResolver
    ) {
        this.educationService = educationService;
        this.certificationService = certificationService;
        this.skillRepository = skillRepository;
        this.contentService = contentService;
        this.actorResolver = actorResolver;
    }

    // --- Education ---
    @PostMapping("/education")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "Create education entry", operationId = "createEducation")
    public ResponseEntity<EducationDto> createEducation(@Valid @RequestBody EducationCreate req, HttpServletRequest request) {
        UUID actorId = actorResolver.resolveActorId();
        String requestId = request.getHeader("X-Request-Id");
        return ResponseEntity.status(HttpStatus.CREATED).body(educationService.createEducation(req, actorId, requestId));
    }

    @PutMapping("/education/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "Update education entry", operationId = "updateEducation")
    public ResponseEntity<EducationDto> updateEducation(
        @PathVariable UUID id,
        @Valid @RequestBody EducationUpdate req,
        HttpServletRequest request
    ) {
        UUID actorId = actorResolver.resolveActorId();
        String requestId = request.getHeader("X-Request-Id");
        return ResponseEntity.ok(educationService.updateEducation(id, req, actorId, requestId));
    }

    @DeleteMapping("/education/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "Delete education entry", operationId = "deleteEducation")
    public ResponseEntity<Void> deleteEducation(@PathVariable UUID id, HttpServletRequest request) {
        UUID actorId = actorResolver.resolveActorId();
        String requestId = request.getHeader("X-Request-Id");
        educationService.deleteEducation(id, actorId, requestId);
        return ResponseEntity.noContent().build();
    }

    // --- Certifications ---
    @PostMapping("/certifications")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "Create certification", operationId = "createCertification")
    public ResponseEntity<CertificationDto> createCertification(@Valid @RequestBody CertificationCreate req, HttpServletRequest request) {
        UUID actorId = actorResolver.resolveActorId();
        String requestId = request.getHeader("X-Request-Id");
        return ResponseEntity.status(HttpStatus.CREATED).body(certificationService.createCertification(req, actorId, requestId));
    }

    @PutMapping("/certifications/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "Update certification", operationId = "updateCertification")
    public ResponseEntity<CertificationDto> updateCertification(
        @PathVariable UUID id,
        @Valid @RequestBody CertificationUpdate req,
        HttpServletRequest request
    ) {
        UUID actorId = actorResolver.resolveActorId();
        String requestId = request.getHeader("X-Request-Id");
        return ResponseEntity.ok(certificationService.updateCertification(id, req, actorId, requestId));
    }

    @DeleteMapping("/certifications/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "Delete certification", operationId = "deleteCertification")
    public ResponseEntity<Void> deleteCertification(@PathVariable UUID id, HttpServletRequest request) {
        UUID actorId = actorResolver.resolveActorId();
        String requestId = request.getHeader("X-Request-Id");
        certificationService.deleteCertification(id, actorId, requestId);
        return ResponseEntity.noContent().build();
    }

    // --- Skills ---
    @PostMapping("/skills")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "Create skill", operationId = "createSkill")
    public ResponseEntity<SkillDto> createSkill(@Valid @RequestBody SkillDto req) {
        SkillJpaEntity entity = new SkillJpaEntity();
        entity.setName(req.name());
        entity.setCategory(req.category());
        entity.setDisplayOrder(req.displayOrder());
        SkillJpaEntity saved = skillRepository.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SkillDto(saved.getId(), saved.getName(), saved.getCategory(), saved.getDisplayOrder()));
    }

    @PutMapping("/skills/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "Update skill", operationId = "updateSkill")
    public ResponseEntity<SkillDto> updateSkill(@PathVariable UUID id, @Valid @RequestBody SkillDto req) {
        SkillJpaEntity entity = skillRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
        entity.setName(req.name());
        entity.setCategory(req.category());
        entity.setDisplayOrder(req.displayOrder());
        entity.setUpdatedAt(Instant.now());
        SkillJpaEntity updated = skillRepository.save(entity);
        return ResponseEntity.ok(new SkillDto(updated.getId(), updated.getName(), updated.getCategory(), updated.getDisplayOrder()));
    }

    @DeleteMapping("/skills/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "Delete skill", operationId = "deleteSkill")
    public ResponseEntity<Void> deleteSkill(@PathVariable UUID id, HttpServletRequest request) {
        UUID actorId = actorResolver.resolveActorId();
        String requestId = request.getHeader("X-Request-Id");
        contentService.softDeleteResource("skills", id, actorId, requestId);
        return ResponseEntity.noContent().build();
    }
}
