# 宋佳丽 · 个人面试介绍网站

面向面试展示的个人站点：多页面静态前端 + 可选的「AI 岗位匹配」Flask 后端。

## 功能概览

| 模块 | 说明 |
|------|------|
| 关于我 | 个人定位、简历下载、联系方式；首页 AI 岗位匹配器 |
| 教育背景 | 西安交大 / 华南理工学历与成绩、奖学金、竞赛荣誉 |
| 实习经历 | 携程、美团酒旅、美团策略、探探；左侧导航切换；项目详情弹窗 |
| 技能证书 | 数据分析、统计建模、工程工具、证书荣誉 |
| 学习与探索 | 数据分析 Skill、业务知识库、智能监控、BA Agent、产品原型；左侧导航 |

## 项目结构

```
resume-website/
├── index.html          # 首页（关于我 + AI 岗位匹配器）
├── education.html      # 教育背景
├── experience.html     # 实习经历
├── skills.html         # 技能证书
├── learning.html       # 学习与探索
├── styles.css          # 全局样式
├── script.js           # 弹窗、侧栏导航、岗位匹配前端逻辑
├── config.js           # 线上 API 地址配置
├── resume-data-analyst.pdf  # 简历文件（下载 / 后端解析用，需自行放置）
├── picture.jpg         # 个人照片等静态资源（需自行放置）
└── backend/            # AI 岗位匹配后端（可选）
    ├── app.py
    ├── requirements.txt
    ├── Procfile
    ├── .env            # ZHIPU_API_KEY（勿提交到公开仓库）
    └── README.md       # 后端详细说明
```

## 快速开始（仅前端）

用浏览器直接打开 `index.html`，或在项目根目录启动本地静态服务：

```bash
# 任选其一
npx serve .
python -m http.server 8080
```

访问对应地址即可浏览全部页面。侧栏导航、项目详情弹窗不依赖后端。

## AI 岗位匹配（前端 + 后端）

首页「AI 岗位匹配器」会请求 `http://localhost:5000/api/match-job`，需先启动后端。

### 1. 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

### 2. 配置

在 `backend/.env` 中设置：

```env
ZHIPU_API_KEY=你的智谱API密钥
ZHIPU_MODEL=glm-4-flash
```

将 `resume-data-analyst.pdf` 放到 `backend/` 目录（或按 `app.py` 中路径修改）。

### 3. 启动

```bash
cd backend
python app.py
```

服务默认监听：`http://127.0.0.1:5000`。

### 4. 使用

1. 打开前端首页  
2. 粘贴岗位 JD，点击「开始匹配」  
3. 查看学历 / 经验 / 技能 / 软技能评分与推荐结果  

后端会缓存当日解析的简历文本，并缓存相同 JD 的匹配结果以加速重复查询。更多接口说明见 [backend/README.md](backend/README.md)。

## 页面交互说明

- **侧栏导航**：`experience.html`、`learning.html` 左侧切换不同公司 / 项目，右侧展示对应内容。  
- **查看详情**：实习与学习页的项目卡片可打开弹窗，展示「核心职责」与「核心成果」。  
- **联系我**：首页弹窗展示电话与邮箱。  
- **下载简历**：链接到 `resume-data-analyst.pdf`（文件需存在于可访问路径）。

## 技术栈

- **前端**：HTML / CSS / 原生 JavaScript  
- **后端**：Flask、flask-cors、智谱 GLM API、PyPDF2  

## 静态资源建议

公网部署（GitHub Pages、Vercel 等）前请确认：

- 照片、logo、简历 PDF 使用相对路径并纳入仓库（或对象存储）  
- 勿将 `.env`、API Key 提交到公开仓库  
- 若启用 AI 匹配，需单独部署后端并修改前端中的 API 地址（当前为 `localhost:5000`）

## 许可与用途

个人面试展示用途。内容与数据以本人简历为准，可按求职方向自行增删页面模块。

## 公网部署

完整步骤（前端 Netlify/GitHub Pages + 后端 Render + `config.js` 配置）见 [DEPLOY.md](DEPLOY.md)。
