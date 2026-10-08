package com.portfolio.application.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.infrastructure.cache.CacheService;
import com.portfolio.infrastructure.persistence.jpa.entity.ProductJpaEntity;
import com.portfolio.infrastructure.persistence.jpa.repository.ProductJpaRepository;
import com.portfolio.web.dto.ProductDtos.Product;
import com.portfolio.web.dto.ProductDtos.ProductCreate;
import com.portfolio.web.dto.ProductDtos.ProductUpdate;
import com.portfolio.web.error.Exceptions.ResourceConflictException;
import com.portfolio.web.error.Exceptions.ResourceNotFoundException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductJpaRepository productRepository;
    private final CacheService cacheService;
    private final AuditService auditService;
    private final ObjectMapper objectMapper;

    public ProductService(
        ProductJpaRepository productRepository,
        CacheService cacheService,
        AuditService auditService,
        ObjectMapper objectMapper
    ) {
        this.productRepository = productRepository;
        this.cacheService = cacheService;
        this.auditService = auditService;
        this.objectMapper = objectMapper;
    }

    public List<Product> listActiveProducts() {
        String cacheKey = "products:list";
        String cached = cacheService.get(cacheKey);
        if (cached != null) {
            try {
                return objectMapper.readValue(cached, new TypeReference<List<Product>>() {});
            } catch (Exception ignored) {}
        }

        List<ProductJpaEntity> entities = productRepository.findActiveProducts();
        List<Product> dtoList = entities.stream().map(this::toDto).toList();

        try {
            cacheService.put(cacheKey, objectMapper.writeValueAsString(dtoList), Duration.ofMinutes(15));
        } catch (Exception ignored) {}

        return dtoList;
    }

    public Product getProductBySlug(String slug) {
        String cacheKey = "products:slug:" + slug;
        String cached = cacheService.get(cacheKey);
        if (cached != null) {
            try {
                return objectMapper.readValue(cached, Product.class);
            } catch (Exception ignored) {}
        }

        ProductJpaEntity entity = productRepository.findBySlugAndDeletedAtIsNull(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));

        if (!entity.isActive()) {
            throw new ResourceNotFoundException("Product not found with slug: " + slug);
        }

        Product dto = toDto(entity);
        try {
            cacheService.put(cacheKey, objectMapper.writeValueAsString(dto), Duration.ofMinutes(30));
        } catch (Exception ignored) {}

        return dto;
    }

    @Transactional
    public Product createProduct(ProductCreate req, UUID actorId, String requestId) {
        if (productRepository.existsBySlugAndDeletedAtIsNull(req.slug())) {
            throw new ResourceConflictException("Active product already exists with slug: " + req.slug());
        }

        ProductJpaEntity entity = new ProductJpaEntity();
        applyProperties(entity, req.slug(), req.title(), req.summary(), req.descriptionMarkdown(),
            req.imageUrl(), req.availabilityStatus(), req.active(), req.displayOrder());
        entity.setCreatedBy(actorId);
        entity.setUpdatedBy(actorId);

        ProductJpaEntity saved = productRepository.save(entity);

        auditService.record(actorId, "CREATE_PRODUCT", "PRODUCT", saved.getId(), null, toDto(saved), requestId);
        cacheService.evictProductCaches(saved.getSlug());

        return toDto(saved);
    }

    @Transactional
    public Product updateProduct(UUID id, ProductUpdate req, UUID actorId, String requestId) {
        ProductJpaEntity entity = productRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (entity.getVersion() != req.version()) {
            throw new OptimisticLockingFailureException("Version mismatch. Expected: " + entity.getVersion() + ", got: " + req.version());
        }

        Product beforeSnapshot = toDto(entity);

        applyProperties(entity, req.slug(), req.title(), req.summary(), req.descriptionMarkdown(),
            req.imageUrl(), req.availabilityStatus(), req.active(), req.displayOrder());
        entity.setUpdatedBy(actorId);
        entity.setUpdatedAt(Instant.now());

        ProductJpaEntity updated = productRepository.save(entity);

        auditService.record(actorId, "UPDATE_PRODUCT", "PRODUCT", updated.getId(), beforeSnapshot, toDto(updated), requestId);
        cacheService.evictProductCaches(updated.getSlug());

        return toDto(updated);
    }

    @Transactional
    public void softDeleteProduct(UUID id, UUID actorId, String requestId) {
        ProductJpaEntity entity = productRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Product beforeSnapshot = toDto(entity);
        entity.setDeletedAt(Instant.now());
        entity.setUpdatedBy(actorId);
        productRepository.save(entity);

        auditService.record(actorId, "SOFT_DELETE_PRODUCT", "PRODUCT", id, beforeSnapshot, null, requestId);
        cacheService.evictProductCaches(entity.getSlug());
    }

    private void applyProperties(ProductJpaEntity entity, String slug, String title, String summary,
                                 String descriptionMarkdown, String imageUrl, String availabilityStatus,
                                 Boolean active, Integer displayOrder) {
        entity.setSlug(slug);
        entity.setTitle(title);
        entity.setSummary(summary);
        entity.setDescriptionMarkdown(descriptionMarkdown);
        entity.setImageUrl(imageUrl);
        entity.setAvailabilityStatus(availabilityStatus != null ? availabilityStatus : "COMING_SOON");
        entity.setActive(active != null ? active : false);
        entity.setDisplayOrder(displayOrder != null ? displayOrder : 0);
    }

    public Product toDto(ProductJpaEntity entity) {
        return new Product(
            entity.getId(),
            entity.getSlug(),
            entity.getTitle(),
            entity.getSummary(),
            entity.getDescriptionMarkdown(),
            entity.getImageUrl(),
            entity.getAvailabilityStatus(),
            entity.isActive(),
            entity.getDisplayOrder(),
            entity.getVersion(),
            entity.getUpdatedAt()
        );
    }
}
