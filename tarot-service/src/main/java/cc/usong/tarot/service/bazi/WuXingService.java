package cc.usong.tarot.service.bazi;

import cc.usong.tarot.constants.BaziConstants;
import cc.usong.tarot.model.bazi.Pillar;
import cc.usong.tarot.model.bazi.WuXingStats;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 五行统计服务。
 */
@Service
public class WuXingService {

    /**
     * 计算五行统计。
     */
    public WuXingStats analyze(Pillar yearPillar, Pillar monthPillar,
                                Pillar dayPillar, Pillar hourPillar,
                                boolean hourPillarMissing) {
        WuXingStats stats = new WuXingStats();
        Map<String, Integer> wuXingCount = initWuXingCount();

        countWuXing(yearPillar, wuXingCount);
        countWuXing(monthPillar, wuXingCount);
        countWuXing(dayPillar, wuXingCount);
        if (!hourPillarMissing && hourPillar != null) {
            countWuXing(hourPillar, wuXingCount);
        }

        stats.setJin(wuXingCount.get("金"));
        stats.setMu(wuXingCount.get("木"));
        stats.setShui(wuXingCount.get("水"));
        stats.setHuo(wuXingCount.get("火"));
        stats.setTu(wuXingCount.get("土"));

        String dayMasterWuXing = dayPillar.getTianGanWuXing();
        stats.setDayMasterWuXing(dayMasterWuXing);
        stats.setStrength(calculateStrength(wuXingCount, dayMasterWuXing));

        return stats;
    }

    private Map<String, Integer> initWuXingCount() {
        Map<String, Integer> map = new HashMap<>();
        map.put("金", 0);
        map.put("木", 0);
        map.put("水", 0);
        map.put("火", 0);
        map.put("土", 0);
        return map;
    }

    private void countWuXing(Pillar pillar, Map<String, Integer> wuXingCount) {
        if (pillar == null) {
            return;
        }
        String ganWuXing = pillar.getTianGanWuXing();
        String zhiWuXing = pillar.getDiZhiWuXing();
        if (ganWuXing != null) {
            wuXingCount.merge(ganWuXing, 1, Integer::sum);
        }
        if (zhiWuXing != null) {
            wuXingCount.merge(zhiWuXing, 1, Integer::sum);
        }
    }

    private String calculateStrength(Map<String, Integer> wuXingCount, String dayMasterWuXing) {
        int sameKind = wuXingCount.get(dayMasterWuXing);
        String generatedWuXing = BaziConstants.WU_XING_GENERATED_BY.get(dayMasterWuXing);
        if (generatedWuXing != null) {
            sameKind += wuXingCount.get(generatedWuXing);
        }
        return sameKind >= 4 ? "身强" : "身弱";
    }
}
