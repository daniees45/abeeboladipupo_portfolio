package com.portfolio.web.controller;

import com.portfolio.application.service.ProductService;
import com.portfolio.web.dto.ProductDtos.Product;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v1/products")
@Tag(name = "Public Store Offerings", description = "Personal-brand store offerings catalog (inquiry only)")
public class PublicProductController {

    private final ProductService productService;

    public PublicProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "List active store offerings", operationId = "listProducts")
    public ResponseEntity<List<Product>> listProducts() {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(15, TimeUnit.MINUTES).cachePublic())
            .body(productService.listActiveProducts());
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get product offering by slug", operationId = "getProductBySlug")
    public ResponseEntity<Product> getProductBySlug(@PathVariable String slug) {
        Product product = productService.getProductBySlug(slug);
        return ResponseEntity.ok()
            .eTag(String.valueOf(product.version()))
            .cacheControl(CacheControl.maxAge(30, TimeUnit.MINUTES).cachePublic())
            .body(product);
    }
}
