package cc.usong.tarot.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 时辰枚举。
 */
@Getter
@AllArgsConstructor
public enum ShiChen {

    ZI("zi", "子", 0),
    CHOU("chou", "丑", 2),
    YIN("yin", "寅", 4),
    MAO("mao", "卯", 6),
    CHEN("chen", "辰", 8),
    SI("si", "巳", 10),
    WU("wu", "午", 12),
    WEI("wei", "未", 14),
    SHEN("shen", "申", 16),
    YOU("you", "酉", 18),
    XU("xu", "戌", 20),
    HAI("hai", "亥", 22),
    UNKNOWN("unknown", "未知", 12);

    private final String code;
    private final String diZhi;
    private final int hour;

    public static ShiChen fromCode(String code) {
        if (code == null) {
            return UNKNOWN;
        }
        for (ShiChen sc : values()) {
            if (sc.code.equalsIgnoreCase(code)) {
                return sc;
            }
        }
        return UNKNOWN;
    }
}
