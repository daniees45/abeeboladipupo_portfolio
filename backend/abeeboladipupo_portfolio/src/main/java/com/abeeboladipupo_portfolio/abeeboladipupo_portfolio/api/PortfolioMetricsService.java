package com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api;

import com.abeeboladipupo_portfolio.abeeboladipupo_portfolio.api.dto.PortfolioMetricsDto;
import java.time.Duration;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class PortfolioMetricsService {

    private static final String PORTFOLIO_METRICS_KEY = "portfolio:metrics";
    private static final int DEFAULT_TOTAL_PROJECTS = 3;
    private static final long DEFAULT_TOTAL_VIEWS = 14250L;

    private final StringRedisTemplate redisTemplate;

    public PortfolioMetricsService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public PortfolioMetricsDto getPortfolioMetrics() {
        PortfolioMetricsDto fallbackMetrics = new PortfolioMetricsDto(
            DEFAULT_TOTAL_PROJECTS,
            DEFAULT_TOTAL_VIEWS,
            "MISS",
            PORTFOLIO_METRICS_KEY
        );

        try {
            String cachedValue = redisTemplate.opsForValue().get(PORTFOLIO_METRICS_KEY);

            if (cachedValue != null && !cachedValue.isBlank()) {
                String[] parts = cachedValue.split("\\|");

                if (parts.length == 3) {
                    return new PortfolioMetricsDto(
                        Integer.parseInt(parts[0]),
                        Long.parseLong(parts[1]),
                        "HIT",
                        PORTFOLIO_METRICS_KEY
                    );
                }
            }
        } catch (Exception ex) {
            return new PortfolioMetricsDto(
                fallbackMetrics.totalProjects(),
                fallbackMetrics.totalViews(),
                "UNAVAILABLE",
                PORTFOLIO_METRICS_KEY
            );
        }

        try {
            redisTemplate.opsForValue().set(
                PORTFOLIO_METRICS_KEY,
                formatMetrics(fallbackMetrics),
                Duration.ofMinutes(5)
            );
        } catch (Exception ex) {
            return fallbackMetrics;
        }

        return fallbackMetrics;
    }

    private String formatMetrics(PortfolioMetricsDto metrics) {
        return metrics.totalProjects() + "|" + metrics.totalViews() + "|" + metrics.cacheStatus();
    }
}
