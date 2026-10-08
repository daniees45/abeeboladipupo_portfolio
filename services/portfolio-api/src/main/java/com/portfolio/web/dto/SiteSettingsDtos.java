package com.portfolio.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.UUID;

public class SiteSettingsDtos {

    public record SiteSettingsDto(
        UUID id,
        String fullName,
        String professionalTitle,
        String headline,
        String bio,
        String contactEmail,
        String phone,
        String location,
        String profileImageUrl,
        String githubUrl,
        String linkedinUrl,
        String websiteUrl,
        String seoTitle,
        String seoDescription,
        String availabilityBadge,
        boolean openToWork,
        Instant updatedAt
    ) {}

    public record SiteSettingsUpdate(
        @NotBlank @Size(max = 160)
        String fullName,

        @NotBlank @Size(max = 200)
        String professionalTitle,

        @NotBlank @Size(max = 300)
        String headline,

        @NotBlank
        String bio,

        @NotBlank @Email @Size(max = 320)
        String contactEmail,

        @Size(max = 50)
        String phone,

        @NotBlank @Size(max = 160)
        String location,

        @Size(max = 2048)
        String profileImageUrl,

        @Size(max = 2048)
        String githubUrl,

        @Size(max = 2048)
        String linkedinUrl,

        @Size(max = 2048)
        String websiteUrl,

        @Size(max = 200)
        String seoTitle,

        @Size(max = 500)
        String seoDescription,

        @Size(max = 120)
        String availabilityBadge,

        Boolean openToWork
    ) {}
}
