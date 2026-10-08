package com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api.dto;

import java.util.List;

public record ProjectCreateRequestDto(
    String title,
    String slug,
    String summary,
    List<String> stack,
    String status,
    String demoViewport,
    int year
) {}
