# AI Tarot Reader 后端重构设计文档

> 日期：2026-03-29
> 范围：全部后端模块（tarot-service、common、gateway-service、骨架服务）
> 策略：渐进式重构，按阶段推进，每阶段可独立编译运行

---

## 一、重构目标

1. **严格分层**：Controller → Service → Repository，各层职责清晰，互不污染
2. **代码规范**：遵守《阿里巴巴 Java 开发手册》及《Effective Java》
3. **消除 God Class**：拆分 BaziService 等过度膨胀的类
4. **统一基础设施**：异常处理、响应包装、日志、校验
5. **线程安全**：修复 RateLimitingService 竞态条件
6. **资源管理**：消除 ExecutorService 泄漏，切换 WebFlux 流式处理
7. **数据外置**：78 张塔罗牌数据从硬编码迁移到 MySQL
8. **配置安全铁律**：所有敏感配置（deploy.sh、application-dev.properties、application-prod.properties、docker-compose.yml 等）绝对禁止提交到 Git，必须通过 `.gitignore` 严格排除

---

## 二、阶段一：基础设施层

### 2.1 Maven 依赖统一管理

父 POM `<dependencyManagement>` 统一管理版本号，子模块只声明 `groupId:artifactId`。

| 依赖 | 版本策略 |
|------|---------|
| Spring Boot | 3.5.3（不变） |
| Spring Cloud | 2025.0.0（不变） |
| Spring Cloud Alibaba | 2023.0.3.2（不变） |
| DashScope SDK | 升级到最新稳定版 |
| **新增** spring-boot-starter-validation | 由 Boot BOM 管理 |
| **新增** spring-boot-starter-webflux | 由 Boot BOM 管理 |

### 2.2 common 模块重构

重构后包结构：

```
cc.usong.common/
├── model/
│   ├── Result<T>              # 统一响应包装
│   ├── PageResult<T>          # 分页响应
│   └── PageRequest            # 分页请求基类
├── enums/
│   ├── ResultCode             # 统一业务状态码枚举
│   └── BusinessStatus         # 业务状态常量
└── exception/
    ├── BusinessException      # 业务异常基类
    ├── TokenInvalidException  # Token 无效/过期
    └── RateLimitExceededException  # 限流异常
```

#### Result<T>

```java
@Data
public class Result<T> implements Serializable {
    private Integer code;
    private String message;
    private T data;

    public static <T> Result<T> success(T data);
    public static <T> Result<T> success();
    public static <T> Result<T> fail(ResultCode code);
    public static <T> Result<T> fail(ResultCode code, String message);
}
```

#### ResultCode 枚举

```java
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

### 2.3 全局异常处理器

在 tarot-service 中新增 `GlobalExceptionHandler`（`@RestControllerAdvice`），统一处理：

- `MethodArgumentNotValidException` → 参数校验失败 → `Result.fail(PARAM_ERROR)`
- `BusinessException` 及子类 → 业务异常 → 对应 ResultCode
- `Exception` → 兜底 → `Result.fail(SERVER_ERROR)`

### 2.4 日志规范

- `System.out.println` → `@Slf4j` + `log.info/warn/error`
- `e.printStackTrace()` → `log.error("描述", e)`
- 异常吞没处补充日志或正确传播

---

## 三、阶段二：数据层

### 3.1 tarot-service 包结构重组

```
cc.usong.tarot/
├── controller/
│   ├── TarotController.java
│   └── BaziController.java
├── service/
│   ├── tarot/
│   │   ├── TarotService.java
│   │   ├── TarotAiService.java
│   │   ├── TarotPromptBuilder.java
│   │   └── SseService.java
│   ├── bazi/
│   │   ├── BaziCalculationService.java
│   │   ├── WuXingService.java
│   │   ├── ShiShenService.java
│   │   ├── DaYunService.java
│   │   ├── BaziAiService.java
│   │   └── BaziPromptBuilder.java
│   └── token/
│       └── RateLimitingService.java
├── repository/
│   ├── AccessTokenRepository.java
│   └── TarotCardRepository.java
├── entity/
│   ├── AccessToken.java
│   └── TarotCardEntity.java
├── dto/
│   ├── request/
│   │   ├── DrawRequest.java
│   │   ├── InterpretationRequest.java
│   │   ├── BaziRequest.java
│   │   └── BaziInterpretRequest.java
│   └── response/
│       ├── SpreadVO.java
│       ├── DeckVO.java
│       ├── CardVO.java
│       ├── DrawResultVO.java
│       ├── BaziChartVO.java
│       ├── PillarVO.java
│       ├── WuXingStatsVO.java
│       ├── ShiShenRelationVO.java
│       └── DaYunInfoVO.java
├── enums/
│   ├── Gender.java
│   ├── ShiChen.java
│   ├── Direction.java
│   └── CardCategory.java
├── constants/
│   ├── TarotConstants.java
│   └── BaziConstants.java
├── converter/
│   ├── TarotCardConverter.java
│   └── BaziConverter.java
└── config/
    ├── DashScopeConfig.java
    └── WebConfig.java
