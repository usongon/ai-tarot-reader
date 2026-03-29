package cc.usong.tarot.service.tarot;

import cc.usong.tarot.dto.request.InterpretRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 塔罗牌 AI Prompt 构建器。
 */
@Component
public class TarotPromptBuilder {

    /**
     * 构建解读 Prompt。
     */
    public String buildInterpretationPrompt(InterpretRequest request) {
        String cardsString = formatCards(request.getCards());
        return String.format("{\"spreads\":\"%s\",\"direction\":\"%s\",\"cards\":\"%s\"}",
                request.getSpreadName(), request.getDirection(), cardsString);
    }

    private String formatCards(List<Map<String, Object>> cards) {
        if (cards == null) {
            return "";
        }
        return cards.stream()
                .map(card -> {
                    String name = (String) card.get("name");
                    boolean reversed = Boolean.TRUE.equals(card.get("reversed"));
                    return name + "(" + (reversed ? "逆位" : "正位") + ")";
                })
                .collect(Collectors.joining(","));
    }
}
