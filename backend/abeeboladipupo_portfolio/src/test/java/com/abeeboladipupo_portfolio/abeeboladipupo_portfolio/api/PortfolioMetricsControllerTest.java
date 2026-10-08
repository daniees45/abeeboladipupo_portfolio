package com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api.dto.PortfolioMetricsDto;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class PortfolioMetricsControllerTest {

    private final PortfolioMetricsService service = org.mockito.Mockito.mock(PortfolioMetricsService.class);
    private final MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new PortfolioMetricsController(service)).build();

    @Test
    void shouldReturnPortfolioMetrics() throws Exception {
        when(service.getPortfolioMetrics()).thenReturn(
            new PortfolioMetricsDto(3, 14250, "HIT", "portfolio:metrics")
        );

        mockMvc.perform(get("/api/v1/metrics"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.totalProjects").value(3))
            .andExpect(jsonPath("$.totalViews").value(14250))
            .andExpect(jsonPath("$.cacheStatus").value("HIT"));
    }
}
