package cc.usong.tarot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 八字命盘 VO。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaziChartVO {

    private String solarDate;
    private String lunarDate;
    private String gender;
    private String genderText;
    private PillarVO yearPillar;
    private PillarVO monthPillar;
    private PillarVO dayPillar;
    private PillarVO hourPillar;
    private WuXingStatsVO wuXingStats;
    private List<ShiShenRelationVO> shiShenList;
    private List<DaYunInfoVO> daYunList;
    private DaYunInfoVO currentDaYun;
    private boolean hourPillarMissing;
}
