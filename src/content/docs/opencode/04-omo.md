---
title: Oh My OpenCode：从单兵模型到 Agent 团队协作
description: 安装和配置 Oh My OpenCode 插件，解锁多 Agent 和 MCP 能力
sidebar:
  order: 4
---

## 本节目标

读完本节，你应该拿到以下结果：

- 理解 OMO 的核心价值——它不是模型管理器，而是 Agent 团队 + MCP + Claude Code 兼容层
- 了解内置 Agent 团队（Sisyphus、Oracle、Librarian 等）各自的职责和调度方式
- 了解内置 MCP（Exa、Context7、Grep.app）如何提升信息获取效率
- 完成 OpenCode + OMO 的最小安装流程，并验证生效
- 能写出一份可用的 `oh-my-opencode.json` 配置，将模型映射到不同 Agent

---

## 1. OMO 是什么

如果 OpenCode 是 zsh，那 Oh My OpenCode（以下简称 OMO）就是 oh-my-zsh。

OMO 是 OpenCode 的官方插件，由社区开发者花费大量真金白银踩坑后提炼出的最佳实践集合。它解决的不是"模型切换"问题（那是 cc-switch 的事），而是以下四个核心问题：

| 问题 | OMO 的解法 |
| --- | --- |
| 复杂任务推不动、跑两步就停 | 内置主控 Agent（Sisyphus）持续推进，不会中途放弃 |
| 单模型做所有事，效果忽高忽低 | 多 Agent 协作，按角色分工派发任务 |
| 写框架代码查不到最新文档 | 内置 MCP（Context7、Exa、Grep.app）接入外部知识 |
| 和 Claude Code 用法不兼容 | 兼容 Command / Agent / Skill / MCP / Hook 等核心概念 |

一句话总结：**OMO 把你从"一个人和一个模型聊天"，升级成"指挥一支 AI 开发团队协作"。**

---

## 2. 内置 Agent 团队

OMO 的核心设计是"主控 + 子 Agent"架构。你不需要手动指挥每个 Agent，主控会自动拆解任务并调度。

### 2.1 Agent 矩阵

| Agent | 类型 | 职责 | 什么时候被调用 |
| --- | --- | --- | --- |
| **Sisyphus** | 主控 Agent | 接收任务、拆解子任务、调度子 Agent、保证主线不断档 | 所有复杂任务的默认入口 |
| **Prometheus** | 规划 Agent | 任务规划与计划制定 | 按 `Tab` 进入，执行 `/start-work` |
| **Atlas** | 执行 Agent | 按计划执行具体任务 | 由 Prometheus 规划后自动调度 |
| **Oracle** | 子 Agent | 架构选择、疑难 bug、复杂排错 | 设计/排错卡住时 |
| **Librarian** | 子 Agent | 查文档、查开源实现、陌生框架上手 | 需要资料摘要或 API 用法时 |
| **Explore** | 子 Agent | 在大仓库里快速定位文件和调用链 | 需要缩小问题范围时 |
| **Frontend UI/UX Engineer** | 子 Agent | 前端页面、交互、样式和组件改造 | 所有前端视觉和交互任务 |
| **Document Writer** | 子 Agent | 技术文档撰写 | 需要生成文档时 |
| **Multimodal Looker** | 子 Agent | 图片和多模态内容分析 | 需要理解截图或视觉内容时 |

### 2.2 工作方式

Sisyphus 的工作流程：

1. 接收你的任务描述
2. 自动拆解为可并行的子任务
3. 按子任务类型派发给对应的子 Agent（前端交给 Frontend Engineer，文档交给 Librarian，排错交给 Oracle）
4. 子 Agent 异步执行，结果回传给 Sisyphus
5. Sisyphus 整合结果，推进主线直到任务完成

关键守则：**不要脱离 `/start-work` 直接用 Atlas。Prometheus 与 Atlas 要成对使用。**

### 2.3 两种工作模式

| 模式 | 触发方式 | 适用场景 |
| --- | --- | --- |
| 快速模式 | 提示词里带 `ultrawork` 或 `ulw` | 中小任务，想快速出结果 |
| 稳定模式 | 按 `Tab` 进入 Prometheus，执行 `/start-work` | 大型任务，需要完整规划和持续推进 |

快速模式示例：

```
ulw 把这个项目的所有 JavaScript 文件迁移到 TypeScript
```

输入后，Sisyphus 自动接管：启动 Explore 扫描代码库，派 Librarian 查最佳实践，自己负责核心迁移逻辑。

