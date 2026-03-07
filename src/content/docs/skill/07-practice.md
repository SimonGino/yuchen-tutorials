---
title: 实战应用：cc-switch + OMO + Skill 协同工作流
description: 在真实项目中落地 Skill，覆盖模型管理、任务编排和工程复盘
sidebar:
  order: 7
---

## 本节目标

- 掌握 cc-switch 管理多供应商模型池的标准流程
- 理解 Oh My OpenCode (OMO) 的三层架构与双闭环编排策略
- 通过一个真实项目（推特书签导出）复盘 AI 协作开发全链路
- 学会 Everything Claude Code 的最小闭环验收与分档启用策略

---

## 一、cc-switch 管理模型池

### 1.1 一句话定义

**cc-switch 负责模型资源池的增删改查** -- 它管的是"你有哪些供应商、哪些模型可用"，不涉及任务编排和 Agent 分工。

### 1.2 添加/编辑/移除/回滚：4 步标准流程

| 步骤 | 操作 | 说明 |
|------|------|------|
| 1 | 在 OpenCode 标签页点击 `+` 新增供应商 | 进入 provider 编辑界面 |
| 2 | 填写 provider JSON（models、baseURL、apiKey） | 使用环境变量注入 key，避免泄露 |
| 3 | 保存后回到列表，可继续编辑或移除 | 支持随时回滚到上一版配置 |
| 4 | 回到 OpenCode 执行 `/models`，确认模型已生效 | 必做，否则不知道是否真正可用 |

每次切换后，固定做两步回归验证：

1. `/models` 检查当前可用模型集合
2. 跑一次固定 smoke task（例如"读代码 + 小改动 + 测试"），确认模型响应正常

### 1.3 供应商模板示例

以下是两个常用供应商的脱敏配置模板，直接复制后替换环境变量即可。

**Codex 模板**：

```json
{
  "models": {
    "gpt-5.3-codex": {
      "limit": { "context": 400000, "output": 128000 },
      "modalities": {
        "input": ["text", "image", "pdf"],
        "output": ["text"]
      },
      "name": "GPT-5.3 Codex",
      "variants": {
        "high": { "reasoningEffort": "high", "reasoningSummary": "detailed", "textVerbosity": "medium" },
        "medium": { "reasoningEffort": "medium", "reasoningSummary": "auto", "textVerbosity": "medium" },
        "low": { "reasoningEffort": "low", "reasoningSummary": "auto", "textVerbosity": "medium" }
      }
    }
  },
  "npm": "@ai-sdk/openai",
  "options": {
    "apiKey": "{env:OPENAI_CODEX_API_KEY}",
    "baseURL": "https://your-gateway.example.com/v1",
    "reasoningEffort": "medium",
    "store": false
  }
}
```

**Antigravity 模板**：

```json
{
  "models": {
    "claude-opus-4-6": {
      "limit": { "context": 200000, "output": 128000 },
      "modalities": {
        "input": ["text", "image", "pdf"],
        "output": ["text"]
      },
      "name": "Claude Opus 4.6"
    },
    "gemini-3-pro-preview": {
      "limit": { "context": 1048576, "output": 65535 },
      "modalities": {
        "input": ["text", "image", "pdf"],
        "output": ["text"]
      },
      "name": "Gemini 3 Pro Preview"
    },
    "gemini-3-flash-preview": {
      "limit": { "context": 1048576, "output": 65535 },
      "modalities": {
        "input": ["text", "image", "pdf"],
        "output": ["text"]
      },
      "name": "Gemini 3 Flash"
    }
  },
  "name": "Antigravity",
  "npm": "@ai-sdk/anthropic",
  "options": {
    "apiKey": "{env:ANTIGRAVITY_API_KEY}",
    "baseURL": "https://your-gateway.example.com/antigravity/v1"
  }
}
```

> 注意：`{env:XXX}` 表示从环境变量读取，务必不要将真实 API Key 硬编码到配置中。

### 1.4 smoke 验证清单

每次新增或变更供应商后，按以下清单走一遍：

1. 执行 `/models`，确认新模型出现在列表中
2. 用新模型跑一个固定任务（建议保留一个"读某个文件 + 做一个小改动 + 跑测试"的标准任务）
3. 对比输出质量和响应速度，确认无明显异常
4. 如果异常，回滚到上一版 provider 配置并排查

---

## 二、OMO 编排 + Skill 协同

### 2.1 三层架构 + 双闭环

OMO（Oh My OpenCode）不是模型管理器，而是一套任务编排系统。它的核心结构是三层加双闭环：

**三层架构**：

| 层级 | 组件 | 职责 |
|------|------|------|
| 模型层 | cc-switch | 管理供应商和模型可用性 |
| 编排层 | OMO（Agent + MCP） | Agent 分工、任务调度、外部知识接入 |
| 执行层 | OpenCode + Skill | 具体任务执行和流程约束 |

**双闭环**：

1. **模型闭环**：`cc-switch` --> `/models` --> OMO 映射 --> smoke 验证。确保模型可用且正确路由。
2. **任务闭环**：`Prometheus 访谈` --> `/start-work 执行` --> 验证完成。确保任务按计划推进并闭环。

