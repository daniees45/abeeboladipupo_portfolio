package com.portfolio.web.controller;

import com.portfolio.application.service.ContactService;
import com.portfolio.web.dto.ContactMessageDtos.ContactMessageCreate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/contact-messages")
@Tag(name = "Contact", description = "Inbound inquiries and recruiter contact")
public class PublicContactController {

    private final ContactService contactService;

    public PublicContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    @Operation(summary = "Submit contact message", operationId = "createContactMessage")
    public ResponseEntity<Void> createContactMessage(@Valid @RequestBody ContactMessageCreate req) {
        contactService.createContactMessage(req);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}
