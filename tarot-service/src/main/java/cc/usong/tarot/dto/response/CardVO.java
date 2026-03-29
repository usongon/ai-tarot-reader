package cc.usong.tarot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 塔罗牌展示 VO。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardVO {

    private String name;
    private String nameChinese;
    private String uprightMeaning;
    private String uprightMeaningChinese;
    private String reversedMeaning;
    private String reversedMeaningChinese;
    private boolean reversed;
}
