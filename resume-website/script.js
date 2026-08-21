document.addEventListener("DOMContentLoaded", () => {
  const openContact = document.getElementById("openContact");
  const contactModal = document.getElementById("contactModal");

  if (openContact && contactModal) {
    const setModalOpen = (isOpen) => {
      contactModal.classList.toggle("is-open", isOpen);
      contactModal.setAttribute("aria-hidden", String(!isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    };

    openContact.addEventListener("click", () => setModalOpen(true));

    contactModal.querySelectorAll("[data-close-contact]").forEach((element) => {
      element.addEventListener("click", () => setModalOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setModalOpen(false);
      }
    });
  }

  // Experience page: project detail modal
  const projectModal = document.getElementById("projectModal");
  const projectDetails = {
    "ctrip-funnel": {
      title: "度假全链路流量归因与监控体系建设",
      process: "PROCESS AND TOOLS｜页面归因 → 路径聚类 → 漏斗拆解 → 机会识别 → 监控沉淀",
      responsibilities: [
        {
          tone: "blue",
          title: "页面归因与路径分层",
          items: [
            "清洗前序页面与埋点，将约 4,600 个 Page ID 抽象为业务页面类型",
            "结合马尔可夫链页面移除效应与访问频次，识别 12 个关键用户阶段",
            "用 Jaccard Distance 与 K-medoids 聚类，沉淀 8 条核心转化路径"
          ]
        },
        {
          tone: "green",
          title: "多维漏斗与机会点",
          items: [
            "将 8 条路径归为主动搜索、首页浏览、内容种草、跨品类引流、复访、会话唤起等类型",
            "对比详情页 UV、CR、唤起率、唤起 CR 与订单贡献，定位入口瓶颈",
            "输出首页内容精简、差异化分发、价格锚点与复访触达等策略建议"
          ]
        },
        {
          tone: "orange",
          title: "监控体系与数仓",
          items: [
            "梳理七产线 DAU、页面归属、导购链路与挂单口径",
            "设计「携程 DAU→度假 DAU→列表→详情→资源→填写→支付→成单」P0–P3 指标",
            "输出日活表、导购链路表、详情页归因表、首页模块流量表等数仓需求"
          ]
        },
        {
          tone: "purple",
          title: "AI 提效与业务闭环",
          items: [
            "利用 AI 实现智能监控指标异动及异动归因",
            "将页面标签、路径逻辑与指标口径沉淀为持续监控能力",
            "形成「发现问题→分析诊断→提出策略→监控验证」闭环"
          ]
        }
      ],
      results: [
        "推动全链路流量看板上线，覆盖 7 条产线、11 个核心指标（含 DAU、详情页 UV、订单量、CR、GMV）与 7 个分析维度（渠道、用户、首访来源等）。",
        "发现收藏/浏览历史复访路径贡献约 51% 订单；旅游首页相关路径详情页 UV 同比 -33.9%、CR -17.4%；内容引流详情页 UV -41.5%，但 CR +65%。",
        "将跨产线每周流量取数时长从约 1 人天缩短至 10 分钟，业务可基于统一口径快速发现异动并定位问题来源。"
      ]
    },
    "meituan-board": {
      title: "频道数据看板建设",
      process: "PROCESS AND TOOLS｜需求对齐 → 埋点设计 → 双层监控 → 异常定位 → 基准线迭代",
      responsibilities: [
        {
          tone: "blue",
          title: "频道总体监控",
          items: [
            "监控 DAU 与渠道来源（金刚区、非金刚区、外投等）",
            "搭建曝光→意向→支付的核心转化漏斗",
            "掌握频道页宏观流量与转化表现"
          ]
        },
        {
          tone: "green",
          title: "模块微观效率",
          items: [
            "独立监控一 tab、二 tab、搜索、橱窗、猜喜、底 tab 等模块",
            "分析各模块曝光、点击及后续转化",
            "形成从整体到模块的双层监控体系"
          ]
        },
        {
          tone: "orange",
          title: "埋点方案落地",
          items: [
            "与业务对齐核心行为与指标（曝光、点击、加购等）",
            "设计事件名、参数、拆分事件与位置标识",
            "协同开发联调测试，上线后持续监控数据质量并迭代"
          ]
        },
        {
          tone: "purple",
          title: "异常诊断与稳态",
          items: [
            "上线当月定位迪士尼秒杀点击率异常根因",
            "识别泛意图用户引流拉低整体点击",
            "为猜你喜欢设置活动期 / 日常期双基准线，大促自动切换"
          ]
        }
      ],
      results: [
        "补齐酒旅频道统一数据看板空白，显著提升跨系统拉数与问题定位效率。",
        "快速定位迪士尼秒杀活动点击率异常：泛意图用户被引流拉低整体点击。",
        "猜喜双基准线上线后，日常策略迭代数据不再被异常流量干扰，监控体系长期稳定性提升。"
      ]
    },
    "meituan-mbr": {
      title: "月度经营分析 MBR 异动归因",
      process: "PROCESS AND TOOLS｜指标重构 → 子分母拆解 → 渠道拆解 → 本异地拆解",
      responsibilities: [
        {
          tone: "blue",
          title: "心智指标",
          items: ["监控频道 DAU", "跟踪 7 日复访率", "聚焦用户心智提升"]
        },
        {
          tone: "green",
          title: "交易规模指标",
          items: [
            "支付 UV、支付订单量、实付 GMV",
            "频道访购率、意向 UV",
            "猜喜 / 橱窗 / 搜索区访购率、点击率、转化率"
          ]
        },
        {
          tone: "orange",
          title: "归因拆解方法",
          items: ["先拆分子分母", "再拆渠道入口", "继续拆本异地用户"]
        },
        {
          tone: "purple",
          title: "策略支持",
          items: [
            "系统定位指标波动根源",
            "为心智提升提供数据依据",
            "助力业务精准调整交易增长策略"
          ]
        }
      ],
      results: [
        "重构月度经营分析核心指标，覆盖心智与交易规模双视角。",
        "形成可复用的异动归因路径：子分母 → 渠道入口 → 本异地用户。",
        "为业务心智提升与交易规模增长提供清晰数据依据，支持策略精准调整。"
      ]
    },
    "meituan-plan": {
      title: "酒店效率型动线 · 即时当地承接",
      process: "PROCESS AND TOOLS｜机会探查 → 行为洞察 → 策略落地 → 净收益共识 → AB 验证",
      responsibilities: [
        {
          tone: "blue",
          title: "机会点识别",
          items: [
            "发现猜你喜欢转化率仅 3.2%，远低于搜索 23.6%",
            "识别仅空搜用户占频道总用户 37%",
            "该类用户点击偏低但购买转化更高，是未挖掘核心增量群体"
          ]
        },
        {
          tone: "green",
          title: "行为洞察与假设",
          items: [
            "76.6% 仅空搜用户有即时消费需求",
            "95% 消费需求集中在 5 公里范围内",
            "提出推送即时当地商品、缩短消费路径的核心假设"
          ]
        },
        {
          tone: "orange",
          title: "策略与内耗攻关",
          items: [
            "推动即时当地商品标签体系，联动算法将商品前置至猜喜顶端",
            "将「首页→空搜→购买」优化为「首页→猜喜→购买」",
            "搭建净收益模型，验证猜喜增量与搜索减量后整体净收益为正"
          ]
        },
        {
          tone: "purple",
          title: "AB 实验验证",
          items: [
            "设计合规 AB 实验，监控迁移人群与整体转化",
            "跟踪搜索与猜喜订单变化，保障搜索核心体验",
            "全程数据追踪调优，推动策略稳健落地"
          ]
        }
      ],
      results: [
        "猜喜在即时当地场景转化率由 3.2% 提升至 12.6%，仅空搜用户被有效激活。",
        "频道页整体支付转化率提升，为酒店业务带来稳定增量订单。",
        "推荐动线成为效率型转化的重要补充，形成可复制的增量挖掘路径。"
      ]
    },
    "meituan-rec": {
      title: "下沉市场便宜货策略 · 首页推荐",
      process: "PROCESS AND TOOLS｜偏好假设 → 人群圈选 → 三层承接 → 异动归因 → AB 验证",
      responsibilities: [
        {
          tone: "blue",
          title: "用户差异与偏好假设",
          items: [
            "按地理维度圈定三四线下沉用户，与一二线对标拆解",
            "对比订单结构、复购与价格带转化数据",
            "验证下沉用户对 0–10 元、5 折以下超低价商品转化意愿显著更高"
          ]
        },
        {
          tone: "green",
          title: "量化拐点锁定人群",
          items: [
            "测算用户 30 天成交订单量转化拐点",
            "圈定近 30 天成交＜3 单、客单价低于大盘 50% 的用户",
            "聚焦低价业务占比超 50% 的价格敏感型用户"
          ]
        },
        {
          tone: "orange",
          title: "三层承接策略",
          items: [
            "强化价格视觉样式",
            "算法优先下沉便宜供给",
            "上线「下单领升星礼」权益标签，形成内容 + 商品 + 权益组合承接"
          ]
        },
        {
          tone: "purple",
          title: "异动归因与迭代",
          items: [
            "首轮实验供给曝光 +31%，点击仅 +9%，定位预期错配",
            "发现到餐占比过高、68% 商品折扣高于 6 折、10% 单价超 50 元",
            "推动扩充外卖 / 闪购供给、优化价格带，并约束权益标签展示规则"
          ]
        }
      ],
      results: [
        "最终方案被采纳，在覆盖 30% 日活用户的 AB 实验中，实验组 DAU 相对对照组提升 6 个百分点。",
        "按全量用户估算，预计能为美团到餐业务带来近 700 万的日活提升。",
        "形成可复用的下沉低价推荐路径：偏好验证 → 精准圈人 → 组合承接 → 异动迭代。"
      ]
    },
    "tantan-retain": {
      title: "双高留存实验与投放优化",
      process: "PROCESS AND TOOLS｜行为建模 → AB 评估 → 策略优化 → 分时投放",
      responsibilities: [
        {
          tone: "blue",
          title: "行为分析建模",
          items: ["PySpark / Hive SQL 建模", "用户行为分析", "数据链路效率优化"]
        },
        {
          tone: "green",
          title: "实验评估",
          items: ["双高留存 AB 实验", "匹配策略优化", "付费转化路径评估"]
        },
        {
          tone: "orange",
          title: "曝光策略优化",
          items: ["调整 ad 卡曝光策略", "提升配对渗透", "监控核心指标看板"]
        },
        {
          tone: "purple",
          title: "触达与投放",
          items: ["识别未触达用户", "提出分时投放方案", "推动次留提升"]
        }
      ],
      results: [
        "配对渗透提升 40%，实验组付费转化提升 0.32%。",
        "发现 50% 目标用户未触达 ad 卡，定位次留提升瓶颈。",
        "分时投放方案推动目标用户次留率提升 15%。"
      ]
    },
    "learn-skill-flow": {
      title: "数据分析 Skill · 标准工作流封装",
      process: "PROCESS AND TOOLS｜需求澄清 → 场景识别 → 加载规则 → MCP 校验 → 生成 SQL → 跑数 → 交付",
      responsibilities: [
        {
          tone: "blue",
          title: "需求澄清铁律",
          items: [
            "复述需求并澄清时间、业务线、人群、渠道等维度",
            "未完成澄清不得进入写 SQL 及之后步骤",
            "用户拒绝问答时列出假设并注明风险"
          ]
        },
        {
          tone: "green",
          title: "场景与领域加载",
          items: [
            "识别异动、流量、画像或看板提数场景",
            "按需加载 scenarios / domains 业务口径与模板",
            "团队游产量异动等场景按飞书维度组合表对齐"
          ]
        },
        {
          tone: "orange",
          title: "校验与跑数",
          items: [
            "写 SQL 前用 Metadata MCP 校验库表与字段",
            "分析类任务默认执行 adhoc 拿到真实结果",
            "不得停在「只给 SQL」而不输出结论"
          ]
        },
        {
          tone: "purple",
          title: "标准化交付",
          items: [
            "口径说明表 + 可审计 SQL + 业务向主要结论",
            "事实与推断写清，贡献度分解点清",
            "定稿前核对原则 3 与场景核对清单"
          ]
        }
      ],
      results: [
        "将需求澄清、口径说明、SQL 生成和结论输出标准化，减少重复沟通与口径错误。",
        "固化流程：需求澄清 → 场景识别 → 加载领域规则 → MCP 校验 → 生成 SQL → 必要时跑数 → 输出口径、SQL 与结论。",
        "为后续 AB 实验、异动归因等分析自动化提供可复用基础。"
      ]
    },
    "learn-skill-diff": {
      title: "数据分析 Skill · 与普通 Prompt 的差异",
      process: "PROCESS AND TOOLS｜任务说明 → 执行规范 → 一致性与可复用",
      responsibilities: [
        {
          tone: "blue",
          title: "普通 Prompt",
          items: [
            "更像一次性的任务说明",
            "主要定义本次要做什么",
            "质量依赖当次对话上下文"
          ]
        },
        {
          tone: "green",
          title: "Skill 作为规范",
          items: [
            "定义何时必须追问",
            "规定应加载哪些业务规则",
            "写 SQL 前如何校验字段"
          ]
        },
        {
          tone: "orange",
          title: "执行约束",
          items: [
            "什么情况下必须跑数",
            "最终交付必须包含哪些内容",
            "用参考文件拆分口径、方法与案例"
          ]
        },
        {
          tone: "purple",
          title: "数据流落地",
          items: [
            "用户问题 → 需求复述与维度确认",
            "选择 scenario / domain → MCP 校验表字段",
            "生成 Hive SQL →（需要时）adhoc → 输出口径表 + 结论"
          ]
        }
      ],
      results: [
        "解决的不是单次回答质量，而是数据分析结果的一致性与可复用性。",
        "把分析师标准工作流变成 AI 可执行资产，而不是散落在聊天记录里的经验。",
        "通过典型案例验证与迭代，持续降低口径错误与返工成本。"
      ]
    },
    "learn-knowledge": {
      title: "个性化业务知识库 · AI 四层工作系统",
      process: "PROCESS AND TOOLS｜角色配置 → 知识索引 → 错误进化 → 开工收工闭环",
      responsibilities: [
        {
          tone: "blue",
          title: "角色与协作配置",
          items: [
            "DNA.md 记录岗位、KPI、业务背景与协作偏好",
            "CLAUDE.md 规定输出格式、文件规范与执行规则",
            "让 AI 每次启动都能快速进入工作状态"
          ]
        },
        {
          tone: "green",
          title: "知识库与索引",
          items: [
            "通用方法论库 + 个人业务方案库双库设计",
            "分别为两套知识库建立索引，先检索再按需读取",
            "避免每次读取大量无关上下文"
          ]
        },
        {
          tone: "orange",
          title: "错误自我进化",
          items: [
            "Heartbeat.md 沉淀命名、格式、脱敏、飞书等错误规则",
            "同类任务直接按规则执行，减少重复纠错",
            "把错误经验变成可持续调用的约束"
          ]
        },
        {
          tone: "purple",
          title: "工作流自动化",
          items: [
            "开工：收集日程、待办与 KPI，写入多维表格并汇总优先级",
            "收工：自动生成复盘、更新待办、收录文档并更新索引",
            "形成具备长期记忆与工作闭环的个人工作伙伴"
          ]
        }
      ],
      results: [
        "每日开工准备从 15–20 分钟缩短到约 2 分钟。",
        "历史方案检索从 10–15 分钟缩短到约 30 秒；数据分析脚本编写从 1–2 小时缩短到 15–30 分钟。",
        "每周约节省 4–5 小时；核心价值是把业务经验、分析框架与错误经验结构化为可迭代资产。"
      ]
    },
    "learn-monitor": {
      title: "智能监控看板 · 异动识别与初步归因",
      process: "PROCESS AND TOOLS｜事实层 → 异常识别 → 诊断下钻 → 结构化结论",
      responsibilities: [
        {
          tone: "blue",
          title: "指标事实层",
          items: [
            "汇总 7 产线 DAU、核心漏斗、同比环比等可下钻指标表",
            "统一日期、产线、渠道、用户与来源等维度口径",
            "为自动归因提供可复核的数据底座"
          ]
        },
        {
          tone: "green",
          title: "动态阈值识别",
          items: [
            "流量指标以同星期近四周均值为基准，结合偏差与标准差",
            "转化率同时关注绝对百分点变化与样本量",
            "统计异常与业务影响同时满足才触发下钻，降低误报"
          ]
        },
        {
          tone: "orange",
          title: "诊断树自动下钻",
          items: [
            "先判断大盘流量变化，再拆到度假各产线",
            "沿 DAU→列表→详情→资源→填写→支付→成单定位损失环节",
            "结合首访来源、人群、页面归因与核心路径识别最大影响面"
          ]
        },
        {
          tone: "purple",
          title: "结构化结论生成",
          items: [
            "输出异常摘要、影响范围、主要归因、待验证假设与建议动作",
            "区分「数据已验证事实」与「需业务确认的推断」",
            "AI 做编排与解释，计算由 SQL / 预计算完成"
          ]
        }
      ],
      results: [
        "把人工发现异常、手动取数下钻、再写结论，转化为看板预警 + 自动初步归因。",
        "分析师可更快聚焦高影响问题，减少重复取数与基础排查时间。",
        "每条结论都有对应指标、维度与下钻数据支撑，保证结果可复核。"
      ]
    },
    "learn-ba-agent": {
      title: "BA Agent · 架构设计与 AB 实验场景",
      process: "PROCESS AND TOOLS｜Planner → Worker → Skills → Supervisor",
      responsibilities: [
        {
          tone: "blue",
          title: "四层架构",
          items: [
            "Planner：识别需求并路由到 AB、异动或趋势场景",
            "Worker：执行具体分析流程",
            "Skills / Supervisor：SQL、Python、UDF 计算与重试、超时、质量校验"
          ]
        },
        {
          tone: "green",
          title: "AB 场景闭环",
          items: [
            "确认实验名称、周期与指标",
            "表查询 MCP 校验字段，SQL 拉取实验组 / 对照组数据",
            "UDF 输出 p-value、置信区间与效应量，再做分维度贡献度拆解"
          ]
        },
        {
          tone: "orange",
          title: "可靠性设计",
          items: [
            "Agent 只输出数据事实与贡献度，不直接输出判断性结论",
            "数学计算全部固化，避免 LLM 幻觉",
            "通过输入扰动、工具异常与边缘数据测试评估鲁棒性"
          ]
        },
        {
          tone: "purple",
          title: "能力沉淀",
          items: [
            "把需求分析、取数、检验、拆解与报告拆成可复用 Agent 能力",
            "LLM 负责理解与编排，代码负责计算与校验",
            "在效率与结果可信度之间取得平衡"
          ]
        }
      ],
      results: [
        "形成可复用的度假 BA Agent 架构与 AB 实验场景能力。",
        "降低对人工经验的强依赖，提升交付效率与口径一致性。",
        "理解如何把数据分析流程产品化为可信的 Agent 工作流。"
      ]
    },
    "learn-jd-match": {
      title: "产品原型 · JD 与数据分析简历智能匹配",
      process: "PROCESS AND TOOLS｜PRD → Schema → 前后端 → Agent 比对 → 样本调优",
      responsibilities: [
        {
          tone: "blue",
          title: "需求与产品设计",
          items: [
            "定义输入为岗位 JD 与候选人简历",
            "输出四维评分、匹配亮点、能力缺口与推荐建议",
            "借助大模型完成 PRD 初稿，明确权重、流程与边界"
          ]
        },
        {
          tone: "green",
          title: "数据结构统一",
          items: [
            "将需求转换为结构化 JSON Schema",
            "保证前后端与 Agent 之间数据格式一致",
            "约定评分规则与输出字段约束"
          ]
        },
        {
          tone: "orange",
          title: "前后端与 Agent",
          items: [
            "前端：JD / 简历输入与结果可视化",
            "后端：文件解析、任务调度与结果存储",
            "Agent：提取 JD 要求、解析简历并按规则逐维比对"
          ]
        },
        {
          tone: "purple",
          title: "测试与迭代",
          items: [
            "用不同 JD 与简历样本测试评分稳定性",
            "持续调整 Prompt、评分规则与输出格式",
            "完成从需求到功能落地的闭环验证"
          ]
        }
      ],
      results: [
        "落地个人网站「JD 与数据分析简历智能匹配」原型能力。",
        "形成业务需求拆解 → PRD → 数据结构 → 前后端联调 → Agent 接入的完整 AI 产品思路。",
        "以 Vibe Coding 方式验证「需求设计到功能落地」的可执行闭环。"
      ]
    }
  };

  if (projectModal) {
    const titleEl = document.getElementById("projectModalTitle");
    const processEl = document.getElementById("projectModalProcess");
    const respGrid = document.getElementById("projectRespGrid");
    const resultGrid = document.getElementById("projectResultGrid");

    const setProjectModalOpen = (isOpen) => {
      projectModal.classList.toggle("is-open", isOpen);
      projectModal.setAttribute("aria-hidden", String(!isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    };

    const renderProjectModal = (detail) => {
      titleEl.textContent = detail.title;
      processEl.textContent = detail.process;

      respGrid.innerHTML = detail.responsibilities.map((item) => `
        <article class="project-resp-card tone-${item.tone}">
          <div class="project-resp-head"><h4>${item.title}</h4></div>
          <ul>${item.items.map((text) => `<li>${text}</li>`).join("")}</ul>
        </article>
      `).join("");

      resultGrid.innerHTML = detail.results.map((text) => `
        <article class="project-result-card"><p>${text}</p></article>
      `).join("");
    };

    document.querySelectorAll("[data-open-project]").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.getAttribute("data-open-project");
        const detail = projectDetails[key];
        if (!detail) return;
        renderProjectModal(detail);
        setProjectModalOpen(true);
      });
    });

    projectModal.querySelectorAll("[data-close-project]").forEach((element) => {
      element.addEventListener("click", () => setProjectModalOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && projectModal.classList.contains("is-open")) {
        setProjectModalOpen(false);
      }
    });
  }

  // Side nav switch (experience / learning)
  const sideNavItems = document.querySelectorAll("[data-side-nav]");
  const sidePanels = document.querySelectorAll("[data-side-panel]");

  if (sideNavItems.length && sidePanels.length) {
    const activateSidePanel = (key) => {
      sideNavItems.forEach((item) => {
        item.classList.toggle("is-active", item.getAttribute("data-side-nav") === key);
      });
      sidePanels.forEach((panel) => {
        const match = panel.getAttribute("data-side-panel") === key;
        panel.classList.toggle("is-active", match);
        panel.toggleAttribute("hidden", !match);
      });
    };

    sideNavItems.forEach((item) => {
      item.addEventListener("click", () => {
        activateSidePanel(item.getAttribute("data-side-nav"));
      });
    });
  }

  // AI Job Matcher
  const matcherForm = document.getElementById("matcherForm");
  const jobDescription = document.getElementById("jobDescription");
  const matchModal = document.getElementById("matchModal");
  const matchModalContent = document.getElementById("matchModalContent");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const closeMatchModal = document.getElementById("closeMatchModal");

  if (!matcherForm || !matchModal) {
    return;
  }

  const setMatchModalOpen = (isOpen) => {
    matchModal.classList.toggle("is-open", isOpen);
    matchModal.setAttribute("aria-hidden", String(!isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  let progressInterval = null;

  function startProgressAnimation() {
    const progressFill = loadingSpinner.querySelector('.progress-fill');
    const progressText = loadingSpinner.querySelector('.progress-text');
    let progress = 0;

    if (progressInterval) clearInterval(progressInterval);

    progressInterval = setInterval(() => {
      if (progress < 70) {
        progress += Math.random() * 12;
      } else if (progress < 90) {
        progress += Math.random() * 8;
      } else {
        progress += Math.random() * 2 + 0.5;
      }

      progress = Math.min(progress, 99);
      progressFill.style.width = progress + '%';
      progressText.textContent = Math.round(progress) + '%';
    }, 500);
  }

  function completeProgress() {
    const progressFill = loadingSpinner.querySelector('.progress-fill');
    const progressText = loadingSpinner.querySelector('.progress-text');
    if (progressInterval) clearInterval(progressInterval);
    progressFill.style.width = '100%';
    progressText.textContent = '100%';
  }

  matcherForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const jd = jobDescription.value.trim();

    if (!jd) {
      alert("请输入岗位描述");
      return;
    }

    matcherForm.style.display = "none";
    loadingSpinner.style.display = "flex";
    startProgressAnimation();

    matchJobDescription(jd)
      .then(({ result }) => {
        completeProgress();
        matchModalContent.innerHTML = renderMatchCard(result);
        setMatchModalOpen(true);
      })
      .catch((error) => {
        completeProgress();
        alert("匹配失败：" + error.message);
      })
      .finally(() => {
        loadingSpinner.style.display = "none";
        matcherForm.style.display = "flex";
      });
  });

  closeMatchModal.addEventListener("click", () => {
    setMatchModalOpen(false);
    matcherForm.style.display = "flex";
    jobDescription.value = "";
  });

  matchModal.querySelectorAll("[data-close-match]").forEach((element) => {
    element.addEventListener("click", () => setMatchModalOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && matchModal.classList.contains("is-open")) {
      setMatchModalOpen(false);
    }
  });

  // API调用函数
  function getApiBase() {
    const configured = (window.RESUME_API_BASE || "").trim().replace(/\/$/, "");
    if (configured) return configured;
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      return "http://localhost:5000";
    }
    return "";
  }

  async function matchJobDescription(jd) {
    const apiBase = getApiBase();
    if (!apiBase) {
      throw new Error("未配置线上 API 地址，请在 config.js 中填写 RESUME_API_BASE");
    }

    const apiUrl = `${apiBase}/api/match-job`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobDescription: jd })
    });

    if (!response.ok) {
      let message = '匹配失败';
      try {
        const errorData = await response.json();
        message = errorData.error || message;
      } catch (_) {
        message = `匹配失败（HTTP ${response.status}）`;
      }
      throw new Error(message);
    }

    const data = await response.json();
    return {
      result: data.result,
      isCached: data.cached
    };
  }

  // 渲染匹配卡片
  function renderMatchCard(jsonStr) {
    try {
      let data = JSON.parse(jsonStr);

      // 兼容两种格式：{ analysis: {...} } 或直接就是 analysis 对象
      const analysis = data.analysis || data;
      const scores = analysis.scores;
      const recommendation = analysis.recommendation;

      // 根据推荐度返回对应的等级标签
      const getRecommendationLevel = (rec) => {
        if (rec.includes('强烈')) return '强烈推荐';
        if (rec.includes('推荐') && !rec.includes('不')) return '推荐';
        if (rec.includes('可考虑')) return '可考虑';
        return '不推荐';
      };

      const level = getRecommendationLevel(recommendation);
      const levelClass = {
        '强烈推荐': 'level-excellent',
        '推荐': 'level-good',
        '可考虑': 'level-fair',
        '不推荐': 'level-poor'
      }[level] || 'level-fair';

      const html = `
        <div class="match-card-container">
          <div class="match-inner-card match-matrix-card">
            <div class="match-card-header">
              <div class="header-title-row">
                <span class="matrix-icon">📊</span>
                <h3>匹配矩阵</h3>
              </div>
              <span class="level-badge ${levelClass}">${level}</span>
            </div>

            <div class="match-card-body">
              <div class="score-circle">
                <div class="score-value">${analysis.overall_score}</div>
                <div class="score-max">/100</div>
              </div>

              <div class="scores-detail">
                <div class="score-item">
                  <div class="score-label">
                    <span class="score-title">学历</span>
                    <span class="score-number">${scores.education.score}</span>
                  </div>
                  <div class="score-bar">
                    <div class="score-fill" style="width: ${scores.education.score}%"></div>
                  </div>
                  <div class="score-explanation">${scores.education.explanation}</div>
                </div>

                <div class="score-item">
                  <div class="score-label">
                    <span class="score-title">工作经验</span>
                    <span class="score-number">${scores.experience.score}</span>
                  </div>
                  <div class="score-bar">
                    <div class="score-fill" style="width: ${scores.experience.score}%"></div>
                  </div>
                  <div class="score-explanation">${scores.experience.explanation}</div>
                </div>

                <div class="score-item">
                  <div class="score-label">
                    <span class="score-title">技能特长</span>
                    <span class="score-number">${scores.skills.score}</span>
                  </div>
                  <div class="score-bar">
                    <div class="score-fill" style="width: ${scores.skills.score}%"></div>
                  </div>
                  <div class="score-explanation">${scores.skills.explanation}</div>
                </div>

                <div class="score-item">
                  <div class="score-label">
                    <span class="score-title">软技能</span>
                    <span class="score-number">${scores.soft_skills.score}</span>
                  </div>
                  <div class="score-bar">
                    <div class="score-fill" style="width: ${scores.soft_skills.score}%"></div>
                  </div>
                  <div class="score-explanation">${scores.soft_skills.explanation}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="match-footer-row">
            <div class="match-inner-card highlights-card">
              <h4>⭐ 匹配亮点</h4>
              <div class="highlights-list">
                ${analysis.highlights.map(h => `
                  <div class="highlight-item">
                    <div class="highlight-req">${h.requirement}</div>
                    <div class="highlight-adv">${h.candidate_advantage}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="match-inner-card summary-card">
              <h4>📊 总体评价</h4>
              <p>${analysis.summary}</p>
            </div>
          </div>
        </div>
      `;

      return html;
    } catch (e) {
      return `<div class="error-message">无法解析AI返回的数据<br/>错误: ${e.message}<br/>数据: ${jsonStr.substring(0, 200)}</div>`;
    }
  }
});
