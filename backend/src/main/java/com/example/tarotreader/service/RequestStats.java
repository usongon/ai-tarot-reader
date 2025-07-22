package com.example.tarotreader.service;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record RequestStats(LocalDateTime lastRequestTime, LocalDate date, int dailyRequestCount) {
}