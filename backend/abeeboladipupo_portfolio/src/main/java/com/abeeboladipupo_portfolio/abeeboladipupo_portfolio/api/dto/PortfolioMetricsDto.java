package com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api.dto;

public record PortfolioMetricsDto(
    int totalProjects,
    long totalViews,
    String cacheStatus,
    String cacheKey
) {}