```

### 3.2 分层访问规则

| 层 | 允许使用 | 禁止使用 |
|----|---------|---------|
| Controller | request DTO、response VO | Entity |
| Service | DTO、Entity、领域逻辑 | HttpServletRequest/Response |
| Repository | Entity | DTO、业务逻辑 |
| Converter | Entity ↔ DTO 互转 | 不含业务逻辑 |

### 3.3 78 张牌迁移到 MySQL

#### TarotCardEntity

```java
@Entity
@Table(name = "tarot_card")
@Data
public class TarotCardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String cardId;

    @Column(nullable = false)
    private String nameEn;

    @Column(nullable = false)
    private String nameCn;

    @Column(nullable = false)
    private String category;       // MAJOR / WANDS / CUPS / SWORDS / PENTACLES

    @Column(nullable = false)
    private Integer number;

    @Column(columnDefinition = "TEXT")
    private String uprightMeaning;

    @Column(columnDefinition = "TEXT")
    private String reversedMeaning;

    @Column(columnDefinition = "TEXT")
    private String description;
}
```

#### Flyway 迁移脚本

```
db/migration/
├── V1__create_tarot_card_table.sql       # 建表
└── V2__init_tarot_card_data.sql          # INSERT 78 张牌
```

#### TarotCardRepository

```java
public interface TarotCardRepository extends JpaRepository<TarotCardEntity, Long> {
    List<TarotCardEntity> findByCategory(String category);
}
```

### 3.4 请求 DTO 校验注解

```java
// DrawRequest
public class DrawRequest {
    @NotBlank(message = "牌阵ID不能为空")
    private String spreadId;
}

// InterpretationRequest
public class InterpretationRequest {
    @NotBlank(message = "Token不能为空")
    private String token;
    @NotBlank(message = "方向不能为空")
    private String direction;
    @NotBlank(message = "牌阵名称不能为空")
    private String spreadName;
    @NotEmpty(message = "卡牌列表不能为空")
    @Valid
    private List<CardDTO> cards;
}

// BaziRequest
public class BaziRequest {
    @NotBlank(message = "出生日期不能为空")
    @Pattern(regexp = "\\d{4}-\\d{1,2}-\\d{1,2}", message = "日期格式错误")
    private String birthDate;
    @NotNull(message = "是否农历不能为空")
    private Boolean isLunar;
    @NotNull(message = "性别不能为空")
    private Gender gender;
    private ShiChen shiChen;
    @NotBlank(message = "Token不能为空")
    private String token;
}
```

### 3.5 清理死代码

| 删除项 | 原因 |
|--------|------|
| `PersistenceService.java` | 空壳实现 |
| `RateLimitingService.verifyRateLimit()` | 从未被调用 |
| `Deck.java` 硬编码数据 | 迁移到数据库 |
| `TarotSpread.java` 内部硬编码 | 抽为配置或数据库 |

---

## 四、阶段三：服务层

### 4.1 BaziService 拆分

| 类 | 职责 | 预估行数 |
|----|------|---------|
| `BaziCalculationService` | 核心排盘，组装 BaziChart | ~120 |
| `WuXingService` | 五行统计分析 | ~80 |
| `ShiShenService` | 十神关系计算 | ~80 |
| `DaYunService` | 大运周期计算 | ~70 |
| `BaziAiService` | AI 解盘 Prompt + DashScope 调用 | ~120 |
| `BaziPromptBuilder` | Prompt 文本构建 | ~60 |

调用链路：

```
BaziController
  → BaziCalculationService.calculateChart(request)
      → WuXingService.analyze(pillars)
      → ShiShenService.analyze(dayMaster, pillars)
      → DaYunService.calculate(gender, pillars)
  → BaziAiService.streamInterpret(chart, token)
