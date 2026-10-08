package com.portfolio.infrastructure.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.OAuthFlow;
import io.swagger.v3.oas.models.security.OAuthFlows;
import io.swagger.v3.oas.models.security.Scopes;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri:https://auth.abeeboladipupo.com/}")
    private String issuerUri;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Personal Portfolio API")
                .version("1.0.0")
                .description("Public content and protected CMS endpoints for https://www.abeeboladipupo.com.")
            )
            .servers(List.of(
                new Server().url("https://api.abeeboladipupo.com/api/v1").description("Production"),
                new Server().url("http://localhost:8080/api/v1").description("Local Development")
            ))
            .components(new Components()
                .addSecuritySchemes("oauth2", new SecurityScheme()
                    .type(SecurityScheme.Type.OAUTH2)
                    .flows(new OAuthFlows()
                        .authorizationCode(new OAuthFlow()
                            .authorizationUrl(issuerUri + "authorize")
                            .tokenUrl(issuerUri + "oauth/token")
                            .scopes(new Scopes()
                                .addString("ADMIN", "Admin CMS access")
                                .addString("EDITOR", "Content editing")
                                .addString("VISITOR", "Read-only admin access")
                            )
                        )
                    )
                )
            );
    }
}
