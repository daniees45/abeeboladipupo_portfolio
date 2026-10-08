package com.portfolio.web.controller;

import com.portfolio.application.service.ResumeService;
import com.portfolio.infrastructure.persistence.jpa.entity.ResumeDocumentJpaEntity;
import com.portfolio.web.dto.ResumeDtos.ActiveResumeDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resume")
@Tag(name = "Resume", description = "Public resume inspection and download")
public class PublicResumeController {

    private final ResumeService resumeService;

    public PublicResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @GetMapping("/active")
    @Operation(summary = "Get active published resume metadata", operationId = "getActiveResume")
    public ResponseEntity<ActiveResumeDto> getActiveResume() {
        return ResponseEntity.ok(resumeService.getActivePublishedResume());
    }

    @GetMapping("/download/{id}")
    @Operation(summary = "Download or stream published resume file", operationId = "downloadResume")
    public ResponseEntity<byte[]> downloadResume(@PathVariable UUID id) {
        ResumeDocumentJpaEntity doc = resumeService.getResumeFile(id);

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(doc.getContentType());
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
            .contentType(mediaType)
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + doc.getFileName() + "\"")
            .contentLength(doc.getFileSizeBytes())
            .body(doc.getFileData());
    }
}
