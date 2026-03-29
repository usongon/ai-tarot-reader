package cc.usong.tarot.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 抽牌请求 DTO。
 */
@Data
public class DrawRequest {

    @NotBlank(message = "牌阵ID不能为空")
    private String spreadId;
}
