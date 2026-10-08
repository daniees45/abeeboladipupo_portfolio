package com.portfolio.web.controller;

import com.portfolio.application.service.ContactService;
import com.portfolio.infrastructure.config.SecurityActorResolver;
import com.portfolio.web.dto.ContactMessageDtos.ContactMessageDto;
import com.portfolio.web.dto.ContactMessageDtos.ContactMessageStatusUpdate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/contact-messages")
@Tag(name = "Admin Contact Messages", description = "CMS administration endpoints for viewing incoming recruiter inquiries")
@SecurityRequirement(name = "oauth2")
public class AdminContactController {

    private final ContactService contactService;
    private final SecurityActorResolver actorResolver;

    public AdminContactController(ContactService contactService, SecurityActorResolver actorResolver) {
        this.contactService = contactService;
        this.actorResolver = actorResolver;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "List all inbound contact messages", operationId = "listContactMessages")
    public ResponseEntity<List<ContactMessageDto>> listContactMessages() {
        return ResponseEntity.ok(contactService.listContactMessages());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "Update status of an inbound contact message", operationId = "updateContactMessageStatus")
    public ResponseEntity<ContactMessageDto> updateStatus(
        @PathVariable UUID id,
        @Valid @RequestBody ContactMessageStatusUpdate req,
        HttpServletRequest request
    ) {
        UUID actorId = actorResolver.resolveActorId();
        String requestId = request.getHeader("X-Request-Id");
        return ResponseEntity.ok(contactService.updateMessageStatus(id, req.status(), actorId, requestId));
    }
}
