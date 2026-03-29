package cc.usong.tarot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 大运信息 VO。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DaYunInfoVO {

    private int startAge;
    private int endAge;
    private String tianGan;
    private String diZhi;
    private String displayText;
    private boolean current;
}
