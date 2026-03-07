---
title: 概览：Skill 是什么、为什么重要
description: Skill 教程概览，理解 Skill 定义、生态和课程结构
sidebar:
  order: 0
---

## 本课程目标

读完整门课程，你将掌握 Skill 的完整链路：

- 理解 Skill 的本质——不是提示词模板，而是标准化的 AI Agent 指令集
- 知道去哪里找 Skill、怎么安装使用
- 了解主流 Skill 生态（Superpowers、Everything Claude Code、skill.sh 等）
- 能从零编写一个自定义 Skill 并通过质量评估
- 能在实际项目中用 Skill 驱动工作流

---

## 1. Skill 到底是什么

一句话定义：**Skill 是写给 AI Agent 的标准化指令集，告诉它"遇到什么场景、按什么流程、做到什么程度"。**

很多人第一反应是：这不就是提示词模板吗？不一样。

| 维度 | Prompt 模板 | Skill |
|------|-------------|-------|
| 触发方式 | 手动粘贴 | 自动匹配或 `/命令` 调用 |
| 结构化 | 纯文本 | 有 frontmatter（name、description、触发条件） |
| 可复用性 | 复制粘贴 | 安装即用，版本可管理 |
| 流程控制 | 没有 | 可以定义步骤、校验、输出格式 |
| 生态 | 个人收藏 | 可发布、可搜索、可安装 |

一个最小的 Skill 长这样：

```markdown
---
name: my-skill
description: 一句话说明这个 skill 干什么
---

## 具体指令内容

告诉 AI 遇到什么场景，按什么步骤执行，输出什么格式。
```

核心就是一个 `SKILL.md` 文件，frontmatter 里的 `name` 和 `description` 决定了 AI 什么时候会触发它。

Skill 分两类：

- **用户可调用**：通过 `/skill-name` 主动触发，比如 `/commit`、`/review-pr`
- **自动触发**：AI 根据 description 判断当前任务是否匹配，自动加载执行

---

## 2. Skill 适用于哪些工具

Skill 不是某一个工具的专属概念。以下工具都支持 Skill 机制：

| 工具 | Skill 格式 | 加载方式 |
|------|-----------|---------|
| Claude Code | `SKILL.md` / `.claude/skills/` | 全局 + 项目级 + 插件 |
| OpenCode | `SKILL.md` / `~/.config/opencode/skills/` | 全局 + 插件（Superpowers） |
| OpenClaw | `SKILL.md` / clawhub | 内置 + 全局 + 工作区 |
| Codex | `~/.codex/` / `~/.agents/skills/` | 软链接 + 自动发现 |

本教程的内容**跨工具通用**，不绑定特定平台。

---

## 3. 课程结构

| 章节 | 内容 | 你会拿到的结果 |
|------|------|----------------|
| [01 找 Skill](/skill/01-find/) | 3 个渠道 + Find Skills 工具 | 能快速搜到你需要的 Skill |
| [02 用别人的 Skill](/skill/02-use/) | 安装方式 + 注意事项 | 能正确安装和使用第三方 Skill |
| [03 推荐 Skill](/skill/03-recommended/) | 10+ 值得装的 Skill 分类推荐 | 知道该装哪些、各自解决什么问题 |
| [04 从零写 Skill](/skill/04-create/) | 7 步创建流程 + 真实案例 | 能独立写出一个可用的 Skill |
| [05 调试与验证](/skill/05-debug/) | 常见问题排查表 | 能快速定位 Skill 不生效的原因 |
| [06 分享与分发](/skill/06-share/) | 发布渠道 + 规范 | 能把 Skill 分享给其他人 |
| [07 实战应用](/skill/07-practice/) | cc-switch + OMO + Skill 协同工作流 | 能在真实项目中落地 Skill |
| [08 进阶编排](/skill/08-advanced/) | Skill x 记忆 x 子Agent x 定时任务 | 理解 Skill 在复杂系统中的编排模式 |

建议按顺序阅读。每章都是自包含的，但后续章节会依赖前面的概念基础。

---

## 下一步

[第 01 章：找 Skill -- 3 个渠道 + Find Skills 工具](/skill/01-find/)
