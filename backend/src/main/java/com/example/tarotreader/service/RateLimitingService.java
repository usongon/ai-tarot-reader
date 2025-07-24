package com.example.tarotreader.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitingService {

    private final ConcurrentHashMap<String, RequestStats> requestCounts = new ConcurrentHashMap<>();

    // 使用ConcurrentHashMap存储口令及其剩余使用次数
    private final ConcurrentHashMap<String, Integer> tokenPool = new ConcurrentHashMap<>();

    public RateLimitingService() {
        // 初始化默认口令池（示例口令）

    }

    public void verifyRateLimit(String ipAddress) {
        RequestStats stats = requestCounts.get(ipAddress);
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();

        if (stats == null || !stats.date().equals(today)) {
            // If no record for today, reset the stats
            requestCounts.put(ipAddress, new RequestStats(now, today, 1));
            return;
        }

        // Check daily limit
        if (stats.dailyRequestCount() >= 3) {
            throw new RateLimitExceededException("Daily request limit exceeded. Please try again tomorrow.");
        }

        // Check per-minute limit
        if (stats.lastRequestTime().plusMinutes(1).isAfter(now)) {
            throw new RateLimitExceededException("You can only make one request per minute.");
        }

        // Update stats
        requestCounts.put(ipAddress, new RequestStats(now, today, stats.dailyRequestCount() + 1));
    }

    /**
     * 验证口令有效性并减少剩余次数
     * @param token 客户端提供的访问口令
     * @return true 如果口令有效且剩余次数充足
     */
    public boolean verifyToken(String token) {
        if (token == null || token.isEmpty()) {
            throw new RateLimitExceededException("Missing access token");
        }

        Integer remaining = tokenPool.get(token);
        if (remaining == null) {
            throw new RateLimitExceededException("Invalid access token");
        }

        if (remaining <= 0) {
            throw new RateLimitExceededException("Access token usage limit exceeded");
        }

        // 原子操作确保线程安全
        tokenPool.put(token, remaining - 1);
        return true;
    }
}