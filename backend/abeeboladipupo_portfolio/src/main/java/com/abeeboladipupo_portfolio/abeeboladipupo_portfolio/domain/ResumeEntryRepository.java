package com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.domain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeEntryRepository extends JpaRepository<ResumeEntry, Long> {
    List<ResumeEntry> findAllByOrderBySortOrderAsc();
}
