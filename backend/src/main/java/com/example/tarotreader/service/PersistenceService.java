
package com.example.tarotreader.service;

import com.example.tarotreader.model.TarotCard;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersistenceService {

    public void save(List<TarotCard> cards) {
        System.out.println("Simulating persistence of drawn cards:");
        for (TarotCard card : cards) {
            System.out.println(card.getName() + (card.isReversed() ? " (Reversed)" : ""));
        }
    }
}
