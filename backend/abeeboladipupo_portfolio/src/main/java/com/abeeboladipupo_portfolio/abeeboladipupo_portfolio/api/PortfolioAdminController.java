package com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api;

import com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api.dto.AdminOverviewDto;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class PortfolioAdminController {

    @GetMapping("/admin/overview")
    public AdminOverviewDto getAdminOverview() {
        return new AdminOverviewDto(
            "Abeoladipupo",
            3,
            5,
            "Authorized • No sponsorship required",
            List.of(
                "Content approvals",
                "Deployment health",
                "Access control",
                "Project publishing"
            )
        );
    }
}
