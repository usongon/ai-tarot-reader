package cc.usong.tarot.service.token;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 请求统计记录。
 */
public record RequestStats(LocalDateTime lastRequestTime, LocalDate date, int dailyRequestCount) {
}
