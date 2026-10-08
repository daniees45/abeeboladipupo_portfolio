package com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api;

import com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api.dto.PortfolioMetricsDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class PortfolioMetricsController {

    private final PortfolioMetricsService portfolioMetricsService;

    public PortfolioMetricsController(PortfolioMetricsService portfolioMetricsService) {
        this.portfolioMetricsService = portfolioMetricsService;
    }

    @GetMapping("/metrics")
    public PortfolioMetricsDto getMetrics() {
        return portfolioMetricsService.getPortfolioMetrics();
    }
}
