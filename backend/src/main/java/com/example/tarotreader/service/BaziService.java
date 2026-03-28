package com.example.tarotreader.service;

import com.alibaba.dashscope.app.Application;
import com.alibaba.dashscope.app.ApplicationParam;
import com.alibaba.dashscope.app.ApplicationResult;
import com.alibaba.dashscope.app.FlowStreamMode;
import com.alibaba.dashscope.exception.InputRequiredException;
import com.alibaba.dashscope.exception.NoApiKeyException;
import com.alibaba.dashscope.utils.JsonUtils;
import com.example.tarotreader.config.DashScopeConfig;
import com.example.tarotreader.model.bazi.*;
import com.google.gson.Gson;
import com.nlf.calendar.EightChar;
import com.nlf.calendar.Lunar;
import com.nlf.calendar.Solar;
import com.nlf.calendar.eightchar.Yun;
import com.nlf.calendar.util.LunarUtil;
import io.reactivex.Flowable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 八字命盘服务。
 * 负责计算八字命盘、五行统计、十神关系和大运。
 * @author dehua
 */
@Service
public class BaziService {

    private final DashScopeConfig dashScopeConfig;

    // 时辰到地支映射
    private static final Map<String, String> SHI_CHEN_TO_DZ = new HashMap<>();
    // 地支到小时映射
    private static final Map<String, Integer> DZ_TO_HOUR = new HashMap<>();
    // 五行相生
    private static final Map<String, String> GENERATES = new HashMap<>();
    // 五行相克
    private static final Map<String, String> CONTROLS = new HashMap<>();
    // 五行被生
    private static final Map<String, String> GENERATED_BY = new HashMap<>();

    static {
        // 初始化时辰到地支映射
        SHI_CHEN_TO_DZ.put("zi", "子");
        SHI_CHEN_TO_DZ.put("chou", "丑");
        SHI_CHEN_TO_DZ.put("yin", "寅");
        SHI_CHEN_TO_DZ.put("mao", "卯");
        SHI_CHEN_TO_DZ.put("chen", "辰");
        SHI_CHEN_TO_DZ.put("si", "巳");
        SHI_CHEN_TO_DZ.put("wu", "午");
        SHI_CHEN_TO_DZ.put("wei", "未");
        SHI_CHEN_TO_DZ.put("shen", "申");
        SHI_CHEN_TO_DZ.put("you", "酉");
        SHI_CHEN_TO_DZ.put("xu", "戌");
        SHI_CHEN_TO_DZ.put("hai", "亥");

        // 初始化地支到小时映射
        DZ_TO_HOUR.put("子", 0);
        DZ_TO_HOUR.put("丑", 2);
        DZ_TO_HOUR.put("寅", 4);
        DZ_TO_HOUR.put("卯", 6);
        DZ_TO_HOUR.put("辰", 8);
        DZ_TO_HOUR.put("巳", 10);
        DZ_TO_HOUR.put("午", 12);
        DZ_TO_HOUR.put("未", 14);
        DZ_TO_HOUR.put("申", 16);
        DZ_TO_HOUR.put("酉", 18);
        DZ_TO_HOUR.put("戌", 20);
        DZ_TO_HOUR.put("亥", 22);

        // 初始化五行相生关系
        GENERATES.put("木", "火");
        GENERATES.put("火", "土");
        GENERATES.put("土", "金");
        GENERATES.put("金", "水");
        GENERATES.put("水", "木");

        // 初始化五行相克关系
        CONTROLS.put("木", "土");
        CONTROLS.put("土", "水");
        CONTROLS.put("水", "火");
        CONTROLS.put("火", "金");
        CONTROLS.put("金", "木");

        // 初始化五行被生关系
        GENERATED_BY.put("火", "木");
        GENERATED_BY.put("土", "火");
        GENERATED_BY.put("金", "土");
        GENERATED_BY.put("水", "金");
        GENERATED_BY.put("木", "水");
    }

    @Autowired
    public BaziService(DashScopeConfig dashScopeConfig) {
        this.dashScopeConfig = dashScopeConfig;
    }

