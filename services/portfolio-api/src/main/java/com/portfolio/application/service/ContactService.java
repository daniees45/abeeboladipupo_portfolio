package com.portfolio.application.service;

import com.portfolio.infrastructure.persistence.jpa.entity.AuditLogJpaEntity;
import com.portfolio.infrastructure.persistence.jpa.entity.ContactMessageJpaEntity;
import com.portfolio.infrastructure.persistence.jpa.repository.AuditLogJpaRepository;
import com.portfolio.infrastructure.persistence.jpa.repository.ContactMessageJpaRepository;
import com.portfolio.web.dto.ContactMessageDtos.ContactMessageCreate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final ContactMessageJpaRepository contactRepository;
    private final AuditLogJpaRepository auditLogRepository;

    public ContactService(ContactMessageJpaRepository contactRepository, AuditLogJpaRepository auditLogRepository) {
        this.contactRepository = contactRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void createContactMessage(ContactMessageCreate req) {
        ContactMessageJpaEntity entity = new ContactMessageJpaEntity(
            req.senderName(),
            req.senderEmail(),
            req.subject(),
            req.body()
        );
        contactRepository.save(entity);
    }

    public List<com.portfolio.web.dto.ContactMessageDtos.ContactMessageDto> listContactMessages() {
        return contactRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(this::toDto)
            .toList();
    }

    @Transactional
    public com.portfolio.web.dto.ContactMessageDtos.ContactMessageDto updateMessageStatus(UUID id, String status, UUID actorId, String requestId) {
        ContactMessageJpaEntity entity = contactRepository.findById(id)
            .orElseThrow(() -> new com.portfolio.web.error.Exceptions.ResourceNotFoundException("Message not found with id: " + id));

        entity.setStatus(status);
        if ("RESOLVED".equalsIgnoreCase(status) || "SPAM".equalsIgnoreCase(status)) {
            entity.setResolvedAt(Instant.now());
            entity.setResolvedBy(actorId);
        }

        ContactMessageJpaEntity updated = contactRepository.save(entity);
        return toDto(updated);
    }

    private com.portfolio.web.dto.ContactMessageDtos.ContactMessageDto toDto(ContactMessageJpaEntity e) {
        return new com.portfolio.web.dto.ContactMessageDtos.ContactMessageDto(
            e.getId(),
            e.getSenderName(),
            e.getSenderEmail(),
            e.getSubject(),
            e.getBody(),
            e.getStatus(),
            e.getCreatedAt(),
            e.getResolvedAt()
        );
    }

    /**
     * Automated GDPR/Privacy 90-day retention purge scheduled daily at 03:00 AM.
     */
    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void purgeExpiredContactMessages() {
        Instant resolvedCutoff = Instant.now().minus(90, ChronoUnit.DAYS);
        Instant staleCutoff = Instant.now().minus(180, ChronoUnit.DAYS);

        int resolvedDeleted = contactRepository.deleteByStatusInAndResolvedAtBefore(
            List.of("RESOLVED", "SPAM"),
            resolvedCutoff
        );
        int staleDeleted = contactRepository.deleteStaleNewMessages(staleCutoff);

        int totalDeleted = resolvedDeleted + staleDeleted;
        if (totalDeleted > 0) {
            log.info("Purged [{}] expired contact messages according to privacy retention policy.", totalDeleted);

            AuditLogJpaEntity audit = new AuditLogJpaEntity(
                null,
                "PURGE_CONTACT_MESSAGES",
                "CONTACT_MESSAGE",
                null,
                null,
                "{\"purgedCount\": " + totalDeleted + "}",
                "cron-scheduled-retention"
            );
            auditLogRepository.save(audit);
        }
    }
}
