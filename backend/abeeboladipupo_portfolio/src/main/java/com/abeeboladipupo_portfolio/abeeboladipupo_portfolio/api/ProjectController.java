package com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api;

import com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api.dto.ProjectCreateRequestDto;
import com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api.dto.ProjectSummaryDto;
import com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.domain.ProjectService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/projects")
    public List<ProjectSummaryDto> getProjects() {
        return projectService.getAllProjects();
    }

    @PostMapping("/projects")
    public ProjectSummaryDto createProject(@RequestBody ProjectCreateRequestDto projectRequest) {
        return projectService.createProject(projectRequest);
    }
}
