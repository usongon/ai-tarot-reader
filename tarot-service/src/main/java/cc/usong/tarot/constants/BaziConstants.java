package cc.usong.tarot.constants;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * 八字命理相关常量。
 */
public final class BaziConstants {

    private BaziConstants() {
    }

    /** 时辰代码 → 地支 */
    public static final Map<String, String> SHI_CHEN_TO_DI_ZHI;
    /** 地支 → 小时 */
    public static final Map<String, Integer> DI_ZHI_TO_HOUR;
    /** 五行相生：木→火, 火→土, 土→金, 金→水, 水→木 */
    public static final Map<String, String> WU_XING_GENERATES;
    /** 五行相克：木→土, 土→水, 水→火, 火→金, 金→木 */
    public static final Map<String, String> WU_XING_CONTROLS;
    /** 五行被生：火←木, 土←火, 金←土, 水←金, 木←水 */
    public static final Map<String, String> WU_XING_GENERATED_BY;
    /** 阳天干 */
    public static final String[] YANG_GAN = {"甲", "丙", "戊", "庚", "壬"};

    static {
        Map<String, String> scDz = new HashMap<>();
        scDz.put("zi", "子");   scDz.put("chou", "丑"); scDz.put("yin", "寅");
        scDz.put("mao", "卯");  scDz.put("chen", "辰"); scDz.put("si", "巳");
        scDz.put("wu", "午");   scDz.put("wei", "未");  scDz.put("shen", "申");
        scDz.put("you", "酉");  scDz.put("xu", "戌");   scDz.put("hai", "亥");
        SHI_CHEN_TO_DI_ZHI = Collections.unmodifiableMap(scDz);

        Map<String, Integer> dzHour = new HashMap<>();
        dzHour.put("子", 0);  dzHour.put("丑", 2);  dzHour.put("寅", 4);
        dzHour.put("卯", 6);  dzHour.put("辰", 8);  dzHour.put("巳", 10);
        dzHour.put("午", 12); dzHour.put("未", 14); dzHour.put("申", 16);
        dzHour.put("酉", 18); dzHour.put("戌", 20); dzHour.put("亥", 22);
        DI_ZHI_TO_HOUR = Collections.unmodifiableMap(dzHour);

        Map<String, String> generates = new HashMap<>();
        generates.put("木", "火"); generates.put("火", "土");
        generates.put("土", "金"); generates.put("金", "水");
        generates.put("水", "木");
        WU_XING_GENERATES = Collections.unmodifiableMap(generates);

        Map<String, String> controls = new HashMap<>();
        controls.put("木", "土"); controls.put("土", "水");
        controls.put("水", "火"); controls.put("火", "金");
        controls.put("金", "木");
        WU_XING_CONTROLS = Collections.unmodifiableMap(controls);

        Map<String, String> generatedBy = new HashMap<>();
        generatedBy.put("火", "木"); generatedBy.put("土", "火");
        generatedBy.put("金", "土"); generatedBy.put("水", "金");
        generatedBy.put("木", "水");
        WU_XING_GENERATED_BY = Collections.unmodifiableMap(generatedBy);
    }
}
