package cc.usong.tarot.repository;

import cc.usong.tarot.entity.TarotCardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 塔罗牌数据访问接口。
 */
@Repository
public interface TarotCardRepository extends JpaRepository<TarotCardEntity, Long> {

    List<TarotCardEntity> findByCategory(String category);
}
