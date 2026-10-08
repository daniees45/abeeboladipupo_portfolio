package com.portfolio.web.controller;

import com.portfolio.application.service.CertificationService;
import com.portfolio.application.service.EducationService;
import com.portfolio.web.dto.CertificationDtos.CertificationDto;
import com.portfolio.web.dto.EducationDtos.EducationDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Credentials", description = "Public education and certifications queries")
public class PublicCredentialsController {

    private final EducationService educationService;
    private final CertificationService certificationService;

    public PublicCredentialsController(EducationService educationService, CertificationService certificationService) {
        this.educationService = educationService;
        this.certificationService = certificationService;
    }

    @GetMapping("/education")
    @Operation(summary = "List education entries", operationId = "listEducation")
    public ResponseEntity<List<EducationDto>> listEducation() {
        return ResponseEntity.ok(educationService.listEducation());
    }

    @GetMapping("/certifications")
    @Operation(summary = "List certifications", operationId = "listCertifications")
    public ResponseEntity<List<CertificationDto>> listCertifications() {
        return ResponseEntity.ok(certificationService.listCertifications());
    }
}
