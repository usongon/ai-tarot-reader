# Tarot Reader - AI智能塔罗牌解读应用

> 🔮 一个基于AI驱动的现代化塔罗牌解读Web应用，融合传统塔罗智慧与人工智能技术

![Tech Stack](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=flat-square&logo=react)
![Tech Stack](https://img.shields.io/badge/Backend-Spring%20Boot%203-6DB33F?style=flat-square&logo=spring)
![Tech Stack](https://img.shields.io/badge/AI-DashScope-FF6B35?style=flat-square)
![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk)

## ✨ 项目特色

### 🎯 核心功能
- **🃏 完整塔罗牌库**: 78张标准塔罗牌，包含大阿卡纳(22张)和小阿卡纳(56张)
- **🎭 多样牌阵系统**: 支持单张牌、三牌阵、凯尔特十字等经典牌阵
- **🤖 AI智能解读**: 集成阿里云DashScope，提供个性化的塔罗牌解读
- **🎨 沉浸式体验**: 精美的卡牌翻转动画和神秘主题设计
- **📱 响应式设计**: 完美适配桌面端和移动端设备

### 🎪 交互体验
- **四阶段占卜流程**: 选择牌阵 → 选择主题 → 虚拟抽牌 → AI解读
- **五大占卜方向**: 事业、爱情、财运、健康、综合运势
- **正逆位系统**: 随机生成正位/逆位，提供不同维度的解读
- **实时反馈**: 流畅的动画效果和即时的用户反馈

## 🛠️ 技术架构

### 前端技术栈
```json
{
  "framework": "React 19.1.0",
  "ui_library": "React Bootstrap 2.10.10 + Bootstrap 5.3.7",
  "markdown": "React Markdown 10.1.0 + Remark GFM 4.0.1",
  "build_tool": "React Scripts 5.0.1",
  "styling": "CSS3 + CSS Variables + Google Fonts"
}
```

### 后端技术栈
```xml
<dependencies>
  <spring-boot>3.5.3</spring-boot>
  <java>21</java>
  <dashscope-sdk>2.20.8</dashscope-sdk>
  <maven>Build Tool</maven>
</dependencies>
```

### AI服务集成
- **阿里云DashScope**: 大语言模型API，提供专业塔罗牌解读服务
- **自定义提示工程**: 针对塔罗牌场景优化的AI解读逻辑

## 🎮 功能详解

### 🃏 塔罗牌牌阵系统

| 牌阵类型 | 牌数 | 适用场景 | 解读维度 |
|---------|------|----------|----------|
| **单张牌** | 1张 | 快速运势查看 | 当前状态/核心问题 |
| **三牌阵** | 3张 | 时间线分析 | 过去/现在/未来 |
| **凯尔特十字** | 10张 | 深度问题剖析 | 全方位综合分析 |

### 🎭 占卜主题分类

- **💼 事业发展**: 职场运势、项目进展、升职加薪
- **💕 爱情关系**: 感情状态、恋爱机会、关系发展
- **💰 财运分析**: 投资理财、收入状况、财富累积
- **🏥 健康状况**: 身体状态、养生建议、疾病预防
- **🌟 综合运势**: 整体运势、生活状态、未来趋势

### 🤖 AI解读特色

- **个性化解读**: 结合牌阵、主题、正逆位进行定制化分析
- **专业术语**: 使用正宗塔罗牌解读术语和象征意义
- **Markdown渲染**: 支持格式化文本，提供结构化的解读报告
- **多层次分析**: 从象征意义到实际指导的全方位解读

## 🚀 快速开始

### 环境要求

- **Java**: JDK 21+
- **Node.js**: 16.0+
- **Maven**: 3.6+
- **阿里云DashScope账号** (可选，用于AI解读功能)

### 1️⃣ 克隆项目

```bash
git clone <repository-url>
cd tarot-reader
```

### 2️⃣ 环境变量配置

在项目根目录创建 `.env` 文件：

```bash
# 阿里云DashScope配置 (如需AI解读必填)
DASH_SCOPE_API_KEY=your_dashscope_api_key
DASH_SCOPE_TAROT_READER_APP_ID=your_app_id
```

### 3️⃣ 启动后端服务

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

后端服务将在 `http://localhost:8080` 启动

### 4️⃣ 启动前端应用

```bash
cd frontend
npm install
npm start
```

前端应用将在 `http://localhost:3000` 启动并自动打开浏览器

## 📡 API 接口文档

### 🃏 牌阵管理

#### 获取所有牌阵
```http
GET /api/spreads
```

**响应示例:**
```json
[
  {
    "id": "single",
    "name": "Single Card",
    "nameChinese": "单张牌",
    "description": "A single card for a quick reading.",
    "descriptionChinese": "最简单的占卜方式，只抽取一张牌",
    "numberOfCards": 1
  },
  {
    "id": "three-card",
    "name": "Three Card Spread", 
    "nameChinese": "三牌阵",
    "description": "A spread for past, present, and future.",
    "descriptionChinese": "经典的三牌阵，分别代表问题的过去、现在和未来",
    "numberOfCards": 3
  }
]
```

### 🎴 牌堆管理

#### 获取洗好的牌堆
```http
GET /api/deck
```

**响应说明**: 返回78张已洗牌的塔罗牌，每张牌包含正逆位状态和完整信息

### 🎯 抽牌功能

#### 根据牌阵抽牌
```http
POST /api/draw
Content-Type: application/json

{
  "spreadId": "three-card"
}
```

### 🤖 AI解读服务

#### 获取AI解读
```http
POST /api/interpret
Content-Type: application/json

{
  "direction": "爱情",
  "spreadName": "三牌阵",
  "cards": [
    {
      "name": "The Lovers",
      "nameChinese": "恋人",
      "reversed": false,
      "uprightMeaning": "Love, harmony, relationships",
      "uprightMeaningChinese": "爱、和谐、关系",
      "reversedMeaning": "Self-love, disharmony, imbalance",
      "reversedMeaningChinese": "自爱、不和谐、失衡"
    }
  ]
}
```

## 📁 项目结构

```
tarot-reader/
├── 📂 backend/                 # Spring Boot 后端
│   ├── 📂 src/main/java/
│   │   └── 📂 com/example/tarotreader/
│   │       ├── 📂 controller/   # REST控制器
│   │       ├── 📂 service/      # 业务逻辑层
│   │       ├── 📂 model/        # 数据模型
│   │       └── 📄 TarotReaderApplication.java
│   └── 📄 pom.xml              # Maven配置
├── 📂 frontend/                # React 前端
│   ├── 📂 src/
│   │   ├── 📄 App.js           # 主应用组件
│   │   ├── 📄 App.css          # 样式文件
│   │   └── 📄 index.js         # 入口文件
│   ├── 📂 public/              # 静态资源
│   └── 📄 package.json         # NPM配置
└── 📄 README.md               # 项目文档
```

## 🎨 核心组件设计

### 前端架构

```javascript
// 游戏状态管理
const GamePhase = {
    SELECTION: '选择牌阵',
    TOPIC_SELECTION: '选择主题', 
    DRAWING: '抽牌阶段',
    RESULT: '结果展示'
};

// 占卜主题
const DIVINATION_TOPICS = [
    "事业", "爱情", "财运", "健康", "综合运势"
];
```

### 后端服务层

```java
@Service
public class TarotService {
    // 牌堆管理
    public List<TarotCard> getShuffledDeck();
    
    // 牌阵管理  
    public List<TarotSpread> getSpreads();
    
    // 抽牌逻辑
    public List<TarotCard> draw(TarotSpread spread);
    
    // AI解读
    public String getInterpretation(InterpretationRequest request);
}
```

## 🔧 开发指南

### 前端开发

- **组件化设计**: 采用React Hooks进行状态管理
- **样式系统**: 使用CSS Variables实现主题化设计
- **动画效果**: CSS3 Transform + Transition实现流畅动画
- **响应式布局**: Bootstrap Grid + 自定义媒体查询

### 后端开发

- **RESTful API**: 遵循REST设计原则
- **服务分层**: Controller → Service → Model 清晰分层
- **依赖注入**: 使用Spring框架的IoC容器
- **数据模型**: 完整的塔罗牌实体设计

### AI集成

- **DashScope SDK**: 阿里云大语言模型集成
- **提示工程**: 针对塔罗牌场景的专业提示词
- **错误处理**: 完善的AI服务降级机制

## 🌟 特色亮点

### 🎨 视觉设计
- **神秘主题**: 深紫色调配合星空背景
- **卡牌动画**: 3D翻转效果和缩放动画
- **自定义字体**: Google Fonts 优雅字体搭配
- **响应式UI**: 完美适配各种屏幕尺寸

### 🔮 用户体验
- **直观操作**: 点击翻牌的沉浸式体验
- **智能引导**: 清晰的操作步骤和进度提示
- **实时反馈**: 加载状态和操作反馈
- **个性化**: 多主题选择和定制化解读

### 🚀 技术创新
- **现代化技术栈**: 最新版本的React和Spring Boot
- **AI驱动**: 智能化的塔罗牌解读服务
- **微服务架构**: 前后端分离的现代化架构
- **云服务集成**: 阿里云AI服务无缝对接

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [项目Issues页面]
- 💬 Discussions: [项目讨论区]

---

> 💫 愿塔罗智慧照亮你的人生道路 ✨