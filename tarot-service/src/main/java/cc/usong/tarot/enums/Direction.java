package cc.usong.tarot.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 牌方向枚举（正位/逆位）。
 */
@Getter
@AllArgsConstructor
public enum Direction {

    UPRIGHT("upright", "正位"),
    REVERSED("reversed", "逆位");

    private final String code;
    private final String label;
}
