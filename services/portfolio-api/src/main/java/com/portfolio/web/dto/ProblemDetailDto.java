package com.portfolio.web.dto;

import java.net.URI;
import java.util.List;

public record ProblemDetailDto(
    URI type,
    String title,
    int status,
    String detail,
    String instance,
    String requestId,
    List<FieldErrorItem> errors
) {
    public record FieldErrorItem(String field, String message) {}

    public static ProblemDetailDto of(int status, String title, String detail, String instance, String requestId, List<FieldErrorItem> errors) {
        return new ProblemDetailDto(
            URI.create("https://api.abeeboladipupo.com/problems/" + status),
            title,
            status,
            detail,
            instance,
            requestId,
            errors
        );
    }
}
