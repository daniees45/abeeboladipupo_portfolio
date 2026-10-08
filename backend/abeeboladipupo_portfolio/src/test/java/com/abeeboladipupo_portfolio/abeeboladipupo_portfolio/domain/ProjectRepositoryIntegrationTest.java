package com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class ProjectRepositoryIntegrationTest {

    @Autowired
    private ProjectRepository projectRepository;

    @Test
    void shouldPersistProjectRecords() {
        Project project = new Project();
        project.setTitle("Launch Readiness");
        project.setSlug("launch-readiness");
        project.setSummary("A production readiness tracking dashboard for engineering teams.");
        project.setStack("Java, Spring Boot, PostgreSQL");
        project.setStatus("draft");
        project.setDemoViewport("desktop");
        project.setYear(2026);
        project.setPublicProject(true);

        Project saved = projectRepository.save(project);

        assertThat(saved.getId()).isNotNull();
        assertThat(projectRepository.findBySlug("launch-readiness")).isPresent();
    }
}
