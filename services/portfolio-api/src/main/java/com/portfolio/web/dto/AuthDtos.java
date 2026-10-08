package com.portfolio.web.dto;

import jakarta.validation.constraints.NotBlank;

public class AuthDtos {

    public record LoginRequest(
        @NotBlank
        String usernameOrKey,

        String password
    ) {}

    public record AuthResponse(
        String token,
        String tokenType,
        long expiresIn,
        String username,
        String role
    ) {}

    public record UserProfile(
        String username,
        String role,
        String displayName
    ) {}
}
