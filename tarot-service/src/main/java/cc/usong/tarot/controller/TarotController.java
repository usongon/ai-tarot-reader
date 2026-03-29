package cc.usong.tarot.controller;

import cc.usong.common.model.Result;
import cc.usong.tarot.dto.request.DrawRequest;
import cc.usong.tarot.dto.request.InterpretRequest;
import cc.usong.tarot.dto.response.CardVO;
import cc.usong.tarot.dto.response.DrawResultVO;
import cc.usong.tarot.dto.response.SpreadVO;
import cc.usong.tarot.service.TarotService;
import cc.usong.tarot.service.tarot.SseService;
import cc.usong.tarot.service.tarot.TarotAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.List;

/**
 * 塔罗牌 API 控制器。
 */
@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TarotController {

    private final TarotService tarotService;
    private final TarotAiService tarotAiService;
    private final SseService sseService;

    @GetMapping("/spreads")
    public Result<List<SpreadVO>> listSpreads() {
        return Result.success(tarotService.listSpreads());
    }

    @GetMapping("/deck")
    public Result<List<CardVO>> getShuffledDeck() {
        return Result.success(tarotService.getShuffledDeck());
    }

    @PostMapping("/draw")
    public Result<DrawResultVO> draw(@Valid @RequestBody DrawRequest request) {
        return Result.success(tarotService.drawCards(request.getSpreadId()));
    }

    @PostMapping("/interpret")
    public Result<String> interpret(@Valid @RequestBody InterpretRequest request) {
        try {
            String result = tarotAiService.interpret(request);
            return Result.success(result);
        } catch (Exception e) {
            log.error("解读失败", e);
            return Result.fail(cc.usong.common.enums.ResultCode.SERVER_ERROR, e.getMessage());
        }
    }

    @PostMapping(value = "/interpret/stream", produces = "text/event-stream")
    public Flux<ServerSentEvent<String>> streamInterpret(@Valid @RequestBody InterpretRequest request) {
        return sseService.streamDashScope(
                () -> {
                    try {
                        return tarotAiService.streamInterpret(request);
                    } catch (Exception e) {
                        log.error("创建塔罗解读流失败", e);
                        throw new RuntimeException(e);
                    }
                },
                request.getToken()
        );
    }
}
