package cc.usong.tarot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 十神关系 VO。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShiShenRelationVO {

    private String position;
    private String tianGan;
    private String shiShen;
    private String wuXing;
}
