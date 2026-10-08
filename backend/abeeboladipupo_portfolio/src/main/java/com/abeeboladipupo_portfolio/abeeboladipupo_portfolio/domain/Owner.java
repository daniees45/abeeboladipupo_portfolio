package com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity 
@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Table(name = "portfolio_owners")
public class Owner {
    @Id 
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String firstName;
    private String lastName;
    private String school;
    private String degree;
    private String course;
    private String citizenship;
    private String graduation;
    private String race;
    private String linkedin;
    private String github;

    private OffsetDateTime createdAt = OffsetDateTime.now();
    private OffsetDateTime updatedAt;
}
