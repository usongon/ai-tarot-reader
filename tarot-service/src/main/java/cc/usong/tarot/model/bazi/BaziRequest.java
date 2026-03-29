package cc.usong.tarot.model.bazi;

/**
 * 排盘请求 DTO。
 * @author dehua
 */
public class BaziRequest {

    private String birthDate;   // "YYYY-MM-DD"
    private Boolean isLunar;    // 是否农历
    private String gender;      // "male" / "female"
    private String shiChen;     // "zi", "chou", "yin", "mao", "chen", "si", "wu", "wei", "shen", "you", "xu", "hai", "unknown"
    private String token;       // 访问口令

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public Boolean getIsLunar() {
        return isLunar;
    }

    public void setIsLunar(Boolean isLunar) {
        this.isLunar = isLunar;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getShiChen() {
        return shiChen;
    }

    public void setShiChen(String shiChen) {
        this.shiChen = shiChen;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
