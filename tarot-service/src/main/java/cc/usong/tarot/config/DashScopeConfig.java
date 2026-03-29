package cc.usong.tarot.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * DashScope配置类。
 * @author dehua
 */
@Configuration
@ConfigurationProperties(prefix = "dashscope")
public class DashScopeConfig {

    private String apiKey;
    private String appId;
    private String baziAppId;

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getBaziAppId() {
        return baziAppId;
    }

    public void setBaziAppId(String baziAppId) {
        this.baziAppId = baziAppId;
    }
}
