# 塔罗占卜前端项目

这是一个使用 React + Vite 构建的塔罗占卜前端应用。

## 功能特性

- 美观的欢迎页面，介绍平台功能和使用方法
- 牌阵选择（单张牌、三牌阵、凯尔特十字）
- 占卜方向选择（爱情、事业、健康、财运、学业等8个方向）
- 交互式抽牌体验，点击翻开卡片
- 重新洗牌功能
- AI大师解读（需输入密钥）
- 生成精美分享卡片，支持保存到本地

## 技术栈

- React 18
- Vite
- Framer Motion（动画效果）
- html2canvas（生成分享图片）
- react-markdown（Markdown渲染）
- Tailwind CSS（样式）

## 快速开始

### 1. 安装依赖

npm install

### 2. 启动开发服务器

npm run dev

访问 http://localhost:5173 或终端显示的地址。

### 3. 构建生产版本

npm run build

### 4. 预览生产版本

npm run preview

## 配置说明

API地址默认为 http://localhost:8080/api，如需修改，请编辑 frontend/src/services/api.js 文件中的 API_BASE_URL。

## 项目结构

frontend/
├── src/
│   ├── components/
│   │   └── ui/           # UI组件（按钮、卡片、模态框等）
│   ├── contexts/         # React Context（状态管理）
│   ├── pages/            # 页面组件
│   ├── services/         # API服务
│   ├── App.jsx           # 主应用组件
│   ├── index.css         # 全局样式
│   └── main.jsx          # 入口文件
├── package.json
└── vite.config.js

## 使用流程

1. 用户进入欢迎页面，了解平台功能
2. 点击"开始占卜"，选择喜欢的牌阵
3. 选择占卜方向（如爱情、事业等）
4. 点击卡片翻开，完成抽牌
5. 点击"AI大师解读"，输入密钥
6. 查看AI解读结果
7. 生成分享卡片，保存到本地

## 注意事项

- 后端服务需要先启动（运行在端口8080）
- AI解读需要有效的访问密钥
- 首次使用会自动下载node_modules依赖
