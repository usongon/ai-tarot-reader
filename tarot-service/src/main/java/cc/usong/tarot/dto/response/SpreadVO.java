package cc.usong.tarot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 牌阵展示 VO。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpreadVO {

    private String id;
    private String name;
    private String nameChinese;
    private String description;
    private String descriptionChinese;
    private int numberOfCards;
}
