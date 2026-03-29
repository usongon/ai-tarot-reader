package cc.usong.tarot.service.bazi;

import cc.usong.tarot.model.bazi.ShiShenRelation;
import com.nlf.calendar.EightChar;
import com.nlf.calendar.util.LunarUtil;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 十神关系计算服务。
 */
@Service
public class ShiShenService {

    /**
     * 计算十神关系。
     */
    public List<ShiShenRelation> analyze(EightChar eightChar, boolean hourPillarMissing) {
        List<ShiShenRelation> shiShenList = new ArrayList<>();
        String dayGan = eightChar.getDayGan();

        addShiShenRelation(shiShenList, "年柱", eightChar.getYearGan(), dayGan);
        addShiShenRelation(shiShenList, "月柱", eightChar.getMonthGan(), dayGan);

        if (!hourPillarMissing) {
            addShiShenRelation(shiShenList, "时柱", eightChar.getTimeGan(), dayGan);
        }

        addHiddenGanShiShen(shiShenList, "年支", eightChar.getYearZhi(), dayGan);
        addHiddenGanShiShen(shiShenList, "月支", eightChar.getMonthZhi(), dayGan);
        addHiddenGanShiShen(shiShenList, "日支", eightChar.getDayZhi(), dayGan);
        if (!hourPillarMissing) {
            addHiddenGanShiShen(shiShenList, "时支", eightChar.getTimeZhi(), dayGan);
        }

        return shiShenList;
    }

    private void addShiShenRelation(List<ShiShenRelation> list, String position,
                                     String gan, String dayGan) {
        if (gan.equals(dayGan)) {
            return;
        }
        ShiShenRelation relation = new ShiShenRelation();
        relation.setPosition(position);
        relation.setTianGan(gan);
        String shiShen = LunarUtil.SHI_SHEN.get(dayGan + gan);
        relation.setShiShen(shiShen != null ? shiShen : "");
        relation.setWuXing(LunarUtil.WU_XING_GAN.get(gan));
        list.add(relation);
    }

    private void addHiddenGanShiShen(List<ShiShenRelation> list, String position,
                                      String zhi, String dayGan) {
        List<String> hideGans = LunarUtil.ZHI_HIDE_GAN.get(zhi);
        if (hideGans == null || hideGans.isEmpty()) {
            return;
        }
        for (String hideGan : hideGans) {
            if (hideGan.equals(dayGan)) {
                continue;
            }
            ShiShenRelation relation = new ShiShenRelation();
            relation.setPosition(position + "藏干");
            relation.setTianGan(hideGan);
            String shiShen = LunarUtil.SHI_SHEN.get(dayGan + hideGan);
            relation.setShiShen(shiShen != null ? shiShen : "");
            relation.setWuXing(LunarUtil.WU_XING_GAN.get(hideGan));
            list.add(relation);
        }
    }
}
