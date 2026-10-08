package com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.domain;

import com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api.dto.ProjectCreateRequestDto;
import com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api.dto.ProjectSummaryDto;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    private static final List<ProjectSummaryDto> FALLBACK_PROJECTS = List.of(
        new ProjectSummaryDto(
            "project-demo-view",
            "Project Demo View",
            "project-demo-view",
            "A secure, recruiter-friendly demo environment that can open a live project sandbox inside the portfolio viewport.",
            List.of("React", "TypeScript", "Tailwind CSS", "Vite", "Cloudflare"),
            "live",
            "desktop",
            2026
        ),
        new ProjectSummaryDto(
            "api-observability",
            "API Observability",
            "api-observability",
            "A production-ready service telemetry dashboard that makes Spring Boot APIs and event flow easy to track.",
            List.of("Java", "Spring Boot", "PostgreSQL", "Redis", "OpenTelemetry"),
            "prototype",
            "tablet",
            2026
        ),
        new ProjectSummaryDto(
            "cloud-automation",
            "Cloud Automation",
            "cloud-automation",
            "Infrastructure automation for deployment pipelines, environment parity, and release confidence across multiple services.",
            List.of("Terraform", "Docker", "Render", "GitHub Actions", "Neon"),
            "concept",
            "mobile",
            2025
        )
    );

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public ProjectService() {
        this(null);
    }

    public List<ProjectSummaryDto> getAllProjects() {
        if (projectRepository == null) {
            return new ArrayList<>(FALLBACK_PROJECTS);
        }

        return projectRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(this::toSummary)
            .toList();
    }

    public ProjectSummaryDto createProject(ProjectCreateRequestDto request) {
        if (projectRepository == null) {
            List<ProjectSummaryDto> fallback = new ArrayList<>(FALLBACK_PROJECTS);
            String slug = normalizeSlug(request);
            ProjectSummaryDto created = new ProjectSummaryDto(
                slug,
                safeTitle(request),
                slug,
                safeSummary(request),
                parseStack(request.stack()),
                safeStatus(request),
                safeViewport(request),
                safeYear(request)
            );
            fallback.add(0, created);
            return created;
        }

        Project project = new Project();
        project.setTitle(safeTitle(request));
        project.setSlug(normalizeSlug(request));
        project.setSummary(safeSummary(request));
        project.setStack(String.join(", ", parseStack(request.stack())));
        project.setStatus(safeStatus(request));
        project.setDemoViewport(safeViewport(request));
        project.setYear(safeYear(request));
        project.setPublicProject(true);

        Project saved = projectRepository.save(project);
        return toSummary(saved);
    }

    private ProjectSummaryDto toSummary(Project project) {
        return new ProjectSummaryDto(
            String.valueOf(project.getId()),
            project.getTitle(),
            project.getSlug(),
            project.getSummary(),
            parseStack(project.getStack()),
            project.getStatus(),
            project.getDemoViewport(),
            project.getYear()
        );
    }

    private static String normalizeSlug(ProjectCreateRequestDto request) {
        String title = safeTitle(request);
        if (request.slug() != null && !request.slug().isBlank()) {
            return request.slug().trim();
        }
        return title.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "-");
    }

    private static String safeTitle(ProjectCreateRequestDto request) {
        return request.title() == null || request.title().isBlank() ? "Untitled Project" : request.title().trim();
    }

    private static String safeSummary(ProjectCreateRequestDto request) {
        return request.summary() == null || request.summary().isBlank() ? "Project summary pending." : request.summary().trim();
    }

    private static String safeStatus(ProjectCreateRequestDto request) {
        return request.status() == null || request.status().isBlank() ? "draft" : request.status().trim();
    }

    private static String safeViewport(ProjectCreateRequestDto request) {
        return request.demoViewport() == null || request.demoViewport().isBlank() ? "desktop" : request.demoViewport().trim();
    }

    private static int safeYear(ProjectCreateRequestDto request) {
        return request.year() == 0 ? 2026 : request.year();
    }

    private static List<String> parseStack(String stack) {
        if (stack == null || stack.isBlank()) {
            return List.of();
        }
        return Arrays.stream(stack.split(","))
            .map(String::trim)
            .filter(value -> !value.isEmpty())
            .toList();
    }

    private static List<String> parseStack(List<String> stack) {
        if (stack == null || stack.isEmpty()) {
            return List.of();
        }
        return stack.stream()
            .map(String::trim)
            .filter(value -> !value.isEmpty())
            .toList();
    }
}
