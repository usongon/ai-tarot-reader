package cc.usong.common.exception;

import cc.usong.common.enums.ResultCode;

/**
 * 限流异常。
 */
public class RateLimitExceededException extends BusinessException {

    public RateLimitExceededException() {
        super(ResultCode.RATE_LIMITED);
    }

    public RateLimitExceededException(String message) {
        super(ResultCode.RATE_LIMITED, message);
    }
}
