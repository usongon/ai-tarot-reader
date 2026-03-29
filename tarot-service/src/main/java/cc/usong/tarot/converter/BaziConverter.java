package cc.usong.tarot.converter;

import cc.usong.tarot.dto.response.*;
import cc.usong.tarot.model.bazi.*;

import java.util.List;

/**
 * 八字领域模型 → VO 转换器。
 */
public final class BaziConverter {

    private BaziConverter() {
    }

    public static PillarVO toPillarVO(Pillar pillar) {
        if (pillar == null) {
            return null;
        }
        return new PillarVO(
                pillar.getTianGan(),
                pillar.getDiZhi(),
                pillar.getTianGanWuXing(),
                pillar.getDiZhiWuXing(),
                pillar.getYinYang(),
                pillar.getDisplayText()
        );
    }

    public static WuXingStatsVO toWuXingStatsVO(WuXingStats stats) {
        if (stats == null) {
            return null;
        }
        return new WuXingStatsVO(
                stats.getJin(),
                stats.getMu(),
                stats.getShui(),
                stats.getHuo(),
                stats.getTu(),
                stats.getDayMasterWuXing(),
                stats.getStrength()
        );
    }

    public static ShiShenRelationVO toShiShenRelationVO(ShiShenRelation relation) {
        if (relation == null) {
            return null;
        }
        return new ShiShenRelationVO(
                relation.getPosition(),
                relation.getTianGan(),
                relation.getShiShen(),
                relation.getWuXing()
        );
    }

    public static DaYunInfoVO toDaYunInfoVO(DaYunInfo info) {
        if (info == null) {
            return null;
        }
        return new DaYunInfoVO(
                info.getStartAge(),
                info.getEndAge(),
                info.getTianGan(),
                info.getDiZhi(),
                info.getDisplayText(),
                info.isCurrent()
        );
    }

    public static BaziChartVO toBaziChartVO(BaziChart chart) {
        if (chart == null) {
            return null;
        }
        List<ShiShenRelationVO> shiShenVOs = chart.getShiShenList() == null
                ? List.of()
                : chart.getShiShenList().stream().map(BaziConverter::toShiShenRelationVO).toList();

        List<DaYunInfoVO> daYunVOs = chart.getDaYunList() == null
                ? List.of()
                : chart.getDaYunList().stream().map(BaziConverter::toDaYunInfoVO).toList();

        return new BaziChartVO(
                chart.getSolarDate(),
                chart.getLunarDate(),
                chart.getGender(),
                chart.getGenderText(),
                toPillarVO(chart.getYearPillar()),
                toPillarVO(chart.getMonthPillar()),
                toPillarVO(chart.getDayPillar()),
                toPillarVO(chart.getHourPillar()),
                toWuXingStatsVO(chart.getWuXingStats()),
                shiShenVOs,
                daYunVOs,
                toDaYunInfoVO(chart.getCurrentDaYun()),
                chart.isHourPillarMissing()
        );
    }
}
