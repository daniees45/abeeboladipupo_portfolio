package com.portfolio.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public class EducationDtos {

    public record EducationDto(
        UUID id,
        String institution,
        String degree,
        String fieldOfStudy,
        LocalDate startedOn,
        LocalDate endedOn,
        boolean currentEducation,
        String description,
        String credentialUrl,
        int displayOrder
    ) {}

    public record EducationCreate(
        @NotBlank @Size(max = 160)
        String institution,

        @NotBlank @Size(max = 160)
        String degree,

        @Size(max = 160)
        String fieldOfStudy,

        @NotNull
        LocalDate startedOn,

        LocalDate endedOn,

        Boolean currentEducation,

        String description,

        @Size(max = 2048)
        String credentialUrl,

        @Min(0)
        Integer displayOrder
    ) {}

    public record EducationUpdate(
        @NotBlank @Size(max = 160)
        String institution,

        @NotBlank @Size(max = 160)
        String degree,

        @Size(max = 160)
        String fieldOfStudy,

        @NotNull
        LocalDate startedOn,

        LocalDate endedOn,

        Boolean currentEducation,

        String description,

        @Size(max = 2048)
        String credentialUrl,

        @Min(0)
        Integer displayOrder
    ) {}
}
