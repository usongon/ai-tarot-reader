package cc.usong.tarot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 五行统计 VO。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WuXingStatsVO {

    private int jin;
    private int mu;
    private int shui;
    private int huo;
    private int tu;
    private String dayMasterWuXing;
    private String strength;
}
