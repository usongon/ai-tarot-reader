package cc.usong.common.exception;

import cc.usong.common.enums.ResultCode;

/**
 * Token无效或已过期异常。
 */
public class TokenInvalidException extends BusinessException {

    public TokenInvalidException() {
        super(ResultCode.TOKEN_INVALID);
    }

    public TokenInvalidException(String message) {
        super(ResultCode.TOKEN_INVALID, message);
    }
}
