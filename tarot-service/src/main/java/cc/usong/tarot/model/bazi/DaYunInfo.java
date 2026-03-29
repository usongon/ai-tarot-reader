package cc.usong.tarot.model.bazi;

/**
 * 大运模型。
 * 命名为 DaYunInfo 以避免与 lunar-java 库的 DaYun 类冲突。
 * @author dehua
 */
public class DaYunInfo {

    private int startAge;      // 起始年龄
    private int endAge;        // 结束年龄
    private String tianGan;    // 天干
    private String diZhi;      // 地支
    private String displayText; // 显示文本
    private boolean isCurrent; // 是否当前大运

    public int getStartAge() {
        return startAge;
    }

    public void setStartAge(int startAge) {
        this.startAge = startAge;
    }

    public int getEndAge() {
        return endAge;
    }

    public void setEndAge(int endAge) {
        this.endAge = endAge;
    }

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

    public String getDisplayText() {
        return displayText;
    }

    public void setDisplayText(String displayText) {
        this.displayText = displayText;
    }

    public boolean isCurrent() {
        return isCurrent;
    }

    public void setCurrent(boolean current) {
        isCurrent = current;
    }
}
