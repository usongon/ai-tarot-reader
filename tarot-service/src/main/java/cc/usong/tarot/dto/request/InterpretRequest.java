package cc.usong.tarot.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;
import java.util.Map;

/**
 * 塔罗牌解读请求 DTO。
 */
@Data
public class InterpretRequest {

    @NotBlank(message = "Token不能为空")
    private String token;

    @NotBlank(message = "方向不能为空")
    private String direction;

    @NotBlank(message = "牌阵名称不能为空")
    private String spreadName;

    private List<Map<String, Object>> cards;
}
