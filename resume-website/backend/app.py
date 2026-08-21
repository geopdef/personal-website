# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import os
from datetime import datetime
import PyPDF2
from dotenv import load_dotenv
import threading
import time

load_dotenv()

app = Flask(__name__)
CORS(app)

# 智谱 API 配置
ZHIPU_API_KEY = os.getenv('ZHIPU_API_KEY')
ZHIPU_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions"
# 使用更快的模型
ZHIPU_MODEL = os.getenv('ZHIPU_MODEL', 'glm-4-flash')  # 默认使用 glm-4-flash（更快）

# 模型配置选项
MODEL_OPTIONS = {
    'glm-3-turbo': {'speed': 'fast', 'quality': 'good', 'tokens_per_min': 1000},
    'glm-4-flash': {'speed': 'very_fast', 'quality': 'good', 'tokens_per_min': 2000},
    'glm-4': {'speed': 'slow', 'quality': 'excellent', 'tokens_per_min': 500},
}

# 缓存系统提示词，避免每次重复构建
SYSTEM_PROMPT_CACHE = None

# 简历 PDF 路径 - 直接指定完整路径
RESUME_PDF_PATH = os.path.join('resume-data-analyst.pdf')
# 简历缓存文件路径
RESUME_CACHE_FILE = os.path.join('resume_cache.txt')
RESUME_CACHE_DATE_FILE = os.path.join('resume_cache_date.txt')


