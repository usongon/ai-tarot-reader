# 八字命理功能设计文档

> 日期：2026-03-28
> 状态：设计中
> 优先级：第一批（后续还有易经卜卦、周公解梦）

---

## 1. 产品概述

在现有 AI 塔罗牌应用内新增「八字命理」模块。用户在首页选择占卜方式后进入八字流程，输入出生信息（支持公历/农历），后端专业排盘（四柱八字、五行统计、十神分析、大运排盘），结合 AI 流式解读。

### 核心决策

| 决策项 | 结论 |
|--------|------|
| 产品形态 | 同一应用内切换，首页增加占卜方式选择 |
| 排盘方式 | 后端用 `lunar-java` 本地计算，AI 只做解读 |
| 日期输入 | 支持公历+农历 |
| 时间输入 | 十二时辰选择器 + 「不确定」选项 |
| 访问控制 | 复用现有 access_token 机制 |
| AI 调用 | DashScope Application + SSE（新建八字专用 App） |

---

## 2. 整体架构

### 数据流

```
用户输入出生信息
  → 后端 BaziService 排盘计算(lunar-java)
    → 生成完整命盘数据(BaziChart)
      → 命盘数据作为 bizParams 传给 DashScope 八字 App
        → AI 流式解读(SSE)
          → 前端实时展示
```

### 导航结构

```
/                       → WelcomePage（增加占卜方式选择）
/tarot/spread           → SpreadSelectionPage（不变）
/tarot/direction        → DirectionSelectionPage（不变）
/tarot/drawing          → DrawingPage（不变）
/bazi/info              → BaziInfoPage（新增：出生信息输入）
/bazi/chart             → BaziChartPage（新增：命盘展示+AI 解读）
```

---

## 3. 后端设计

### 3.1 新增依赖

```xml
<!-- pom.xml -->
<dependency>
    <groupId>cn.6tail</groupId>
    <artifactId>lunar-java</artifactId>
    <version>1.30.0</version>
</dependency>
```

### 3.2 数据模型

#### BaziRequest — 排盘请求

```java
public class BaziRequest {
    private String birthDate;   // 日期，格式取决于 isLunar
                                //   公历: "1990-06-15"
                                //   农历: "1990-05-23"（农历五月廿三）
    private Boolean isLunar;    // 是否农历，默认 false
    private String gender;      // "male" 或 "female"
    private String shiChen;     // 时辰标识：
                                //   "zi","chou","yin","mao","chen","si",
                                //   "wu","wei","shen","you","xu","hai"
                                //   或 "unknown"（不确定）
    private String token;       // 访问口令（解读时需要，排盘不需要）
}
```

#### BaziChart — 命盘结果

```java
public class BaziChart {
    // 基本信息
    private String solarDate;        // 公历日期，如 "1990年6月15日"
    private String lunarDate;        // 农历日期，如 "庚午年五月廿三"
    private String gender;           // 性别
    private String genderText;       // "男" / "女"

    // 四柱
    private Pillar yearPillar;       // 年柱
    private Pillar monthPillar;      // 月柱
    private Pillar dayPillar;        // 日柱（日主）
    private Pillar hourPillar;       // 时柱（可能为 null，shiChen=unknown 时）

    // 五行统计
    private WuXingStats wuXingStats;

    // 十神（基于日干）
    private List<ShiShenRelation> shiShenList;

    // 大运
    private List<DaYun> daYunList;
    private DaYun currentDaYun;      // 当前大运

    // 标记
    private boolean hourPillarMissing; // 时柱是否缺失
}
```

#### Pillar — 天干地支柱

```java
public class Pillar {
    private String tianGan;          // 天干，如 "甲"
    private String diZhi;            // 地支，如 "子"
    private String tianGanWuXing;    // 天干五行，如 "木"
    private String diZhiWuXing;      // 地支五行，如 "水"
    private String yinYang;          // 阴阳，如 "阳"
    private String displayText;      // 显示文字，如 "甲子"
}
```

#### WuXingStats — 五行统计

```java
public class WuXingStats {
    private int jin;    // 金
    private int mu;     // 木
    private int shui;   // 水
    private int huo;    // 火
    private int tu;     // 土
    private String dayMasterWuXing;  // 日主五行
    private String strength;         // 日主强弱判断：身强/身弱/平衡
}
```

#### ShiShenRelation — 十神关系

```java
public class ShiShenRelation {
    private String position;     // 所在位置：年干/月干/时干/年支藏干/...
    private String tianGan;      // 对应的天干或藏干
    private String shiShen;      // 十神名称：比肩/劫财/食神/伤官/偏财/正财/七杀/正官/偏印/正印
    private String wuXing;       // 五行
}
```

