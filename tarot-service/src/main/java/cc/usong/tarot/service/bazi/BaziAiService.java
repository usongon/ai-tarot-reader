package cc.usong.tarot.service.bazi;

import cc.usong.tarot.config.DashScopeConfig;
import cc.usong.tarot.model.bazi.BaziChart;
import com.alibaba.dashscope.app.Application;
import com.alibaba.dashscope.app.ApplicationParam;
import com.alibaba.dashscope.app.ApplicationResult;
import com.alibaba.dashscope.app.FlowStreamMode;
import com.alibaba.dashscope.exception.InputRequiredException;
import com.alibaba.dashscope.exception.NoApiKeyException;
import io.reactivex.Flowable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 八字 AI 解读服务。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BaziAiService {

    private final DashScopeConfig dashScopeConfig;
    private final BaziPromptBuilder baziPromptBuilder;

    /**
     * 流式获取八字解读结果。
     */
    public Flowable<ApplicationResult> streamInterpret(BaziChart chart)
            throws NoApiKeyException, InputRequiredException {
        String userPrompt = baziPromptBuilder.buildInterpretationPrompt(chart);
        log.info("构建八字解读Prompt，命盘日期：{}", chart.getSolarDate());

        ApplicationParam param = ApplicationParam.builder()
                .apiKey(dashScopeConfig.getApiKey())
                .appId(dashScopeConfig.getBaziAppId())
                .prompt(userPrompt)
                .incrementalOutput(true)
                .flowStreamMode(FlowStreamMode.MESSAGE_FORMAT)
                .build();

        Application application = new Application();
        return application.streamCall(param);
    }
}
