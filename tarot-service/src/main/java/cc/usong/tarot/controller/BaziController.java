package cc.usong.tarot.controller;

import cc.usong.common.model.Result;
import cc.usong.tarot.converter.BaziConverter;
import cc.usong.tarot.dto.request.BaziInterpretRequest;
import cc.usong.tarot.dto.request.BaziRequest;
import cc.usong.tarot.dto.response.BaziChartVO;
import cc.usong.tarot.model.bazi.BaziChart;
import cc.usong.tarot.service.bazi.BaziAiService;
import cc.usong.tarot.service.bazi.BaziCalculationService;
import cc.usong.tarot.service.tarot.SseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

/**
 * 八字命盘 API 控制器。
 */
@Slf4j
@RestController
@RequestMapping("/api/bazi")
@RequiredArgsConstructor
public class BaziController {

    private final BaziCalculationService baziCalculationService;
    private final BaziAiService baziAiService;
    private final SseService sseService;

    @PostMapping("/chart")
    public Result<BaziChartVO> calculateChart(@Valid @RequestBody BaziRequest request) {
        BaziChart chart = baziCalculationService.calculateChart(
                request.getBirthDate(),
                Boolean.TRUE.equals(request.getIsLunar()),
                request.getGender(),
                request.getShiChen()
        );
        return Result.success(BaziConverter.toBaziChartVO(chart));
    }

    @PostMapping(value = "/interpret/stream", produces = "text/event-stream")
    public Flux<ServerSentEvent<String>> streamInterpret(@Valid @RequestBody BaziInterpretRequest request) {
        // 从前端传来的 chart map 重建 BaziChart（简化处理：前端直接传原始 JSON）
        BaziChart chart = reconstructChart(request.getChart());
        return sseService.streamDashScope(
                () -> {
                    try {
                        return baziAiService.streamInterpret(chart);
                    } catch (Exception e) {
                        log.error("创建八字解读流失败", e);
                        throw new RuntimeException(e);
                    }
                },
                request.getToken()
        );
    }

    private BaziChart reconstructChart(java.util.Map<String, Object> chartMap) {
        // 使用 Jackson ObjectMapper 将 Map 转回 BaziChart
        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        return mapper.convertValue(chartMap, BaziChart.class);
    }
}
