package com.example.tarotreader.service;

import com.example.tarotreader.model.AccessToken;
import com.example.tarotreader.repository.AccessTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitingService {

    private final ConcurrentHashMap<String, RequestStats> requestCounts = new ConcurrentHashMap<>();
    private final AccessTokenRepository accessTokenRepository;

    @Autowired
    public RateLimitingService(AccessTokenRepository accessTokenRepository) {
        this.accessTokenRepository = accessTokenRepository;
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
    @Transactional
    public boolean verifyToken(String token) {
        if (token == null || token.isEmpty()) {
            throw new RateLimitExceededException("Missing access token");
        }

        // 先检查口令是否存在且启用
        AccessToken accessToken = accessTokenRepository.findByTokenAndStatus(token, 1)
                .orElseThrow(() -> new RateLimitExceededException("Invalid access token"));

        // 使用原子操作减少剩余次数
        int updated = accessTokenRepository.decrementRemainingCount(token);
        if (updated == 0) {
            throw new RateLimitExceededException("Access token usage limit exceeded");
        }

        return true;
    }
}
