package com.example.tarotreader.service;

import com.example.tarotreader.config.DashScopeConfig;
import com.example.tarotreader.model.bazi.BaziChart;
import com.example.tarotreader.model.bazi.BaziRequest;
import com.example.tarotreader.model.bazi.DaYunInfo;
import com.example.tarotreader.model.bazi.Pillar;
import com.example.tarotreader.model.bazi.WuXingStats;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * BaziService单元测试。
 * @author dehua
 */
class BaziServiceTest {

    private BaziService baziService;
    private DashScopeConfig dashScopeConfig;

    @BeforeEach
    void setUp() {
        dashScopeConfig = new DashScopeConfig();
        dashScopeConfig.setApiKey("dummy-api-key");
        dashScopeConfig.setAppId("dummy-app-id");
        dashScopeConfig.setBaziAppId("dummy-bazi-app-id");
        baziService = new BaziService(dashScopeConfig);
    }

    @Test
    @DisplayName("公历日期+有时辰 - 正确计算命盘")
    void calculateChart_solarDate_withHourPillar() {
        // Arrange
        BaziRequest request = new BaziRequest();
        request.setBirthDate("1990-06-15");
        request.setIsLunar(false);
        request.setGender("male");
        request.setShiChen("wei"); // 未时 (13:00-15:00)

        // Act
        BaziChart chart = baziService.calculateChart(request);

        // Assert
        assertNotNull(chart, "Chart should not be null");
        assertEquals("1990年6月15日", chart.getSolarDate(), "Solar date should be formatted correctly");
        assertEquals("male", chart.getGender(), "Gender should be male");
        assertEquals("男", chart.getGenderText(), "Gender text should be '男'");
        assertFalse(chart.isHourPillarMissing(), "Hour pillar should not be missing");

        // Verify all 4 pillars exist with displayText length 2
        assertNotNull(chart.getYearPillar(), "Year pillar should exist");
        assertNotNull(chart.getMonthPillar(), "Month pillar should exist");
        assertNotNull(chart.getDayPillar(), "Day pillar should exist");
        assertNotNull(chart.getHourPillar(), "Hour pillar should exist");

        assertEquals(2, chart.getYearPillar().getDisplayText().length(), "Year pillar displayText should have 2 characters");
        assertEquals(2, chart.getMonthPillar().getDisplayText().length(), "Month pillar displayText should have 2 characters");
        assertEquals(2, chart.getDayPillar().getDisplayText().length(), "Day pillar displayText should have 2 characters");
        assertEquals(2, chart.getHourPillar().getDisplayText().length(), "Hour pillar displayText should have 2 characters");

        // Verify WuXingStats populated
        WuXingStats stats = chart.getWuXingStats();
        assertNotNull(stats, "WuXingStats should not be null");
        int total = stats.getJin() + stats.getMu() + stats.getShui() + stats.getHuo() + stats.getTu();
        assertTrue(total > 0, "WuXingStats sum should be greater than 0");

        // Verify ShiShenList not empty
        assertNotNull(chart.getShiShenList(), "ShiShenList should not be null");
        assertFalse(chart.getShiShenList().isEmpty(), "ShiShenList should not be empty");

        // Verify DaYunList not empty
        assertNotNull(chart.getDaYunList(), "DaYunList should not be null");
        assertFalse(chart.getDaYunList().isEmpty(), "DaYunList should not be empty");
    }

    @Test
    @DisplayName("时辰未知 - 无时柱")
    void calculateChart_unknownShiChen_noHourPillar() {
        // Arrange
        BaziRequest request = new BaziRequest();
        request.setBirthDate("1990-06-15");
        request.setIsLunar(false);
        request.setGender("female");
        request.setShiChen("unknown");

        // Act
        BaziChart chart = baziService.calculateChart(request);

        // Assert
        assertNotNull(chart, "Chart should not be null");
        assertTrue(chart.isHourPillarMissing(), "Hour pillar should be missing");
        assertNull(chart.getHourPillar(), "Hour pillar should be null");
        assertEquals("女", chart.getGenderText(), "Gender text should be '女'");
    }

    @Test
    @DisplayName("农历日期 - 正确转换为公历")
    void calculateChart_lunarDate_convertedCorrectly() {
        // Arrange
        BaziRequest request = new BaziRequest();
        request.setBirthDate("1990-05-23");
        request.setIsLunar(true);
        request.setGender("male");
        request.setShiChen("wu"); // 午时 (11:00-13:00)

        // Act
        BaziChart chart = baziService.calculateChart(request);

        // Assert
        assertNotNull(chart, "Chart should not be null");
        assertNotNull(chart.getSolarDate(), "Solar date should not be null");
        assertFalse(chart.getSolarDate().isEmpty(), "Solar date should not be empty");
        assertNotNull(chart.getLunarDate(), "Lunar date should not be null");
    }

    @Test
    @DisplayName("大运列表 - 包含有效条目")
    void calculateChart_daYun_hasEntries() {
        // Arrange
        BaziRequest request = new BaziRequest();
        request.setBirthDate("1990-06-15");
        request.setIsLunar(false);
        request.setGender("male");
        request.setShiChen("wei");

        // Act
        BaziChart chart = baziService.calculateChart(request);

        // Assert
        assertNotNull(chart.getDaYunList(), "DaYunList should not be null");
        assertFalse(chart.getDaYunList().isEmpty(), "DaYunList should have entries");

        DaYunInfo firstDaYun = chart.getDaYunList().get(0);
        assertNotNull(firstDaYun.getDisplayText(), "First DaYun should have displayText");
        assertTrue(firstDaYun.getDisplayText().length() >= 2, "First DaYun displayText should have at least 2 characters");
        assertTrue(firstDaYun.getStartAge() >= 0, "First DaYun startAge should be >= 0");
    }
}
