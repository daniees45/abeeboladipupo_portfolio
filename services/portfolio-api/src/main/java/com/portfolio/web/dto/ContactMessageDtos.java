package com.portfolio.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

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
}
