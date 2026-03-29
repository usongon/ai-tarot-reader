package cc.usong.tarot.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 塔罗牌类别枚举。
 */
@Getter
@AllArgsConstructor
public enum CardCategory {

    MAJOR("major", "大阿尔卡纳"),
    WANDS("wands", "权杖"),
    CUPS("cups", "圣杯"),
    SWORDS("swords", "宝剑"),
    PENTACLES("pentacles", "星币");

    private final String code;
    private final String label;
}