#### DaYun — 大运

```java
public class DaYun {
    private int startAge;         // 起始年龄
    private int endAge;           // 结束年龄
    private String tianGan;       // 大运天干
    private String diZhi;         // 大运地支
    private String displayText;   // 如 "甲子"
    private boolean isCurrent;    // 是否当前大运
}
```

### 3.3 API 端点

#### 排盘

```
POST /api/bazi/chart
Content-Type: application/json

Request:
{
  "birthDate": "1990-06-15",
  "isLunar": false,
  "gender": "male",
  "shiChen": "wei"
}

Response:
{
  "solarDate": "1990年6月15日",
  "lunarDate": "庚午年五月廿三",
  "gender": "male",
  "genderText": "男",
  "yearPillar": { "tianGan": "庚", "diZhi": "午", ... },
  "monthPillar": { "tianGan": "壬", "diZhi": "午", ... },
  "dayPillar":   { "tianGan": "丁", "diZhi": "巳", ... },
  "hourPillar":  { "tianGan": "丁", "diZhi": "未", ... },
  "wuXingStats": { "jin": 2, "mu": 1, "shui": 1, "huo": 3, "tu": 1, ... },
  "shiShenList": [ ... ],
  "daYunList": [ ... ],
  "currentDaYun": { ... },
  "hourPillarMissing": false
}
```

#### AI 解读（SSE）

```
POST /api/bazi/interpret/stream
Content-Type: application/json

Request:
{
  "token": "xxx",
  "chart": { ... }    // 完整的 BaziChart JSON
}

Response: SSE 流
data:第一段解读...
data:第二段解读...
```

### 3.4 核心服务逻辑

#### BaziService

```java
@Service
public class BaziService {

    /**
     * 排盘计算
     * 1. 根据日期+isLunar 创建 Lunar 对象
     * 2. 获取八字（LunarEightChar）
     * 3. 提取四柱天干地支
     * 4. 统计五行
     * 5. 计算十神
     * 6. 排大运
     */
    public BaziChart calculateChart(BaziRequest request);

    /**
     * 流式 AI 解读
     * 复用 TarotService 的 SSE 架构
     * 使用八字专用的 DashScope AppId
     */
    public Flowable<ApplicationResult> getInterpretationStream(BaziChart chart);
}
```

#### 排盘核心流程（伪代码）

```java
public BaziChart calculateChart(BaziRequest request) {
    // 1. 创建日期对象
    Solar solar;
    if (request.getIsLunar()) {
        // 农历输入：解析为 Lunar 再转 Solar
        Lunar lunar = Lunar.fromYmd(year, month, day);
        solar = lunar.getSolar();
    } else {
        // 公历输入
        solar = Solar.fromYmd(year, month, day);
    }

    // 2. 获取八字
    Lunar lunarObj = solar.getLunar();
    EightChar eightChar = lunarObj.getEightChar();

    // 3. 四柱
    String yearGan = eightChar.getYearGan();
    String yearZhi = eightChar.getYearZhi();
    // ... 月、日同理

    // 4. 时柱处理
    if ("unknown".equals(request.getShiChen())) {
        // 时柱缺失
    } else {
        // 根据时辰映射到地支
        String hourZhi = shiChenToDiZhi(request.getShiChen());
        // 计算时干（根据日干推算）
    }

    // 5. 五行统计
    // 统计八个天干地支的五行属性

    // 6. 十神计算
    // 以日干为基准，计算其他干支与日干的十神关系

    // 7. 大运排盘
    // 根据性别和年柱阴阳确定顺逆
    // 计算起运年龄和每步大运

    return chart;
}
```

### 3.5 控制器

```java
@RestController
@RequestMapping("/api/bazi")
public class BaziController {

    @Autowired
    private BaziService baziService;

    @Autowired
    private RateLimitingService rateLimitingService;

    /**
     * 排盘 — 不需要 token，纯计算
     */
    @PostMapping("/chart")
    public ResponseEntity<BaziChart> calculateChart(@RequestBody BaziRequest request) {
        BaziChart chart = baziService.calculateChart(request);
        return ResponseEntity.ok(chart);
    }

    /**
     * AI 解读 — 需要 token，复用限流机制
     */
    @PostMapping(value = "/interpret/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter interpretStream(@RequestBody Map<String, Object> requestBody) {
        // 1. 验证 token（复用 rateLimitingService）
        // 2. 从请求中提取 chart 数据
        // 3. 调用 baziService.getInterpretationStream()
        // 4. 返回 SseEmitter（与 TarotController 相同模式）
    }
}
```

