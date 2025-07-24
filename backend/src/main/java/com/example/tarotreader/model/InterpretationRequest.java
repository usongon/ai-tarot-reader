
package com.example.tarotreader.model;

import java.util.List;

public class InterpretationRequest {

    private String token; // 新增口令字段
    private String direction;
    private String spreadName;
    private List<TarotCard> cards;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getSpreadName() {
        return spreadName;
    }

    public void setSpreadName(String spreadName) {
        this.spreadName = spreadName;
    }

    public List<TarotCard> getCards() {
        return cards;
    }

    public void setCards(List<TarotCard> cards) {
        this.cards = cards;
    }
}