    /**
     * 计算八字命盘。
     *
     * @param request 排盘请求
     * @return 八字命盘结果
     */
    public BaziChart calculateChart(BaziRequest request) {
        BaziChart chart = new BaziChart();

        // 解析出生日期
        String[] dateParts = request.getBirthDate().split("-");
        int year = Integer.parseInt(dateParts[0]);
        int month = Integer.parseInt(dateParts[1]);
        int day = Integer.parseInt(dateParts[2]);

        Solar solar;
        Lunar lunar;

        // 处理农历或公历日期
        if (Boolean.TRUE.equals(request.getIsLunar())) {
            // 农历日期转公历
            lunar = Lunar.fromYmd(year, month, day);
            solar = lunar.getSolar();
        } else {
            // 公历日期
            solar = Solar.fromYmd(year, month, day);
            lunar = solar.getLunar();
        }

        // 设置日期信息
        chart.setSolarDate(formatSolarDate(solar));
        chart.setLunarDate(formatLunarDate(lunar));

        // 设置性别信息
        chart.setGender(request.getGender());
        chart.setGenderText("male".equals(request.getGender()) ? "男" : "女");

        // 确定时辰
        String shiChen = request.getShiChen();
        boolean hourPillarMissing = "unknown".equals(shiChen);
        chart.setHourPillarMissing(hourPillarMissing);

        // 根据时辰设置时间
        int hour;
        if (hourPillarMissing) {
            hour = 12; // 默认使用午时
        } else {
            String diZhi = SHI_CHEN_TO_DZ.get(shiChen);
            hour = DZ_TO_HOUR.getOrDefault(diZhi, 12);
        }

        // 创建带时间的Solar对象
        Solar solarWithTime = new Solar(solar.getYear(), solar.getMonth(), solar.getDay(), hour, 0, 0);
        Lunar lunarWithTime = solarWithTime.getLunar();

        // 获取八字
        EightChar eightChar = lunarWithTime.getEightChar();

        // 构建四柱
        chart.setYearPillar(buildPillar(eightChar.getYearGan(), eightChar.getYearZhi()));
        chart.setMonthPillar(buildPillar(eightChar.getMonthGan(), eightChar.getMonthZhi()));
        chart.setDayPillar(buildPillar(eightChar.getDayGan(), eightChar.getDayZhi()));

        if (!hourPillarMissing) {
            chart.setHourPillar(buildPillar(eightChar.getTimeGan(), eightChar.getTimeZhi()));
        }

        // 计算五行统计
        chart.setWuXingStats(calculateWuXingStats(chart, eightChar));

        // 计算十神关系
        chart.setShiShenList(calculateShiShen(eightChar, hourPillarMissing));

        // 计算大运（传入出生日期用于计算周岁）
        chart.setDaYunList(calculateDaYun(eightChar, request.getGender(), request.getBirthDate()));

        // 设置当前大运
        setCurrentDaYun(chart);

        return chart;
    }

    /**
     * 获取八字解读流式输出。
     *
     * @param chart 八字命盘
     * @return 流式输出结果
     * @throws NoApiKeyException      如果未设置API密钥
     * @throws InputRequiredException 如果缺少必需的输入参数
     */
    public Flowable<ApplicationResult> getInterpretationStream(BaziChart chart) throws NoApiKeyException, InputRequiredException {
        String userPrompt = buildUserPrompt(chart);

        ApplicationParam param = ApplicationParam.builder()
                .apiKey(dashScopeConfig.getApiKey())
                .appId(dashScopeConfig.getBaziAppId())
                .prompt(userPrompt)
                .incrementalOutput(true)
                .flowStreamMode(FlowStreamMode.MESSAGE_FORMAT)
                .build();

        Application application = new Application();
        return application.streamCall(param);
    }

    /**
     * 构建柱对象。
     */
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

    /**
     * 判断天干阴阳。
     */
    private String determineYinYang(String gan) {
        String[] yangGan = {"甲", "丙", "戊", "庚", "壬"};
        for (String yg : yangGan) {
            if (yg.equals(gan)) {
                return "阳";
            }
        }
        return "阴";
    }

    /**
     * 格式化公历日期。
     */
    private String formatSolarDate(Solar solar) {
        return solar.getYear() + "年" + solar.getMonth() + "月" + solar.getDay() + "日";
    }

    /**
     * 格式化农历日期。
     */
    private String formatLunarDate(Lunar lunar) {
        return lunar.getYearInGanZhi() + "年" + lunar.getMonthInChinese() + "月" + lunar.getDayInChinese() + "日";
    }

    /**
     * 计算五行统计。
     */
    private WuXingStats calculateWuXingStats(BaziChart chart, EightChar eightChar) {
        WuXingStats stats = new WuXingStats();
        Map<String, Integer> wuXingCount = new HashMap<>();
        wuXingCount.put("金", 0);
        wuXingCount.put("木", 0);
        wuXingCount.put("水", 0);
        wuXingCount.put("火", 0);
        wuXingCount.put("土", 0);

        // 统计年柱
        countWuXing(chart.getYearPillar(), wuXingCount);
        // 统计月柱
        countWuXing(chart.getMonthPillar(), wuXingCount);
        // 统计日柱
        countWuXing(chart.getDayPillar(), wuXingCount);
        // 统计时柱（如果存在）
        if (!chart.isHourPillarMissing() && chart.getHourPillar() != null) {
            countWuXing(chart.getHourPillar(), wuXingCount);
        }

        stats.setJin(wuXingCount.get("金"));
        stats.setMu(wuXingCount.get("木"));
        stats.setShui(wuXingCount.get("水"));
        stats.setHuo(wuXingCount.get("火"));
        stats.setTu(wuXingCount.get("土"));

        // 设置日主五行
        String dayMasterWuXing = chart.getDayPillar().getTianGanWuXing();
        stats.setDayMasterWuXing(dayMasterWuXing);

        // 简化计算身强身弱
        stats.setStrength(calculateStrength(wuXingCount, dayMasterWuXing));

        return stats;
    }

