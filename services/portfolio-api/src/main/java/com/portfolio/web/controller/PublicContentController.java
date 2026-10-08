package com.portfolio.web.controller;

import com.portfolio.application.service.ContentService;
import com.portfolio.web.dto.BlogPostDtos.BlogPost;
import com.portfolio.web.dto.BlogPostDtos.BlogPostPage;
import com.portfolio.web.dto.ExperienceDto;
import com.portfolio.web.dto.SkillDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Public Content", description = "Public skills, experience timeline, and blog posts")
public class PublicContentController {

    private final ContentService contentService;

    public PublicContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping("/skills")
    @Operation(summary = "List technical skills", operationId = "listSkills")
    public ResponseEntity<List<SkillDto>> listSkills() {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
            .body(contentService.listSkills());
    }

    @GetMapping("/experience")
    @Operation(summary = "List career experience", operationId = "listExperience")
    public ResponseEntity<List<ExperienceDto>> listExperience() {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
            .body(contentService.listExperience());
    }

    @GetMapping("/posts")
    @Operation(summary = "List blog posts", operationId = "listPosts")
    public ResponseEntity<BlogPostPage> listPosts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(15, TimeUnit.MINUTES).cachePublic())
            .body(contentService.listPosts(page, size));
    }

    @GetMapping("/posts/{slug}")
    @Operation(summary = "Get blog post by slug", operationId = "getPostBySlug")
    public ResponseEntity<BlogPost> getPostBySlug(@PathVariable String slug) {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES).cachePublic())
            .body(contentService.getPostBySlug(slug));
    }
}
