package com.example.tarotreader.repository;

import com.example.tarotreader.model.AccessToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 访问口令数据访问接口。
 * @author dehua
 */
@Repository
public interface AccessTokenRepository extends JpaRepository<AccessToken, Long> {

    /**
     * 根据口令字符串查找
     */
    Optional<AccessToken> findByToken(String token);

    /**
     * 根据口令和状态查找（只查找启用的口令）
     */
    Optional<AccessToken> findByTokenAndStatus(String token, Integer status);

    /**
     * 原子操作：减少剩余次数（只有当剩余次数大于0时才执行）
     * @return 受影响的行数，1表示成功，0表示失败（次数不足或口令不存在）
     */
    @Modifying
    @Query("UPDATE AccessToken a SET a.remainingCount = a.remainingCount - 1 WHERE a.token = :token AND a.remainingCount > 0 AND a.status = 1")
    int decrementRemainingCount(@Param("token") String token);
}