---

## 3. 内置 MCP

OMO 内置了三个高频 MCP 服务，不需要额外安装，开箱即用：

| MCP | 功能 | 使用场景 | 产出 |
| --- | --- | --- | --- |
| **Exa** | 实时联网搜索 | 需要最新信息、外部方案对比、公告动态 | 联网检索结果，补齐仓库外部上下文 |
| **Context7** | 官方文档查询 | 写框架代码、用 SDK、查参数和规范 | 官方文档语境，减少 API 误用和返工 |
| **Grep.app** | GitHub 跨仓库代码搜索 | 想看"别人怎么写"并找真实开源样例 | 跨 GitHub 代码搜索结果，快速得到参考实现 |

### 实战路由建议

遇到问题时按以下顺序选择工具：

1. 框架与 SDK 细节 --> 优先查 **Context7**
2. 需要最新信息或外部动态 --> 补 **Exa**
3. 想看大规模实战样例 --> 用 **Grep.app**
4. 仓库内快速定位 --> 用 **Explore** Agent

---

## 4. 兼容层价值

如果你用过 Claude Code，OMO 的设计思路会非常熟悉。两者共享以下核心概念：

| 概念 | Claude Code | OMO / OpenCode |
| --- | --- | --- |
| 自定义指令 | `CLAUDE.md` | `OPENCODE.md`（兼容 `CLAUDE.md`） |
| 技能 / 工作流 | Custom Commands | Skills |
| 工具扩展 | MCP Server | MCP Server（同协议） |
| 钩子 | Hooks | Hooks |
| 子代理 | Sub-agent | 内置 Agent 团队 |

这意味着：

- 你在 Claude Code 积累的 `CLAUDE.md` 规则可以直接迁移
- MCP 服务器配置格式兼容，不需要重写
- 已有的工作习惯（Command、Skill、Hook）可以平滑过渡

---

## 5. 安装与接入最小流程

### 5.1 前置条件

- OpenCode 已安装并能正常启动（参考[第 01 章](/opencode/01-install/)）
- 至少有一个可用的模型 Provider（参考[第 02 章](/opencode/02-model/)）

### 5.2 安装 OMO

**推荐方式：让 AI 智能体来安装**

把以下提示粘贴到 OpenCode 对话框：

```
按照以下说明安装和配置 oh-my-opencode：
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

OMO 的作者推荐让智能体来处理安装，因为它涉及文件复制、符号链接和配置合并，人工操作容易出错。

**手动方式（备用）：**

确保 `~/.config/opencode/opencode.json` 中包含插件声明：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["oh-my-opencode"]
}
```

### 5.3 检查配置文件

安装完成后，确认以下两个文件存在：

| 文件 | 路径 | 作用 |
| --- | --- | --- |
| OpenCode 主配置 | `~/.config/opencode/opencode.json` | 必须包含 `"plugin": ["oh-my-opencode"]` |
| OMO 配置 | `~/.config/opencode/oh-my-opencode.json` | Agent 和模型映射 |

如果 `opencode.json` 里没有 plugin 字段，手动补上：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["oh-my-opencode"]
}
```

### 5.4 验证安装

分两步验证，顺序不能反：

**第一步：验证 OMO 插件是否生效**

1. 启动 `opencode`
2. 输入一个带 `ulw` 的任务（例如 `ulw 列出当前目录的文件结构`），确认自动编排可用
3. 按 `Tab` 进入 Prometheus，执行 `/start-work`，确认计划流可用

**第二步：验证模型池是否正常**

```bash
opencode models
```

这一步检查的是 Provider 是否可用，不等于 OMO 安装验证。两步都通过才算安装成功。

---

## 6. 配置实战：Agent 映射示例

OMO 的核心配置文件是 `~/.config/opencode/oh-my-opencode.json`。它决定了每个 Agent 使用哪个模型。

### 6.1 配置结构

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "agents": {
    "agent名称": {
      "model": "provider_id/model_id",
      "variant": "档位（可选）"
    }
  },
  "categories": {
    "分类名称": {
      "model": "provider_id/model_id",
      "variant": "档位（可选）"
    }
  }
}
```

关键规则：

- `model` 字段必须使用 `provider_id/model_id` 格式
- `provider_id` 必须和你在 `opencode.json` 中配置的 Provider ID 一致
- `variant` 可选，对应模型的推理档位（`low` / `medium` / `high` / `xhigh`）

### 6.2 完整配置示例

