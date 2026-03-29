package cc.usong.tarot.service.tarot;

import cc.usong.common.exception.TokenInvalidException;
import cc.usong.tarot.service.token.RateLimitingService;
import com.alibaba.dashscope.app.ApplicationResult;
import io.reactivex.Flowable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.function.Supplier;

/**
 * SSE 流式输出服务。
 * 统一封装 DashScope Flowable → WebFlux Flux 转换。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SseService {

    private final RateLimitingService rateLimitingService;

    /**
     * 将 DashScope Flowable 转为 WebFlux Flux<ServerSentEvent<String>>。
     *
     * @param flowableSupplier DashScope Flowable 提供者
     * @param token            访问口令
     * @return Flux<ServerSentEvent<String>>
     */
    public Flux<ServerSentEvent<String>> streamDashScope(
            Supplier<Flowable<ApplicationResult>> flowableSupplier,
            String token) {

        // 1. 验证 token
        try {
            rateLimitingService.verifyToken(token);
        } catch (Exception e) {
            log.warn("Token验证失败: {}", e.getMessage());
            return Flux.just(ServerSentEvent.<String>builder()
                    .data("[FORBIDDEN]" + e.getMessage())
                    .build());
        }

        // 2. 获取 Flowable 并转换为 Flux
        try {
            Flowable<ApplicationResult> flowable = flowableSupplier.get();

            return Flux.create(sink -> {
                flowable.subscribe(
                        result -> {
                            String finishReason = result.getOutput().getFinishReason();
                            if ("stop".equals(finishReason)) {
                                log.debug("SSE stream completed");
                            } else {
                                String content = result.getOutput()
                                        .getWorkflowMessage().getMessage().getContent();
                                if (content != null && !content.isEmpty()) {
                                    sink.next(ServerSentEvent.<String>builder()
                                            .data(content)
                                            .build());
                                }
                            }
                        },
                        error -> {
                            log.error("SSE stream error", error);
                            sink.next(ServerSentEvent.<String>builder()
                                    .data("[ERROR]" + error.getMessage())
                                    .build());
                            sink.complete();
                        },
                        sink::complete
                );
            });
        } catch (Exception e) {
            log.error("创建SSE流失败", e);
            return Flux.just(ServerSentEvent.<String>builder()
                    .data("[ERROR]" + e.getMessage())
                    .build());
        }
    }
}
