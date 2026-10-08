package com.portfolio.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public class CertificationDtos {

    public record CertificationDto(
        UUID id,
        String name,
        String issuingOrganization,
        LocalDate issueDate,
        LocalDate expirationDate,
        String credentialId,
        String credentialUrl,
        int displayOrder
    ) {}

    public record CertificationCreate(
        @NotBlank @Size(max = 160)
        String name,

        @NotBlank @Size(max = 160)
        String issuingOrganization,

        @NotNull
        LocalDate issueDate,

        LocalDate expirationDate,

        @Size(max = 160)
        String credentialId,

        @Size(max = 2048)
        String credentialUrl,

        @Min(0)
        Integer displayOrder
    ) {}

    public record CertificationUpdate(
        @NotBlank @Size(max = 160)
        String name,

        @NotBlank @Size(max = 160)
        String issuingOrganization,

        @NotNull
        LocalDate issueDate,

        LocalDate expirationDate,

        @Size(max = 160)
        String credentialId,

        @Size(max = 2048)
        String credentialUrl,

        @Min(0)
        Integer displayOrder
    ) {}
}
