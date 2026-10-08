package com.portfolio.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class ProjectDtos {

    public record ProjectCreate(
        @NotBlank @Size(max = 120)
        @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$", message = "Slug must be lowercase alphanumeric with hyphens")
        String slug,

        @NotBlank @Size(max = 160)
        String title,

        @NotBlank @Size(max = 500)
        String summary,

        @NotBlank
        String contentMarkdown,

        @URL @Size(max = 2048)
        String repositoryUrl,

        @URL @Size(max = 2048)
        String liveUrl,

        @URL @Size(max = 2048)
        String demoUrl,

        Boolean published,
        Boolean featured,

        @Min(0)
        Integer displayOrder,

        String problem,
        String solution,
        String architectureFlow,
        String keyFeatures,
        String technologies
    ) {}

    public record ProjectUpdate(
        @NotBlank @Size(max = 120)
        @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$")
        String slug,

        @NotBlank @Size(max = 160)
        String title,

        @NotBlank @Size(max = 500)
        String summary,

        @NotBlank
        String contentMarkdown,

        @URL @Size(max = 2048)
        String repositoryUrl,

        @URL @Size(max = 2048)
        String liveUrl,

        @URL @Size(max = 2048)
        String demoUrl,

        Boolean published,
        Boolean featured,

        @Min(0)
        Integer displayOrder,

        @NotNull @Min(0)
        Integer version,

        String problem,
        String solution,
        String architectureFlow,
        String keyFeatures,
        String technologies
    ) {}

    public record Project(
        UUID id,
        String slug,
        String title,
        String summary,
        String contentMarkdown,
        String repositoryUrl,
        String liveUrl,
        String demoUrl,
        boolean published,
        boolean featured,
        int displayOrder,
        int version,
        String problem,
        String solution,
        String architectureFlow,
        String keyFeatures,
        String technologies,
        List<String> stack,
        Instant updatedAt
    ) {}

    public record ProjectPage(
        List<Project> content,
        int page,
        int size,
        long totalElements
    ) {}
}
