package cc.usong.tarot.service;

/**
 * 限流异常类。
 * @author dehua
 */
public class RateLimitExceededException extends RuntimeException {
    public RateLimitExceededException(String message) {
        super(message);
    }
}