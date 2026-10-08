package com.portfolio.infrastructure.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
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

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Stateless REST API using Bearer JWT
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public read & contact endpoints
                .requestMatchers(HttpMethod.GET, "/api/v1/projects/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/experience").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/skills").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/posts/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/contact-messages").permitAll()

                // Health & OpenAPI
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()

                // Admin endpoints with RBAC (ADR-002)
                .requestMatchers(HttpMethod.POST, "/api/v1/admin/projects").hasAnyAuthority("SCOPE_ADMIN", "SCOPE_EDITOR", "ROLE_ADMIN", "ROLE_EDITOR")
                .requestMatchers(HttpMethod.PUT, "/api/v1/admin/projects/**").hasAnyAuthority("SCOPE_ADMIN", "SCOPE_EDITOR", "ROLE_ADMIN", "ROLE_EDITOR")
                .requestMatchers("/api/v1/admin/products/**").hasAnyAuthority("SCOPE_ADMIN", "ROLE_ADMIN")
                .requestMatchers("/api/v1/admin/**").hasAnyAuthority("SCOPE_ADMIN", "ROLE_ADMIN")

                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            );

        return http.build();
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

                // 1. Check standard 'scope' or 'scp' claim
                Object scopes = jwt.getClaims().get("scope");
                if (scopes instanceof String s) {
                    for (String scope : s.split(" ")) {
                        authorities.add(new SimpleGrantedAuthority("SCOPE_" + scope));
                    }
                }

                // 2. Check Auth0 custom roles claim (e.g. 'https://abeeboladipupo.com/roles' or 'roles')
                List<?> roles = jwt.getClaimAsStringList("roles");
                if (roles == null) {
                    roles = jwt.getClaimAsStringList("https://www.abeeboladipupo.com/roles");
                }
                if (roles != null) {
                    for (Object role : roles) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toString()));
                        authorities.add(new SimpleGrantedAuthority("SCOPE_" + role.toString()));
                    }
                }

                return authorities;
            }
        });
        return converter;
    }
}
