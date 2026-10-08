package com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class ProjectControllerTest {

    private final MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new ProjectController()).build();

    @Test
    void shouldReturnPortfolioProjects() throws Exception {
        mockMvc.perform(get("/api/v1/projects"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].slug").value("project-demo-view"))
            .andExpect(jsonPath("$[0].status").value("live"));
    }
}
