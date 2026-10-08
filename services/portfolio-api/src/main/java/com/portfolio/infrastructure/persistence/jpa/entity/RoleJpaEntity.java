package com.portfolio.infrastructure.persistence.jpa.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "role")
public class RoleJpaEntity {

    @Id
    private Short id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    public RoleJpaEntity() {}

    public RoleJpaEntity(Short id, String code) {
        this.id = id;
        this.code = code;
    }

    public Short getId() { return id; }
    public void setId(Short id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}
