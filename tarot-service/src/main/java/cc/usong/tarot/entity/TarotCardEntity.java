package cc.usong.tarot.entity;

import jakarta.persistence.*;
import lombok.Data;

/**
 * 塔罗牌实体。
 */
@Data
@Entity
@Table(name = "tarot_card")
public class TarotCardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String cardId;

    @Column(nullable = false)
    private String nameEn;

    @Column(nullable = false)
    private String nameCn;

    @Column(nullable = false, length = 32)
    private String category;

    @Column(nullable = false)
    private Integer number;

    @Column(columnDefinition = "TEXT")
    private String uprightMeaning;

    @Column(columnDefinition = "TEXT")
    private String uprightMeaningCn;

    @Column(columnDefinition = "TEXT")
    private String reversedMeaning;

    @Column(columnDefinition = "TEXT")
    private String reversedMeaningCn;

    @Column(columnDefinition = "TEXT")
    private String imagePath;
}
