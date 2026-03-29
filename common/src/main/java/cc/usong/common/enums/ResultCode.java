package cc.usong.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 统一业务状态码枚举。
 */
@Getter
@AllArgsConstructor
public enum ResultCode {

    SUCCESS(200, "操作成功"),
    PARAM_ERROR(400, "参数错误"),
    TOKEN_INVALID(401, "Token无效或已过期"),
    RATE_LIMITED(429, "请求过于频繁"),
    SERVER_ERROR(500, "服务器内部错误");

    private final int code;
    private final String message;
}
