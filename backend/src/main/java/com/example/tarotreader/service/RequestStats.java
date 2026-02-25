package com.example.tarotreader.service;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 请求统计记录类。
 * @author dehua
 */
public record RequestStats(LocalDateTime lastRequestTime, LocalDate date, int dailyRequestCount) {
}