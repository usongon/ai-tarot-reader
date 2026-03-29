# 灵境占卜 - AI智能占卜应用

> 基于AI驱动的现代化占卜Web应用，融合塔罗牌解读与八字命理分析

**在线体验**: [http://usong.cc](http://usong.cc) (限量体验Token: `eddc0e6b2ded11988b3fdd25eaf22039`)

![Tech Stack](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=flat-square&logo=react)
![Tech Stack](https://img.shields.io/badge/Gateway-Spring%20Cloud%20Gateway-6DB33F?style=flat-square&logo=spring)
![Tech Stack](https://img.shields.io/badge/Registry-Nacos-00C1DE?style=flat-square)
![Tech Stack](https://img.shields.io/badge/AI-DashScope-FF6B35?style=flat-square)
![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 项目特色

### 核心功能
- **塔罗牌占卜**: 78张标准塔罗牌，支持单张牌、三牌阵、凯尔特十字等经典牌阵
- **八字命理排盘**: 基于lunar-java的专业八字排盘，支持公历/农历输入、五行统计、十神关系、大运分析
- **AI智能解读**: 集成阿里云DashScope，流式输出个性化解读结果
- **沉浸式体验**: 精美的卡牌翻转动画和神秘主题设计
- **移动端适配**: 完整的手机端响应式布局
- **分享功能**: 一键生成精美的占卜/命盘结果卡片

### 塔罗占卜体验
- 四阶段占卜流程: 欢迎页 → 选择牌阵 → 选择方向 → 抽牌解读
- 八大占卜方向: 爱情、事业、健康、财运、感情发展、学业、人缘、综合运势
- 正逆位系统: 随机生成正位/逆位，提供不同维度的解读

### 八字命理体验
- 专业排盘: 支持公历/农历日期、十二时辰选择
- 四柱八字: 年柱、月柱、日柱、时柱完整展示
- 五行分析: 金木水火土统计、身强身弱判断
- 十神关系: 天干十神、地支藏干十神完整推算
- 大运走势: 大运时间线展示，自动定位当前大运

## 技术架构

微服务架构，基于 Spring Cloud Alibaba + Nacos + Docker Compose 部署。

```
                    ┌─────────────┐
                    │   Nginx     │ :80 → 前端静态资源
                    │   (宿主机)   │ :80/api/* → :8080
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Gateway   │ :8080
                    │  (Docker)   │ 路由 /api/** → tarot-service
                    └──────┬──────┘
                           │ Nacos 服务发现
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐    ...    ┌──────▼──────┐
       │tarot-service│          │user-service │  (骨架)
       │  (Docker)   │          │  (Docker)   │
       │   :8081     │          │   :8082     │
       └──────┬──────┘          └─────────────┘
              │
       ┌──────▼──────┐
       │  MySQL RDS  │  阿里云 RDS
       │   :3306     │
       └─────────────┘
```

### 后端技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| Spring Boot | 3.5.3 | 基础框架 |
| Spring Cloud Gateway (MVC) | 2025.0.0 | API 网关 |
| Spring Cloud Alibaba | 2023.0.3.2 | 微服务组件 |
| Nacos | 2.4.3 | 服务注册与发现 |
| Spring Data JPA | - | ORM框架 |
| DashScope SDK | 2.22.9 | 阿里云AI服务 |
| lunar-java | 1.7.7 | 农历/八字计算 |
| Java | 21 | 编程语言 |

### 前端技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.2.0 | 前端框架 |
| Vite | 7.3.1 | 构建工具 |
| Framer Motion | 12.34.0 | 动画库 |
| React Markdown | 10.1.0 | Markdown渲染 |
| html2canvas | 1.4.1 | 截图分享 |

## 快速开始

### 环境要求

- Java 21+
- Node.js 16+
- Docker & Docker Compose (生产部署)
- MySQL 8.0+
- 阿里云 DashScope 账号

### 本地开发

**1. 克隆项目**

```bash
git clone https://github.com/usongon/ai-tarot-reader.git
cd ai-tarot-reader
```

**2. 启动基础设施**

```bash
docker compose up -d nacos mysql
```

**3. 启动后端服务**

```bash
# 先安装父 POM 和 common 模块
./mvnw install -N
./mvnw install -pl common -DskipTests

# 启动 tarot-service (端口 8081)
./mvnw spring-boot:run -pl tarot-service

# 启动 gateway-service (端口 8080)
./mvnw spring-boot:run -pl gateway-service
```

**4. 启动前端**

```bash
cd frontend
npm install
npm run dev
```

前端将在 `http://localhost:5173` 启动，API 请求自动代理到 Gateway (8080)。

### 生产部署

```bash
# 一键构建并部署
./deploy.sh

# 跳过构建，只部署
./deploy.sh --skip-build

# 只部署前端
./deploy.sh --skip-backend
```

## 项目结构

```
ai-tarot-reader/
├── common/                          # 公共模块 (DTO、工具类)
├── gateway-service/                 # API 网关 (:8080)
├── tarot-service/                   # 塔罗牌 + 八字命理服务 (:8081)
│   └── src/main/java/cc/usong/tarot/
│       ├── config/                  # 配置类
│       ├── controller/              # REST 控制器
│       ├── model/                   # 数据模型 (塔罗牌 + 八字)
│       ├── repository/              # 数据访问层
│       └── service/                 # 业务逻辑
├── user-service/                    # 用户服务 (骨架，:8082)
├── payment-service/                 # 支付服务 (骨架，:8083)
├── fortune-service/                 # 运势订阅服务 (骨架，:8084)
├── community-service/               # 社区服务 (骨架，:8085)
├── frontend/                        # React 前端
├── docker-compose.yml               # 开发环境基础设施
├── docker-compose.prod.yml          # 生产环境完整部署
├── deploy.sh                        # 一键部署脚本
└── pom.xml                          # Maven 父 POM
```

## API 接口

### 塔罗牌
- `GET /api/spreads` - 获取所有牌阵
- `GET /api/deck` - 获取洗好的牌堆 (78张)
- `POST /api/draw` - 根据牌阵抽牌
- `POST /api/interpret` - AI 解读 (流式SSE，需要 token)

### 八字命理
- `POST /api/bazi/chart` - 八字排盘计算
- `POST /api/bazi/interpret/stream` - AI 八字解读 (流式SSE，需要 token)

## 许可证

[MIT 许可证](LICENSE)

## 联系方式

- Email: zdhuntero@gmail.com
- GitHub: https://github.com/usongon/ai-tarot-reader
- Issues: https://github.com/usongon/ai-tarot-reader/issues
