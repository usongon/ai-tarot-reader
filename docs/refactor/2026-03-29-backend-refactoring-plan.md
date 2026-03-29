# AI Tarot Reader 后端重构实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 对全部后端模块执行渐进式重构，实现严格分层、代码规范化、WebFlux SSE改造、Deck数据迁移MySQL。

**Architecture:** 4阶段推进——基础设施层 → 数据层 → 服务层 → 表现层+骨架服务+Gateway。每阶段完成后可独立编译运行。

**Tech Stack:** Java 21, Spring Boot 3.5.3, Spring WebFlux, Spring Data JPA, Flyway, DashScope SDK, Lombok

---

## 阶段一：基础设施层

### Task 1: 父 POM 添加新依赖管理

**Files:**
- Modify: `pom.xml` (parent)

- [ ] **Step 1: 在父 POM `<properties>` 中新增 Flyway 版本属性**

在 `<lunar.version>1.7.7</lunar.version>` 之后添加：

```xml
<flyway.version>11.8.0</flyway.version>
<flyway-mysql.version>11.8.0</flyway-mysql.version>
```

- [ ] **Step 2: 在父 POM `<dependencyManagement>` 中添加 Flyway 声明**

在 `<artifactId>lunar</artifactId>` 的 `</dependency>` 之后添加：

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
    <version>${flyway.version}</version>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-mysql</artifactId>
    <version>${flyway-mysql.version}</version>
</dependency>
```

- [ ] **Step 3: 验证父 POM 编译通过**

Run: `./mvnw install -N -DskipTests`
Expected: BUILD SUCCESS

- [ ] **Step 4: Commit**

```bash
git add pom.xml
git commit -m "build: 父POM添加Flyway依赖管理"
```

---

### Task 2: common 模块重构——异常体系

**Files:**
- Modify: `common/pom.xml`
- Create: `common/src/main/java/cc/usong/common/enums/ResultCode.java`
- Create: `common/src/main/java/cc/usong/common/exception/BusinessException.java`
- Create: `common/src/main/java/cc/usong/common/exception/TokenInvalidException.java`
- Create: `common/src/main/java/cc/usong/common/exception/RateLimitExceededException.java`

- [ ] **Step 1: common/pom.xml 添加 Lombok 依赖**

在 `<dependencies>` 中 `spring-boot-starter-web` 之后添加：

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

- [ ] **Step 2: 创建 ResultCode 枚举**

```java
package cc.usong.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 统一业务状态码枚举。
 */
@Getter
@AllArgsConstructor
public enum ResultCode {

    SUCCESS(200, "操作成功"),
    PARAM_ERROR(400, "参数错误"),
    TOKEN_INVALID(401, "Token无效或已过期"),
    RATE_LIMITED(429, "请求过于频繁"),
    SERVER_ERROR(500, "服务器内部错误");

    private final int code;
    private final String message;
}
```

- [ ] **Step 3: 创建 BusinessException 基类**

```java
package cc.usong.common.exception;

import cc.usong.common.enums.ResultCode;
import lombok.Getter;

/**
 * 业务异常基类。
 */
@Getter
public class BusinessException extends RuntimeException {

    private final ResultCode resultCode;

    public BusinessException(ResultCode resultCode) {
        super(resultCode.getMessage());
        this.resultCode = resultCode;
    }

    public BusinessException(ResultCode resultCode, String message) {
        super(message);
        this.resultCode = resultCode;
    }
}
```

- [ ] **Step 4: 创建 TokenInvalidException**

```java
package cc.usong.common.exception;

import cc.usong.common.enums.ResultCode;

/**
 * Token无效或已过期异常。
 */
public class TokenInvalidException extends BusinessException {

    public TokenInvalidException() {
        super(ResultCode.TOKEN_INVALID);
    }

    public TokenInvalidException(String message) {
        super(ResultCode.TOKEN_INVALID, message);
    }
}
```

- [ ] **Step 5: 创建 RateLimitExceededException**

```java
package cc.usong.common.exception;

import cc.usong.common.enums.ResultCode;

/**
 * 限流异常。
 */
public class RateLimitExceededException extends BusinessException {

    public RateLimitExceededException() {
        super(ResultCode.RATE_LIMITED);
    }

    public RateLimitExceededException(String message) {
        super(ResultCode.RATE_LIMITED, message);
    }
}
```

- [ ] **Step 6: 验证 common 模块编译**

Run: `./mvnw install -pl common -DskipTests`
Expected: BUILD SUCCESS

- [ ] **Step 7: Commit**

```bash
git add common/
git commit -m "feat(common): 重构common模块，新增ResultCode枚举和统一异常体系"
```

---

### Task 3: common 模块重构——Result 响应包装

**Files:**
- Modify: `common/src/main/java/cc/usong/common/model/Result.java`

- [ ] **Step 1: 重写 Result.java**

```java
package cc.usong.common.model;

import cc.usong.common.enums.ResultCode;
import lombok.Data;

import java.io.Serializable;

/**
 * 统一 API 响应包装类。
 */
@Data
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer code;
    private String message;
    private T data;

    public static <T> Result<T> success() {
        return success(null);
    }

    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(ResultCode.SUCCESS.getCode());
        result.setMessage(ResultCode.SUCCESS.getMessage());
        result.setData(data);
        return result;
    }

    public static <T> Result<T> fail(ResultCode resultCode) {
        Result<T> result = new Result<>();
        result.setCode(resultCode.getCode());
        result.setMessage(resultCode.getMessage());
        return result;
    }

    public static <T> Result<T> fail(ResultCode resultCode, String message) {
        Result<T> result = new Result<>();
        result.setCode(resultCode.getCode());
        result.setMessage(message);
        return result;
    }
}
```

- [ ] **Step 2: 验证 common 模块编译**

Run: `./mvnw install -pl common -DskipTests`
Expected: BUILD SUCCESS

- [ ] **Step 3: Commit**

```bash
git add common/src/main/java/cc/usong/common/model/Result.java
git commit -m "refactor(common): 重构Result为标准响应包装，关联ResultCode枚举"
```

---

### Task 4: tarot-service 添加新依赖 + 全局异常处理器

**Files:**
- Modify: `tarot-service/pom.xml`
- Create: `tarot-service/src/main/java/cc/usong/tarot/config/GlobalExceptionHandler.java`

- [ ] **Step 1: tarot-service/pom.xml 添加新依赖**

在 `<dependencies>` 中 `spring-boot-starter-web` 之后添加：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-mysql</artifactId>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

- [ ] **Step 2: 创建 GlobalExceptionHandler**

```java
package cc.usong.tarot.config;