---

## 4. 百炼平台 AI 应用配置

### 4.1 应用创建信息

在阿里云百炼平台创建一个新的 Application，配置如下：

| 配置项 | 值 |
|--------|-----|
| 应用类型 | 智能体应用 |
| 模型 | qwen-max（或 qwen-plus，按需选择） |
| 应用名称 | AI 八字命理师 |
| 应用描述 | 专业的八字命理解读服务 |

### 4.2 System Prompt

以下为完整的 system prompt，复制到百炼平台的「人设与回复逻辑」中：

```markdown
# 角色设定

你是一位精通中国传统八字命理的大师，拥有深厚的命理学功底。你的任务是根据用户提供的八字命盘数据，进行专业、详细且通俗易懂的命理解读。

# 基本原则

1. **基于数据解读**：你必须严格基于系统提供的命盘数据（四柱、五行、十神、大运）进行分析，不得凭空编造命盘信息。
2. **专业且通俗**：使用专业的命理术语，但必须用通俗的语言解释其含义，让不懂命理的人也能理解。
3. **客观中立**：命理解读应客观中立，不夸大不恐吓。遇到不利信息时，应提供建设性的建议。
4. **娱乐免责**：在解读开头注明"以下解读仅供娱乐参考，不构成任何人生决策建议"。

# 解读结构

请按以下结构进行解读，每个部分都要详细展开：

## 一、命盘总览

简要介绍用户的八字命盘构成，点明日主（日柱天干）是什么，属于什么五行，在整个命局中的强弱。

## 二、五行分析

分析用户八字中五行的分布情况：
- 哪些五行较旺，哪些五行较弱或缺失
- 五行是否平衡，对日主的影响
- 给出五行喜用建议（喜什么五行、忌什么五行）

## 三、十神格局

分析主要的十神关系：
- 列出主要的十神及其含义
- 分析命局的整体格局倾向（如食伤生财、官印相生等）
- 说明这些格局对性格和运势的影响

## 四、四柱详解

分别解读年柱、月柱、日柱、时柱（若有时柱）的含义：
- **年柱**：祖上根基、早年运势、与长辈的关系
- **月柱**：父母家庭、青年运势、事业发展基础
- **日柱**：自身性格、婚姻感情、中年运势
- **时柱**：晚年运势、子女缘分、人生归宿（若时柱缺失，说明影响并基于三柱分析）

## 五、大运走势

分析当前大运及未来几步大运：
- 当前大运的天干地支及其对命局的影响
- 未来2-3步大运的简要趋势
- 每步大运中需要特别注意的方面

## 六、综合建议

基于以上分析，给出综合性的建议：
- 事业方向建议
- 感情婚姻建议
- 健康注意事项
- 开运建议（颜色、方位、数字等）

# 格式要求

1. 使用 Markdown 格式输出
2. 每个章节使用 `##` 标题
3. 重点内容使用 **加粗** 标注
4. 适当使用列表使内容清晰
5. 语言风格温和亲切，像一位智慧长者在给你讲解

# 注意事项

- 如果用户消息中「时柱状态」为"缺失"，在解读中明确说明时柱未知，并基于年柱、月柱、日柱三柱进行分析
- 解读中提到的天干地支必须与系统提供的命盘数据完全一致
- 不要出现自相矛盾的论述
```

### 4.3 用户消息模板

在百炼平台配置一个用户消息占位，后端调用时传入实际内容：

```
请为我解读以下八字命盘：

姓名/性别：{{genderText}}
出生日期（公历）：{{solarDate}}
出生日期（农历）：{{lunarDate}}
时柱状态：{{hourPillarStatus}}

## 四柱八字

| 柱位 | 天干 | 地支 | 天干五行 | 地支五行 |
|------|------|------|----------|----------|
| 年柱 | {{yearGan}} | {{yearZhi}} | {{yearGanWX}} | {{yearZhiWX}} |
| 月柱 | {{monthGan}} | {{monthZhi}} | {{monthGanWX}} | {{monthZhiWX}} |
| 日柱 | {{dayGan}} | {{dayZhi}} | {{dayGanWX}} | {{dayZhiWX}} |
| 时柱 | {{hourGan}} | {{hourZhi}} | {{hourGanWX}} | {{hourZhiWX}} |

## 五行统计

金：{{jin}}个 | 木：{{mu}}个 | 水：{{shui}}个 | 火：{{huo}}个 | 土：{{tu}}个
日主五行：{{dayMasterWX}}
日主强弱：{{strength}}

## 十神关系

{{shiShenDetail}}

## 大运

