
package com.example.tarotreader.controller;

import com.alibaba.dashscope.app.ApplicationResult;
import com.example.tarotreader.model.DrawRequest;
import com.example.tarotreader.model.InterpretationRequest;
import com.example.tarotreader.model.TarotCard;
import com.example.tarotreader.model.TarotSpread;
import com.example.tarotreader.service.RateLimitExceededException;
import com.example.tarotreader.service.RateLimitingService;
import com.example.tarotreader.service.TarotService;
import io.reactivex.Flowable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * 塔罗牌解读应用的主控制器。
 * 处理所有与塔罗牌、牌堆和牌阵相关的API请求。
 */
@RestController
@RequestMapping("/api")
public class TarotController {

    private final TarotService tarotService;
    private final RateLimitingService rateLimitingService;

    /**
     * 使用TarotService构造一个TarotController。
     * @param tarotService 用于处理塔罗牌相关逻辑的服务。
     */
    @Autowired
    public TarotController(TarotService tarotService, RateLimitingService rateLimitingService) {
        this.tarotService = tarotService;
        this.rateLimitingService = rateLimitingService;
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
            // 从请求体中获取口令
            String token = request.getToken();
            rateLimitingService.verifyToken(token);
            String interpretation = tarotService.getInterpretation(request);
            return ResponseEntity.ok(interpretation);
        } catch (RateLimitExceededException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error generating interpretation: " + e.getMessage());
        }
    }

    /**
     * 流式获取塔罗牌解读结果。
     * 使用 Server-Sent Events (SSE) 实现实时流式输出。
     * @param request 包含牌阵、方向、卡牌和口令的请求对象。
     * @return SseEmitter 用于流式传输解读结果。
     */
    @PostMapping(value = "/interpret/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter interpretStream(@RequestBody InterpretationRequest request) {
        SseEmitter emitter = new SseEmitter(180000L); // 3分钟超时

        ExecutorService executor = Executors.newSingleThreadExecutor();
        executor.execute(() -> {
            try {
                // 验证口令
                String token = request.getToken();
                rateLimitingService.verifyToken(token);

                // 获取流式输出
                Flowable<ApplicationResult> resultFlowable = tarotService.getInterpretationStream(request);

                // 使用 blockingForEach 处理每个结果
                resultFlowable.blockingForEach(result -> {
                    try {
                        String finishReason = result.getOutput().getFinishReason();
                        if ("stop".equals(finishReason)) {
                            // 流结束
                            System.out.println("[STREAM] Task finished");
                        } else {
                            // 获取流式内容
                            String content = result.getOutput().getWorkflowMessage().getMessage().getContent();
                            if (content != null && !content.isEmpty()) {
                                System.out.println("[STREAM] Received chunk at " + System.currentTimeMillis() + ": " + content.length() + " chars");
                                emitter.send(SseEmitter.event()
                                        .data(content)
                                        .name("message"));
                            }
                        }
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                });

                // 流式输出完成
                emitter.complete();

            } catch (RateLimitExceededException e) {
                try {
                    emitter.send(SseEmitter.event()
                            .data("[FORBIDDEN]" + e.getMessage())
                            .name("error"));
                } catch (IOException ioException) {
                    // Ignore
                }
                emitter.complete();
            } catch (Exception e) {
                e.printStackTrace();
                try {
                    emitter.send(SseEmitter.event()
                            .data("[ERROR]" + e.getMessage())
                            .name("error"));
                } catch (IOException ioException) {
                    // Ignore
                }
                emitter.completeWithError(e);
            }
        });

        executor.shutdown();

        // 设置超时和完成回调
        emitter.onTimeout(() -> {
            emitter.complete();
        });

        emitter.onCompletion(() -> {
            // Cleanup if needed
        });

        return emitter;
    }
}