以下是一份经过实战验证的配置，使用了两个 Provider（`codex` 和 `antigravity`）：

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "agents": {
    "sisyphus": {
      "model": "codex/gpt-5.3-codex",
      "variant": "high"
    },
    "prometheus": {
      "model": "codex/gpt-5.3-codex",
      "variant": "high"
    },
    "atlas": {
      "model": "codex/gpt-5.3-codex",
      "variant": "high"
    },
    "oracle": {
      "model": "codex/gpt-5.3-codex",
      "variant": "high"
    },
    "librarian": {
      "model": "codex/gpt-5.3-codex",
      "variant": "medium"
    },
    "explore": {
      "model": "antigravity/gemini-3-flash-preview"
    },
    "frontend-ui-ux-engineer": {
      "model": "antigravity/gemini-3-pro-preview"
    },
    "document-writer": {
      "model": "antigravity/gemini-3-flash-preview"
    },
    "multimodal-looker": {
      "model": "antigravity/gemini-3-flash-preview"
    }
  },
  "categories": {
    "quick": {
      "model": "codex/gpt-5.3-codex",
      "variant": "medium"
    },
    "visual-engineering": {
      "model": "antigravity/gemini-3-pro-preview"
    }
  }
}
```

### 6.3 配置解读

这份配置的分工逻辑：

| 分组 | Agent | 模型 | 理由 |
| --- | --- | --- | --- |
| 主线决策 | sisyphus / prometheus / atlas / oracle | GPT-5.3 Codex (high) | 主控和攻坚角色需要最强推理能力 |
| 知识检索 | librarian | GPT-5.3 Codex (medium) | 查文档不需要最高推理档，medium 够用 |
| 快速任务 | explore / document-writer / multimodal-looker | Gemini 3 Flash | 速度快、成本低，适合可并行的辅助任务 |
| 前端视觉 | frontend-ui-ux-engineer | Gemini 3 Pro | 视觉理解强，设计感好 |
| 快速分类 | quick | GPT-5.3 Codex (medium) | 减少不必要的高推理消耗 |

### 6.4 模型分工策略

核心原则是两条：

1. **把主控决策和专项任务拆开**——贵模型用在关键路径，便宜模型用在可并行环节
2. **同一模型用 variant 控档**——同一个 GPT-5.3 Codex，oracle 用 high，quick 用 medium

如果预算允许升级到"双核"配置，可以只替换关键角色：

```json
{
  "agents": {
    "sisyphus": { "model": "antigravity/claude-opus-4-6" },
    "prometheus": { "model": "antigravity/claude-opus-4-6" },
    "oracle": { "model": "codex/gpt-5.3-codex-spark", "variant": "high" }
  }
}
```

先保留现有分工，只替换主控和攻坚角色，观察 3-5 次任务的速度、质量和成本再决定是否全量切换。

---

## 7. 常见问题

### 看不到模型

检查顺序：

1. 先确认 Provider 配置正确——在 `opencode.json` 中检查 `provider` 字段
2. 运行 `opencode models` 查看可用模型列表
3. 确认 `oh-my-opencode.json` 中的 `provider_id/model_id` 和实际 Provider ID 一致

### 插件没生效

检查 `~/.config/opencode/opencode.json` 是否包含：

```json
{
  "plugin": ["oh-my-opencode"]
}
```

如果配置正确但仍不生效，重启 OpenCode 再试。

### ulw 命令没有触发多 Agent 协作

确认 OMO 安装成功后，在提示词中包含 `ultrawork` 或 `ulw`。如果仍然没有多 Agent 行为，检查 `oh-my-opencode.json` 中是否正确配置了 agents 字段。

### 启动异常或报错

- 先升级 OpenCode 到最新版本
- 检查 Node.js 版本是否满足要求
- 查看终端输出的错误信息，通常会指明具体的配置问题

### Prometheus 和 Atlas 的关系

Prometheus 负责规划，Atlas 负责执行。使用时的正确流程是：按 `Tab` 进入 Prometheus --> 执行 `/start-work` --> Prometheus 制定计划 --> Atlas 按计划执行。不要跳过 Prometheus 直接调用 Atlas。

---

## 8. 下一步

OMO 解决了"Agent 团队怎么协作"的问题。但 Agent 的行为质量，很大程度上取决于你给它们的指令是否结构化。

下一章我们进入 [Skills 工作流](/opencode/05-skills/)，学习如何用 Skills 把"该怎么做"固化成可复用的标准流程。
