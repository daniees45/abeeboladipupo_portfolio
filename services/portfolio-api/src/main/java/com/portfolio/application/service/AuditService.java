package com.portfolio.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.infrastructure.persistence.jpa.entity.AuditLogJpaEntity;
import com.portfolio.infrastructure.persistence.jpa.repository.AuditLogJpaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);

    private final AuditLogJpaRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    public AuditService(AuditLogJpaRepository auditLogRepository, ObjectMapper objectMapper) {
        this.auditLogRepository = auditLogRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void record(UUID actorId, String action, String entityType, UUID entityId, Object beforeState, Object afterState, String requestId) {
        try {
            String beforeJson = beforeState != null ? objectMapper.writeValueAsString(beforeState) : null;
            String afterJson = afterState != null ? objectMapper.writeValueAsString(afterState) : null;

            AuditLogJpaEntity entry = new AuditLogJpaEntity(
                actorId,
                action,
                entityType,
                entityId,
                beforeJson,
                afterJson,
                requestId != null ? requestId : UUID.randomUUID().toString()
            );

            auditLogRepository.save(entry);
        } catch (Exception ex) {
            log.error("Failed to record audit log for action [{}], entity [{}]", action, entityType, ex);
            throw new RuntimeException("Audit recording failure", ex);
        }
    }
}
