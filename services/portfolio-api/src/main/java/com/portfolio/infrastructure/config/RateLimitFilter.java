package com.portfolio.infrastructure.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.web.dto.ProblemDetailDto;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.URI;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> contactBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> generalBuckets = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;

    public RateLimitFilter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();
        String clientIp = getClientIp(request);

        // 1. Strict rate limit on contact messages: 5 requests per 10 minutes
        if ("/api/v1/contact-messages".equals(path) && "POST".equalsIgnoreCase(method)) {
            Bucket bucket = contactBuckets.computeIfAbsent(clientIp, k -> createContactBucket());
            if (!bucket.tryConsume(1)) {
                writeRateLimitProblem(request, response, "Contact message rate limit exceeded. Please wait a few minutes before resending.");
                return;
            }
        }

        // 2. Public read endpoints: 120 requests per minute
        if (path.startsWith("/api/v1/") && !path.startsWith("/api/v1/admin/")) {
            Bucket bucket = generalBuckets.computeIfAbsent(clientIp, k -> createGeneralBucket());
            if (!bucket.tryConsume(1)) {
                writeRateLimitProblem(request, response, "API rate limit exceeded. Maximum 120 requests per minute.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private Bucket createContactBucket() {
        Bandwidth limit = Bandwidth.classic(5, Refill.greedy(5, Duration.ofMinutes(10)));
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket createGeneralBucket() {
        Bandwidth limit = Bandwidth.classic(120, Refill.greedy(120, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private void writeRateLimitProblem(HttpServletRequest request, HttpServletResponse response, String detail) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);

        String reqId = request.getHeader("X-Request-Id");
        if (reqId == null || reqId.isBlank()) reqId = UUID.randomUUID().toString();

        ProblemDetailDto problem = new ProblemDetailDto(
            URI.create("https://api.abeeboladipupo.com/problems/429"),
            "Too Many Requests",
            HttpStatus.TOO_MANY_REQUESTS.value(),
            detail,
            request.getRequestURI(),
            reqId,
            List.of()
        );

        response.getWriter().write(objectMapper.writeValueAsString(problem));
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