def get_system_prompt():
    """获取系统提示词（只在第一次构建，后续使用缓存）"""
    global SYSTEM_PROMPT_CACHE
    if SYSTEM_PROMPT_CACHE is not None:
        return SYSTEM_PROMPT_CACHE

    SYSTEM_PROMPT_CACHE = """你是一个专业的岗位匹配分析师，帮助HR评估自己的岗位与用户的数据分析简历的匹配度。

## 职责
HR会输入一份岗位的JD（职位描述），你需要基于候选人的数据分析简历，给出该岗位与候选人的匹配度评估。

---

## 📋 JD解读规则

在分析JD时，需要提取并分类以下信息：

1. **学历要求维度**
   - 学位要求（博士、硕士、本科等）
   - 专业方向要求
   - 行业认证或资格证书

2. **工作经验维度**
   - 工作年限要求
   - 行业经验要求
   - 相关岗位经历
   - 项目经验复杂度

3. **技能特长维度**
   - 技术工具（SQL、Python、R、Tableau、Power BI等）
   - 数据库知识
   - 编程语言
   - 数据分析框架和方法论
   - 业务知识（金融、电商、医疗等）

4. **软技能维度**
   - 沟通能力
   - 团队协作
   - 问题解决能力
   - 项目管理
   - 学习能力和主动性

---

## 📊 各维度打分规则

### 学历维度（权重15%）
- **95-100分**：学位等级相同或更高；专业完全相关
- **90-94分**：学位等级相同；专业完全相关
- **80-89分**：学位等级相同；专业相关
- **75-79分**：学位等级相同；专业基本相关
- **低于75分**：学位等级明显不符或专业无关

### 工作经验维度（权重30%）
- **95-100分**：工作年限超过要求；具有完全匹配的行业/岗位经验
- **90-94分**：工作年限符合要求；具有完全匹配的行业/岗位经验
- **80-89分**：工作年限符合要求；具有相关行业/岗位经验
- **75-79分**：工作年限基本符合；有部分相关经验
- **低于75分**：工作年限不足或经验无关

### 技能特长维度（权重30%）
- **95-100分**：掌握JD中要求的所有核心工具/技能；有深度应用经验
- **90-94分**：掌握JD中要求的大部分核心工具/技能（90%以上）
- **80-89分**：掌握JD中要求的主要工具/技能（70-90%）
- **75-79分**：掌握JD中要求的部分工具/技能（50-70%）
- **低于75分**：技能覆盖不足（50%以下）

### 软技能维度（权重25%）
- **95-100分**：简历充分体现所有要求的软技能；有多个具体案例支撑
- **90-94分**：简历清晰体现大部分软技能；有具体案例支撑
- **80-89分**：简历体现主要软技能；有案例支撑
- **75-79分**：简历有所体现相关软技能；案例基本足够
- **低于75分**：简历中软技能体现不明显

---

## 📊 输出格式（必须是 JSON）

你必须输出一个完整的 JSON 对象，不能有其他文本。JSON 格式如下:

{
  "analysis": {
    "timestamp": "YYYY-MM-DD HH:mm:ss",
    "candidate_name": "候选人姓名",
    "job_title": "岗位名称",
    "overall_score": xx,
    "scores": {
      "education": {
        "score": xx,
        "weight": 0.15,
        "explanation": "13字以上的详细解释说明"
      },
      "experience": {
        "score": xx,
        "weight": 0.30,
        "explanation": "13字以上的详细解释说明"
      },
      "skills": {
        "score": xx,
        "weight": 0.30,
        "explanation": "13字以上的详细解释说明"
      },
      "soft_skills": {
        "score": xx,
        "weight": 0.25,
        "explanation": "13字以上的详细解释说明"
      }
    },
    "jd_requirements": {
      "education": ["要求1", "要求2"],
      "experience": ["要求1", "要求2"],
      "skills": ["要求1", "要求2"],
      "soft_skills": ["要求1", "要求2"]
    },
    "candidate_profile": {
      "education": "从简历提取的学历信息",
      "experience": "从简历提取的工作经验概述",
      "skills": ["技能1", "技能2"],
      "soft_skills": ["软技能1", "软技能2"]
    },
    "highlights": [
      {
        "requirement": "JD中的具体要求",
        "candidate_advantage": "必须30字以上的详细候选人优势说明和匹配分析"
      }
    ],
    "summary": "100-150字的总体评价",
    "recommendation": "强烈推荐/推荐/可考虑/不推荐"
  }
}

重点:
1. overall_score = 学历×15% + 工作经验×30% + 技能特长×30% + 软技能×25%，四舍五入保留整数
   - 例如：学历90 + 经验85 + 技能92 + 软技能88
   - 计算：90×0.15 + 85×0.30 + 92×0.30 + 88×0.25 = 13.5 + 25.5 + 27.6 + 22 = 88.6 ≈ 89分
   - 必须逐步计算每项，确保最终结果正确
2. 所有得分都是 0-100 的整数
3. 输出必须是有效的 JSON，不能有 Markdown 代码块或其他文本
4. highlights 数组应包含 2-3 个匹配亮点，每个亮点的candidate_advantage不少于30字
5. explanation 字段每个必须是13字以上（包含标点）
6. summary 字段必须精确控制在100-150字范围内（包含标点和空格），不能超出范围，也不能小于范围。总体评价应包含：(1)整体匹配度评估；(2)优势分析（列举1-2个最强匹配点）；(3)不足分析或建议
7. 计算流程：
   - (1) 先给四个维度各自独立打分
   - (2) 逐步计算综合分：学历分×0.15，经验分×0.30，技能分×0.30，软技能分×0.25
   - (3) 将四个结果相加得到总和
   - (4) 对总和四舍五入取整，确保是0-100的整数
   - (5) 验证最终综合分与各维度分数的合理性
   - (6) 确保计算无误后才输出JSON
8. 先生成完整的summary，再进行字数统计验证，确保字数在100-150范围内才能输出JSON
9. 如果summary字数不足100字，必须扩展内容直到达到100字
10. 如果summary字数超过150字，必须精简内容直到降到150字以内"""
    return SYSTEM_PROMPT_CACHE


