package cc.usong.tarot.model.bazi;

/**
 * AI 解读请求 DTO。
 * @author dehua
 */
public class BaziInterpretRequest {

    private String token;     // 访问口令
    private BaziChart chart;  // 命盘数据

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public BaziChart getChart() {
        return chart;
    }

    public void setChart(BaziChart chart) {
        this.chart = chart;
    }
}
