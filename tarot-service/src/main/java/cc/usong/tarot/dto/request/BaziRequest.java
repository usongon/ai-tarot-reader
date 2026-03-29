package cc.usong.tarot.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * 八字排盘请求 DTO。
 */
@Data
public class BaziRequest {

    @NotBlank(message = "出生日期不能为空")
    @Pattern(regexp = "\\d{4}-\\d{1,2}-\\d{1,2}", message = "日期格式应为YYYY-M-D")
    private String birthDate;

    @NotNull(message = "是否农历不能为空")
    private Boolean isLunar;

    @NotBlank(message = "性别不能为空")
    private String gender;

    private String shiChen;

    @NotBlank(message = "Token不能为空")
    private String token;
}
