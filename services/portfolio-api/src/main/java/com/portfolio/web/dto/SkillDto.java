package com.portfolio.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record SkillDto(
    @NotNull UUID id,
    @NotBlank @Size(max = 80) String name,
    @NotBlank @Size(max = 80) String category,
    @Min(0) int displayOrder
) {}
