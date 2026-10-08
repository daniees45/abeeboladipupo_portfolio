package com.portfolio.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

import java.time.Instant;
import java.util.UUID;

public class ProductDtos {

    public record ProductCreate(
        @NotBlank @Size(max = 120)
        @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$", message = "Slug must be lowercase alphanumeric with hyphens")
        String slug,

        @NotBlank @Size(max = 160)
        String title,

        @NotBlank @Size(max = 500)
        String summary,

        @NotBlank
        String descriptionMarkdown,

        @URL @Size(max = 2048)
        String imageUrl,

        @NotBlank
        @Pattern(regexp = "^(COMING_SOON|INQUIRY_ONLY)$", message = "Availability status must be COMING_SOON or INQUIRY_ONLY")
        String availabilityStatus,

        Boolean active,

        @Min(0)
        Integer displayOrder
    ) {}

    public record ProductUpdate(
        @NotBlank @Size(max = 120)
        @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$")
        String slug,

        @NotBlank @Size(max = 160)
        String title,

        @NotBlank @Size(max = 500)
        String summary,

        @NotBlank
        String descriptionMarkdown,

        @URL @Size(max = 2048)
        String imageUrl,

        @NotBlank
        @Pattern(regexp = "^(COMING_SOON|INQUIRY_ONLY)$")
        String availabilityStatus,

        Boolean active,

        @Min(0)
        Integer displayOrder,

        @NotNull @Min(0)
        Integer version
    ) {}

    public record Product(
        UUID id,
        String slug,
        String title,
        String summary,
        String descriptionMarkdown,
        String imageUrl,
        String availabilityStatus,
        boolean active,
        int displayOrder,
        int version,
        Instant updatedAt
    ) {}
}