import cc.usong.common.enums.ResultCode;
import cc.usong.common.exception.BusinessException;
import cc.usong.common.model.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器。
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .reduce((a, b) -> a + "; " + b)
                .orElse("参数校验失败");
        log.warn("参数校验失败: {}", message);
        return Result.fail(ResultCode.PARAM_ERROR, message);
    }

    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.OK)
    public Result<Void> handleBusiness(BusinessException e) {
        log.warn("业务异常: {}", e.getMessage());
        return Result.fail(e.getResultCode(), e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<Void> handleException(Exception e) {
        log.error("未预期的异常", e);
        return Result.fail(ResultCode.SERVER_ERROR);
    }
}
```

- [ ] **Step 3: 验证编译**

Run: `./mvnw compile -pl tarot-service`
Expected: BUILD SUCCESS（可能有 import 警告，阶段二会修复）

- [ ] **Step 4: Commit**

```bash
git add tarot-service/pom.xml tarot-service/src/main/java/cc/usong/tarot/config/GlobalExceptionHandler.java
git commit -m "feat(tarot-service): 添加webflux/validation/flyway依赖和全局异常处理器"
```

---

## 阶段二：数据层

### Task 5: 创建 enums 包

**Files:**
- Create: `tarot-service/src/main/java/cc/usong/tarot/enums/Gender.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/enums/ShiChen.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/enums/Direction.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/enums/CardCategory.java`

- [ ] **Step 1: 创建 Gender 枚举**

```java
package cc.usong.tarot.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 性别枚举。
 */
@Getter
@AllArgsConstructor
public enum Gender {

    MALE("male", "男"),
    FEMALE("female", "女");

    private final String code;
    private final String label;

    public static Gender fromCode(String code) {
        for (Gender g : values()) {
            if (g.code.equalsIgnoreCase(code)) {
                return g;
            }
        }
        throw new IllegalArgumentException("无效的性别代码: " + code);
    }
}
```

- [ ] **Step 2: 创建 ShiChen 枚举**

```java
package cc.usong.tarot.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 时辰枚举。
 */
@Getter
@AllArgsConstructor
public enum ShiChen {

    ZI("zi", "子", 0),
    CHOU("chou", "丑", 2),
    YIN("yin", "寅", 4),
    MAO("mao", "卯", 6),
    CHEN("chen", "辰", 8),
    SI("si", "巳", 10),
    WU("wu", "午", 12),
    WEI("wei", "未", 14),
    SHEN("shen", "申", 16),
    YOU("you", "酉", 18),
    XU("xu", "戌", 20),
    HAI("hai", "亥", 22),
    UNKNOWN("unknown", "未知", 12);

    private final String code;
    private final String diZhi;
    private final int hour;

    public static ShiChen fromCode(String code) {
        if (code == null) {
            return UNKNOWN;
        }
        for (ShiChen sc : values()) {
            if (sc.code.equalsIgnoreCase(code)) {
                return sc;
            }
        }
        return UNKNOWN;
    }
}
```

- [ ] **Step 3: 创建 Direction 枚举**

```java
package cc.usong.tarot.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 牌方向枚举（正位/逆位）。
 */
@Getter
@AllArgsConstructor
public enum Direction {

    UPRIGHT("upright", "正位"),
    REVERSED("reversed", "逆位");

    private final String code;
    private final String label;
}
```

- [ ] **Step 4: 创建 CardCategory 枚举**

```java
package cc.usong.tarot.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 塔罗牌类别枚举。
 */
@Getter
@AllArgsConstructor
public enum CardCategory {

    MAJOR("major", "大阿尔卡纳"),
    WANDS("wands", "权杖"),
    CUPS("cups", "圣杯"),
    SWORDS("swords", "宝剑"),
    PENTACLES("pentacles", "星币");

    private final String code;
    private final String label;
}
```

- [ ] **Step 5: Commit**

```bash
git add tarot-service/src/main/java/cc/usong/tarot/enums/
git commit -m "feat(tarot-service): 新增Gender/ShiChen/Direction/CardCategory枚举"
```

---

### Task 6: 创建 constants 包

**Files:**
- Create: `tarot-service/src/main/java/cc/usong/tarot/constants/TarotConstants.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/constants/BaziConstants.java`

- [ ] **Step 1: 创建 TarotConstants**

```java
package cc.usong.tarot.constants;

/**
 * 塔罗牌相关常量。
 */
public final class TarotConstants {

    private TarotConstants() {
    }

    public static final long SSE_TIMEOUT_MS = 180_000L;
    public static final int DECK_SIZE = 78;
    public static final String FORBIDDEN_PREFIX = "[FORBIDDEN]";
    public static final String ERROR_PREFIX = "[ERROR]";
}
```

- [ ] **Step 2: 创建 BaziConstants**

从 BaziService 中提取所有 static Map 到此类：

```java
package cc.usong.tarot.constants;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * 八字命理相关常量。
 */
public final class BaziConstants {

    private BaziConstants() {
    }

    /** 时辰代码 → 地支 */
    public static final Map<String, String> SHI_CHEN_TO_DI_ZHI;
    /** 地支 → 小时 */
    public static final Map<String, Integer> DI_ZHI_TO_HOUR;
    /** 五行相生：木→火, 火→土, 土→金, 金→水, 水→木 */
    public static final Map<String, String> WU_XING_GENERATES;
    /** 五行相克：木→土, 土→水, 水→火, 火→金, 金→木 */
    public static final Map<String, String> WU_XING_CONTROLS;
    /** 五行被生：火←木, 土←火, 金←土, 水←金, 木←水 */
    public static final Map<String, String> WU_XING_GENERATED_BY;
    /** 阳天干 */
    public static final String[] YANG_GAN = {"甲", "丙", "戊", "庚", "壬"};

    static {
        Map<String, String> scDz = new HashMap<>();
        scDz.put("zi", "子");   scDz.put("chou", "丑"); scDz.put("yin", "寅");
        scDz.put("mao", "卯");  scDz.put("chen", "辰"); scDz.put("si", "巳");
        scDz.put("wu", "午");   scDz.put("wei", "未");  scDz.put("shen", "申");
        scDz.put("you", "酉");  scDz.put("xu", "戌");   scDz.put("hai", "亥");
        SHI_CHEN_TO_DI_ZHI = Collections.unmodifiableMap(scDz);

        Map<String, Integer> dzHour = new HashMap<>();
        dzHour.put("子", 0);  dzHour.put("丑", 2);  dzHour.put("寅", 4);
        dzHour.put("卯", 6);  dzHour.put("辰", 8);  dzHour.put("巳", 10);
        dzHour.put("午", 12); dzHour.put("未", 14); dzHour.put("申", 16);
        dzHour.put("酉", 18); dzHour.put("戌", 20); dzHour.put("亥", 22);
        DI_ZHI_TO_HOUR = Collections.unmodifiableMap(dzHour);

        Map<String, String> generates = new HashMap<>();
        generates.put("木", "火"); generates.put("火", "土");
        generates.put("土", "金"); generates.put("金", "水");
        generates.put("水", "木");
        WU_XING_GENERATES = Collections.unmodifiableMap(generates);

        Map<String, String> controls = new HashMap<>();
        controls.put("木", "土"); controls.put("土", "水");
        controls.put("水", "火"); controls.put("火", "金");
        controls.put("金", "木");
        WU_XING_CONTROLS = Collections.unmodifiableMap(controls);

        Map<String, String> generatedBy = new HashMap<>();
        generatedBy.put("火", "木"); generatedBy.put("土", "火");
        generatedBy.put("金", "土"); generatedBy.put("水", "金");
        generatedBy.put("木", "水");
        WU_XING_GENERATED_BY = Collections.unmodifiableMap(generatedBy);
    }
}
```

- [ ] **Step 3: Commit**

```bash
git add tarot-service/src/main/java/cc/usong/tarot/constants/
git commit -m "feat(tarot-service): 提取TarotConstants和BaziConstants常量类"
```

---

### Task 7: 创建 entity 包，迁移 AccessToken

**Files:**
- Create: `tarot-service/src/main/java/cc/usong/tarot/entity/AccessToken.java`
- Delete: `tarot-service/src/main/java/cc/usong/tarot/model/AccessToken.java`

- [ ] **Step 1: 创建 entity/AccessToken.java**

将 `model/AccessToken.java` 移到 `entity` 包，添加 Lombok `@Data` 简化：

```java
package cc.usong.tarot.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 访问口令实体。
 */
@Data
@Entity
@Table(name = "access_token")
public class AccessToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "token", nullable = false, unique = true, length = 64)
    private String token;

    @Column(name = "remaining_count", nullable = false)
    private Integer remainingCount;

    @Column(name = "total_count", nullable = false)
    private Integer totalCount;

    @Column(name = "status", nullable = false)
    private Integer status = 1;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public boolean isActive() {
        return status != null && status == 1;
    }
}
```

- [ ] **Step 2: 更新 AccessTokenRepository 的 import**

修改 `repository/AccessTokenRepository.java` 的 import：

```java
import cc.usong.tarot.entity.AccessToken;  // 改为新包路径
```

- [ ] **Step 3: 删除旧的 model/AccessToken.java**

```bash
rm tarot-service/src/main/java/cc/usong/tarot/model/AccessToken.java
```

- [ ] **Step 4: 验证编译**

Run: `./mvnw compile -pl tarot-service`
Expected: BUILD SUCCESS

- [ ] **Step 5: Commit**

```bash
git add tarot-service/src/main/java/cc/usong/tarot/entity/ tarot-service/src/main/java/cc/usong/tarot/repository/ tarot-service/src/main/java/cc/usong/tarot/model/AccessToken.java
git commit -m "refactor(tarot-service): AccessToken迁移至entity包，使用Lombok简化"
```

---

### Task 8: 创建 TarotCardEntity + Flyway 迁移

**Files:**
- Create: `tarot-service/src/main/java/cc/usong/tarot/entity/TarotCardEntity.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/repository/TarotCardRepository.java`
- Create: `tarot-service/src/main/resources/db/migration/V1__create_tarot_card_table.sql`
- Create: `tarot-service/src/main/resources/db/migration/V2__init_tarot_card_data.sql`

- [ ] **Step 1: 创建 TarotCardEntity**

```java
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
```

- [ ] **Step 2: 创建 TarotCardRepository**

```java
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
```

- [ ] **Step 3: 创建 V1 建表脚本**

`tarot-service/src/main/resources/db/migration/V1__create_tarot_card_table.sql`：

```sql
CREATE TABLE IF NOT EXISTS tarot_card (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    card_id     VARCHAR(64)  NOT NULL UNIQUE,
    name_en     VARCHAR(128) NOT NULL,
    name_cn     VARCHAR(128) NOT NULL,
    category    VARCHAR(32)  NOT NULL COMMENT 'MAJOR/WANDS/CUPS/SWORDS/PENTACLES',
    number      INT          NOT NULL,
    upright_meaning     TEXT,
    upright_meaning_cn  TEXT,
    reversed_meaning    TEXT,
    reversed_meaning_cn TEXT,
    image_path          TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

- [ ] **Step 4: 创建 V2 数据初始化脚本**

`tarot-service/src/main/resources/db/migration/V2__init_tarot_card_data.sql`：

根据 Deck.java 中的78张牌数据生成 INSERT 语句。每张牌需生成对应的 card_id（英文小写+下划线格式）、category、number。

card_id 编码规则：
- 大阿尔卡纳：`fool`, `magician`, `high_priestess`, ... `world`
- 小阿尔卡纳花色牌：`wands_01`, `wands_02`, ... `wands_king`，`cups_01`, ..., `swords_01`, ..., `pentacles_01`, ...

```sql
-- Major Arcana (22 cards, number 0-21)
-- 注意：upright_meaning_cn 和 reversed_meaning_cn 分别存放正位/逆位的中文含义
INSERT INTO tarot_card (card_id, name_en, name_cn, category, number, upright_meaning, upright_meaning_cn, reversed_meaning, reversed_meaning_cn, image_path) VALUES
('fool', 'The Fool', '愚人', 'MAJOR', 0, 'Beginnings, innocence, spontaneity, a free spirit', '开始、纯真、顺其自然、自由的精神', 'Naivety, foolishness, recklessness, risk-taking', '天真、愚蠢、鲁莽、冒险', 'https://www.sacred-texts.com/tarot/pkt/img/ar00.jpg'),
('magician', 'The Magician', '魔术师', 'MAJOR', 1, 'Manifestation, resourcefulness, power, inspired action', '显现、足智多谋、力量、受启发的行动', 'Manipulation, poor planning, untapped talents', '操控、计划不周、未开发的才能', 'https://www.sacred-texts.com/tarot/pkt/img/ar01.jpg'),
('high_priestess', 'The High Priestess', '女祭司', 'MAJOR', 2, 'Intuition, sacred knowledge, divine feminine, the subconscious mind', '直觉、神圣知识、神圣女性、潜意识', 'Secrets, disconnected from intuition, withdrawal and silence', '秘密、与直觉脱节、退缩和沉默', 'https://www.sacred-texts.com/tarot/pkt/img/ar02.jpg'),
('empress', 'The Empress', '女皇', 'MAJOR', 3, 'Femininity, beauty, nature, nurturing, abundance', '女性气质、美丽、自然、养育、富足', 'Creative block, dependence on others', '创意受阻、依赖他人', 'https://www.sacred-texts.com/tarot/pkt/img/ar03.jpg'),
('emperor', 'The Emperor', '皇帝', 'MAJOR', 4, 'Authority, establishment, structure, a father figure', '权威、建立、结构、父亲形象', 'Domination, excessive control, lack of discipline, inflexibility', '统治、过度控制、缺乏纪律、僵化', 'https://www.sacred-texts.com/tarot/pkt/img/ar04.jpg'),
('hierophant', 'The Hierophant', '教皇', 'MAJOR', 5, 'Spiritual wisdom, religious beliefs, conformity, tradition, institutions', '精神智慧、宗教信仰、整合、传统、制度', 'Personal beliefs, freedom, challenging the status quo', '个人信仰、自由、挑战现状', 'https://www.sacred-texts.com/tarot/pkt/img/ar05.jpg'),
('lovers', 'The Lovers', '恋人', 'MAJOR', 6, 'Love, harmony, relationships, values alignment, choices', '爱、和谐、关系、价值观一致、选择', 'Self-love, disharmony, imbalance, misalignment of values', '自爱、不和谐、失衡、价值观错位', 'https://www.sacred-texts.com/tarot/pkt/img/ar06.jpg'),
('chariot', 'The Chariot', '战车', 'MAJOR', 7, 'Control, willpower, victory, assertion, determination', '控制、意志力、胜利、主张、决心', 'Self-discipline, opposition, lack of direction', '自律、对立、缺乏方向', 'https://www.sacred-texts.com/tarot/pkt/img/ar07.jpg'),
('strength', 'Strength', '力量', 'MAJOR', 8, 'Strength, courage, persuasion, influence, compassion', '力量、勇气、说服、影响、同情', 'Inner strength, self-doubt, low energy, raw emotion', '内在力量、自我怀疑、精力不足、原始情感', 'https://www.sacred-texts.com/tarot/pkt/img/ar08.jpg'),
('hermit', 'The Hermit', '隐士', 'MAJOR', 9, 'Soul-searching, introspection, being alone, inner guidance', '灵魂探索、反省、独处、内在指引', 'Isolation, loneliness, withdrawal', '孤立、孤独、退缩', 'https://www.sacred-texts.com/tarot/pkt/img/ar09.jpg'),
('wheel_of_fortune', 'Wheel of Fortune', '命运之轮', 'MAJOR', 10, 'Good luck, karma, life cycles, destiny, a turning point', '好运、业力、生命周期、命运、转折点', 'Bad luck, resistance to change, breaking cycles', '坏运气、抗拒改变、打破循环', 'https://www.sacred-texts.com/tarot/pkt/img/ar10.jpg'),
('justice', 'Justice', '正义', 'MAJOR', 11, 'Justice, fairness, truth, cause and effect, law', '正义、公平、真理、因果、法律', 'Unfairness, lack of accountability, dishonesty', '不公、缺乏责任、不诚实', 'https://www.sacred-texts.com/tarot/pkt/img/ar11.jpg'),
('hanged_man', 'The Hanged Man', '倒吊人', 'MAJOR', 12, 'Pause, surrender, letting go, new perspectives', '暂停、投降、放手、新视角', 'Delays, resistance, stalling, indecision', '延迟、抵抗、停滞、优柔寡断', 'https://www.sacred-texts.com/tarot/pkt/img/ar12.jpg'),
('death', 'Death', '死神', 'MAJOR', 13, 'Endings, change, transformation, transition', '结束、改变、转变、过渡', 'Resistance to change, personal transformation, inner purging', '抗拒改变、个人转变、内在清洗', 'https://www.sacred-texts.com/tarot/pkt/img/ar13.jpg'),
('temperance', 'Temperance', '节制', 'MAJOR', 14, 'Balance, moderation, patience, purpose', '平衡、适度、耐心、目的', 'Imbalance, excess, self-healing, re-alignment', '失衡、过度、自我疗愈、重新调整', 'https://www.sacred-texts.com/tarot/pkt/img/ar14.jpg'),
('devil', 'The Devil', '恶魔', 'MAJOR', 15, 'Shadow self, attachment, addiction, restriction, sexuality', '阴暗面、依恋、成瘾、限制、性', 'Releasing limiting beliefs, exploring dark thoughts, detachment', '释放限制性信念、探索黑暗思想、超脱', 'https://www.sacred-texts.com/tarot/pkt/img/ar15.jpg'),
('tower', 'The Tower', '塔', 'MAJOR', 16, 'Sudden change, upheaval, chaos, revelation, awakening', '突然的变化、剧变、混乱、启示、觉醒', 'Personal transformation, fear of change, averting disaster', '个人转变、害怕改变、避免灾难', 'https://www.sacred-texts.com/tarot/pkt/img/ar16.jpg'),
('star', 'The Star', '星星', 'MAJOR', 17, 'Hope, faith, purpose, renewal, spirituality', '希望、信念、目的、更新、灵性', 'Lack of faith, despair, self-trust, disconnection', '缺乏信念、绝望、自我信任、脱节', 'https://www.sacred-texts.com/tarot/pkt/img/ar17.jpg'),
('moon', 'The Moon', '月亮', 'MAJOR', 18, 'Illusion, fear, anxiety, subconscious, intuition', '幻觉、恐惧、焦虑、潜意识、直觉', 'Release of fear, repressed emotion, inner confusion', '释放恐惧、压抑的情感、内心混乱', 'https://www.sacred-texts.com/tarot/pkt/img/ar18.jpg'),
('sun', 'The Sun', '太阳', 'MAJOR', 19, 'Positivity, fun, warmth, success, vitality', '积极、乐趣、温暖、成功、活力', 'Inner child, feeling down, overly optimistic', '内在小孩、情绪低落、过于乐观', 'https://www.sacred-texts.com/tarot/pkt/img/ar19.jpg'),
('judgement', 'Judgement', '审判', 'MAJOR', 20, 'Judgement, rebirth, inner calling, absolution', '审判、重生、内在召唤、赦免', 'Self-doubt, inner critic, ignoring the call', '自我怀疑、内心批判、忽视召唤', 'https://www.sacred-texts.com/tarot/pkt/img/ar20.jpg'),
('world', 'The World', '世界', 'MAJOR', 21, 'Completion, integration, accomplishment, travel', '完成、整合、成就、旅行', 'Seeking personal closure, short-cuts, delays', '寻求个人了结、走捷径、延迟', 'https://www.sacred-texts.com/tarot/pkt/img/ar21.jpg');
```

（小阿尔卡纳的 INSERT 语句按同样格式继续编写，分为 WANDS、CUPS、SWORDS、PENTACLES 四组各14张。具体数据从 Deck.java 逐行提取。）

> **注意**：V2 脚本包含全部78张牌的 INSERT。由于篇幅限制此处只展示了 Major Arcana 部分。执行时需补全全部78条记录。

- [ ] **Step 5: 在 application.properties 中添加 Flyway 配置**

追加到 `tarot-service/src/main/resources/application.properties`：

```properties
# Flyway 配置
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration
```

- [ ] **Step 6: Commit**

```bash
git add tarot-service/src/main/java/cc/usong/tarot/entity/TarotCardEntity.java tarot-service/src/main/java/cc/usong/tarot/repository/TarotCardRepository.java tarot-service/src/main/resources/db/ tarot-service/src/main/resources/application.properties
git commit -m "feat(tarot-service): 新增TarotCardEntity和Flyway数据库迁移脚本"
```

---

### Task 9: 创建 DTO 体系（request + response）

**Files:**
- Create: `tarot-service/src/main/java/cc/usong/tarot/dto/request/DrawRequest.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/dto/request/InterpretRequest.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/dto/request/BaziRequest.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/dto/request/BaziInterpretRequest.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/dto/response/SpreadVO.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/dto/response/CardVO.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/dto/response/DrawResultVO.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/dto/response/BaziChartVO.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/dto/response/PillarVO.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/dto/response/WuXingStatsVO.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/dto/response/ShiShenRelationVO.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/dto/response/DaYunInfoVO.java`

- [ ] **Step 1: 创建 request/DrawRequest.java（带校验）**

```java
package cc.usong.tarot.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 抽牌请求 DTO。
 */
@Data
public class DrawRequest {

    @NotBlank(message = "牌阵ID不能为空")
    private String spreadId;
}
```

- [ ] **Step 2: 创建 request/InterpretRequest.java**

```java
package cc.usong.tarot.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;
import java.util.Map;

/**
 * 塔罗牌解读请求 DTO。
 */
@Data
public class InterpretRequest {

    @NotBlank(message = "Token不能为空")
    private String token;

    @NotBlank(message = "方向不能为空")
    private String direction;

    @NotBlank(message = "牌阵名称不能为空")
    private String spreadName;

    private List<Map<String, Object>> cards;
}
```

- [ ] **Step 3: 创建 request/BaziRequest.java**

```java
package cc.usong.tarot.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * 八字排盘请求 DTO。
 */
@Data
public class BaziRequest {

    @NotBlank(message = "出生日期不能为空")
    @Pattern(regexp = "\\d{4}-\\d{1,2}-\\d{1,2}", message = "日期格式应为YYYY-M-D")
    private String birthDate;

    @NotNull(message = "是否农历不能为空")
    private Boolean isLunar;

    @NotBlank(message = "性别不能为空")
    private String gender;

    private String shiChen;

    @NotBlank(message = "Token不能为空")
    private String token;
}
```

- [ ] **Step 4: 创建 request/BaziInterpretRequest.java**

```java
package cc.usong.tarot.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

/**
 * 八字AI解读请求 DTO。
 */
@Data
public class BaziInterpretRequest {

    @NotBlank(message = "Token不能为空")
    private String token;

    @NotNull(message = "命盘数据不能为空")
    private Map<String, Object> chart;
}
```

- [ ] **Step 5: 创建 response/SpreadVO.java**

```java
package cc.usong.tarot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 牌阵展示 VO。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpreadVO {

    private String id;
    private String name;
    private String nameChinese;
    private String description;
    private String descriptionChinese;
    private int numberOfCards;
}
```

- [ ] **Step 6: 创建 response/CardVO.java**

```java
package cc.usong.tarot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 塔罗牌展示 VO。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardVO {

    private String name;
    private String nameChinese;
    private String uprightMeaning;
    private String uprightMeaningChinese;
    private String reversedMeaning;
    private String reversedMeaningChinese;
    private boolean reversed;
}
```

- [ ] **Step 7: 创建 response/DrawResultVO.java**

```java
package cc.usong.tarot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 抽牌结果 VO。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DrawResultVO {

    private List<CardVO> cards;
    private SpreadVO spread;
}
```

- [ ] **Step 8: 创建 response/PillarVO.java**

```java
package cc.usong.tarot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 天干地支柱 VO。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PillarVO {

    private String tianGan;
    private String diZhi;
    private String tianGanWuXing;
    private String diZhiWuXing;
    private String yinYang;
    private String displayText;
}
```

- [ ] **Step 9: 创建 response/WuXingStatsVO.java**

```java
package cc.usong.tarot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 五行统计 VO。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WuXingStatsVO {

    private int jin;
    private int mu;
    private int shui;
    private int huo;
    private int tu;
    private String dayMasterWuXing;
    private String strength;
}
```

- [ ] **Step 10: 创建 response/ShiShenRelationVO.java**

```java
package cc.usong.tarot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 十神关系 VO。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShiShenRelationVO {

    private String position;
    private String tianGan;
    private String shiShen;
    private String wuXing;
}
```

- [ ] **Step 11: 创建 response/DaYunInfoVO.java**

```java
package cc.usong.tarot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 大运信息 VO。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DaYunInfoVO {

    private int startAge;
    private int endAge;
    private String tianGan;
    private String diZhi;
    private String displayText;
    private boolean current;
}
```

- [ ] **Step 12: 创建 response/BaziChartVO.java**

```java
package cc.usong.tarot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 八字命盘 VO。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaziChartVO {

    private String solarDate;
    private String lunarDate;
    private String gender;
    private String genderText;
    private PillarVO yearPillar;
    private PillarVO monthPillar;
    private PillarVO dayPillar;
    private PillarVO hourPillar;
    private WuXingStatsVO wuXingStats;
    private List<ShiShenRelationVO> shiShenList;
    private List<DaYunInfoVO> daYunList;
    private DaYunInfoVO currentDaYun;
    private boolean hourPillarMissing;
}
```

- [ ] **Step 13: Commit**

```bash
git add tarot-service/src/main/java/cc/usong/tarot/dto/
git commit -m "feat(tarot-service): 创建DTO体系，request带校验注解，response为VO"
```

---

### Task 10: 创建 Converter 类

**Files:**
- Create: `tarot-service/src/main/java/cc/usong/tarot/converter/TarotCardConverter.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/converter/BaziConverter.java`

- [ ] **Step 1: 创建 TarotCardConverter**

```java
package cc.usong.tarot.converter;

import cc.usong.tarot.dto.response.CardVO;
import cc.usong.tarot.dto.response.SpreadVO;
import cc.usong.tarot.entity.TarotCardEntity;
import cc.usong.tarot.model.TarotSpread;

import java.util.List;

/**
 * 塔罗牌 Entity ↔ DTO 转换器。
 */
public final class TarotCardConverter {

    private TarotCardConverter() {
    }

    public static CardVO toCardVO(TarotCardEntity entity, boolean reversed) {
        CardVO vo = new CardVO();
        vo.setName(entity.getNameEn());
        vo.setNameChinese(entity.getNameCn());
        vo.setUprightMeaning(entity.getUprightMeaning());
        vo.setUprightMeaningChinese(entity.getDescription());
        vo.setReversedMeaning(entity.getReversedMeaning());
        vo.setReversed(true);
        return vo;
    }

    public static List<CardVO> toCardVOList(List<TarotCardEntity> entities) {
        return entities.stream()
                .map(e -> toCardVO(e, false))
                .toList();
    }

    public static SpreadVO toSpreadVO(TarotSpread spread) {
        return new SpreadVO(
                spread.getId(),
                spread.getName(),
                spread.getNameChinese(),
                spread.getDescription(),
                spread.getDescriptionChinese(),
                spread.getNumberOfCards()
        );
    }

    public static List<SpreadVO> toSpreadVOList(List<TarotSpread> spreads) {
        return spreads.stream()
                .map(TarotCardConverter::toSpreadVO)
                .toList();
    }
}
```

- [ ] **Step 2: 创建 BaziConverter**

```java
package cc.usong.tarot.converter;

import cc.usong.tarot.dto.response.*;
import cc.usong.tarot.model.bazi.*;

import java.util.List;

/**
 * 八字领域模型 → VO 转换器。
 */
public final class BaziConverter {

    private BaziConverter() {
    }

    public static PillarVO toPillarVO(Pillar pillar) {
        if (pillar == null) {
            return null;
        }
        return new PillarVO(
                pillar.getTianGan(),
                pillar.getDiZhi(),
                pillar.getTianGanWuXing(),
                pillar.getDiZhiWuXing(),
                pillar.getYinYang(),
                pillar.getDisplayText()
        );
    }

    public static WuXingStatsVO toWuXingStatsVO(WuXingStats stats) {
        if (stats == null) {
            return null;
        }
        return new WuXingStatsVO(
                stats.getJin(),
                stats.getMu(),
                stats.getShui(),
                stats.getHuo(),
                stats.getTu(),
                stats.getDayMasterWuXing(),
                stats.getStrength()
        );
    }

    public static ShiShenRelationVO toShiShenRelationVO(ShiShenRelation relation) {
        if (relation == null) {
            return null;
        }
        return new ShiShenRelationVO(
                relation.getPosition(),
                relation.getTianGan(),
                relation.getShiShen(),
                relation.getWuXing()
        );
    }

    public static DaYunInfoVO toDaYunInfoVO(DaYunInfo info) {
        if (info == null) {
            return null;
        }
        return new DaYunInfoVO(
                info.getStartAge(),
                info.getEndAge(),
                info.getTianGan(),
                info.getDiZhi(),
                info.getDisplayText(),
                info.isCurrent()
        );
    }

    public static BaziChartVO toBaziChartVO(BaziChart chart) {
        if (chart == null) {
            return null;
        }
        List<ShiShenRelationVO> shiShenVOs = chart.getShiShenList() == null
                ? List.of()
                : chart.getShiShenList().stream().map(BaziConverter::toShiShenRelationVO).toList();

        List<DaYunInfoVO> daYunVOs = chart.getDaYunList() == null
                ? List.of()
                : chart.getDaYunList().stream().map(BaziConverter::toDaYunInfoVO).toList();

        return new BaziChartVO(
                chart.getSolarDate(),
                chart.getLunarDate(),
                chart.getGender(),
                chart.getGenderText(),
                toPillarVO(chart.getYearPillar()),
                toPillarVO(chart.getMonthPillar()),
                toPillarVO(chart.getDayPillar()),
                toPillarVO(chart.getHourPillar()),
                toWuXingStatsVO(chart.getWuXingStats()),
                shiShenVOs,
                daYunVOs,
                toDaYunInfoVO(chart.getCurrentDaYun()),
                chart.isHourPillarMissing()
        );
    }
}
```

- [ ] **Step 3: Commit**

```bash
git add tarot-service/src/main/java/cc/usong/tarot/converter/
git commit -m "feat(tarot-service): 新增TarotCardConverter和BaziConverter"
```

---

### Task 11: 清理死代码

**Files:**
- Delete: `tarot-service/src/main/java/cc/usong/tarot/service/PersistenceService.java`
- Delete: `tarot-service/src/main/java/cc/usong/tarot/service/RateLimitExceededException.java`

- [ ] **Step 1: 删除 PersistenceService**

```bash
rm tarot-service/src/main/java/cc/usong/tarot/service/PersistenceService.java
```

- [ ] **Step 2: 删除旧的 RateLimitExceededException（已移至 common）**

```bash
rm tarot-service/src/main/java/cc/usong/tarot/service/RateLimitExceededException.java
```

- [ ] **Step 3: 验证编译**

Run: `./mvnw compile -pl tarot-service`
Expected: 编译可能报错（TarotService 引用了 PersistenceService），将在 Task 12 修复

- [ ] **Step 4: Commit**

```bash
git add -u tarot-service/src/main/java/cc/usong/tarot/service/
git commit -m "refactor(tarot-service): 删除PersistenceService和旧RateLimitExceededException"
```

---

## 阶段三：服务层

### Task 12: 拆分 BaziService——WuXingService

**Files:**
- Create: `tarot-service/src/main/java/cc/usong/tarot/service/bazi/WuXingService.java`

- [ ] **Step 1: 创建 WuXingService**

从 BaziService 中提取 `calculateWuXingStats`、`countWuXing`、`calculateStrength` 方法：

```java
package cc.usong.tarot.service.bazi;

import cc.usong.tarot.constants.BaziConstants;
import cc.usong.tarot.model.bazi.Pillar;
import cc.usong.tarot.model.bazi.WuXingStats;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 五行统计服务。
 */
@Service
public class WuXingService {

    /**
     * 计算五行统计。
     */
    public WuXingStats analyze(Pillar yearPillar, Pillar monthPillar,
                                Pillar dayPillar, Pillar hourPillar,
                                boolean hourPillarMissing) {
        WuXingStats stats = new WuXingStats();
        Map<String, Integer> wuXingCount = initWuXingCount();

        countWuXing(yearPillar, wuXingCount);
        countWuXing(monthPillar, wuXingCount);
        countWuXing(dayPillar, wuXingCount);
        if (!hourPillarMissing && hourPillar != null) {
            countWuXing(hourPillar, wuXingCount);
        }

        stats.setJin(wuXingCount.get("金"));
        stats.setMu(wuXingCount.get("木"));
        stats.setShui(wuXingCount.get("水"));
        stats.setHuo(wuXingCount.get("火"));
        stats.setTu(wuXingCount.get("土"));

        String dayMasterWuXing = dayPillar.getTianGanWuXing();
        stats.setDayMasterWuXing(dayMasterWuXing);
        stats.setStrength(calculateStrength(wuXingCount, dayMasterWuXing));

        return stats;
    }

    private Map<String, Integer> initWuXingCount() {
        Map<String, Integer> map = new HashMap<>();
        map.put("金", 0);
        map.put("木", 0);
        map.put("水", 0);
        map.put("火", 0);
        map.put("土", 0);
        return map;
    }

    private void countWuXing(Pillar pillar, Map<String, Integer> wuXingCount) {
        if (pillar == null) {
            return;
        }
        String ganWuXing = pillar.getTianGanWuXing();
        String zhiWuXing = pillar.getDiZhiWuXing();
        if (ganWuXing != null) {
            wuXingCount.merge(ganWuXing, 1, Integer::sum);
        }
        if (zhiWuXing != null) {
            wuXingCount.merge(zhiWuXing, 1, Integer::sum);
        }
    }

    private String calculateStrength(Map<String, Integer> wuXingCount, String dayMasterWuXing) {
        int sameKind = wuXingCount.get(dayMasterWuXing);
        String generatedWuXing = BaziConstants.WU_XING_GENERATED_BY.get(dayMasterWuXing);
        if (generatedWuXing != null) {
            sameKind += wuXingCount.get(generatedWuXing);
        }
        return sameKind >= 4 ? "身强" : "身弱";
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add tarot-service/src/main/java/cc/usong/tarot/service/bazi/WuXingService.java
git commit -m "refactor(tarot-service): 从BaziService提取WuXingService"
```

---

### Task 13: 拆分 BaziService——ShiShenService

**Files:**
- Create: `tarot-service/src/main/java/cc/usong/tarot/service/bazi/ShiShenService.java`

- [ ] **Step 1: 创建 ShiShenService**

```java
package cc.usong.tarot.service.bazi;

import cc.usong.tarot.model.bazi.ShiShenRelation;
import com.nlf.calendar.EightChar;
import com.nlf.calendar.util.LunarUtil;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 十神关系计算服务。
 */
@Service
public class ShiShenService {

    /**
     * 计算十神关系。
     */
    public List<ShiShenRelation> analyze(EightChar eightChar, boolean hourPillarMissing) {
        List<ShiShenRelation> shiShenList = new ArrayList<>();
        String dayGan = eightChar.getDayGan();

        addShiShenRelation(shiShenList, "年柱", eightChar.getYearGan(), dayGan);
        addShiShenRelation(shiShenList, "月柱", eightChar.getMonthGan(), dayGan);

        if (!hourPillarMissing) {
            addShiShenRelation(shiShenList, "时柱", eightChar.getTimeGan(), dayGan);
        }

        addHiddenGanShiShen(shiShenList, "年支", eightChar.getYearZhi(), dayGan);
        addHiddenGanShiShen(shiShenList, "月支", eightChar.getMonthZhi(), dayGan);
        addHiddenGanShiShen(shiShenList, "日支", eightChar.getDayZhi(), dayGan);
        if (!hourPillarMissing) {
            addHiddenGanShiShen(shiShenList, "时支", eightChar.getTimeZhi(), dayGan);
        }

        return shiShenList;
    }

    private void addShiShenRelation(List<ShiShenRelation> list, String position,
                                     String gan, String dayGan) {
        if (gan.equals(dayGan)) {
            return;
        }
        ShiShenRelation relation = new ShiShenRelation();
        relation.setPosition(position);
        relation.setTianGan(gan);
        String shiShen = LunarUtil.SHI_SHEN.get(dayGan + gan);
        relation.setShiShen(shiShen != null ? shiShen : "");
        relation.setWuXing(LunarUtil.WU_XING_GAN.get(gan));
        list.add(relation);
    }

    private void addHiddenGanShiShen(List<ShiShenRelation> list, String position,
                                      String zhi, String dayGan) {
        List<String> hideGans = LunarUtil.ZHI_HIDE_GAN.get(zhi);
        if (hideGans == null || hideGans.isEmpty()) {
            return;
        }
        for (String hideGan : hideGans) {
            if (hideGan.equals(dayGan)) {
                continue;
            }
            ShiShenRelation relation = new ShiShenRelation();
            relation.setPosition(position + "藏干");
            relation.setTianGan(hideGan);
            String shiShen = LunarUtil.SHI_SHEN.get(dayGan + hideGan);
            relation.setShiShen(shiShen != null ? shiShen : "");
            relation.setWuXing(LunarUtil.WU_XING_GAN.get(hideGan));
            list.add(relation);
        }
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add tarot-service/src/main/java/cc/usong/tarot/service/bazi/ShiShenService.java
git commit -m "refactor(tarot-service): 从BaziService提取ShiShenService"
```

---

### Task 14: 拆分 BaziService——DaYunService

**Files:**
- Create: `tarot-service/src/main/java/cc/usong/tarot/service/bazi/DaYunService.java`

- [ ] **Step 1: 创建 DaYunService**

```java
package cc.usong.tarot.service.bazi;

import cc.usong.tarot.model.bazi.DaYunInfo;
import com.nlf.calendar.EightChar;
import com.nlf.calendar.eightchar.DaYun;
import com.nlf.calendar.eightchar.Yun;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

/**
 * 大运计算服务。
 */
@Service
public class DaYunService {

    /**
     * 计算大运列表。
     */
    public List<DaYunInfo> calculate(EightChar eightChar, String gender, String birthDate) {
        List<DaYunInfo> daYunList = new ArrayList<>();

        int genderValue = "male".equals(gender) ? 1 : 0;
        Yun yun = eightChar.getYun(genderValue);
        DaYun[] daYuns = yun.getDaYun();

        int currentAge = calculateCurrentAge(birthDate);

        for (DaYun daYun : daYuns) {
            if (daYun.getIndex() == 0) {
                continue;
            }

            DaYunInfo info = new DaYunInfo();
            info.setStartAge(daYun.getStartAge());
            info.setEndAge(daYun.getEndAge());

            String ganZhi = daYun.getGanZhi();
            if (ganZhi != null && ganZhi.length() >= 2) {
                info.setTianGan(ganZhi.substring(0, 1));
                info.setDiZhi(ganZhi.substring(1, 2));
                info.setDisplayText(ganZhi);
            }

            info.setCurrent(currentAge >= daYun.getStartAge() && currentAge <= daYun.getEndAge());
            daYunList.add(info);
        }

        return daYunList;
    }

    private int calculateCurrentAge(String birthDate) {
        String[] dateParts = birthDate.split("-");
        LocalDate birthLocalDate = LocalDate.of(
                Integer.parseInt(dateParts[0]),
                Integer.parseInt(dateParts[1]),
                Integer.parseInt(dateParts[2]));
        return Period.between(birthLocalDate, LocalDate.now()).getYears();
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add tarot-service/src/main/java/cc/usong/tarot/service/bazi/DaYunService.java
git commit -m "refactor(tarot-service): 从BaziService提取DaYunService"
```

---

### Task 15: 拆分 BaziService——BaziPromptBuilder + BaziAiService + BaziCalculationService

**Files:**
- Create: `tarot-service/src/main/java/cc/usong/tarot/service/bazi/BaziPromptBuilder.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/service/bazi/BaziAiService.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/service/bazi/BaziCalculationService.java`

- [ ] **Step 1: 创建 BaziPromptBuilder**

```java
package cc.usong.tarot.service.bazi;

import cc.usong.tarot.model.bazi.*;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Period;

/**
 * 八字 AI Prompt 构建器。
 */
@Component
public class BaziPromptBuilder {

    /**
     * 构建完整的用户提示词。
     */
    public String buildInterpretationPrompt(BaziChart chart) {
        StringBuilder sb = new StringBuilder();

        int currentAge = calculateCurrentAge(chart.getSolarDate());

        sb.append("请为我解读以下八字命盘：\n\n");
        sb.append("性别：").append(chart.getGenderText())
          .append("，公历：").append(chart.getSolarDate())
          .append("，农历：").append(chart.getLunarDate())
          .append("，当前").append(currentAge).append("岁\n\n");

        appendPillars(sb, chart);
        appendWuXing(sb, chart);
        appendShiShen(sb, chart);
        appendDaYun(sb, chart, currentAge);

        return sb.toString();
    }

    private int calculateCurrentAge(String solarDate) {
        String[] parts = solarDate.split("[^0-9]+");
        LocalDate birth = LocalDate.of(
                Integer.parseInt(parts[0]),
                Integer.parseInt(parts[1]),
                Integer.parseInt(parts[2]));
        return Period.between(birth, LocalDate.now()).getYears();
    }

    private void appendPillars(StringBuilder sb, BaziChart chart) {
        sb.append("四柱八字：\n");
        appendPillarText(sb, "年柱", chart.getYearPillar());
        appendPillarText(sb, "月柱", chart.getMonthPillar());
        appendPillarText(sb, "日柱", chart.getDayPillar()).append(" ← 日主");
        sb.append("\n");
        if (chart.getHourPillar() != null) {
            appendPillarText(sb, "时柱", chart.getHourPillar());
        } else {
            sb.append("时柱：出生时辰未知，时柱缺失\n");
        }
        sb.append("\n");
    }

    private StringBuilder appendPillarText(StringBuilder sb, String label, Pillar p) {
        sb.append(label).append("：天干 ").append(p.getTianGan())
          .append("（").append(p.getTianGanWuXing()).append("）")
          .append("、地支 ").append(p.getDiZhi())
          .append("（").append(p.getDiZhiWuXing()).append("）\n");
        return sb;
    }

    private void appendWuXing(StringBuilder sb, BaziChart chart) {
        if (chart.getWuXingStats() == null) {
            return;
        }
        WuXingStats s = chart.getWuXingStats();
        sb.append("五行个数：金").append(s.getJin())
          .append(" 木").append(s.getMu())
          .append(" 水").append(s.getShui())
          .append(" 火").append(s.getHuo())
          .append(" 土").append(s.getTu())
          .append("，日主五行：").append(s.getDayMasterWuXing())
          .append("，").append(s.getStrength()).append("\n\n");
    }

    private void appendShiShen(StringBuilder sb, BaziChart chart) {
        if (chart.getShiShenList() == null || chart.getShiShenList().isEmpty()) {
            return;
        }
        sb.append("十神关系：\n");
        for (ShiShenRelation ss : chart.getShiShenList()) {
            sb.append("- ").append(ss.getPosition()).append(" ")
              .append(ss.getTianGan()).append("(").append(ss.getWuXing()).append(") → ")
              .append(ss.getShiShen()).append("\n");
        }
        sb.append("\n");
    }

    private void appendDaYun(StringBuilder sb, BaziChart chart, int currentAge) {
        if (chart.getDaYunList() == null || chart.getDaYunList().isEmpty()) {
            return;
        }
        sb.append("大运走势：\n");
        for (DaYunInfo dy : chart.getDaYunList()) {
            sb.append("- ").append(dy.getDisplayText())
              .append("（").append(dy.getStartAge()).append("-").append(dy.getEndAge()).append("岁）");
            if (dy.isCurrent()) sb.append(" ← 当前");
            sb.append("\n");
        }
        sb.append("\n");

        if (chart.getCurrentDaYun() != null) {
            DaYunInfo cdy = chart.getCurrentDaYun();
            sb.append("当前第").append(chart.getDaYunList().indexOf(cdy) + 1)
              .append("步大运：").append(cdy.getDisplayText())
              .append("（").append(cdy.getStartAge()).append("-").append(cdy.getEndAge()).append("岁")
              .append("，当前").append(currentAge).append("岁正在此步大运中）\n");
        }
    }
}
```

- [ ] **Step 2: 创建 BaziAiService**

```java
package cc.usong.tarot.service.bazi;

import cc.usong.tarot.config.DashScopeConfig;
import cc.usong.tarot.model.bazi.BaziChart;
import com.alibaba.dashscope.app.Application;
import com.alibaba.dashscope.app.ApplicationParam;
import com.alibaba.dashscope.app.ApplicationResult;
import com.alibaba.dashscope.app.FlowStreamMode;
import com.alibaba.dashscope.exception.InputRequiredException;
import com.alibaba.dashscope.exception.NoApiKeyException;
import io.reactivex.Flowable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 八字 AI 解读服务。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BaziAiService {

    private final DashScopeConfig dashScopeConfig;
    private final BaziPromptBuilder baziPromptBuilder;

    /**
     * 流式获取八字解读结果。
     */
    public Flowable<ApplicationResult> streamInterpret(BaziChart chart)
            throws NoApiKeyException, InputRequiredException {
        String userPrompt = baziPromptBuilder.buildInterpretationPrompt(chart);
        log.info("构建八字解读Prompt，命盘日期：{}", chart.getSolarDate());

        ApplicationParam param = ApplicationParam.builder()
                .apiKey(dashScopeConfig.getApiKey())
                .appId(dashScopeConfig.getBaziAppId())
                .prompt(userPrompt)
                .incrementalOutput(true)
                .flowStreamMode(FlowStreamMode.MESSAGE_FORMAT)
                .build();

        Application application = new Application();
        return application.streamCall(param);
    }
}
```

- [ ] **Step 3: 创建 BaziCalculationService**

```java
package cc.usong.tarot.service.bazi;

import cc.usong.tarot.enums.ShiChen;
import cc.usong.tarot.model.bazi.*;
import com.nlf.calendar.EightChar;
import com.nlf.calendar.Lunar;
import com.nlf.calendar.Solar;
import com.nlf.calendar.util.LunarUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 八字排盘核心计算服务。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BaziCalculationService {

    private final WuXingService wuXingService;
    private final ShiShenService shiShenService;
    private final DaYunService daYunService;

    /**
     * 计算八字命盘。
     */
    public BaziChart calculateChart(String birthDate, boolean isLunar,
                                     String gender, String shiChenCode) {
        BaziChart chart = new BaziChart();

        // 解析日期
        String[] dateParts = birthDate.split("-");
        int year = Integer.parseInt(dateParts[0]);
        int month = Integer.parseInt(dateParts[1]);
        int day = Integer.parseInt(dateParts[2]);

        Solar solar;
        Lunar lunar;
        if (isLunar) {
            lunar = Lunar.fromYmd(year, month, day);
            solar = lunar.getSolar();
        } else {
            solar = Solar.fromYmd(year, month, day);
            lunar = solar.getLunar();
        }

        chart.setSolarDate(formatSolarDate(solar));
        chart.setLunarDate(formatLunarDate(lunar));
        chart.setGender(gender);
        chart.setGenderText("male".equals(gender) ? "男" : "女");

        // 确定时辰
        ShiChen shiChen = ShiChen.fromCode(shiChenCode);
        boolean hourPillarMissing = shiChen == ShiChen.UNKNOWN;
        chart.setHourPillarMissing(hourPillarMissing);

        int hour = shiChen.getHour();
        Solar solarWithTime = new Solar(solar.getYear(), solar.getMonth(), solar.getDay(), hour, 0, 0);
        Lunar lunarWithTime = solarWithTime.getLunar();
        EightChar eightChar = lunarWithTime.getEightChar();

        // 构建四柱
        chart.setYearPillar(buildPillar(eightChar.getYearGan(), eightChar.getYearZhi()));
        chart.setMonthPillar(buildPillar(eightChar.getMonthGan(), eightChar.getMonthZhi()));
        chart.setDayPillar(buildPillar(eightChar.getDayGan(), eightChar.getDayZhi()));
        if (!hourPillarMissing) {
            chart.setHourPillar(buildPillar(eightChar.getTimeGan(), eightChar.getTimeZhi()));
        }

        // 计算五行、十神、大运
        chart.setWuXingStats(wuXingService.analyze(
                chart.getYearPillar(), chart.getMonthPillar(),
                chart.getDayPillar(), chart.getHourPillar(), hourPillarMissing));
        chart.setShiShenList(shiShenService.analyze(eightChar, hourPillarMissing));
        chart.setDaYunList(daYunService.calculate(eightChar, gender, birthDate));

        // 设置当前大运
        setCurrentDaYun(chart);

        return chart;
    }

    private Pillar buildPillar(String gan, String zhi) {
        Pillar pillar = new Pillar();
        pillar.setTianGan(gan);
        pillar.setDiZhi(zhi);
        pillar.setTianGanWuXing(LunarUtil.WU_XING_GAN.get(gan));
        pillar.setDiZhiWuXing(LunarUtil.WU_XING_ZHI.get(zhi));
        pillar.setYinYang(determineYinYang(gan));
        pillar.setDisplayText(gan + zhi);
        return pillar;
    }

    private String determineYinYang(String gan) {
        for (String yg : BaziConstants.YANG_GAN) {
            if (yg.equals(gan)) {
                return "阳";
            }
        }
        return "阴";
    }

    private String formatSolarDate(Solar solar) {
        return solar.getYear() + "年" + solar.getMonth() + "月" + solar.getDay() + "日";
    }

    private String formatLunarDate(Lunar lunar) {
        return lunar.getYearInGanZhi() + "年" + lunar.getMonthInChinese() + "月" + lunar.getDayInChinese() + "日";
    }

    private void setCurrentDaYun(BaziChart chart) {
        if (chart.getDaYunList() != null) {
            for (DaYunInfo daYun : chart.getDaYunList()) {
                if (daYun.isCurrent()) {
                    chart.setCurrentDaYun(daYun);
                    return;
                }
            }
        }
    }
}
```

- [ ] **Step 4: Commit**

```bash
git add tarot-service/src/main/java/cc/usong/tarot/service/bazi/
git commit -m "refactor(tarot-service): BaziService拆分为5个服务类+1个PromptBuilder"
```

---

### Task 16: 拆分 TarotService——TarotPromptBuilder + TarotAiService

**Files:**
- Create: `tarot-service/src/main/java/cc/usong/tarot/service/tarot/TarotPromptBuilder.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/service/tarot/TarotAiService.java`

- [ ] **Step 1: 创建 TarotPromptBuilder**

```java
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
```

- [ ] **Step 2: 创建 TarotAiService**

```java
package cc.usong.tarot.service.tarot;

import cc.usong.tarot.config.DashScopeConfig;
import cc.usong.tarot.dto.request.InterpretRequest;
import com.alibaba.dashscope.app.Application;
import com.alibaba.dashscope.app.ApplicationParam;
import com.alibaba.dashscope.app.ApplicationResult;
import com.alibaba.dashscope.app.FlowStreamMode;
import com.alibaba.dashscope.exception.InputRequiredException;
import com.alibaba.dashscope.exception.NoApiKeyException;
import com.alibaba.dashscope.utils.JsonUtils;
import io.reactivex.Flowable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 塔罗牌 AI 解读服务。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TarotAiService {

    private final DashScopeConfig dashScopeConfig;
    private final TarotPromptBuilder tarotPromptBuilder;

    /**
     * 非流式解读。
     */
    public String interpret(InterpretRequest request)
            throws NoApiKeyException, InputRequiredException {
        String bizParams = tarotPromptBuilder.buildInterpretationPrompt(request);

        ApplicationParam param = ApplicationParam.builder()
                .apiKey(dashScopeConfig.getApiKey())
                .appId(dashScopeConfig.getAppId())
                .prompt("抽卡成功")
                .bizParams(JsonUtils.parse(bizParams))
                .build();

        Application application = new Application();
        ApplicationResult result = application.call(param);
        return result.getOutput().getText();
    }

    /**
     * 流式解读。
     */
    public Flowable<ApplicationResult> streamInterpret(InterpretRequest request)
            throws NoApiKeyException, InputRequiredException {
        String bizParams = tarotPromptBuilder.buildInterpretationPrompt(request);
        log.info("构建塔罗解读Prompt，牌阵：{}", request.getSpreadName());

        ApplicationParam param = ApplicationParam.builder()
                .apiKey(dashScopeConfig.getApiKey())
                .appId(dashScopeConfig.getAppId())
                .prompt("抽卡成功")
                .bizParams(JsonUtils.parse(bizParams))
                .incrementalOutput(true)
                .flowStreamMode(FlowStreamMode.MESSAGE_FORMAT)
                .build();

        Application application = new Application();
        return application.streamCall(param);
    }
}
```

- [ ] **Step 3: Commit**

```bash
git add tarot-service/src/main/java/cc/usong/tarot/service/tarot/
git commit -m "refactor(tarot-service): 从TarotService提取TarotPromptBuilder和TarotAiService"
```

---

### Task 17: 创建 SseService（WebFlux 流式封装）

**Files:**
- Create: `tarot-service/src/main/java/cc/usong/tarot/service/tarot/SseService.java`

- [ ] **Step 1: 创建 SseService**

```java
package cc.usong.tarot.service.tarot;

import cc.usong.common.exception.TokenInvalidException;
import cc.usong.tarot.service.token.RateLimitingService;
import com.alibaba.dashscope.app.ApplicationResult;
import io.reactivex.Flowable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.function.Supplier;

/**
 * SSE 流式输出服务。
 * 统一封装 DashScope Flowable → WebFlux Flux 转换。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SseService {

    private final RateLimitingService rateLimitingService;

    /**
     * 将 DashScope Flowable 转为 WebFlux Flux<ServerSentEvent<String>>。
     *
     * @param flowableSupplier DashScope Flowable 提供者
     * @param token            访问口令
     * @return Flux<ServerSentEvent<String>>
     */
    public Flux<ServerSentEvent<String>> streamDashScope(
            Supplier<Flowable<ApplicationResult>> flowableSupplier,
            String token) {

        // 1. 验证 token
        try {
            rateLimitingService.verifyToken(token);
        } catch (Exception e) {
            log.warn("Token验证失败: {}", e.getMessage());
            return Flux.just(ServerSentEvent.<String>builder()
                    .data("[FORBIDDEN]" + e.getMessage())
                    .build());
        }

        // 2. 获取 Flowable 并转换为 Flux
        try {
            Flowable<ApplicationResult> flowable = flowableSupplier.get();

            return Flux.create(sink -> {
                flowable.subscribe(
                        result -> {
                            String finishReason = result.getOutput().getFinishReason();
                            if ("stop".equals(finishReason)) {
                                log.debug("SSE stream completed");
                            } else {
                                String content = result.getOutput()
                                        .getWorkflowMessage().getMessage().getContent();
                                if (content != null && !content.isEmpty()) {
                                    sink.next(ServerSentEvent.<String>builder()
                                            .data(content)
                                            .build());
                                }
                            }
                        },
                        error -> {
                            log.error("SSE stream error", error);
                            sink.next(ServerSentEvent.<String>builder()
                                    .data("[ERROR]" + error.getMessage())
                                    .build());
                            sink.complete();
                        },
                        sink::complete
                );
            });
        } catch (Exception e) {
            log.error("创建SSE流失败", e);
            return Flux.just(ServerSentEvent.<String>builder()
                    .data("[ERROR]" + e.getMessage())
                    .build());
        }
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add tarot-service/src/main/java/cc/usong/tarot/service/tarot/SseService.java
git commit -m "feat(tarot-service): 新增SseService，统一WebFlux流式输出封装"
```

---

### Task 18: 重构 RateLimitingService（修复线程安全 + 迁移包）

**Files:**
- Create: `tarot-service/src/main/java/cc/usong/tarot/service/token/RateLimitingService.java`
- Create: `tarot-service/src/main/java/cc/usong/tarot/service/token/RequestStats.java`
- Delete: `tarot-service/src/main/java/cc/usong/tarot/service/RateLimitingService.java`
- Delete: `tarot-service/src/main/java/cc/usong/tarot/service/RequestStats.java`

- [ ] **Step 1: 创建 token/RequestStats.java**

```java
package cc.usong.tarot.service.token;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 请求统计记录。
 */
public record RequestStats(LocalDateTime lastRequestTime, LocalDate date, int dailyRequestCount) {
}
```

- [ ] **Step 2: 创建 token/RateLimitingService.java（线程安全版）**

```java
package cc.usong.tarot.service.token;

import cc.usong.common.exception.RateLimitExceededException;
import cc.usong.tarot.entity.AccessToken;
import cc.usong.tarot.repository.AccessTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 限流服务类（线程安全）。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RateLimitingService {

    private final AccessTokenRepository accessTokenRepository;

    @Value("${rate-limit.daily-max:3}")
    private int dailyMaxRequests;

    @Value("${rate-limit.interval-minutes:1}")
    private int intervalMinutes;

    /**
     * 验证口令有效性并减少剩余次数。
     *
     * @param token 客户端提供的访问口令
     */
    @Transactional
    public void verifyToken(String token) {
        if (token == null || token.isBlank()) {
            throw new RateLimitExceededException("缺少访问口令");
        }

        AccessToken accessToken = accessTokenRepository.findByTokenAndStatus(token, 1)
                .orElseThrow(() -> new RateLimitExceededException("无效的访问口令"));

        int updated = accessTokenRepository.decrementRemainingCount(token);
        if (updated == 0) {
            throw new RateLimitExceededException("访问口令使用次数已达上限");
        }

        log.debug("Token验证通过，剩余次数：{}", accessToken.getRemainingCount() - 1);
    }
}
```

- [ ] **Step 3: 删除旧文件**

```bash
rm tarot-service/src/main/java/cc/usong/tarot/service/RateLimitingService.java
rm tarot-service/src/main/java/cc/usong/tarot/service/RequestStats.java
```

- [ ] **Step 4: Commit**

```bash
git add tarot-service/src/main/java/cc/usong/tarot/service/token/ tarot-service/src/main/java/cc/usong/tarot/service/RateLimitingService.java tarot-service/src/main/java/cc/usong/tarot/service/RequestStats.java
git commit -m "refactor(tarot-service): RateLimitingService迁移至token包，使用common异常体系"
```

---

### Task 19: 重写 TarotService（使用 DB 卡牌 + 新 DTO）

**Files:**
- Rewrite: `tarot-service/src/main/java/cc/usong/tarot/service/TarotService.java`

- [ ] **Step 1: 重写 TarotService**

```java
package cc.usong.tarot.service;

import cc.usong.tarot.converter.TarotCardConverter;
import cc.usong.tarot.dto.request.InterpretRequest;
import cc.usong.tarot.dto.response.CardVO;
import cc.usong.tarot.dto.response.DrawResultVO;
import cc.usong.tarot.dto.response.SpreadVO;
import cc.usong.tarot.entity.TarotCardEntity;
import cc.usong.tarot.model.TarotSpread;
import cc.usong.tarot.repository.TarotCardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 塔罗牌业务服务。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TarotService {

    private final TarotCardRepository tarotCardRepository;

    private final List<TarotSpread> spreads = List.of(
            new TarotSpread("single", "Single Card", "单张牌",
                    "A single card for a quick reading.",
                    "最简单的占卜方式，只抽取一张牌，用于快速了解当前运势或问题的核心。", 1),
            new TarotSpread("three-card", "Three Card Spread", "三牌阵",
                    "A spread for past, present, and future.",
                    "经典的三牌阵，分别代表问题的过去、现在和未来，帮助理清思绪。", 3),
            new TarotSpread("celtic-cross", "Celtic Cross", "凯尔特十字",
                    "A comprehensive spread for a detailed reading.",
                    "复杂且强大的凯尔特十字牌阵，可以深入分析问题的各个方面，提供详细的指引。", 10)
    );

    /**
     * 获取所有牌阵。
     */
    public List<SpreadVO> listSpreads() {
        return TarotCardConverter.toSpreadVOList(spreads);
    }

    /**
     * 获取洗好的牌组。
     */
    public List<CardVO> getShuffledDeck() {
        List<TarotCardEntity> allCards = tarotCardRepository.findAll();
        List<TarotCardEntity> shuffled = new ArrayList<>(allCards);
        Collections.shuffle(shuffled);
        return shuffled.stream()
                .map(card -> {
                    CardVO vo = TarotCardConverter.toCardVO(card, false);
                    vo.setReversed(Math.random() > 0.5);
                    return vo;
                })
                .toList();
    }

    /**
     * 查找牌阵。
     */
    public Optional<TarotSpread> getSpread(String id) {
        return spreads.stream()
                .filter(s -> s.getId().equals(id))
                .findFirst();
    }

    /**
     * 抽牌。
     */
    public DrawResultVO drawCards(String spreadId) {
        TarotSpread spread = getSpread(spreadId)
                .orElseThrow(() -> new IllegalArgumentException("无效的牌阵ID: " + spreadId));

        List<TarotCardEntity> allCards = tarotCardRepository.findAll();
        List<TarotCardEntity> shuffled = new ArrayList<>(allCards);
        Collections.shuffle(shuffled);

        List<CardVO> drawnCards = shuffled.stream()
                .limit(spread.getNumberOfCards())
                .map(card -> {
                    CardVO vo = TarotCardConverter.toCardVO(card, false);
                    vo.setReversed(Math.random() > 0.5);
                    return vo;
                })
                .toList();

        SpreadVO spreadVO = TarotCardConverter.toSpreadVO(spread);
        return new DrawResultVO(drawnCards, spreadVO);
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add tarot-service/src/main/java/cc/usong/tarot/service/TarotService.java
git commit -m "refactor(tarot-service): 重写TarotService，使用DB卡牌和DTO体系"
```

---

### Task 20: 删除旧 BaziService + 旧的 model 类

**Files:**
- Delete: `tarot-service/src/main/java/cc/usong/tarot/service/BaziService.java`
- Delete: `tarot-service/src/main/java/cc/usong/tarot/model/Deck.java`

- [ ] **Step 1: 删除旧 BaziService**

BaziService 已被拆分为 `service/bazi/` 下的 5 个服务，原文件可以删除：

```bash
rm tarot-service/src/main/java/cc/usong/tarot/service/BaziService.java
```

- [ ] **Step 2: 删除 Deck.java（数据已迁移到 DB）**

```bash
rm tarot-service/src/main/java/cc/usong/tarot/model/Deck.java
```

- [ ] **Step 3: 验证编译**

Run: `./mvnw compile -pl tarot-service`
Expected: 可能有 Controller 引用报错，将在 Task 21 修复

- [ ] **Step 4: Commit**

```bash
git add -u tarot-service/src/main/java/cc/usong/tarot/service/BaziService.java tarot-service/src/main/java/cc/usong/tarot/model/Deck.java
git commit -m "refactor(tarot-service): 删除旧BaziService和Deck.java"
```

---

## 阶段四：表现层 + 骨架服务 + Gateway

### Task 21: 重写 TarotController

**Files:**
- Rewrite: `tarot-service/src/main/java/cc/usong/tarot/controller/TarotController.java`

- [ ] **Step 1: 重写 TarotController**

```java
package cc.usong.tarot.controller;

import cc.usong.common.model.Result;
import cc.usong.tarot.dto.request.DrawRequest;
import cc.usong.tarot.dto.request.InterpretRequest;
import cc.usong.tarot.dto.response.CardVO;
import cc.usong.tarot.dto.response.DrawResultVO;
import cc.usong.tarot.dto.response.SpreadVO;
import cc.usong.tarot.service.TarotService;
import cc.usong.tarot.service.tarot.SseService;
import cc.usong.tarot.service.tarot.TarotAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.List;

/**
 * 塔罗牌 API 控制器。
 */
@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TarotController {

    private final TarotService tarotService;
    private final TarotAiService tarotAiService;
    private final SseService sseService;

    @GetMapping("/spreads")
    public Result<List<SpreadVO>> listSpreads() {
        return Result.success(tarotService.listSpreads());
    }

    @GetMapping("/deck")
    public Result<List<CardVO>> getShuffledDeck() {
        return Result.success(tarotService.getShuffledDeck());
    }

    @PostMapping("/draw")
    public Result<DrawResultVO> draw(@Valid @RequestBody DrawRequest request) {
        return Result.success(tarotService.drawCards(request.getSpreadId()));
    }

    @PostMapping("/interpret")
    public Result<String> interpret(@Valid @RequestBody InterpretRequest request) {
        try {
            String result = tarotAiService.interpret(request);
            return Result.success(result);
        } catch (Exception e) {
            log.error("解读失败", e);
            return Result.fail(cc.usong.common.enums.ResultCode.SERVER_ERROR, e.getMessage());
        }
    }

    @PostMapping(value = "/interpret/stream", produces = "text/event-stream")
    public Flux<ServerSentEvent<String>> streamInterpret(@Valid @RequestBody InterpretRequest request) {
        return sseService.streamDashScope(
                () -> tarotAiService.streamInterpret(request),
                request.getToken()
        );
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add tarot-service/src/main/java/cc/usong/tarot/controller/TarotController.java
git commit -m "refactor(tarot-service): 重写TarotController，使用WebFlux+DTO+Result"
```

---

### Task 22: 重写 BaziController

**Files:**
- Rewrite: `tarot-service/src/main/java/cc/usong/tarot/controller/BaziController.java`

- [ ] **Step 1: 重写 BaziController**

```java
package cc.usong.tarot.controller;

import cc.usong.common.model.Result;
import cc.usong.tarot.converter.BaziConverter;
import cc.usong.tarot.dto.request.BaziInterpretRequest;
import cc.usong.tarot.dto.request.BaziRequest;
import cc.usong.tarot.dto.response.BaziChartVO;
import cc.usong.tarot.model.bazi.BaziChart;
import cc.usong.tarot.service.bazi.BaziAiService;
import cc.usong.tarot.service.bazi.BaziCalculationService;
import cc.usong.tarot.service.tarot.SseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

/**
 * 八字命盘 API 控制器。
 */
@Slf4j
@RestController
@RequestMapping("/api/bazi")
@RequiredArgsConstructor
public class BaziController {

    private final BaziCalculationService baziCalculationService;
    private final BaziAiService baziAiService;
    private final SseService sseService;

    @PostMapping("/chart")
    public Result<BaziChartVO> calculateChart(@Valid @RequestBody BaziRequest request) {
        BaziChart chart = baziCalculationService.calculateChart(
                request.getBirthDate(),
                Boolean.TRUE.equals(request.getIsLunar()),
                request.getGender(),
                request.getShiChen()
        );
        return Result.success(BaziConverter.toBaziChartVO(chart));
    }

    @PostMapping(value = "/interpret/stream", produces = "text/event-stream")
    public Flux<ServerSentEvent<String>> streamInterpret(@Valid @RequestBody BaziInterpretRequest request) {
        // 从前端传来的 chart map 重建 BaziChart（简化处理：前端直接传原始 JSON）
        BaziChart chart = reconstructChart(request.getChart());
        return sseService.streamDashScope(
                () -> baziAiService.streamInterpret(chart),
                request.getToken()
        );
    }

    private BaziChart reconstructChart(java.util.Map<String, Object> chartMap) {
        // 使用 Jackson ObjectMapper 将 Map 转回 BaziChart
        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        return mapper.convertValue(chartMap, BaziChart.class);
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add tarot-service/src/main/java/cc/usong/tarot/controller/BaziController.java
git commit -m "refactor(tarot-service): 重写BaziController，使用WebFlux+DTO+Result"
```

---

### Task 23: Gateway 优化

**Files:**
- Modify: `gateway-service/pom.xml`
- Modify: `gateway-service/src/main/java/cc/usong/gateway/SseBufferingFilter.java`

- [ ] **Step 1: gateway-service/pom.xml 添加 common 依赖和 Lombok**

在 `<dependencies>` 中添加：

```xml
<dependency>
    <groupId>cc.usong</groupId>
    <artifactId>common</artifactId>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

- [ ] **Step 2: 优化 SseBufferingFilter**

```java
package cc.usong.gateway;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * SSE 流式响应缓冲过滤器。
 */
@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SseBufferingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        if (isSseRequest(httpRequest)) {
            configureSseResponse(httpResponse);
        }

        chain.doFilter(request, response);
    }

    private boolean isSseRequest(HttpServletRequest request) {
        return request.getRequestURI().contains("/stream");
    }

    private void configureSseResponse(HttpServletResponse response) {
        response.setHeader("X-Accel-Buffering", "no");
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Connection", "keep-alive");
    }
}
```

- [ ] **Step 3: Commit**

```bash
git add gateway-service/
git commit -m "refactor(gateway): 添加common依赖，优化SseBufferingFilter"
```

---

### Task 24: 骨架服务建立分层结构

**Files:**
每个骨架服务创建：`config/WebConfig.java`、`exception/GlobalExceptionHandler.java`

- [ ] **Step 1: 为每个骨架服务 POM 添加 validation + lombok 依赖**

在 user-service、payment-service、fortune-service、community-service 的 `pom.xml` 的 `<dependencies>` 中添加：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

- [ ] **Step 2: 为每个骨架服务创建标准目录结构**

对 user-service、payment-service、fortune-service、community-service 各自执行：

```bash
mkdir -p {service}/src/main/java/cc/usong/{name}/controller
mkdir -p {service}/src/main/java/cc/usong/{name}/service
mkdir -p {service}/src/main/java/cc/usong/{name}/repository
mkdir -p {service}/src/main/java/cc/usong/{name}/entity
mkdir -p {service}/src/main/java/cc/usong/{name}/dto/request
mkdir -p {service}/src/main/java/cc/usong/{name}/dto/response
mkdir -p {service}/src/main/java/cc/usong/{name}/config
mkdir -p {service}/src/main/java/cc/usong/{name}/exception
```

- [ ] **Step 3: 每个骨架服务创建 WebConfig.java**

以 user-service 为例（其他三个类似）：

```java
package cc.usong.user.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(false);
            }
        };
    }
}
```

- [ ] **Step 4: 每个骨架服务创建 GlobalExceptionHandler**

复用 common 模块的异常体系（与 Task 4 中 tarot-service 的相同）。

- [ ] **Step 5: 验证全量编译**

Run: `./mvnw clean compile -DskipTests`
Expected: BUILD SUCCESS

- [ ] **Step 6: Commit**

```bash
git add user-service/ payment-service/ fortune-service/ community-service/
git commit -m "refactor: 骨架服务建立标准分层结构和依赖"
```

---

### Task 25: 删除旧的 model 包中不再使用的文件

**Files:**
- Delete: `tarot-service/src/main/java/cc/usong/tarot/model/DrawRequest.java`
- Delete: `tarot-service/src/main/java/cc/usong/tarot/model/InterpretationRequest.java`
- Keep: `tarot-service/src/main/java/cc/usong/tarot/model/TarotCard.java` (临时保留，直到确认前端不再依赖旧格式)
- Keep: `tarot-service/src/main/java/cc/usong/tarot/model/TarotSpread.java` (TarotService 仍在使用)
- Keep: `tarot-service/src/main/java/cc/usong/tarot/model/bazi/` (BaziCalculationService 等仍在使用)

- [ ] **Step 1: 删除已迁移到 dto 的旧请求类**

```bash
rm tarot-service/src/main/java/cc/usong/tarot/model/DrawRequest.java
rm tarot-service/src/main/java/cc/usong/tarot/model/InterpretationRequest.java
```

- [ ] **Step 2: 验证全量编译**

Run: `./mvnw clean compile -DskipTests`
Expected: BUILD SUCCESS

- [ ] **Step 3: 最终 Commit**

```bash
git add -u tarot-service/src/main/java/cc/usong/tarot/model/
git commit -m "refactor(tarot-service): 清理已迁移的旧model类"
```

---

### Task 26: 全量验证

- [ ] **Step 1: 全量编译**

Run: `./mvnw clean compile -DskipTests`
Expected: BUILD SUCCESS

- [ ] **Step 2: 全量打包**

Run: `./mvnw clean package -DskipTests`
Expected: BUILD SUCCESS

- [ ] **Step 3: 本地启动验证（需要 MySQL + Nacos）**

```bash
# 启动 tarot-service
./mvnw spring-boot:run -pl tarot-service

# 验证接口
curl http://localhost:8081/api/spreads
curl http://localhost:8081/api/deck
```

Expected: 返回 `Result<T>` 格式的 JSON 数据

- [ ] **Step 4: Commit 验证通过标记**

```bash
git tag -a "refactor-phase-complete" -m "后端重构4阶段完成，全量编译验证通过"
```
