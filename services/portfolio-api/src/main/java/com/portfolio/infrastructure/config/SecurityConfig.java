package com.portfolio.infrastructure.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${app.cors.allowed-origins:https://www.abeeboladipupo.com,https://abeeboladipupo.com,http://localhost:3000,http://localhost:5173}")
    private List<String> allowedOrigins;

    private final AdminTokenAuthenticationFilter adminTokenFilter;

    public SecurityConfig(AdminTokenAuthenticationFilter adminTokenFilter) {
        this.adminTokenFilter = adminTokenFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Stateless REST API
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(adminTokenFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                // Public settings, content & credentials
                .requestMatchers(HttpMethod.GET, "/api/v1/settings").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/projects/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/experience").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/education").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/certifications").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/skills").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/resume/active").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/resume/download/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/metrics").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/posts/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()

                // Public contact submission & auth
                .requestMatchers(HttpMethod.POST, "/api/v1/contact-messages").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/auth/me").authenticated()

                // Health & OpenAPI
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()

                // Admin endpoints protected by RBAC
                .requestMatchers("/api/v1/admin/**").hasAnyAuthority("SCOPE_ADMIN", "ROLE_ADMIN", "ADMIN")

                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            );

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return token -> {
            try {
                com.nimbusds.jwt.SignedJWT signedJWT = com.nimbusds.jwt.SignedJWT.parse(token);
                var claims = signedJWT.getJWTClaimsSet();
                return Jwt.withTokenValue(token)
                    .header("alg", "HS256")
                    .subject(claims.getSubject())
                    .claims(c -> c.putAll(claims.getClaims()))
                    .issuedAt(claims.getIssueTime() != null ? claims.getIssueTime().toInstant() : java.time.Instant.now())
                    .expiresAt(claims.getExpirationTime() != null ? claims.getExpirationTime().toInstant() : java.time.Instant.now().plusSeconds(86400))
                    .build();
            } catch (Exception e) {
                throw new JwtException("Token parsing error", e);
            }
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Request-Id", "If-None-Match"));
        configuration.setExposedHeaders(List.of("ETag", "X-Request-Id"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new Converter<Jwt, Collection<GrantedAuthority>>() {
            @Override
            public Collection<GrantedAuthority> convert(Jwt jwt) {
                Collection<GrantedAuthority> authorities = new ArrayList<>();

                Object scopes = jwt.getClaims().get("scope");
                if (scopes instanceof String s) {
                    for (String scope : s.split(" ")) {
                        authorities.add(new SimpleGrantedAuthority("SCOPE_" + scope));
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + scope));
                    }
                }

                List<?> roles = jwt.getClaimAsStringList("roles");
                if (roles != null) {
                    for (Object role : roles) {
                        String r = String.valueOf(role);
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + r.replaceFirst("^ROLE_", "")));
                    }
                }

                return authorities;
            }
        });
        return converter;
    }
}
