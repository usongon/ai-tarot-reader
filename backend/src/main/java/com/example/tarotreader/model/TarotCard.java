package com.example.tarotreader.model;

/**
 * 塔罗牌模型类。
 * @author dehua
 */
public class TarotCard {

    private String name;
    private String nameChinese;
    private String uprightMeaning;
    private String uprightMeaningChinese;
    private String reversedMeaning;
    private String reversedMeaningChinese;
    private boolean reversed;
    private String imagePath;

    public TarotCard(String name, String nameChinese, String uprightMeaning, String uprightMeaningChinese, String reversedMeaning, String reversedMeaningChinese, String imagePath) {
        this.name = name;
        this.nameChinese = nameChinese;
        this.uprightMeaning = uprightMeaning;
        this.uprightMeaningChinese = uprightMeaningChinese;
        this.reversedMeaning = reversedMeaning;
        this.reversedMeaningChinese = reversedMeaningChinese;
        this.imagePath = imagePath;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNameChinese() {
        return nameChinese;
    }

    public void setNameChinese(String nameChinese) {
        this.nameChinese = nameChinese;
    }

    public String getUprightMeaning() {
        return uprightMeaning;
    }

    public void setUprightMeaning(String uprightMeaning) {
        this.uprightMeaning = uprightMeaning;
    }

    public String getUprightMeaningChinese() {
        return uprightMeaningChinese;
    }

    public void setUprightMeaningChinese(String uprightMeaningChinese) {
        this.uprightMeaningChinese = uprightMeaningChinese;
    }

    public String getReversedMeaning() {
        return reversedMeaning;
    }

    public void setReversedMeaning(String reversedMeaning) {
        this.reversedMeaning = reversedMeaning;
    }

    public String getReversedMeaningChinese() {
        return reversedMeaningChinese;
    }

    public void setReversedMeaningChinese(String reversedMeaningChinese) {
        this.reversedMeaningChinese = reversedMeaningChinese;
    }

    public boolean isReversed() {
        return reversed;
    }

    public void setReversed(boolean reversed) {
        this.reversed = reversed;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
}
