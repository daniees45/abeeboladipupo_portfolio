package com.portfolio.infrastructure.config;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Service
public class TokenService {

    @Value("${app.security.jwt-secret:abeeb-portfolio-ultra-secure-hmac-sha256-key-2026}")
    private String jwtSecret;

    @Value("${app.security.admin-key:abeeb-admin-2026}")
    private String adminSecretKey;

    public String generateAdminToken(String subject) {
        try {
            Instant now = Instant.now();
            Instant expiry = now.plus(24, ChronoUnit.HOURS);

            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(subject)
                .issuer("https://www.abeeboladipupo.com")
                .issueTime(Date.from(now))
                .expirationTime(Date.from(expiry))
                .claim("roles", List.of("ROLE_ADMIN", "ADMIN"))
                .claim("scope", "ADMIN")
                .build();

            SignedJWT signedJWT = new SignedJWT(
                new JWSHeader(JWSAlgorithm.HS256),
                claimsSet
            );

            JWSSigner signer = new MACSigner(jwtSecret.getBytes(StandardCharsets.UTF_8));
            signedJWT.sign(signer);

            return signedJWT.serialize();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate token", e);
        }
    }

    public boolean validateToken(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }

        // Fast-path: check direct secret access key match
        if (token.equals(adminSecretKey)) {
            return true;
        }

        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(jwtSecret.getBytes(StandardCharsets.UTF_8));

            if (!signedJWT.verify(verifier)) {
                return false;
            }

            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            return expirationTime == null || expirationTime.after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public String getAdminSecretKey() {
        return adminSecretKey;
    }
}
