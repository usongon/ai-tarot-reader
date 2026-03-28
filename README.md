# 灵境占卜 - AI智能占卜应用

> 🔮 一个基于AI驱动的现代化占卜Web应用，融合塔罗牌解读与八字命理分析

![Tech Stack](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=flat-square&logo=react)
![Tech Stack](https://img.shields.io/badge/Backend-Spring%20Boot%203.5-6DB33F?style=flat-square&logo=spring)
![Tech Stack](https://img.shields.io/badge/AI-DashScope-FF6B35?style=flat-square)
![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ 项目特色

### 🎯 核心功能
- **🃏 塔罗牌占卜**: 78张标准塔罗牌，支持单张牌、三牌阵、凯尔特十字等经典牌阵
- **🧭 八字命理排盘**: 基于lunar-java的专业八字排盘，支持公历/农历输入、五行统计、十神关系、大运分析
- **🤖 AI智能解读**: 集成阿里云DashScope，流式输出个性化解读结果
- **🎨 沉浸式体验**: 精美的卡牌翻转动画和神秘主题设计
- **📱 分享功能**: 一键生成精美的占卜/命盘结果卡片

### 🎪 塔罗占卜体验
- **四阶段占卜流程**: 欢迎页 → 选择牌阵 → 选择方向 → 抽牌解读
- **八大占卜方向**: 爱情、事业、健康、财运、感情发展、学业、人缘、综合运势
- **正逆位系统**: 随机生成正位/逆位，提供不同维度的解读

### 🧭 八字命理体验
- **专业排盘**: 支持公历/农历日期、十二时辰选择
- **四柱八字**: 年柱、月柱、日柱、时柱完整展示
- **五行分析**: 金木水火土统计、身强身弱判断
- **十神关系**: 天干十神、地支藏干十神完整推算
- **大运走势**: 大运时间线展示，自动定位当前大运
- **流式解读**: AI基于完整命盘信息进行专业解读

## 🛠️ 技术架构

### 前端技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.2.0 | 前端框架 |
| Vite | 7.3.1 | 构建工具 |
| Framer Motion | 12.34.0 | 动画库 |
| React Markdown | 10.1.0 | Markdown渲染 |
| html2canvas | 1.4.1 | 截图分享 |
| Tailwind CSS | CDN | 样式框架 |

### 后端技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| Spring Boot | 3.5.3 | 后端框架 |
| Spring Data JPA | - | ORM框架 |
| MySQL Connector | - | 数据库连接 |
| DashScope SDK | 2.20.8 | 阿里云AI服务 |
| lunar-java | 1.7.4 | 农历/八字计算 |
| Java | 21 | 编程语言 |

### 数据存储
- **MySQL 8.0+**: 存储访问口令和使用次数
- **数据库表结构**: 参见 [`backend/src/main/resources/schema.sql`](backend/src/main/resources/schema.sql)

## 🚀 快速开始

### 环境要求

- **Java**: JDK 21+
- **Node.js**: 16.0+
- **Maven**: 3.6+
- **MySQL**: 8.0+
- **阿里云DashScope账号** (用于AI解读功能)

### 1️⃣ 克隆项目

```bash
git clone https://github.com/usongon/ai-tarot-reader.git
cd ai-tarot-reader
```

### 2️⃣ 数据库配置

在 MySQL 中执行建表脚本：

```bash
mysql -h <数据库地址> -u <用户名> -p < backend/src/main/resources/schema.sql
```

### 3️⃣ 后端配置

后端支持多环境配置，配置文件位于 `backend/src/main/resources/`：

| 文件 | 用途 |
|------|------|
| `application.properties` | 公共配置，切换环境 |
| `application-dev.properties` | 开发环境配置 |
| `application-prod.properties` | 生产环境配置 |

**需要配置的项目：**

```properties
# MySQL 数据库连接
spring.datasource.url=jdbc:mysql://<地址>:3306/tarot_reader?useSSL=true&serverTimezone=Asia/Shanghai
spring.datasource.username=<用户名>
spring.datasource.password=<密码>

# 阿里云 DashScope API 配置
dashscope.api-key=<你的API密钥>
dashscope.app-id=<塔罗牌应用ID>
dashscope.bazi-app-id=<八字命理应用ID>
```

**切换环境：**

```properties
# application.properties
spring.profiles.active=dev   # 开发环境
spring.profiles.active=prod  # 生产环境
```

或通过启动参数：`java -jar app.jar --spring.profiles.active=prod`

### 4️⃣ 启动后端服务

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

后端服务将在 `http://localhost:8080` 启动

### 5️⃣ 启动前端应用

```bash
cd frontend
npm install
npm run dev
```

前端应用将在 `http://localhost:5173` 启动

## 📡 API 接口文档

### 获取所有牌阵
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
    "descriptionChinese": "最简单的占卜方式",
    "numberOfCards": 1
  }
]
```

### 获取洗好的牌堆
```http
GET /api/deck
```

返回78张已洗牌的塔罗牌，每张牌包含正逆位状态。

### 根据牌阵抽牌
```http
POST /api/draw
Content-Type: application/json

{
  "spreadId": "three-card"
}
```

### AI解读服务（塔罗牌）
```http
POST /api/interpret
Content-Type: application/json

{
  "token": "YOUR_ACCESS_TOKEN",
  "direction": "爱情",
  "spreadName": "三牌阵",
  "cards": [
    {
      "name": "The Lovers",
      "nameChinese": "恋人",
      "reversed": false
    }
  ]
}
```

### 八字排盘
```http
POST /api/bazi/chart
Content-Type: application/json

{
  "birthDate": "1990-06-15",
  "isLunar": false,
  "gender": "male",
  "shiChen": "wu"
}
```

### 八字AI解读（流式SSE）
```http
POST /api/bazi/interpret/stream
Content-Type: application/json

{
  "token": "YOUR_ACCESS_TOKEN",
  "chart": { ... }
}
```

## 📁 项目结构

```
ai-tarot-reader/
├── 📂 backend/                      # Spring Boot 后端
│   ├── 📂 src/main/java/com/example/tarotreader/
│   │   ├── 📂 config/               # 配置类
│   │   │   ├── DashScopeConfig.java # AI配置
│   │   │   └── WebConfig.java       # CORS配置
│   │   ├── 📂 controller/           # REST控制器
│   │   ├── 📂 model/                # 数据模型
│   │   │   └── 📂 bazi/             # 八字命理模型
│   │   ├── 📂 repository/           # 数据访问层
│   │   ├── 📂 service/              # 业务逻辑层
│   │   │   └── BaziService.java     # 八字排盘+解读
│   │   └── 📄 TarotReaderApplication.java
│   ├── 📂 src/main/resources/
│   │   ├── 📄 application.properties
│   │   ├── 📄 application-dev.properties
│   │   ├── 📄 application-prod.properties
│   │   └── 📄 schema.sql            # 数据库建表脚本
│   └── 📄 pom.xml
├── 📂 frontend/                     # React 前端
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── 📂 ui/               # UI通用组件
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── TarotCard.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── BufferedMarkdown.jsx
│   │   │   │   └── ShareCard.jsx
│   │   │   └── 📂 bazi/             # 八字命理组件
│   │   │       ├── ChartDisplay.jsx
│   │   │       ├── ShiChenSelector.jsx
│   │   │       ├── LunarDatePicker.jsx
│   │   │       ├── SolarDatePicker.jsx
│   │   │       └── BaziShareCard.jsx
│   │   ├── 📂 pages/                # 页面组件
│   │   │   ├── WelcomePage.jsx
│   │   │   ├── SpreadSelectionPage.jsx
│   │   │   ├── DirectionSelectionPage.jsx
│   │   │   ├── DrawingPage.jsx
│   │   │   ├── BaziInfoPage.jsx
│   │   │   └── BaziChartPage.jsx
│   │   ├── 📂 contexts/             # 状态管理
│   │   │   └── TarotContext.jsx
│   │   ├── 📂 services/             # API封装
│   │   │   └── api.js
│   │   ├── 📄 App.jsx
│   │   └── 📄 main.jsx
│   ├── 📄 package.json
│   └── 📄 vite.config.js
├── 📄 deploy.sh                     # 一键部署脚本
├── 📄 LICENSE
└── 📄 README.md
```

## 🎮 功能详解

### 🃏 塔罗牌牌阵系统

| 牌阵类型 | 牌数 | 适用场景 | 解读维度 |
|---------|------|----------|----------|
| **单张牌** | 1张 | 快速运势查看 | 当前状态/核心问题 |
| **三牌阵** | 3张 | 时间线分析 | 过去/现在/未来 |
| **凯尔特十字** | 10张 | 深度问题剖析 | 全方位综合分析 |

### 🎭 占卜方向

- **💕 爱情**: 感情状态、恋爱机会、关系发展
- **💼 事业**: 职场运势、项目进展、升职加薪
- **💰 财运**: 投资理财、收入状况、财富累积
- **🏥 健康**: 身体状态、养生建议
- **💑 感情发展**: 关系走向、情感建议
- **📚 学业**: 考试运势、学习状态
- **👥 人缘**: 人际关系、社交运势
- **🌟 综合运势**: 整体运势、生活状态

### 🔐 访问控制

- 基于口令的访问控制，保护 AI 解读服务
- 每个口令有使用次数限制
- 口令存储在 MySQL 数据库中，支持动态管理

## 🎨 UI设计特点

- **神秘主题**: 深紫色渐变背景，营造神秘氛围
- **3D翻转**: 塔罗牌翻转动画，还原真实抽牌体验
- **流畅过渡**: Framer Motion 驱动的页面切换动画
- **响应式设计**: 完美适配桌面和移动端
- **分享卡片**: 一键生成精美的占卜结果图片

## 📝 许可证

本项目采用 [MIT 许可证](LICENSE)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📞 联系方式

- 📧 Email: [zdhuntero@gmail.com]
- 🐛 Issues: [https://github.com/usongon/ai-tarot-reader/issues]
- 🌟 GitHub: [https://github.com/usongon/ai-tarot-reader]

---

> 💫 愿灵境智慧照亮你的人生道路 ✨