def extract_resume_from_pdf():
    """从 PDF 中提取简历内容，支持每日缓存"""
    try:
        # 检查今天是否已经解析过
        today = datetime.now().strftime('%Y-%m-%d')
        cache_date_valid = False

        if os.path.exists(RESUME_CACHE_DATE_FILE):
            with open(RESUME_CACHE_DATE_FILE, 'r', encoding='utf-8') as f:
                cached_date = f.read().strip()
                cache_date_valid = (cached_date == today)

        # 如果缓存有效且缓存文件存在，直接返回缓存
        if cache_date_valid and os.path.exists(RESUME_CACHE_FILE):
            print(f"[DEBUG] 使用今日缓存的简历")
            with open(RESUME_CACHE_FILE, 'r', encoding='utf-8') as f:
                return f.read()

        # 否则重新解析 PDF
        if not os.path.exists(RESUME_PDF_PATH):
            print(f"[WARNING] PDF 文件不存在: {RESUME_PDF_PATH}")
            return None

        print(f"[DEBUG] 读取 PDF: {RESUME_PDF_PATH}")

        with open(RESUME_PDF_PATH, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""

            # 提取所有页面的文本
            for page in pdf_reader.pages:
                text += page.extract_text()

            print(f"[DEBUG] 成功提取 PDF 文本，长度: {len(text)}")

            # 保存到缓存文件
            with open(RESUME_CACHE_FILE, 'w', encoding='utf-8') as f:
                f.write(text)

            # 保存缓存日期
            with open(RESUME_CACHE_DATE_FILE, 'w', encoding='utf-8') as f:
                f.write(today)

            print(f"[DEBUG] 简历已缓存到 {RESUME_CACHE_FILE}")
            return text

    except Exception as e:
        print(f"[ERROR] 读取 PDF 失败: {e}")
        return None


# 启动时加载简历
RESUME_CONTENT = extract_resume_from_pdf()


# 匹配结果缓存，键为简历和JD的组合hash
MATCH_CACHE = {}
CACHE_TTL = 3600  # 1小时缓存有效期


def get_cache_key(job_description, resume_content):
    """生成缓存键"""
    import hashlib
    key_str = f"{job_description}:{resume_content[:200]}"
    return hashlib.md5(key_str.encode()).hexdigest()


def is_cache_valid(cache_entry):
    """检查缓存是否有效"""
    return (time.time() - cache_entry['timestamp']) < CACHE_TTL


@app.route('/api/match-job', methods=['POST'])
def match_job():
    """岗位匹配端点"""
    request_start = time.time()
    try:
        data = request.get_json()
        job_description = data.get('jobDescription', '').strip()

        if not job_description:
            return jsonify({'error': '岗位描述不能为空'}), 400

        if not RESUME_CONTENT:
            return jsonify({'error': '简历加载失败，请检查 PDF 文件'}), 500

        # 检查缓存
        cache_start = time.time()
        cache_key = get_cache_key(job_description, RESUME_CONTENT)
        if cache_key in MATCH_CACHE and is_cache_valid(MATCH_CACHE[cache_key]):
            cache_time = time.time() - cache_start
            print(f"[DEBUG] 从缓存返回结果, 耗时: {cache_time:.2f}秒")
            cached_result = MATCH_CACHE[cache_key]['result']
            total_time = time.time() - request_start
            print(f"[DEBUG] 总耗时: {total_time:.2f}秒")
            return jsonify({
                'success': True,
                'result': cached_result,
                'jobDescription': job_description[:100],
                'cached': True
            })

        # 调用智谱 API
        print(f"[DEBUG] 开始调用 API...")
        api_start = time.time()
        result = call_zhipu_api(get_system_prompt(), job_description)
        api_time = time.time() - api_start
        print(f"[DEBUG] API 调用耗时: {api_time:.2f}秒")

        # 缓存结果
        cache_save_start = time.time()
        MATCH_CACHE[cache_key] = {
            'result': result,
            'timestamp': time.time()
        }
        cache_save_time = time.time() - cache_save_start
        print(f"[DEBUG] 缓存保存耗时: {cache_save_time:.2f}秒")

        total_time = time.time() - request_start
        print(f"[DEBUG] 总耗时: {total_time:.2f}秒")

        return jsonify({
            'success': True,
            'result': result,
            'jobDescription': job_description[:100],
            'cached': False
        })

    except Exception as e:
        print(f"[ERROR] {str(e)}")
        return jsonify({'error': str(e)}), 500
def match_job():
    """岗位匹配端点"""
    request_start = time.time()
    try:
        data = request.get_json()
        job_description = data.get('jobDescription', '').strip()

        if not job_description:
            return jsonify({'error': '岗位描述不能为空'}), 400

        if not RESUME_CONTENT:
            return jsonify({'error': '简历加载失败，请检查 PDF 文件'}), 500

        # 检查缓存
        cache_start = time.time()
        cache_key = get_cache_key(job_description, RESUME_CONTENT)
        if cache_key in MATCH_CACHE and is_cache_valid(MATCH_CACHE[cache_key]):
            cache_time = time.time() - cache_start
            print(f"[DEBUG] 从缓存返回结果, 耗时: {cache_time:.2f}秒")
            cached_result = MATCH_CACHE[cache_key]['result']
            total_time = time.time() - request_start
            print(f"[DEBUG] 总耗时: {total_time:.2f}秒")
            return jsonify({
                'success': True,
                'result': cached_result,
                'jobDescription': job_description[:100],
                'cached': True
            })

        # 调用智谱 API
        print(f"[DEBUG] 开始调用 API...")
        api_start = time.time()
        result = call_zhipu_api(get_system_prompt(), job_description)
        api_time = time.time() - api_start
        print(f"[DEBUG] API 调用耗时: {api_time:.2f}秒")

        # 缓存结果
        cache_save_start = time.time()
        MATCH_CACHE[cache_key] = {
            'result': result,
            'timestamp': time.time()
        }
        cache_save_time = time.time() - cache_save_start
        print(f"[DEBUG] 缓存保存耗时: {cache_save_time:.2f}秒")

        total_time = time.time() - request_start
        print(f"[DEBUG] 总耗时: {total_time:.2f}秒")

        return jsonify({
            'success': True,
            'result': result,
            'jobDescription': job_description[:100],
            'cached': False
        })

    except Exception as e:
        print(f"[ERROR] {str(e)}")
        return jsonify({'error': str(e)}), 500


def call_zhipu_api(system_prompt, job_description):
    """调用智谱 API"""
    try:
        print(f"[DEBUG] 调用智谱 API")
        print(f"[DEBUG] 模型: {ZHIPU_MODEL}")

        headers = {
            'Authorization': f'Bearer {ZHIPU_API_KEY}',
            'Content-Type': 'application/json'
        }

        user_message = f"""请分析以下岗位与候选人的匹配度:
        【岗位描述】
        {job_description}

        【候选人简历内容】
        {RESUME_CONTENT}

        请根据前面的打分规则，详细分析并输出匹配度评估 JSON。"""

        payload = {
            'model': ZHIPU_MODEL,
            'messages': [
                {
                    'role': 'system',
                    'content': system_prompt
                },
                {
                    'role': 'user',
                    'content': user_message
                }
            ],
            'temperature': 0.5,
            'max_tokens': 1024,
            'top_p': 0.8
        }

        print(f"[DEBUG] 发送请求到: {ZHIPU_API_URL}")
        start_time = time.time()

        response = requests.post(
            ZHIPU_API_URL,
            json=payload,
            headers=headers,
            timeout=120
        )

        elapsed = time.time() - start_time
        print(f"[DEBUG] 状态码: {response.status_code}, 耗时: {elapsed:.2f}秒")

        if response.status_code != 200:
            error_text = response.text[:500]
            print(f"[DEBUG] 错误响应: {error_text}")
            return f'API错误 ({response.status_code}): {error_text}'

        result = response.json()

        # 解析智谱 API 响应
        if 'choices' in result and len(result['choices']) > 0:
            message = result['choices'][0].get('message', {})
            content = message.get('content', '分析失败，请重试')
            print(f"[DEBUG] 提取内容长度: {len(content)}")

            # 尝试解析为 JSON
            try:
                # 如果内容被```json包装，先清理
                if content.strip().startswith('```'):
                    # 移除Markdown代码块标记
                    content = content.strip()
                    if content.startswith('```json'):
                        content = content[7:]  # 移除 ```json
                    elif content.startswith('```'):
                        content = content[3:]  # 移除 ```
                    if content.endswith('```'):
                        content = content[:-3]  # 移除末尾的 ```
                    content = content.strip()

                json_result = json.loads(content)
                print(f"[DEBUG] 成功解析 JSON")
                return json.dumps(json_result, ensure_ascii=False, indent=2)
            except json.JSONDecodeError:
                print(f"[DEBUG] 响应不是 JSON，返回原始内容")
                return content
        else:
            return f'未知响应格式: {str(result)[:200]}'

    except requests.exceptions.Timeout:
        print("[DEBUG] 请求超时")
        return '请求超时（120秒），请检查网络或稍后重试'
    except requests.exceptions.RequestException as e:
        print(f"[DEBUG] 请求异常: {e}")
        return f'网络错误: {str(e)}'
    except json.JSONDecodeError as e:
        print(f"[DEBUG] JSON解析错误: {e}")
        return f'响应格式错误: {e}'
    except Exception as e:
        print(f"[DEBUG] 未知错误: {e}")
        return f'未知错误: {str(e)}'


@app.route('/health', methods=['GET'])
def health():
    """健康检查端点"""
    return jsonify({
        'status': 'ok',
        'resume_loaded': RESUME_CONTENT is not None,
        'cache_entries': len(MATCH_CACHE)
    }), 200


@app.route('/api/cache-stats', methods=['GET'])
def cache_stats():
    """返回缓存统计信息"""
    return jsonify({
        'cache_size': len(MATCH_CACHE),
        'cache_entries': list(MATCH_CACHE.keys())[:10]  # 只返回前10个
    }), 200


@app.route('/api/cache-clear', methods=['POST'])
def cache_clear():
    """清空缓存"""
    global MATCH_CACHE
    MATCH_CACHE = {}
    return jsonify({
        'message': '缓存已清空',
        'status': 'ok'
    }), 200


# 常见岗位模板 - 用于启动时预加载缓存
COMMON_JOB_TEMPLATES = [
    {
        'title': '初级数据分析师',
        'description': '岗位职责：负责数据收集、清洗和分析；使用SQL、Python进行数据处理；制作数据报表和可视化仪表板。岗位要求：本科及以上学历；1-3年数据分析相关工作经验；熟悉SQL和Python；了解Excel数据分析；具备较强的沟通能力。'
    },
    {
        'title': '中级数据分析师',
        'description': '岗位职责：设计和实施数据分析项目；建立数据分析模型；指导初级分析师的工作；与业务部门协作进行数据需求分析。岗位要求：本科及以上学历；3-5年数据分析工作经验；精通SQL、Python、R等语言；掌握数据可视化工具（Tableau、Power BI等）；具备统计学基础；强执行力和沟通能力。'
    },
    {
        'title': '数据分析师',
        'description': '岗位职责：负责产品和运营数据分析；进行用户行为分析和转化漏斗分析；输出数据驱动的业务建议。岗位要求：本科学历，计算机、数学、统计等相关专业；2年以上数据分析工作经验；熟悉SQL和Python；懂产品、业务分析；良好的问题解决能力。'
    },
    {
        'title': '高级数据分析师',
        'description': '岗位职责：领导数据分析团队；开发高级数据分析方法和工具；为公司战略决策提供数据支撑；建立数据治理体系。岗位要求：本科及以上学历；5年以上数据分析工作经验；掌握多种分析工具和编程语言；具备机器学习知识；卓越的沟通和领导能力；能够独立推动复杂项目。'
    }
]


def preload_common_jobs():
    """启动时预加载常见岗位的匹配结果"""
    global MATCH_CACHE

    if not RESUME_CONTENT:
        print("[INFO] 简历未加载，跳过预加载")
        return

    print(f"[INFO] 开始预加载 {len(COMMON_JOB_TEMPLATES)} 个常见岗位...")

    for idx, job in enumerate(COMMON_JOB_TEMPLATES, 1):
        cache_key = get_cache_key(job['description'], RESUME_CONTENT)

        # 跳过已存在的缓存
        if cache_key in MATCH_CACHE:
            print(f"  [{idx}] {job['title']} - 已在缓存中，跳过")
            continue

        try:
            print(f"  [{idx}] {job['title']} - 预加载中...", end='', flush=True)
            start = time.time()

            # 调用 API 进行分析
            result = call_zhipu_api(get_system_prompt(), job['description'])

            elapsed = time.time() - start

            # 缓存结果
            MATCH_CACHE[cache_key] = {
                'result': result,
                'timestamp': time.time()
            }

            print(f" ✓ 完成 ({elapsed:.1f}秒)")

        except Exception as e:
            print(f" ✗ 失败: {str(e)[:50]}")
            continue

    print(f"[INFO] 预加载完成，共缓存 {len(MATCH_CACHE)} 项")


def preload_async():
    """后台线程执行预加载，不阻塞启动"""
    thread = threading.Thread(target=preload_common_jobs, daemon=True)
    thread.start()
    return thread


@app.route('/api/preload', methods=['POST'])
def trigger_preload():
    """手动触发预加载"""
    thread = preload_async()
    return jsonify({
        'message': '预加载已启动，后台运行',
        'status': 'running'
    }), 200


if __name__ == '__main__':
    # 开发环境运行；线上由 gunicorn 启动
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', '0') == '1'
    print("=" * 60)
    print("🚀 启动 Flask 服务")
    print("=" * 60)
    print(f"✓ API: 智谱 GLM")
    print(f"✓ 模型: {ZHIPU_MODEL}")
    print(f"✓ 简历: {'已加载' if RESUME_CONTENT else '未找到'}")
    print(f"✓ 监听: http://127.0.0.1:{port}")
    print("=" * 60)

    # 启动后台预加载（不阻塞主程序启动）
    print("\n[INIT] 启动后台预加载线程...")
    preload_thread = preload_async()
    print("[INIT] 主程序已启动，预加载在后台运行")
    print()

    app.run(host='0.0.0.0', debug=debug, port=port)
