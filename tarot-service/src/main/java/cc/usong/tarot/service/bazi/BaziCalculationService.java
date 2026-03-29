package cc.usong.tarot.service.bazi;

import cc.usong.tarot.constants.BaziConstants;
import cc.usong.tarot.enums.ShiChen;
import cc.usong.tarot.model.bazi.*;
import com.nlf.calendar.EightChar;
import com.nlf.calendar.Lunar;
import com.nlf.calendar.Solar;
import com.nlf.calendar.util.LunarUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 八字排盘核心计算服务。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BaziCalculationService {

    private final WuXingService wuXingService;
    private final ShiShenService shiShenService;
    private final DaYunService daYunService;

    /**
     * 计算八字命盘。
     */
    public BaziChart calculateChart(String birthDate, boolean isLunar,
                                     String gender, String shiChenCode) {
        BaziChart chart = new BaziChart();

        // 解析日期
        String[] dateParts = birthDate.split("-");
        int year = Integer.parseInt(dateParts[0]);
        int month = Integer.parseInt(dateParts[1]);
        int day = Integer.parseInt(dateParts[2]);

        Solar solar;
        Lunar lunar;
        if (isLunar) {
            lunar = Lunar.fromYmd(year, month, day);
            solar = lunar.getSolar();
        } else {
            solar = Solar.fromYmd(year, month, day);
            lunar = solar.getLunar();
        }

        chart.setSolarDate(formatSolarDate(solar));
        chart.setLunarDate(formatLunarDate(lunar));
        chart.setGender(gender);
        chart.setGenderText("male".equals(gender) ? "男" : "女");

        // 确定时辰
        ShiChen shiChen = ShiChen.fromCode(shiChenCode);
        boolean hourPillarMissing = shiChen == ShiChen.UNKNOWN;
        chart.setHourPillarMissing(hourPillarMissing);

        int hour = shiChen.getHour();
        Solar solarWithTime = new Solar(solar.getYear(), solar.getMonth(), solar.getDay(), hour, 0, 0);
        Lunar lunarWithTime = solarWithTime.getLunar();
        EightChar eightChar = lunarWithTime.getEightChar();

        // 构建四柱
        chart.setYearPillar(buildPillar(eightChar.getYearGan(), eightChar.getYearZhi()));
        chart.setMonthPillar(buildPillar(eightChar.getMonthGan(), eightChar.getMonthZhi()));
        chart.setDayPillar(buildPillar(eightChar.getDayGan(), eightChar.getDayZhi()));
        if (!hourPillarMissing) {
            chart.setHourPillar(buildPillar(eightChar.getTimeGan(), eightChar.getTimeZhi()));
        }

        // 计算五行、十神、大运
        chart.setWuXingStats(wuXingService.analyze(
                chart.getYearPillar(), chart.getMonthPillar(),
                chart.getDayPillar(), chart.getHourPillar(), hourPillarMissing));
        chart.setShiShenList(shiShenService.analyze(eightChar, hourPillarMissing));
        chart.setDaYunList(daYunService.calculate(eightChar, gender, birthDate));

        // 设置当前大运
        setCurrentDaYun(chart);

        return chart;
    }

    private Pillar buildPillar(String gan, String zhi) {
        Pillar pillar = new Pillar();
        pillar.setTianGan(gan);
        pillar.setDiZhi(zhi);
        pillar.setTianGanWuXing(LunarUtil.WU_XING_GAN.get(gan));
        pillar.setDiZhiWuXing(LunarUtil.WU_XING_ZHI.get(zhi));
        pillar.setYinYang(determineYinYang(gan));
        pillar.setDisplayText(gan + zhi);
        return pillar;
    }

    private String determineYinYang(String gan) {
        for (String yg : BaziConstants.YANG_GAN) {
            if (yg.equals(gan)) {
                return "阳";
            }
        }
        return "阴";
    }

    private String formatSolarDate(Solar solar) {
        return solar.getYear() + "年" + solar.getMonth() + "月" + solar.getDay() + "日";
    }

    private String formatLunarDate(Lunar lunar) {
        return lunar.getYearInGanZhi() + "年" + lunar.getMonthInChinese() + "月" + lunar.getDayInChinese() + "日";
    }

    private void setCurrentDaYun(BaziChart chart) {
        if (chart.getDaYunList() != null) {
            for (DaYunInfo daYun : chart.getDaYunList()) {
                if (daYun.isCurrent()) {
                    chart.setCurrentDaYun(daYun);
                    return;
                }
            }
        }
    }
}