```

### 4.2 TarotService 拆分

| 类 | 职责 |
|----|------|
| `TarotService` | 牌组管理、洗牌、抽牌、牌阵查询 |
| `TarotAiService` | AI 解读 DashScope 调用 |
| `TarotPromptBuilder` | Prompt 文本构建 |
| `SseService` | WebFlux 流式输出封装 |

### 4.3 SseService 设计

```java
@Service
@Slf4j
public class SseService {
    public Flux<ServerSentEvent<String>> streamDashScope(
            Supplier<Flowable<String>> flowableSupplier,
            String token,
            RateLimitingService rateLimitingService) {
        // 1. 验证 token
        // 2. Flowable → Flux 转换
        // 3. 统一错误处理
        // 4. 返回 Flux<ServerSentEvent<String>>
    }
}
```

Controller 调用示例：

```java
@PostMapping("/interpret/stream")
public Flux<ServerSentEvent<String>> streamInterpret(
        @Valid @RequestBody InterpretationRequest request) {
    return sseService.streamDashScope(
        () -> tarotAiService.buildInterpretFlowable(request),
        request.getToken(),
        rateLimitingService
    );
}
```

### 4.4 RateLimitingService 线程安全修复

- `requestCounts` 读写全部通过 `ConcurrentHashMap.compute()` 原子操作
- 限流阈值提取到 `application.properties`：
  - `rate-limit.daily-max=3`
  - `rate-limit.interval-minutes=1`

### 4.5 常量提取

- `TarotConstants`：SSE 超时、牌组大小、错误前缀等
- `BaziConstants`：默认时辰、日期格式、天干地支映射表等

---

## 五、阶段四：表现层 + 骨架服务 + Gateway

### 5.1 Controller 瘦身

职责严格限制为：接收请求 + 触发校验 + 调用 Service + 返回响应。

非流式接口统一使用 `Result<T>` 包装：

```java
@GetMapping("/spreads")
public Result<List<SpreadVO>> listSpreads() {
    return Result.success(tarotService.listSpreads());
}

@PostMapping("/draw")
public Result<DrawResultVO> draw(@Valid @RequestBody DrawRequest request) {
    return Result.success(tarotService.drawCards(request));
}
```

流式接口返回 `Flux<ServerSentEvent<String>>`，不包装 `Result`。

### 5.2 骨架服务标准结构

user-service、payment-service、fortune-service、community-service 统一建立：

```
{service}/src/main/java/cc/usong/{service}/
├── {ServiceName}Application.java
├── controller/
├── service/
├── repository/
├── entity/
├── dto/
│   ├── request/
│   └── response/
├── config/
│   └── WebConfig.java
└── exception/
    └── GlobalExceptionHandler.java
```

每个骨架包含正确包分层、`@Slf4j` 日志、标准 POM 依赖声明。

### 5.3 gateway-service 优化

- `SseBufferingFilter` 添加 `@Slf4j`，完善 SSE 响应头设置
- SSE 超时和路由规则从硬编码改为 `application.yml` 配置化

### 5.4 模块依赖关系

```
common（被所有服务依赖）
gateway-service → common
tarot-service   → common
user-service    → common
payment-service → common
fortune-service → common
community-service → common
```

---

## 六、验证标准

| 检查项 | 方法 |
|--------|------|
| 编译通过 | `./mvnw clean compile` |
| 单元测试 | `./mvnw test` |
| 接口兼容 | 前端联调，所有 API 行为不变 |
| SSE 流式 | 塔罗解读和八字解读流式输出正常 |
| 分层合规 | Controller 无业务逻辑、Service 无 Web 依赖、Repository 无 DTO |

---

## 七、前端适配（后端全部验证通过后独立执行）

> 此任务在后端重构完成并全部验证通过后启动，需要单独做方案、写计划、执行。

改动范围：

| 接口 | 前端方法 | 改动 |
|------|---------|------|
| `GET /api/spreads` | `getSpreads()` | 提取 `response.data` |
| `GET /api/deck` | `getDeck()` | 提取 `response.data` |
| `POST /api/draw` | `drawCards()` | 提取 `response.data` |
| `POST /api/bazi/chart` | `calculateChart()` | 提取 `response.data` |
| SSE 流式接口 | `interpretStream()` | **无需改动** |

SSE 流式接口前端不需要修改——WebFlux `Flux<ServerSentEvent>` 在 HTTP 线上仍然是标准 SSE 协议（`text/event-stream` + `data:` 格式），前端现有的 `ReadableStream` 解析逻辑完全兼容。
