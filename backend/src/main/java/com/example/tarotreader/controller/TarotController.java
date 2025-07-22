
package com.example.tarotreader.controller;

import com.example.tarotreader.model.DrawRequest;
import com.example.tarotreader.model.InterpretationRequest;
import com.example.tarotreader.model.TarotCard;
import com.example.tarotreader.model.TarotSpread;
import com.example.tarotreader.service.TarotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 塔罗牌解读应用的主控制器。
 * 处理所有与塔罗牌、牌堆和牌阵相关的API请求。
 */
@RestController
@RequestMapping("/api")
public class TarotController {

    private final TarotService tarotService;

    /**
     * 使用TarotService构造一个TarotController。
     * @param tarotService 用于处理塔罗牌相关逻辑的服务。
     */
    @Autowired
    public TarotController(TarotService tarotService) {
        this.tarotService = tarotService;
    }

    /**
     * 获取一副完全洗好的塔罗牌。
     * 牌堆中的每张牌都会被随机赋予正位或逆位状态。
     * @return 代表已洗牌的牌堆的TarotCard对象列表。
     */
    @GetMapping("/deck")
    public List<TarotCard> getShuffledDeck() {
        return tarotService.getShuffledDeck();
    }

    /**
     * 获取所有可用的塔罗牌牌阵列表。
     * @return TarotSpread对象列表。
     */
    @GetMapping("/spreads")
    public List<TarotSpread> getSpreads() {
        return tarotService.getSpreads();
    }

    /**
     * 根据所选的牌阵抽牌。
     * @param drawRequest 包含所用牌阵ID的请求体。
     * @return 包含所抽取的TarotCard对象列表的ResponseEntity，如果牌阵ID无效则返回bad request。
     */
    @PostMapping("/draw")
    public ResponseEntity<List<TarotCard>> draw(@RequestBody DrawRequest drawRequest) {
        return tarotService.getSpread(drawRequest.getSpreadId())
                .map(tarotService::draw)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }

    @PostMapping("/interpret")
    public ResponseEntity<String> interpret(@RequestBody InterpretationRequest request) {
        try {
            String interpretation = tarotService.getInterpretation(request);
            return ResponseEntity.ok(interpretation);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error generating interpretation: " + e.getMessage());
        }
    }
}