只要按这两个闭环走，模型再多也不会乱。

### 2.2 Agent 分工策略表

| 组件 | 类型 | 什么时候用 | 主要产出 |
|------|------|-----------|---------|
| Sisyphus | 主控 Agent | 任务复杂、涉及多文件、需要持续推进 | 统一拆解任务并调度子 Agent，保证主线不断档 |
| Oracle | 子 Agent | 架构选择、疑难 bug、复杂排错 | 高质量诊断、方案比较和修复路径 |
| Librarian | 子 Agent | 查文档、查开源实现、陌生框架上手 | 资料摘要、关键 API 用法、可落地参考 |
| Explore | 子 Agent | 大仓库快速定位文件/调用链 | 快速扫描代码库，缩小问题范围 |
| Frontend UI/UX Engineer | 子 Agent | 前端页面、交互、样式和组件改造 | 完整 UI 方案与前端实现代码 |
| Exa | MCP | 需要最新信息、外部方案对比、公告动态 | 联网检索结果，补齐仓库外上下文 |
| Context7 | MCP | 写框架代码、用 SDK、查参数和规范 | 官方文档语境，减少 API 误用和返工 |
| Grep.app | MCP | 想看"别人怎么写"、找真实开源样例 | 跨 GitHub 代码搜索，快速得到参考实现 |

**实战路由建议**：

1. 主任务先交给 `Sisyphus` 统筹
2. 设计/排错卡住时拉 `Oracle`
3. 框架与 SDK 细节优先查 `Context7`，需要最新信息再补 `Exa`
4. 要看大规模实战样例时用 `Grep.app`，仓库内快速定位用 `Explore`
5. 只要是前端视觉和交互任务，优先交给 `Frontend UI/UX Engineer`

### 2.3 两种工作模式

| 模式 | 触发方式 | 适用场景 | 特点 |
|------|---------|---------|------|
| 快速模式 | 提示词里带 `ultrawork` / `ulw` | 小任务、快速验证、单文件改动 | 快速自动编排，直接开干 |
| 稳定模式 | `Tab` --> `Prometheus` --> `/start-work` | 复杂任务、多文件改造、需要计划 | 先访谈收敛需求，再按计划推进 |

稳定模式的工作流：

1. 按 `Tab` 切换到 `Prometheus` Agent
2. `Prometheus` 会先做需求访谈，帮你收敛目标
3. 执行 `/start-work`，生成执行计划
4. 按计划逐步推进，每步有验证

### 2.4 核心守则

:::caution[不要跳过 Prometheus]
**不要脱离 `/start-work` 直接用 `atlas`。** Prometheus 与 Atlas 必须成对使用 -- Prometheus 负责规划，Atlas 负责执行。跳过规划直接执行，等于让 AI 在没有地图的情况下开车。
:::

---

## 三、工程实战复盘 -- 推特书签导出

### 3.1 项目背景

信息流太快了，**收藏不等于学习**：

- 收藏不等于看过
- 看过不等于理解
- 理解不等于可复用

目标：把"平台收藏"变成"本地知识资产" -- 能检索、能复盘、能二次加工。

技术选型：`Codex + Superpower Skills + TDD`，全程要求"可验证"。

### 3.2 AI 协作开发 SOP

整个开发流程严格按五步走：

| 阶段 | 使用的 Skill | 核心产出 |
|------|-------------|---------|
| 需求收敛 | `brainstorming` | 把模糊想法变成明确设计决策 |
| 计划拆解 | `writing-plans` | 可执行的任务列表 + 每步验收标准 |
| 任务执行 | `executing-plans` | 按 task 逐个推进，每个 task 单独 commit |
| 质量保障 | TDD（红灯 --> 绿灯 --> 重构） | 每个功能都有测试覆盖 |
| 验收三连 | 两轮导出 + 幂等检查 + 空目录检查 | 可重复、可验证的交付证据 |

关键原则：**Codex 负责执行，Skill 负责流程，TDD 负责质量。**

### 3.3 需求收敛 6 问

在 `brainstorming` 阶段，通过 6 个问题把需求冻结：

```text
Q1：抓取范围？
A：最新 50 条（不做时间范围）

Q2：输出形态？
A：每条书签单独一个 .md

Q3：媒体策略？
A：默认下载 imgs/videos

Q4：重复运行策略？
A：已存在文件跳过（幂等）

Q5：工程边界？
A：先在当前仓库做 PoC，不走 skill 运行方式，必须有 debug 入口

Q6：执行顺序？
A：先认证调试，再批量导出
```

把这 6 个问题答完后，需求才真正"冻结"。后面所有计划、测试、提交都围绕这一版需求执行，避免边写边改。

### 3.4 执行指令模板

以下模板可以直接复用。先定义变量：

```bash
export PROJECT_ROOT="$HOME/Code/Playground/your-project"
export PLAN_FILE="$PROJECT_ROOT/docs/plans/your-plan.md"
export OUTPUT_DIR="/tmp/your-output-demo"
```

然后在新会话中粘贴执行指令：

