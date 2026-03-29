package cc.usong.tarot.service.bazi;

import cc.usong.tarot.model.bazi.*;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Period;

/**
 * 八字 AI Prompt 构建器。
 */
@Component
public class BaziPromptBuilder {

    /**
     * 构建完整的用户提示词。
     */
    public String buildInterpretationPrompt(BaziChart chart) {
        StringBuilder sb = new StringBuilder();

        int currentAge = calculateCurrentAge(chart.getSolarDate());

        sb.append("请为我解读以下八字命盘：\n\n");
        sb.append("性别：").append(chart.getGenderText())
          .append("，公历：").append(chart.getSolarDate())
          .append("，农历：").append(chart.getLunarDate())
          .append("，当前").append(currentAge).append("岁\n\n");

        appendPillars(sb, chart);
        appendWuXing(sb, chart);
        appendShiShen(sb, chart);
        appendDaYun(sb, chart, currentAge);

        return sb.toString();
    }

    private int calculateCurrentAge(String solarDate) {
        String[] parts = solarDate.split("[^0-9]+");
        LocalDate birth = LocalDate.of(
                Integer.parseInt(parts[0]),
                Integer.parseInt(parts[1]),
                Integer.parseInt(parts[2]));
        return Period.between(birth, LocalDate.now()).getYears();
    }

    private void appendPillars(StringBuilder sb, BaziChart chart) {
        sb.append("四柱八字：\n");
        appendPillarText(sb, "年柱", chart.getYearPillar());
        appendPillarText(sb, "月柱", chart.getMonthPillar());
        appendPillarText(sb, "日柱", chart.getDayPillar()).append(" ← 日主");
        sb.append("\n");
        if (chart.getHourPillar() != null) {
            appendPillarText(sb, "时柱", chart.getHourPillar());
        } else {
            sb.append("时柱：出生时辰未知，时柱缺失\n");
        }
        sb.append("\n");
    }

    private StringBuilder appendPillarText(StringBuilder sb, String label, Pillar p) {
        sb.append(label).append("：天干 ").append(p.getTianGan())
          .append("（").append(p.getTianGanWuXing()).append("）")
          .append("、地支 ").append(p.getDiZhi())
          .append("（").append(p.getDiZhiWuXing()).append("）\n");
        return sb;
    }

    private void appendWuXing(StringBuilder sb, BaziChart chart) {
        if (chart.getWuXingStats() == null) {
            return;
        }
        WuXingStats s = chart.getWuXingStats();
        sb.append("五行个数：金").append(s.getJin())
          .append(" 木").append(s.getMu())
          .append(" 水").append(s.getShui())
          .append(" 火").append(s.getHuo())
          .append(" 土").append(s.getTu())
          .append("，日主五行：").append(s.getDayMasterWuXing())
          .append("，").append(s.getStrength()).append("\n\n");
    }

    private void appendShiShen(StringBuilder sb, BaziChart chart) {
        if (chart.getShiShenList() == null || chart.getShiShenList().isEmpty()) {
            return;
        }
        sb.append("十神关系：\n");
        for (ShiShenRelation ss : chart.getShiShenList()) {
            sb.append("- ").append(ss.getPosition()).append(" ")
              .append(ss.getTianGan()).append("(").append(ss.getWuXing()).append(") → ")
              .append(ss.getShiShen()).append("\n");
        }
        sb.append("\n");
    }

    private void appendDaYun(StringBuilder sb, BaziChart chart, int currentAge) {
        if (chart.getDaYunList() == null || chart.getDaYunList().isEmpty()) {
            return;
        }
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
}
