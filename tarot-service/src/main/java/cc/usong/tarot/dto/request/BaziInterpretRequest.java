package cc.usong.tarot.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

/**
 * 八字AI解读请求 DTO。
 */
@Data
public class BaziInterpretRequest {

    @NotBlank(message = "Token不能为空")
    private String token;

    @NotNull(message = "命盘数据不能为空")
    private Map<String, Object> chart;
}
