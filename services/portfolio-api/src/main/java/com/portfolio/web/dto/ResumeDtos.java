package com.portfolio.web.dto;

import java.time.Instant;
import java.util.UUID;

public class ResumeDtos {

    public record ResumeDocumentDto(
        UUID id,
        String fileName,
        String contentType,
        long fileSizeBytes,
        String versionTag,
        String targetTrack,
        boolean isPublished,
        Instant uploadedAt
    ) {}

    public record ActiveResumeDto(
        UUID id,
        String fileName,
        String contentType,
        long fileSizeBytes,
        String versionTag,
        String downloadUrl,
        Instant uploadedAt
    ) {}
}
