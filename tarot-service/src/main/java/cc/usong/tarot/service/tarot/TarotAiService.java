package cc.usong.tarot.service.tarot;

import cc.usong.tarot.config.DashScopeConfig;
import cc.usong.tarot.dto.request.InterpretRequest;
import com.alibaba.dashscope.app.Application;
import com.alibaba.dashscope.app.ApplicationParam;
import com.alibaba.dashscope.app.ApplicationResult;
import com.alibaba.dashscope.app.FlowStreamMode;
import com.alibaba.dashscope.exception.InputRequiredException;
import com.alibaba.dashscope.exception.NoApiKeyException;
import com.alibaba.dashscope.utils.JsonUtils;
import io.reactivex.Flowable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 塔罗牌 AI 解读服务。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TarotAiService {

    private final DashScopeConfig dashScopeConfig;
    private final TarotPromptBuilder tarotPromptBuilder;

    /**
     * 非流式解读。
     */
    public String interpret(InterpretRequest request)
            throws NoApiKeyException, InputRequiredException {
        String bizParams = tarotPromptBuilder.buildInterpretationPrompt(request);

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
     * 流式解读。
     */
    public Flowable<ApplicationResult> streamInterpret(InterpretRequest request)
            throws NoApiKeyException, InputRequiredException {
        String bizParams = tarotPromptBuilder.buildInterpretationPrompt(request);
        log.info("构建塔罗解读Prompt，牌阵：{}", request.getSpreadName());

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
