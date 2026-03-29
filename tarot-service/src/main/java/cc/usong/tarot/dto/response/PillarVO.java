package cc.usong.tarot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 天干地支柱 VO。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PillarVO {

    private String tianGan;
    private String diZhi;
    private String tianGanWuXing;
    private String diZhiWuXing;
    private String yinYang;
    private String displayText;
}
