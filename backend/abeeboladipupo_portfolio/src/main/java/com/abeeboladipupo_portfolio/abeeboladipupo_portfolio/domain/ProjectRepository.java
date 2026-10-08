package com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.domain;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findBySlug(String slug);

    List<Project> findAllByOrderByCreatedAtDesc();
}
