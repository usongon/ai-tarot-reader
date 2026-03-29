package cc.usong.tarot.model.bazi;

import java.util.List;

/**
 * 命盘结果聚合模型。
 * @author dehua
 */
public class BaziChart {

    private String solarDate;           // 公历日期
    private String lunarDate;           // 农历日期
    private String gender;              // 性别代码
    private String genderText;          // 性别文本
    private Pillar yearPillar;          // 年柱
    private Pillar monthPillar;         // 月柱
    private Pillar dayPillar;           // 日柱
    private Pillar hourPillar;          // 时柱
    private WuXingStats wuXingStats;    // 五行统计
    private List<ShiShenRelation> shiShenList; // 十神列表
    private List<DaYunInfo> daYunList;  // 大运列表
    private DaYunInfo currentDaYun;     // 当前大运
    private boolean hourPillarMissing;  // 时柱是否缺失

    public String getSolarDate() {
        return solarDate;
    }

    public void setSolarDate(String solarDate) {
        this.solarDate = solarDate;
    }

    public String getLunarDate() {
        return lunarDate;
    }

    public void setLunarDate(String lunarDate) {
        this.lunarDate = lunarDate;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getGenderText() {
        return genderText;
    }

    public void setGenderText(String genderText) {
        this.genderText = genderText;
    }

    public Pillar getYearPillar() {
        return yearPillar;
    }

    public void setYearPillar(Pillar yearPillar) {
        this.yearPillar = yearPillar;
    }

    public Pillar getMonthPillar() {
        return monthPillar;
    }

    public void setMonthPillar(Pillar monthPillar) {
        this.monthPillar = monthPillar;
    }

    public Pillar getDayPillar() {
        return dayPillar;
    }

    public void setDayPillar(Pillar dayPillar) {
        this.dayPillar = dayPillar;
    }

    public Pillar getHourPillar() {
        return hourPillar;
    }

    public void setHourPillar(Pillar hourPillar) {
        this.hourPillar = hourPillar;
    }

    public WuXingStats getWuXingStats() {
        return wuXingStats;
    }

    public void setWuXingStats(WuXingStats wuXingStats) {
        this.wuXingStats = wuXingStats;
    }

    public List<ShiShenRelation> getShiShenList() {
        return shiShenList;
    }

    public void setShiShenList(List<ShiShenRelation> shiShenList) {
        this.shiShenList = shiShenList;
    }

    public List<DaYunInfo> getDaYunList() {
        return daYunList;
    }

    public void setDaYunList(List<DaYunInfo> daYunList) {
        this.daYunList = daYunList;
    }

    public DaYunInfo getCurrentDaYun() {
        return currentDaYun;
    }

    public void setCurrentDaYun(DaYunInfo currentDaYun) {
        this.currentDaYun = currentDaYun;
    }

    public boolean isHourPillarMissing() {
        return hourPillarMissing;
    }

    public void setHourPillarMissing(boolean hourPillarMissing) {
        this.hourPillarMissing = hourPillarMissing;
    }
}
