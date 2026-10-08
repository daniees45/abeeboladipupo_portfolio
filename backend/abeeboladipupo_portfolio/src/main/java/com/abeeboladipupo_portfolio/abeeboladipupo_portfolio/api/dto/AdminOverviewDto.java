package com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api.dto;

import java.util.List;

public record AdminOverviewDto(
    String ownerName,
    int totalProjects,
    int activeSystems,
    String authorizationStatus,
    List<String> tasks
) {}
