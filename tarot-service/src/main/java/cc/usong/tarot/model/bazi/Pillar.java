package cc.usong.tarot.model.bazi;

/**
 * 天干地支柱模型。
 * @author dehua
 */
public class Pillar {

    private String tianGan;       // 天干
    private String diZhi;         // 地支
    private String tianGanWuXing; // 天干五行
    private String diZhiWuXing;   // 地支五行
    private String yinYang;       // 阴阳
    private String displayText;   // 显示文本

    public String getTianGan() {
        return tianGan;
    }

    public void setTianGan(String tianGan) {
        this.tianGan = tianGan;
    }

    public String getDiZhi() {
        return diZhi;
    }

    public void setDiZhi(String diZhi) {
        this.diZhi = diZhi;
    }

    public String getTianGanWuXing() {
        return tianGanWuXing;
    }

    public void setTianGanWuXing(String tianGanWuXing) {
        this.tianGanWuXing = tianGanWuXing;
    }

    public String getDiZhiWuXing() {
        return diZhiWuXing;
    }

    public void setDiZhiWuXing(String diZhiWuXing) {
        this.diZhiWuXing = diZhiWuXing;
    }

    public String getYinYang() {
        return yinYang;
    }

    public void setYinYang(String yinYang) {
        this.yinYang = yinYang;
    }

    public String getDisplayText() {
        return displayText;
    }

    public void setDisplayText(String displayText) {
        this.displayText = displayText;
    }
}
