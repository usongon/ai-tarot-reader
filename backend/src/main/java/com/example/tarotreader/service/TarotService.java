
package com.example.tarotreader.service;

import com.alibaba.dashscope.app.FlowStreamMode;
import com.example.tarotreader.config.DashScopeConfig;
import com.example.tarotreader.model.Deck;
import com.example.tarotreader.model.TarotCard;
import com.example.tarotreader.model.TarotSpread;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.dashscope.app.Application;
import com.alibaba.dashscope.app.ApplicationParam;
import com.alibaba.dashscope.app.ApplicationResult;
import com.alibaba.dashscope.exception.InputRequiredException;
import com.alibaba.dashscope.exception.NoApiKeyException;
import com.alibaba.dashscope.utils.JsonUtils;
import com.example.tarotreader.model.InterpretationRequest;

import io.reactivex.Flowable;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 用于处理塔罗牌相关逻辑的服务类。
 * 包括洗牌、牌阵管理和抽牌功能。
 */
@Service
public class TarotService {

    private final PersistenceService persistenceService;
    private final DashScopeConfig dashScopeConfig;
    private final List<TarotSpread> spreads;

    /**
     * 构造一个TarotService并初始化可用的牌阵列表。
     *
     * @param persistenceService 用于持久化抽取的卡牌的服务（当前未使用）。
     * @param dashScopeConfig    DashScope API配置。
     */
    @Autowired
    public TarotService(PersistenceService persistenceService, DashScopeConfig dashScopeConfig) {
        this.persistenceService = persistenceService;
        this.dashScopeConfig = dashScopeConfig;
        this.spreads = Arrays.asList(
                new TarotSpread("single", "Single Card", "单张牌", "A single card for a quick reading.", "最简单的占卜方式，只抽取一张牌，用于快速了解当前运势或问题的核心。", 1),
                new TarotSpread("three-card", "Three Card Spread", "三牌阵", "A spread for past, present, and future.", "经典的三牌阵，分别代表问题的过去、现在和未来，帮助理清思绪。", 3),
                new TarotSpread("celtic-cross", "Celtic Cross", "凯尔特十字", "A comprehensive spread for a detailed reading.", "复杂且强大的凯尔特十字牌阵，可以深入分析问题的各个方面，提供详细的指引。", 10)
        );
    }

    /**
     * 创建一副新牌，将其洗牌，并为每张牌随机分配正逆位状态。
     *
     * @return 代表完整、已洗牌的牌堆的TarotCard对象列表。
     */
    public List<TarotCard> getShuffledDeck() {
        Deck deck = new Deck();
        deck.shuffle();
        // Manually set reversed status for each card in the full deck
        deck.getCards().forEach(card -> card.setReversed(Math.random() > 0.5));
        return deck.getCards();
    }

    /**
     * 获取可用的塔罗牌牌阵列表。
     *
     * @return TarotSpread对象列表。
     */
    public List<TarotSpread> getSpreads() {
        return spreads;
    }

    /**
     * 根据ID查找塔罗牌牌阵。
     *
     * @param id 要查找的牌阵的ID。
     * @return 如果找到，则返回包含TarotSpread的Optional，否则返回空的Optional。
     */
    public Optional<TarotSpread> getSpread(String id) {
        return spreads.stream().filter(spread -> spread.getId().equals(id)).findFirst();
    }

    /**
     * 为给定的牌阵抽取指定数量的牌。
     * 每次抽牌都会创建并洗乱一副新牌。
     * 抽取的牌通过PersistenceService保存。
     *
     * @param spread 用于抽牌的TarotSpread。
     * @return 抽取的TarotCard对象列表。
     */
    public List<TarotCard> draw(TarotSpread spread) {
        Deck deck = new Deck();
        deck.shuffle();
        List<TarotCard> drawnCards = deck.draw(spread.getNumberOfCards());
        persistenceService.save(drawnCards);
        return drawnCards;
    }

    public String getInterpretation(InterpretationRequest request) throws NoApiKeyException, InputRequiredException {
        String cardsString = request.getCards().stream()
                .map(card -> card.getName() + "(" + (card.isReversed() ? "逆位" : "正位") + ")")
                .collect(Collectors.joining(","));

        String bizParams = String.format(
                "{\"spreads\":\"%s\",\"direction\":\"%s\",\"cards\":\"%s\"}",
                request.getSpreadName(),
                request.getDirection(),
                cardsString
        );

        ApplicationParam param = ApplicationParam.builder()
                .apiKey(dashScopeConfig.getApiKey())
                .appId(dashScopeConfig.getAppId())
                .prompt("抽卡成功")
                .bizParams(JsonUtils.parse(bizParams))
                .build();

        Application application = new Application();
        ApplicationResult result = application.call(param);
        return result.getOutput().getText();
    }

    /**
     * 流式获取塔罗牌解读结果。
     *
     * @param request 包含牌阵、方向和卡牌信息的请求对象。
     * @return Flowable<ApplicationResult> 流式输出的结果。
     * @throws NoApiKeyException      如果未设置API密钥。
     * @throws InputRequiredException 如果缺少必需的输入参数。
     */
    public Flowable<ApplicationResult> getInterpretationStream(InterpretationRequest request) throws NoApiKeyException, InputRequiredException {
        String cardsString = request.getCards().stream()
                .map(card -> card.getName() + "(" + (card.isReversed() ? "逆位" : "正位") + ")")
                .collect(Collectors.joining(","));

        String bizParams = String.format(
                "{\"spreads\":\"%s\",\"direction\":\"%s\",\"cards\":\"%s\"}",
                request.getSpreadName(),
                request.getDirection(),
                cardsString
        );

        ApplicationParam param = ApplicationParam.builder()
                .apiKey(dashScopeConfig.getApiKey())
                .appId(dashScopeConfig.getAppId())
                .prompt("抽卡成功")
                .bizParams(JsonUtils.parse(bizParams))
                .incrementalOutput(true)
                .flowStreamMode(FlowStreamMode.MESSAGE_FORMAT)
                .build();

        Application application = new Application();
        return application.streamCall(param);
    }
}
