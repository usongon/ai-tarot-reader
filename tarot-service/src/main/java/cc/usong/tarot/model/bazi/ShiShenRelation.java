package cc.usong.tarot.model.bazi;

/**
 * 十神关系模型。
 * @author dehua
 */
public class ShiShenRelation {

    private String position;  // 位置 (年柱, 月柱, 时柱)
    private String tianGan;   // 天干
    private String shiShen;   // 十神
    private String wuXing;    // 五行

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getTianGan() {
        return tianGan;
    }

    public void setTianGan(String tianGan) {
        this.tianGan = tianGan;
    }

    public String getShiShen() {
        return shiShen;
    }

    public void setShiShen(String shiShen) {
        this.shiShen = shiShen;
    }

    public String getWuXing() {
        return wuXing;
    }

    public void setWuXing(String wuXing) {
        this.wuXing = wuXing;
    }
}
