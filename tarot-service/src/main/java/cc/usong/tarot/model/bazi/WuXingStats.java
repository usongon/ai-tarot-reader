package cc.usong.tarot.model.bazi;

/**
 * 五行统计模型。
 * @author dehua
 */
public class WuXingStats {

    private int jin;            // 金
    private int mu;             // 木
    private int shui;           // 水
    private int huo;            // 火
    private int tu;             // 土
    private String dayMasterWuXing; // 日主五行
    private String strength;    // 身强身弱

    public int getJin() {
        return jin;
    }

    public void setJin(int jin) {
        this.jin = jin;
    }

    public int getMu() {
        return mu;
    }

    public void setMu(int mu) {
        this.mu = mu;
    }

    public int getShui() {
        return shui;
    }

    public void setShui(int shui) {
        this.shui = shui;
    }

    public int getHuo() {
        return huo;
    }

    public void setHuo(int huo) {
        this.huo = huo;
    }

    public int getTu() {
        return tu;
    }

    public void setTu(int tu) {
        this.tu = tu;
    }

    public String getDayMasterWuXing() {
        return dayMasterWuXing;
    }

    public void setDayMasterWuXing(String dayMasterWuXing) {
        this.dayMasterWuXing = dayMasterWuXing;
    }

    public String getStrength() {
        return strength;
    }

    public void setStrength(String strength) {
        this.strength = strength;
    }
}
