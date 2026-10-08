package com.portfolio.web.controller;

import com.portfolio.application.service.ProductService;
import com.portfolio.infrastructure.config.SecurityActorResolver;
import com.portfolio.web.dto.ProductDtos.Product;
import com.portfolio.web.dto.ProductDtos.ProductCreate;
import com.portfolio.web.dto.ProductDtos.ProductUpdate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/products")
@Tag(name = "Admin Products", description = "CMS administration endpoints for personal-brand offerings")
@SecurityRequirement(name = "oauth2")
public class AdminProductController {

    private final ProductService productService;
    private final SecurityActorResolver actorResolver;

    public AdminProductController(ProductService productService, SecurityActorResolver actorResolver) {
        this.productService = productService;
        this.actorResolver = actorResolver;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "Create a store offering", operationId = "createProduct")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody ProductCreate req, HttpServletRequest request) {
        UUID actorId = actorResolver.resolveActorId();
        String requestId = request.getHeader("X-Request-Id");
        Product created = productService.createProduct(req, actorId, requestId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "Update a store offering", operationId = "updateProduct")
    public ResponseEntity<Product> updateProduct(
        @PathVariable UUID id,
        @Valid @RequestBody ProductUpdate req,
        HttpServletRequest request
    ) {
        UUID actorId = actorResolver.resolveActorId();
        String requestId = request.getHeader("X-Request-Id");
        Product updated = productService.updateProduct(id, req, actorId, requestId);
        return ResponseEntity.ok(updated);
    }
}
