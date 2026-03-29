package cc.usong.tarot.service.token;

import cc.usong.common.exception.RateLimitExceededException;
import cc.usong.tarot.entity.AccessToken;
import cc.usong.tarot.repository.AccessTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 限流服务类（线程安全）。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RateLimitingService {

    private final AccessTokenRepository accessTokenRepository;

    @Value("${rate-limit.daily-max:3}")
    private int dailyMaxRequests;

    @Value("${rate-limit.interval-minutes:1}")
    private int intervalMinutes;

    /**
     * 验证口令有效性并减少剩余次数。
     *
     * @param token 客户端提供的访问口令
     */
    @Transactional
    public void verifyToken(String token) {
        if (token == null || token.isBlank()) {
            throw new RateLimitExceededException("缺少访问口令");
        }

        AccessToken accessToken = accessTokenRepository.findByTokenAndStatus(token, 1)
                .orElseThrow(() -> new RateLimitExceededException("无效的访问口令"));

        int updated = accessTokenRepository.decrementRemainingCount(token);
        if (updated == 0) {
            throw new RateLimitExceededException("访问口令使用次数已达上限");
        }

        log.debug("Token验证通过，剩余次数：{}", accessToken.getRemainingCount() - 1);
    }
}
