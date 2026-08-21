# 🚀 AI岗位匹配器 - 后端服务

这是一个Flask后端服务，用于调用智谱(Zhipu) AI API进行岗位与简历匹配分析。

## 📋 快速开始

### 环境要求
- Python 3.8+
- pip

### 安装依赖

```bash
# 进入backend目录
cd backend

# 安装所有依赖
py -m pip install -r requirements.txt
```

### 配置环境变量

1. **创建 `.env` 文件**（如果不存在）
   ```bash
   # 在backend目录下创建.env文件
   echo ZHIPU_API_KEY=your_api_key_here > .env
   ```

2. **添加API密钥**
   - 打开 `.env` 文件
   - 将你的智谱API密钥替换 `your_api_key_here`
   - 保存文件

3. **确保简历PDF存在**
   - 将 `resume-data-analyst.pdf` 放在 `backend` 目录下
   - 或修改 [app.py:18](app.py#L18) 中的路径指向正确位置

### 启动后端服务

```bash
# 进入backend目录
cd backend

# 启动Flask服务
py app.py
```

你会看到如下输出：
```
============================================================
🚀 启动 Flask 服务
============================================================
✓ API: 智谱 GLM
✓ 模型: glm-3-turbo
✓ 简历: 已加载
✓ 监听: http://127.0.0.1:5000
============================================================
```

**服务已启动在 `http://localhost:5000`**

## 🔑 API 配置详解

### 环境变量设置

```python
# app.py 中会自动读取
ZHIPU_API_KEY = os.getenv('ZHIPU_API_KEY')  # 从 .env 读取
```

### 获取API密钥

1. 访问 [智谱AI官网](https://open.bigmodel.cn/)
2. 注册/登录账号
3. 进入"API密钥管理"
4. 创建新密钥
5. 复制并粘贴到 `.env` 文件

### 安全建议

- ✅ **已做好**: `.env` 文件已在 `.gitignore` 中，密钥不会上传到Git
- ✅ **使用环境变量**: 敏感信息通过 `.env` 管理，不写死在代码中
- ⚠️ **注意**: 不要把 `.env` 提交到版本控制

## 📡 API 接口

### POST /api/match-job

岗位与简历匹配分析接口

**请求**
```json
{
  "jobDescription": "岗位JD或职位描述内容..."
}
```

**成功响应 (200)**
```json
{
  "success": true,
  "result": "{\"analysis\": {...匹配分析JSON...}}",
  "jobDescription": "岗位描述前100字..."
}
```

**错误响应 (400/500)**
```json
{
  "error": "错误信息描述"
}
```

### GET /health

健康检查接口

**响应**
```json
{
  "status": "ok",
  "resume_loaded": true
}
```

## 🧪 测试 API

### 方法1：浏览器直接测试

```
http://localhost:5000/health
```

### 方法2：使用 curl 测试

```bash
curl -X POST http://localhost:5000/api/match-job \
  -H "Content-Type: application/json" \
  -d '{"jobDescription":"数据分析师，要求3年以上经验，熟悉SQL和Python..."}'
```

### 方法3：使用前端网页测试

1. 启动后端服务（当前终端）
2. 在新终端启动前端：
   ```bash
   cd d:\Users\songjiali\Desktop\sql\resume-website
   py -m http.server 8000
   ```
3. 打开浏览器访问 `http://localhost:8000`
4. 在网页上输入岗位描述，点击"开始匹配"

## 🔗 前端配置

前端文件位置：`../script.js`

前端已配置调用后端API：
```javascript
const apiUrl = 'http://localhost:5000/api/match-job';
```

如需改变后端地址，修改上述URL即可。

## ✨ 完整操作流程

### 第一次使用

```
1. 配置阶段
   └─ 克隆项目
   └─ 进入backend目录
   └─ 创建.env文件，添加API密钥
   └─ 将简历PDF放在backend目录

2. 安装阶段
   └─ 运行: py -m pip install -r requirements.txt

3. 启动阶段
   └─ 后端: py app.py (在backend目录)
   └─ 前端: py -m http.server 8000 (在根目录)

4. 使用阶段
   └─ 打开: http://localhost:8000
   └─ 输入岗位描述
   └─ 点击"开始匹配"
   └─ 查看弹出的匹配结果卡片
```

### 每次使用（后续）

```
1. 打开两个终端窗口

2. 终端1 - 启动后端
   cd d:\Users\songjiali\Desktop\sql\resume-website\backend
   py app.py

3. 终端2 - 启动前端服务
   cd d:\Users\songjiali\Desktop\sql\resume-website
   py -m http.server 8000

4. 打开浏览器
   访问 http://localhost:8000

5. 使用网页匹配岗位
   - 在文本框输入岗位描述(JD)
   - 点击"开始匹配"按钮
   - 等待AI分析（通常需要5-30秒）
   - 查看弹出的漂亮卡片结果
```

## 📊 匹配分析的四个维度

AI会从以下四个维度评估简历与岗位的匹配度：

| 维度 | 权重 | 说明 |
|------|------|------|
| **学历** | 10% | 学位等级、专业方向、认证资格 |
| **工作经验** | 35% | 工作年限、行业经验、岗位相关性 |
| **技能特长** | 30% | 技术工具、数据库、编程语言、方法论 |
| **软技能** | 20% | 沟通、团队协作、问题解决、学习能力 |

**综合分 = 学历×10% + 经验×35% + 技能×30% + 软技能×20%**

## 🎨 前端展示效果

匹配结果以弹出modal卡片形式展示，包含：

- 📌 **综合等级** - 强烈推荐/推荐/可考虑/不推荐
- 🎯 **综合分数** - 0-100的总分
- 📊 **四维分数** - 学历、经验、技能、软技能的单项分数和进度条
- ⭐ **匹配亮点** - 2-3个最匹配的要点
- 📝 **总体评价** - 100字以内的评价总结

## 🔧 模型和参数配置

### 当前模型

```python
ZHIPU_MODEL = "glm-3-turbo"  # 快速响应
```

### 可选模型

```python
"glm-3-turbo"    # 最快，推荐用于快速响应
"glm-4-flash"    # 快速，质量较好
"glm-4"          # 较慢但质量最好
```

### 请求参数

```python
{
  "temperature": 0.5,      # 创意度（越低越稳定）
  "max_tokens": 1024,      # 最大回复长度
  "top_p": 0.8             # 多样性参数
}
```

## 🐛 故障排查

| 问题 | 症状 | 原因 | 解决方案 |
|------|------|------|--------|
| **连接被拒绝** | `ERR_CONNECTION_REFUSED` | 后端未启动 | 运行 `py app.py` |
| **简历未找到** | 启动时显示"未找到" | 简历PDF文件缺失 | 将 `resume-data-analyst.pdf` 放在backend目录 |
| **API错误** | 前端显示API错误 | API密钥无效或过期 | 检查.env文件中的密钥 |
| **请求超时** | 匹配30秒后失败 | 网络慢或API响应慢 | 重试或检查网络连接 |
| **CORS错误** | 浏览器报CORS错误 | 前后端地址不匹配 | 检查script.js中的apiUrl |
| **无法解析JSON** | 前端显示解析错误 | API返回格式不对 | 检查后端终端的调试信息 |

## 🚢 生产部署

### 使用Gunicorn部署

```bash
# 安装Gunicorn
py -m pip install gunicorn

# 启动服务
gunicorn app:app --bind 0.0.0.0:5000 --workers 4
```

### 部署到云平台

支持的平台：
- **Vercel** - 无服务器函数
- **Render** - 容器化应用
- **Railway** - 一键部署
- **Heroku** - 经典PaaS

### Docker部署

```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000"]
```

## 📝 日志和调试

### 查看调试信息

后端终端会输出详细的调试信息：

```
[DEBUG] 调用智谱 API
[DEBUG] 模型: glm-3-turbo
[DEBUG] 发送请求到: https://open.bigmodel.cn/api/paas/v4/chat/completions
[DEBUG] 状态码: 200
[DEBUG] 提取内容长度: 1234
[DEBUG] 成功解析 JSON
```

### 错误日志

遇到错误时会看到：

```
[ERROR] 读取 PDF 失败: 找不到文件
[ERROR] API错误 (401): Unauthorized
```

## 💡 最佳实践

1. **开发阶段**
   - 使用 `py app.py` 运行（包含热重载）
   - 检查后端终端的 `[DEBUG]` 信息调试

2. **测试阶段**
   - 用不同岗位描述多次测试
   - 检查匹配分数的合理性
   - 验证JSON格式正确性

3. **生产阶段**
   - 使用Gunicorn或容器部署
   - 配置日志收集和监控
   - 设置错误告警

4. **性能优化**
   - 使用更快的模型（glm-3-turbo）
   - 减少max_tokens避免长回复
   - 增加max_tokens如需更详细的分析

## 📦 依赖说明

- **Flask** `2.3.3` - Web框架
- **Flask-CORS** `4.0.0` - 跨域资源共享
- **requests** `2.31.0` - HTTP请求库
- **PyPDF2** `3.0.1` - PDF文本提取
- **python-dotenv** `1.0.0` - 环境变量管理

## 🔗 相关链接

- [智谱AI官网](https://open.bigmodel.cn/)
- [Flask文档](https://flask.palletsprojects.com/)
- [PyPDF2文档](https://pypdf2.readthedocs.io/)

---

**最后更新**: 2026-07-08  
**API类型**: 智谱GLM (Zhipu AI)  
**状态**: ✅ 生产就绪  
**当前模型**: glm-3-turbo (快速响应)