{{daYunDetail}}
当前大运：{{currentDaYun}}（{{currentDaYunAge}}岁-{{currentDaYunEndAge}}岁）
```

### 4.4 bizParams 数据结构

后端调用 DashScope Application 时，通过 `bizParams` 传入命盘数据。以下是传给百炼平台的 JSON 结构：

```json
{
  "genderText": "男",
  "solarDate": "1990年6月15日",
  "lunarDate": "庚午年五月廿三",
  "hourPillarStatus": "完整",
  "yearGan": "庚", "yearZhi": "午", "yearGanWX": "金", "yearZhiWX": "火",
  "monthGan": "壬", "monthZhi": "午", "monthGanWX": "水", "monthZhiWX": "火",
  "dayGan": "丁", "dayZhi": "巳", "dayGanWX": "火", "dayZhiWX": "火",
  "hourGan": "丁", "hourZhi": "未", "hourGanWX": "火", "hourZhiWX": "土",
  "jin": 2, "mu": 1, "shui": 1, "huo": 3, "tu": 1,
  "dayMasterWX": "火",
  "strength": "身强",
  "shiShenDetail": "- 年干 庚(金) → 正财\n- 月干 壬(水) → 正官\n- 时干 丁(火) → 比肩\n- 年支午藏干 丁(火) → 比肩，己(土) → 食神\n- 月支午藏干 丁(火) → 比肩，己(土) → 食神\n- 时支未藏干 己(土) → 食神，丁(火) → 比肩，乙(木) → 印绶",
  "daYunDetail": "- 癸未(0-9岁) → 甲申(10-19岁) → 乙酉(20-29岁) → 丙戌(30-39岁) → 丁亥(40-49岁) → 戊子(50-59岁) → 己丑(60-69岁)",
  "currentDaYun": "丙戌",
  "currentDaYunAge": "30",
  "currentDaYunEndAge": "39"
}
```

### 4.5 后端调用代码参考

```java
// 在 BaziService.java 中
public Flowable<ApplicationResult> getInterpretationStream(BaziChart chart) {
    // 构建 bizParams（将 chart 转为上方的 JSON 结构）
    Map<String, Object> bizParams = buildBizParams(chart);

    ApplicationParam param = ApplicationParam.builder()
        .apiKey(dashScopeConfig.getApiKey())
        .appId(dashScopeConfig.getBaziAppId())  // 八字专用 AppId
        .prompt("排盘完成")                        // 触发词
        .bizParams(bizParams)
        .incrementalOutput(true)
        .flowStreamMode(FlowStreamMode.MESSAGE_FORMAT)
        .build();

    Application application = new Application();
    return application.streamCall(param);
}
```

### 4.6 配置项新增

在 `application-dev.properties` 和 `application-prod.properties` 中新增：

```properties
# 八字命理 DashScope App
dashscope.bazi.app-id=${DASH_SCOPE_BAZI_APP_ID:}
```

同时修改 `DashScopeConfig.java`，增加 `baziAppId` 字段。

---

## 5. 前端设计

### 5.1 页面流程

```
首页选择「八字命理」
  → BaziInfoPage（输入出生信息）
    → BaziChartPage（命盘展示 + AI 解读）