```text
请使用 executing-plans skill，按 ${PLAN_FILE} 逐任务执行。
要求：
1）全程 TDD
2）每个 task 完成后单独 commit
3）先完成 debug 认证验证再做导出链路
4）每一步给测试或命令验证结果
```

验收三连命令（两轮导出 + 幂等 + 空目录检查）：

```bash
cd "$PROJECT_ROOT"

# 第一轮导出（验证功能可用）
npx -y bun skills/your-skill/scripts/main.ts --limit 10 --output "$OUTPUT_DIR"

# 第二轮复跑（验证幂等 -- 应出现 skipped）
npx -y bun skills/your-skill/scripts/main.ts --limit 10 --output "$OUTPUT_DIR"

# 空目录检查（结果应为 0）
find "$OUTPUT_DIR" -type d -empty | wc -l
```

### 3.5 踩坑总结

| 坑 | 现象 | 解决方案 |
|----|------|---------|
| 目录命名不可读 | 目录是纯数字 id，看不出内容 | 改为 `YYYYMMDD-HHmmss-标题-作者-id` 格式 |
| 出现空目录 | 失败时先建目录，留下"空壳" | 先拿到 markdown 内容，再创建目标目录写入 |
| 排序不是发布时间 | 抓取顺序是书签 timeline 返回顺序（最近收藏优先） | 目录名增加时间前缀（由 tweetId 解码），按文件名做时间浏览 |

核心经验：**能跑不算完成，能重复稳定跑才算完成。**

---

## 四、Everything Claude Code 落地 SOP

### 4.1 最小闭环验收

配置完成后，用一个小任务跑通三步闭环：

```text
/plan    -->  把需求拆成步骤、边界、验收方式
/tdd     -->  RED/GREEN/REFACTOR 驱动实现
/code-review  -->  检查质量、安全、可维护性
```

验收清单：

- `/plan` 输出包含：步骤、边界、验收方式
- `/tdd` 输出包含：RED/GREEN/REFACTOR 顺序 + 具体测试命令
- `/code-review` 输出包含：风险点（security/logic）+ 验证项
- 你没有为了"让它工作"而反复解释同样的规则（说明 rules 生效了）

### 4.2 Command 选择速查表

| 你遇到的情况 | 先用哪个命令 | 你要提供的关键信息 |
|-------------|-------------|-------------------|
| 不知道从哪改、怎么拆 | `/plan` | goal、限制、验收、影响范围 |
| 要加功能/修逻辑但怕回归 | `/tdd` | 测试命令、接口定义、边界条件 |
| 构建/测试挂了 | `/build-fix` | 报错日志、复现命令、环境信息 |
| 改完担心质量/安全 | `/code-review` | 变更点、风险偏好、发布方式 |
| 代码越来越乱 | `/refactor-clean` | "只清理不重构"的限制、验证方式 |
| 项目间切包管理器 | `/setup-pm` | 你希望的默认 pm、项目偏好 |

### 4.3 hooks 分三档启用策略

不要一次性把所有 hooks 都打开。按噪音/收益比分三档：

| 档位 | 建议 | 包含的 hooks | 说明 |
|------|------|-------------|------|
| 第一档 | 默认开 | 提醒 tmux、提醒 console.log、提醒格式化 | 低噪音，高收益 |
| 第二档 | 按团队习惯开 | 提交前检查 TODO、敏感信息扫描（提醒式） | 中等噪音，团队规范需要 |
| 第三档 | 慎用自动执行 | 自动跑 typecheck、自动跑测试、自动生成变更摘要 | 高噪音，容易打断心流 |

实用判断：如果你的 typecheck/test 通常 30 秒内跑完，可以考虑第三档；如果经常超过 1 分钟，先别自动跑，改成提醒。

如果你发现 hooks 让你"每次都被打断"，优先把它从"拦截/自动执行"改成"提醒"，稳定后再升级。

### 4.4 MCP 选择建议

按常见工作场景，选最少但够用的组合：

| 工作场景 | 推荐 MCP | 说明 |
|---------|---------|------|
| 日常开发（大多数人） | `github` +（可选）`vercel`/`railway` | 覆盖代码管理 + 部署 |
| 有数据库排查需求 | 上面 + `supabase`（或你的 DB MCP） | 减少复制粘贴 SQL 和日志 |
| 需要长期项目记忆 | 上面 + `memory` | 控制写入内容，避免噪音 |

**MCP 启用原则**：如果你经常复制粘贴同一类信息（PR 链接、日志、SQL），开；如果你只是"偶尔可能用到"，先别开。

### 4.5 MCP 过多的典型症状

出现以下任意 2 条，就该减少 MCP 数量：

1. 输出变长但没重点（像是在"展示工具"，不是解决问题）
2. 经常忘记你刚刚说过的限制条件
3. 计划里开始出现无关探索（跑偏）
4. 同样的问题要你重复解释

解决方式通常只有一个：**禁用一批，回到每个项目 3-5 个 MCP。**

---

## 下一步

学完实战应用，继续前往 [进阶编排](/skill/08-advanced/) -- 了解如何在更复杂的场景中组合 Skill、Agent 和 MCP，构建自动化工作流。
