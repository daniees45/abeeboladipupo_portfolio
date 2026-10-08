package com.portfolio.infrastructure.persistence.jpa.repository;

import com.portfolio.infrastructure.persistence.jpa.entity.AppUserJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppUserJpaRepository extends JpaRepository<AppUserJpaEntity, UUID> {

    Optional<AppUserJpaEntity> findBySubject(String subject);

    Optional<AppUserJpaEntity> findByEmail(String email);
}
