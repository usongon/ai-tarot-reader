package com.example.tarotreader.model;

/**
 * 塔罗牌阵模型类。
 * @author dehua
 */
public class TarotSpread {

    private String id;
    private String name;
    private String nameChinese;
    private String description;
    private String descriptionChinese;
    private int numberOfCards;

    public TarotSpread(String id, String name, String nameChinese, String description, String descriptionChinese, int numberOfCards) {
        this.id = id;
        this.name = name;
        this.nameChinese = nameChinese;
        this.description = description;
        this.descriptionChinese = descriptionChinese;
        this.numberOfCards = numberOfCards;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescriptionChinese() {
        return descriptionChinese;
    }

    public void setDescriptionChinese(String descriptionChinese) {
        this.descriptionChinese = descriptionChinese;
    }

    public int getNumberOfCards() {
        return numberOfCards;
    }

    public void setNumberOfCards(int numberOfCards) {
        this.numberOfCards = numberOfCards;
    }
}
