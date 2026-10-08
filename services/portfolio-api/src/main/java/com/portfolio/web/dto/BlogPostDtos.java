package com.portfolio.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.URL;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class BlogPostDtos {

    public record BlogPost(
        @NotNull UUID id,
        @NotBlank String slug,
        @NotBlank String title,
        @NotBlank String excerpt,
        @NotBlank String bodyMarkdown,
        @URL String coverImageUrl,
        boolean published,
        Instant publishedAt
    ) {}

    public record BlogPostPage(
        List<BlogPost> content,
        int page,
        int size,
        long totalElements
    ) {}
}
