package cc.usong.tarot.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 性别枚举。
 */
@Getter
@AllArgsConstructor
public enum Gender {

    MALE("male", "男"),
    FEMALE("female", "女");

    private final String code;
    private final String label;

    public static Gender fromCode(String code) {
        for (Gender g : values()) {
            if (g.code.equalsIgnoreCase(code)) {
                return g;
            }
        }
        throw new IllegalArgumentException("无效的性别代码: " + code);
    }
}
