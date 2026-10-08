package com.portfolio.web.controller;

import com.portfolio.infrastructure.config.TokenService;
import com.portfolio.web.dto.AuthDtos.AuthResponse;
import com.portfolio.web.dto.AuthDtos.LoginRequest;
import com.portfolio.web.dto.AuthDtos.UserProfile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Admin authentication and token issuance")
public class AuthController {

    private final TokenService tokenService;

    public AuthController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate admin and issue JWT", operationId = "login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        String key = req.usernameOrKey() != null ? req.usernameOrKey().trim() : "";
        String adminKey = tokenService.getAdminSecretKey();

        // Validates secret access key or admin credentials
        boolean isMatch = key.equals(adminKey) ||
            ("admin".equalsIgnoreCase(key) && (req.password() != null && req.password().equals(adminKey)));

        if (!isMatch) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = tokenService.generateAdminToken("admin");
        return ResponseEntity.ok(new AuthResponse(
            token,
            "Bearer",
            86400L,
            "admin",
            "ROLE_ADMIN"
        ));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated profile", operationId = "getCurrentProfile")
    public ResponseEntity<UserProfile> getCurrentProfile(Authentication authentication) {
        String name = authentication != null ? authentication.getName() : "visitor";
        return ResponseEntity.ok(new UserProfile(name, "ROLE_ADMIN", "Abeeb Oladipupo"));
    }
}
