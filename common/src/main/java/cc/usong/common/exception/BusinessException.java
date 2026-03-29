package cc.usong.common.exception;

import cc.usong.common.enums.ResultCode;
import lombok.Getter;

/**
 * 业务异常基类。
 */
@Getter
public class BusinessException extends RuntimeException {

    private final ResultCode resultCode;

    public BusinessException(ResultCode resultCode) {
        super(resultCode.getMessage());
        this.resultCode = resultCode;
    }

    public BusinessException(ResultCode resultCode, String message) {
        super(message);
        this.resultCode = resultCode;
    }
}
