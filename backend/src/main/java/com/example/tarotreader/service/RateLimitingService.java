package com.example.tarotreader.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitingService {

    private final ConcurrentHashMap<String, RequestStats> requestCounts = new ConcurrentHashMap<>();

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
}