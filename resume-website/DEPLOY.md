# 部署指南：前端公开站点 + 后端 AI 匹配（Render）

本文按「任何人都能打开网站，并且 AI 岗位匹配也能在公网使用」来写。

---

## 一、整体架构

| 部分 | 托管平台 | 作用 |
|------|----------|------|
| 前端（html/css/js） | Netlify 或 GitHub Pages | 任何人用链接打开 |
| 后端（Flask） | [Render](https://render.com) | `/api/match-job` |

前端通过 `config.js` 里的 `RESUME_API_BASE` 访问后端。

---

## 二、部署后端到 Render（先做）

### 1. 准备仓库

1. 在 GitHub 新建公开或私有仓库，把本项目推上去。  
2. 确认 `backend/resume-data-analyst.pdf` 已在仓库中（后端要靠它解析简历）。  
3. 确认 **没有** 提交 `backend/.env`（已在 `.gitignore` 中忽略）。

### 2. 创建 Web Service

1. 打开 [https://dashboard.render.com](https://dashboard.render.com) 注册/登录（可用 GitHub 登录）。  
2. **New +** → **Web Service** → 连接你的 GitHub 仓库。  
3. 填写：

| 配置项 | 值 |
|--------|-----|
| Name | 例如 `songjiali-resume-api`（决定网址） |
| Region | 选离你近的即可 |
| Root Directory | `backend` |
| Runtime | `Python 3` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `gunicorn app:app --bind 0.0.0.0:$PORT --workers 1 --threads 4 --timeout 120` |

4. **Environment** 里添加：

| Key | Value |
|-----|--------|
| `ZHIPU_API_KEY` | 你的智谱 API Key |
| `ZHIPU_MODEL` | `glm-4-flash`（可选） |

5. 选择 Free 套餐 → **Create Web Service**。

### 3. 拿到线上地址

部署成功后，Render 会给出类似：

```text
https://songjiali-resume-api.onrender.com
```

浏览器访问：

```text
https://你的服务名.onrender.com/
```

若接口正常，可在本地用：

```bash
curl -X POST https://你的服务名.onrender.com/api/match-job ^
  -H "Content-Type: application/json" ^
  -d "{\"jobDescription\":\"需要SQL和Python的数据分析岗位\"}"
```

> Free 套餐闲置会休眠，第一次请求可能要等 30–60 秒，属正常现象。

---

## 三、改前端 API 地址

打开项目根目录 `config.js`，改成你的 Render 地址（**不要**末尾斜杠）：

```js
window.RESUME_API_BASE = "https://songjiali-resume-api.onrender.com";
```

保存后，把更新后的前端一并部署（见下一节）。

本地开发时：
- `config.js` 可留空 `""`
- 本机访问时会自动用 `http://localhost:5000`

---

## 四、部署前端（二选一）

### 方式 A：Netlify 拖拽（最快）

1. [https://app.netlify.com/drop](https://app.netlify.com/drop)  
2. 拖入整个前端目录（至少包含 html/css/js/图片/pdf/`config.js`）  
3. 得到 `https://xxxx.netlify.app`，发给别人即可  

注意：之后改了 `config.js` 要重新拖一次，或改用 Git 连接自动发布。

### 方式 B：GitHub Pages

1. 仓库 Settings → Pages → Branch `main` / 根目录  
2. 地址类似：`https://用户名.github.io/仓库名/`  
3. 确保已提交并推送最新的 `config.js`

---

## 五、验收清单

1. 用手机流量（非公司 Wi‑Fi）打开前端链接  
2. 首页各板块、图片、简历下载正常  
3. 粘贴一段 JD，点「开始匹配」  
4. 若 Render 刚唤醒，稍等后能弹出匹配结果  

若报错「未配置线上 API」→ 检查 `config.js` 是否已填写并重新发布前端。  
若 CORS / 网络失败 → 检查 Render 服务是否在线、地址是否写错。

---

## 六、推荐操作顺序

1. 推代码到 GitHub（含 `backend/resume-data-analyst.pdf`，不含 `.env`）  
2. Render 部署后端 → 复制 HTTPS 地址  
3. 填写 `config.js` → 再提交推送  
4. Netlify / GitHub Pages 发布前端  
5. 用公网链接测试匹配功能  

需要我继续帮你：初始化 git、写好首次 commit（排除密钥），可以说一声。
