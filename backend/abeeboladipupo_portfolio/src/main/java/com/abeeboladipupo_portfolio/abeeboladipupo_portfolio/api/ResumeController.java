package com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api;

import com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api.dto.ResumeEntryDto;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class ResumeController {

    @GetMapping("/resume")
    public List<ResumeEntryDto> getResume() {
        return List.of(
            new ResumeEntryDto(
                "Experience",
                "Senior Software Engineer",
                "2022 - Present",
                "Designs and ships resilient product systems with strong engineering quality and operational maturity.",
                "Independent Product Engineering"
            ),
            new ResumeEntryDto(
                "Experience",
                "Cloud Architect",
                "2020 - 2022",
                "Built cloud deployment workflow, system monitoring, and production-grade release confidence patterns.",
                "Portfolio Platform"
            ),
            new ResumeEntryDto(
                "Education",
                "B.Sc. Computer Science",
                "2015 - 2019",
                "Focused on software architecture, data systems, and product-oriented engineering practice.",
                "University of Technology"
            )
        );
    }
}
