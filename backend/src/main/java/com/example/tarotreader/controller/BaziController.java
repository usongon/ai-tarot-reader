package com.example.tarotreader.controller;

import com.alibaba.dashscope.app.ApplicationResult;
import com.example.tarotreader.model.bazi.BaziChart;
import com.example.tarotreader.model.bazi.BaziInterpretRequest;
import com.example.tarotreader.model.bazi.BaziRequest;
import com.example.tarotreader.service.BaziService;
import com.example.tarotreader.service.RateLimitExceededException;
import com.example.tarotreader.service.RateLimitingService;
import io.reactivex.Flowable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * 八字命盘控制器。
 * 处理八字排盘和AI解读相关的API请求。
 * @author dehua
 */
@RestController
@RequestMapping("/api/bazi")
public class BaziController {

    private final BaziService baziService;
    private final RateLimitingService rateLimitingService;

    /**
     * 使用BaziService构造一个BaziController。
     * @param baziService 用于处理八字命盘相关逻辑的服务。
     * @param rateLimitingService 用于验证口令和限流的服务。
     */
    @Autowired
    public BaziController(BaziService baziService, RateLimitingService rateLimitingService) {
        this.baziService = baziService;
        this.rateLimitingService = rateLimitingService;
    }

    /**
     * 计算八字命盘。
     * @param request 包含出生日期、性别、时辰等信息的请求体。
     * @return 包含八字命盘结果的ResponseEntity。
     */
    @PostMapping("/chart")
    public ResponseEntity<BaziChart> calculateChart(@RequestBody BaziRequest request) {
        BaziChart chart = baziService.calculateChart(request);
        return ResponseEntity.ok(chart);
    }

    /**
     * 流式获取八字解读结果。
     * 使用 Server-Sent Events (SSE) 实现实时流式输出。
     * @param request 包含八字命盘和口令的请求对象。
     * @return SseEmitter 用于流式传输解读结果。
     */
    @PostMapping(value = "/interpret/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter interpretStream(@RequestBody BaziInterpretRequest request) {
        SseEmitter emitter = new SseEmitter(180000L); // 3分钟超时

        ExecutorService executor = Executors.newSingleThreadExecutor();
        executor.execute(() -> {
            try {
                // 验证口令
                String token = request.getToken();
                rateLimitingService.verifyToken(token);

                // 获取流式输出
                Flowable<ApplicationResult> resultFlowable = baziService.getInterpretationStream(request.getChart());

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
