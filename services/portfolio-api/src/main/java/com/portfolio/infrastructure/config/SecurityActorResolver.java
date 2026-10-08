package com.portfolio.infrastructure.config;

import com.portfolio.infrastructure.persistence.jpa.entity.AppUserJpaEntity;
import com.portfolio.infrastructure.persistence.jpa.repository.AppUserJpaRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class SecurityActorResolver {

    private final AppUserJpaRepository appUserRepository;

    public SecurityActorResolver(AppUserJpaRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public UUID resolveActorId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return null;
        }

        if (auth.getPrincipal() instanceof Jwt jwt) {
            String subject = jwt.getSubject();
            if (subject != null) {
                return appUserRepository.findBySubject(subject)
                    .map(AppUserJpaEntity::getId)
                    .orElseGet(() -> {
                        String email = jwt.getClaimAsString("email");
                        if (email != null) {
                            return appUserRepository.findByEmail(email)
                                .map(AppUserJpaEntity::getId)
                                .orElse(null);
                        }
                        return null;
                    });
            }
        } else if (auth.getName() != null) {
            return appUserRepository.findBySubject(auth.getName())
                .map(AppUserJpaEntity::getId)
                .orElse(null);
        }
        return null;
    }
}
