package cc.usong.tarot.service;

import cc.usong.tarot.converter.TarotCardConverter;
import cc.usong.tarot.dto.request.InterpretRequest;
import cc.usong.tarot.dto.response.CardVO;
import cc.usong.tarot.dto.response.DrawResultVO;
import cc.usong.tarot.dto.response.SpreadVO;
import cc.usong.tarot.entity.TarotCardEntity;
import cc.usong.tarot.model.TarotSpread;
import cc.usong.tarot.repository.TarotCardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class TarotService {

    private final TarotCardRepository tarotCardRepository;

    private final List<TarotSpread> spreads = List.of(
            new TarotSpread("single", "Single Card", "单张牌",
                    "A single card for a quick reading.",
                    "最简单的占卜方式，只抽取一张牌，用于快速了解当前运势或问题的核心。", 1),
            new TarotSpread("three-card", "Three Card Spread", "三牌阵",
                    "A spread for past, present, and future.",
                    "经典的三牌阵，分别代表问题的过去、现在和未来，帮助理清思绪。", 3),
            new TarotSpread("celtic-cross", "Celtic Cross", "凯尔特十字",
                    "A comprehensive spread for a detailed reading.",
                    "复杂且强大的凯尔特十字牌阵，可以深入分析问题的各个方面，提供详细的指引。", 10)
    );

    public List<SpreadVO> listSpreads() {
        return TarotCardConverter.toSpreadVOList(spreads);
    }

    public List<CardVO> getShuffledDeck() {
        List<TarotCardEntity> allCards = tarotCardRepository.findAll();
        List<TarotCardEntity> shuffled = new ArrayList<>(allCards);
        Collections.shuffle(shuffled);
        return shuffled.stream()
                .map(card -> {
                    CardVO vo = TarotCardConverter.toCardVO(card, false);
                    vo.setReversed(Math.random() > 0.5);
                    return vo;
                })
                .toList();
    }

    public Optional<TarotSpread> getSpread(String id) {
        return spreads.stream()
                .filter(s -> s.getId().equals(id))
                .findFirst();
    }

    public DrawResultVO drawCards(String spreadId) {
        TarotSpread spread = getSpread(spreadId)
                .orElseThrow(() -> new IllegalArgumentException("无效的牌阵ID: " + spreadId));

        List<TarotCardEntity> allCards = tarotCardRepository.findAll();
        List<TarotCardEntity> shuffled = new ArrayList<>(allCards);
        Collections.shuffle(shuffled);

        List<CardVO> drawnCards = shuffled.stream()
                .limit(spread.getNumberOfCards())
                .map(card -> {
                    CardVO vo = TarotCardConverter.toCardVO(card, false);
                    vo.setReversed(Math.random() > 0.5);
                    return vo;
                })
                .toList();

        SpreadVO spreadVO = TarotCardConverter.toSpreadVO(spread);
        return new DrawResultVO(drawnCards, spreadVO);
    }
}
