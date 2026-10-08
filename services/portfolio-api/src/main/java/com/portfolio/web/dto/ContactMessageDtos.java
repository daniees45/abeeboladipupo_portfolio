package com.portfolio.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.UUID;

public class ContactMessageDtos {

    public record ContactMessageCreate(
        @NotBlank @Size(max = 120)
        String senderName,

        @NotBlank @Email @Size(max = 320)
        String senderEmail,

        @NotBlank @Size(max = 200)
        String subject,

        @NotBlank @Size(max = 10000)
        String body
    ) {}

    public record ContactMessageDto(
        UUID id,
        String senderName,
        String senderEmail,
        String subject,
        String body,
        String status,
        Instant createdAt,
        Instant resolvedAt
    ) {}

    public record ContactMessageStatusUpdate(
        @NotBlank
        @Pattern(regexp = "^(NEW|IN_PROGRESS|RESOLVED|SPAM)$", message = "Status must be NEW, IN_PROGRESS, RESOLVED, or SPAM")
        String status
    ) {}
}