    /**
     * 统计单个柱的五行。
     */
    private void countWuXing(Pillar pillar, Map<String, Integer> wuXingCount) {
        if (pillar == null) return;
        String ganWuXing = pillar.getTianGanWuXing();
        String zhiWuXing = pillar.getDiZhiWuXing();
        if (ganWuXing != null) {
            wuXingCount.put(ganWuXing, wuXingCount.get(ganWuXing) + 1);
        }
        if (zhiWuXing != null) {
            wuXingCount.put(zhiWuXing, wuXingCount.get(zhiWuXing) + 1);
        }
    }

    /**
     * 简化计算身强身弱。
     */
    private String calculateStrength(Map<String, Integer> wuXingCount, String dayMasterWuXing) {
        int sameKind = wuXingCount.get(dayMasterWuXing);
        String generatedWuXing = GENERATED_BY.get(dayMasterWuXing);
        if (generatedWuXing != null) {
            sameKind += wuXingCount.get(generatedWuXing);
        }
        return sameKind >= 4 ? "身强" : "身弱";
    }

    /**
     * 计算十神关系。
     */
    private List<ShiShenRelation> calculateShiShen(EightChar eightChar, boolean hourPillarMissing) {
        List<ShiShenRelation> shiShenList = new ArrayList<>();
        String dayGan = eightChar.getDayGan();

        // 年柱天干十神
        addShiShenRelation(shiShenList, "年柱", eightChar.getYearGan(), dayGan);

        // 月柱天干十神
        addShiShenRelation(shiShenList, "月柱", eightChar.getMonthGan(), dayGan);

        // 时柱天干十神（如果存在）
        if (!hourPillarMissing) {
            addShiShenRelation(shiShenList, "时柱", eightChar.getTimeGan(), dayGan);
        }

        // 地支藏干十神
        addHiddenGanShiShen(shiShenList, "年支", eightChar.getYearZhi(), dayGan);
        addHiddenGanShiShen(shiShenList, "月支", eightChar.getMonthZhi(), dayGan);
        addHiddenGanShiShen(shiShenList, "日支", eightChar.getDayZhi(), dayGan);
        if (!hourPillarMissing) {
            addHiddenGanShiShen(shiShenList, "时支", eightChar.getTimeZhi(), dayGan);
        }

        return shiShenList;
    }

    /**
     * 添加天干十神关系。
     */
    private void addShiShenRelation(List<ShiShenRelation> list, String position, String gan, String dayGan) {
        if (gan.equals(dayGan)) {
            return; // 日干本身不计算十神
        }
        ShiShenRelation relation = new ShiShenRelation();
        relation.setPosition(position);
        relation.setTianGan(gan);
        String shiShen = LunarUtil.SHI_SHEN.get(dayGan + gan);
        relation.setShiShen(shiShen != null ? shiShen : "");
        relation.setWuXing(LunarUtil.WU_XING_GAN.get(gan));
        list.add(relation);
    }

