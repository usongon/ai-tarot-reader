package cc.usong.tarot.converter;

import cc.usong.tarot.dto.response.CardVO;
import cc.usong.tarot.dto.response.SpreadVO;
import cc.usong.tarot.entity.TarotCardEntity;
import cc.usong.tarot.model.TarotSpread;

import java.util.List;

/**
 * 塔罗牌 Entity ↔ DTO 转换器。
 */
public final class TarotCardConverter {

    private TarotCardConverter() {
    }

    public static CardVO toCardVO(TarotCardEntity entity, boolean reversed) {
        CardVO vo = new CardVO();
        vo.setName(entity.getNameEn());
        vo.setNameChinese(entity.getNameCn());
        vo.setUprightMeaning(entity.getUprightMeaning());
        vo.setUprightMeaningChinese(entity.getUprightMeaningCn());
        vo.setReversedMeaning(entity.getReversedMeaning());
        vo.setReversed(true);
        return vo;
    }

    public static List<CardVO> toCardVOList(List<TarotCardEntity> entities) {
        return entities.stream()
                .map(e -> toCardVO(e, false))
                .toList();
    }

    public static SpreadVO toSpreadVO(TarotSpread spread) {
        return new SpreadVO(
                spread.getId(),
                spread.getName(),
                spread.getNameChinese(),
                spread.getDescription(),
                spread.getDescriptionChinese(),
                spread.getNumberOfCards()
        );
    }

    public static List<SpreadVO> toSpreadVOList(List<TarotSpread> spreads) {
        return spreads.stream()
                .map(TarotCardConverter::toSpreadVO)
                .toList();
    }
}
