package com.portfolio.infrastructure.cache;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Set;

/**
 * Cache-aside Redis service implementing ADR-005:
 * - Versioned cache keys (projects:featured:true:v1)
 * - Bounded TTLs
 * - Explicit eviction upon committed writes
 * - Resilient fallback if Redis connection is temporarily interrupted
 */
@Service
public class CacheService {

    private static final Logger log = LoggerFactory.getLogger(CacheService.class);
    private static final String NAMESPACE_VERSION = "v1";

    private final StringRedisTemplate redisTemplate;

    public CacheService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String get(String key) {
        try {
            return redisTemplate.opsForValue().get(versionedKey(key));
        } catch (Exception ex) {
            log.warn("Redis GET failed for key [{}]. Falling back to database.", key, ex);
            return null;
        }
    }

    public void put(String key, String value, Duration ttl) {
        try {
            redisTemplate.opsForValue().set(versionedKey(key), value, ttl);
        } catch (Exception ex) {
            log.warn("Redis PUT failed for key [{}]. Continuing without caching.", key, ex);
        }
    }

    public void evict(String key) {
        try {
            redisTemplate.delete(versionedKey(key));
        } catch (Exception ex) {
            log.warn("Redis DELETE failed for key [{}].", key, ex);
        }
    }

    public void evictByPattern(String pattern) {
        try {
            Set<String> keys = redisTemplate.keys(versionedKey(pattern));
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
            }
        } catch (Exception ex) {
            log.warn("Redis evictByPattern failed for pattern [{}].", pattern, ex);
        }
    }

    public void evictProjectCaches(String slug) {
        evict("projects:slug:" + slug);
        evictByPattern("projects:list:*");
    }

    public void evictProductCaches(String slug) {
        evict("products:slug:" + slug);
        evict("products:list");
    }

    public void evictPostCaches(String slug) {
        evict("content:post:slug:" + slug);
        evictByPattern("content:posts:*");
    }

    public void evictSkillCaches() {
        evict("content:skills");
    }

    public void evictExperienceCaches() {
        evict("content:experience");
    }

    private String versionedKey(String baseKey) {
        return baseKey + ":" + NAMESPACE_VERSION;
    }
}