```

### 5.2 BaziInfoPage（信息输入页）

页面布局：

```
┌─────────────────────────────────┐
│          八字命理排盘             │
│                                 │
│  📅 日期类型                     │
│  [公历] [农历]    ← 切换按钮     │
│                                 │
│  📆 出生日期                     │
│  [日期选择器 / 农历选择器]        │
│                                 │
│  ⏰ 出生时辰                     │
│  ┌──────┬──────┬──────┐        │
│  │ 子时  │ 丑时  │ 寅时  │        │
│  ├──────┼──────┼──────┤        │
│  │ 卯时  │ 辰时  │ 巳时  │        │
│  ├──────┼──────┼──────┤        │
│  │ 午时  │ 未时  │ 申时  │        │
│  ├──────┼──────┼──────┤        │
│  │ 酉时  │ 戌时  │ 亥时  │        │
│  ├──────┴──────┴──────┤        │
│  │    不确定出生时间     │        │
│  └─────────────────────┘        │
│                                 │
│  👤 性别                        │
│  [男] [女]                       │
│                                 │
│  🔑 访问口令                     │
│  [____________]                 │
│                                 │
│       [ 开始排盘 ]              │
└─────────────────────────────────┘
```

组件划分：
- `ShiChenSelector.jsx` — 时辰选择网格
- `LunarDatePicker.jsx` — 农历日期选择器（三组下拉：年、月、日）
- 公历模式直接用 `<input type="date">`

### 5.3 BaziChartPage（命盘+解读页）

页面布局：

```
┌─────────────────────────────────┐
│  ← 返回          八字命盘         │
│                                 │
│  ┌──── 命盘信息 ────────────┐   │
│  │ 男  公历:1990-06-15      │   │
│  │     农历:庚午年五月廿三   │   │
│  └──────────────────────────┘   │
│                                 │
│  ┌──── 四柱八字 ────────────┐   │
│  │  年柱   月柱   日柱   时柱 │   │
│  │  庚午   壬午   丁巳   丁未 │   │
│  │  金火   水火   火火   火土 │   │
│  └──────────────────────────┘   │
│                                 │
│  ┌──── 五行分布 ────────────┐   │
│  │ 金 ■■░░░ 2               │   │
│  │ 木 ■░░░░ 1               │   │
│  │ 水 ■░░░░ 1               │   │
│  │ 火 ■■■░░ 3  ← 日主       │   │
│  │ 土 ■░░░░ 1               │   │
│  │ 日主:丁火 身强            │   │
│  └──────────────────────────┘   │
│                                 │
│  ┌──── 当前大运 ────────────┐   │
│  │ 丙戌 (30-39岁)           │   │
│  └──────────────────────────┘   │
│                                 │
│  ┌──── AI 命理解读 ────────┐    │
│  │ (BufferedMarkdown 组件)  │    │
│  │ ## 一、命盘总览          │    │
│  │ 您的日主为丁火...        │    │
│  │ ...（流式输出中）         │    │
│  └──────────────────────────┘   │
│                                 │
│  [ 分享命盘 ]                   │
└─────────────────────────────────┘
```

### 5.4 状态管理

扩展 `TarotContext` 为通用 `AppContext`，新增八字相关状态：

```javascript
{
  // 现有塔罗牌状态保持不变
  spreads: [],
  selectedSpread: null,
  selectedDirection: null,
  cards: [],
  flippedCards: new Set(),
  interpretation: null,
  token: localStorage.getItem('tarot_token') || '',

  // 新增八字状态
  baziRequest: null,        // 用户输入的出生信息
  baziChart: null,          // 排盘结果（BaziChart）
  baziInterpretation: '',   // AI 解读文本
}
```

### 5.5 API 调用

```javascript
// api.js 新增
export const baziApi = {
  // 排盘
  calculateChart: async (birthDate, isLunar, gender, shiChen) => {
    const response = await fetch(`${API_BASE_URL}/bazi/chart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birthDate, isLunar, gender, shiChen }),
    });
    return response.json();
  },

  // AI 解读（SSE 流式）
  interpretStream: async (token, chart, { onChunk, onComplete, onError }) => {
    // 与塔罗牌 interpretStream 相同的 SSE 处理逻辑
    const response = await fetch(`${API_BASE_URL}/bazi/interpret/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, chart }),
    });
    // ... SSE 解析逻辑同 TarotController
  },
};
```

---

## 6. 变更清单

### 后端新增

| 文件 | 说明 |
|------|------|
| `pom.xml` | 新增 `lunar-java` 依赖 |
| `model/bazi/BaziRequest.java` | 排盘请求 DTO |
| `model/bazi/BaziChart.java` | 命盘结果 |
| `model/bazi/Pillar.java` | 天干地支柱 |
| `model/bazi/WuXingStats.java` | 五行统计 |
| `model/bazi/ShiShenRelation.java` | 十神关系 |
| `model/bazi/DaYun.java` | 大运 |
| `service/BaziService.java` | 排盘计算 + AI 解读 |
| `controller/BaziController.java` | API 端点 |
| `config/DashScopeConfig.java` | 新增 `baziAppId` |
| `application-*.properties` | 新增 `dashscope.bazi.app-id` |

### 前端新增

| 文件 | 说明 |
|------|------|
| `pages/BaziInfoPage.jsx` | 出生信息输入页 |
| `pages/BaziChartPage.jsx` | 命盘展示+AI 解读页 |
| `components/bazi/ChartDisplay.jsx` | 命盘可视化组件 |
| `components/bazi/ShiChenSelector.jsx` | 时辰选择组件 |
| `components/bazi/LunarDatePicker.jsx` | 农历日期选择器 |

### 前端修改

| 文件 | 说明 |
|------|------|
| `pages/WelcomePage.jsx` | 增加占卜方式选择入口 |
| `services/api.js` | 新增八字 API 调用 |
| `contexts/TarotContext.jsx` | 扩展状态 |
| `App.jsx` | 新增路由 |

### 不变

- 数据库 schema（复用 `access_token` 表）
- `RateLimitingService`（复用）
- 塔罗牌全部功能（零改动）
