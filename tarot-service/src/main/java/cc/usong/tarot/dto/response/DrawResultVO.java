package cc.usong.tarot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 抽牌结果 VO。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DrawResultVO {

    private List<CardVO> cards;
    private SpreadVO spread;
}