    /**
     * 添加地支藏干十神关系。
     */
    private void addHiddenGanShiShen(List<ShiShenRelation> list, String position, String zhi, String dayGan) {
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

    /**
     * 计算大运。
     */
    private List<DaYunInfo> calculateDaYun(EightChar eightChar, String gender, String birthDate) {
        List<DaYunInfo> daYunList = new ArrayList<>();

        // gender: 1=male, 0=female
        int genderValue = "male".equals(gender) ? 1 : 0;
        Yun yun = eightChar.getYun(genderValue);
        com.nlf.calendar.eightchar.DaYun[] daYuns = yun.getDaYun();

        // 计算当前周岁
        String[] dateParts = birthDate.split("-");
        java.time.LocalDate birthLocalDate = java.time.LocalDate.of(
                Integer.parseInt(dateParts[0]), Integer.parseInt(dateParts[1]), Integer.parseInt(dateParts[2]));
        int currentAge = java.time.Period.between(birthLocalDate, java.time.LocalDate.now()).getYears();

        for (com.nlf.calendar.eightchar.DaYun daYun : daYuns) {
            // 跳过初始阶段 (index == 0)
            if (daYun.getIndex() == 0) {
                continue;
            }

            DaYunInfo info = new DaYunInfo();
            info.setStartAge(daYun.getStartAge());
            info.setEndAge(daYun.getEndAge());

            String ganZhi = daYun.getGanZhi();
            if (ganZhi != null && ganZhi.length() >= 2) {
                info.setTianGan(ganZhi.substring(0, 1));
                info.setDiZhi(ganZhi.substring(1, 2));
                info.setDisplayText(ganZhi);
            }

            // 用周岁判断是否当前大运（而非日历年比较）
            info.setCurrent(currentAge >= daYun.getStartAge() && currentAge <= daYun.getEndAge());

            daYunList.add(info);
        }

        return daYunList;
    }

    /**
     * 设置当前大运。
     */
    private void setCurrentDaYun(BaziChart chart) {
        for (DaYunInfo daYun : chart.getDaYunList()) {
            if (daYun.isCurrent()) {
                chart.setCurrentDaYun(daYun);
                return;
            }
        }
    }

    /**
     * 构建完整的用户提示词（直接作为 prompt 发给大模型，不需要百炼模板变量）。
     */
    private String buildUserPrompt(BaziChart chart) {
        StringBuilder sb = new StringBuilder();

        // 基本信息（周岁：考虑生日是否已过）
        String[] dateNums = chart.getSolarDate().split("[^0-9]+");
        java.time.LocalDate birthLocalDate = java.time.LocalDate.of(
                Integer.parseInt(dateNums[0]), Integer.parseInt(dateNums[1]), Integer.parseInt(dateNums[2]));
        int currentAge = java.time.Period.between(birthLocalDate, java.time.LocalDate.now()).getYears();

        sb.append("请为我解读以下八字命盘：\n\n");
        sb.append("性别：").append(chart.getGenderText())
          .append("，公历：").append(chart.getSolarDate())
          .append("，农历：").append(chart.getLunarDate())
          .append("，当前").append(currentAge).append("岁\n\n");

        // 四柱八字
        sb.append("四柱八字：\n");

        appendPillarText(sb, "年柱", chart.getYearPillar());
        appendPillarText(sb, "月柱", chart.getMonthPillar());
        appendPillarText(sb, "日柱", chart.getDayPillar()).append(" ← 日主");

        if (chart.getHourPillar() != null) {
            appendPillarText(sb, "时柱", chart.getHourPillar());
        } else {
            sb.append("时柱：出生时辰未知，时柱缺失\n");
        }
        sb.append("\n");

        // 五行统计
        if (chart.getWuXingStats() != null) {
            WuXingStats s = chart.getWuXingStats();
            sb.append("五行个数：金").append(s.getJin())
              .append(" 木").append(s.getMu())
              .append(" 水").append(s.getShui())
              .append(" 火").append(s.getHuo())
              .append(" 土").append(s.getTu())
              .append("，日主五行：").append(s.getDayMasterWuXing())
              .append("，").append(s.getStrength()).append("\n\n");
        }

        // 十神
        if (chart.getShiShenList() != null && !chart.getShiShenList().isEmpty()) {
            sb.append("十神关系：\n");
            for (ShiShenRelation ss : chart.getShiShenList()) {
                sb.append("- ").append(ss.getPosition()).append(" ")
                  .append(ss.getTianGan()).append("(").append(ss.getWuXing()).append(") → ")
                  .append(ss.getShiShen()).append("\n");
            }
            sb.append("\n");
        }

        // 大运
        if (chart.getDaYunList() != null && !chart.getDaYunList().isEmpty()) {
            sb.append("大运走势：\n");
            for (DaYunInfo dy : chart.getDaYunList()) {
                sb.append("- ").append(dy.getDisplayText())
                  .append("（").append(dy.getStartAge()).append("-").append(dy.getEndAge()).append("岁）");
                if (dy.isCurrent()) sb.append(" ← 当前");
                sb.append("\n");
            }
            sb.append("\n");

            if (chart.getCurrentDaYun() != null) {
                DaYunInfo cdy = chart.getCurrentDaYun();
                sb.append("当前第").append(chart.getDaYunList().indexOf(cdy) + 1)
                  .append("步大运：").append(cdy.getDisplayText())
                  .append("（").append(cdy.getStartAge()).append("-").append(cdy.getEndAge()).append("岁")
                  .append("，当前").append(currentAge).append("岁正在此步大运中）\n");
            }
        }

        return sb.toString();
    }

    private StringBuilder appendPillarText(StringBuilder sb, String label, Pillar p) {
        sb.append(label).append("：天干 ").append(p.getTianGan())
          .append("（").append(p.getTianGanWuXing()).append("）")
          .append("、地支 ").append(p.getDiZhi())
          .append("（").append(p.getDiZhiWuXing()).append("）\n");
        return sb;
    }
}
