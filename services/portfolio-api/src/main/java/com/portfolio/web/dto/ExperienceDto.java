package com.portfolio.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record ExperienceDto(
    @NotNull UUID id,
    @NotBlank String company,
    @NotBlank String role,
    String location,
    @NotBlank String descriptionMarkdown,
    @NotNull LocalDate startedOn,
    LocalDate endedOn,
    boolean currentRole
) {}
