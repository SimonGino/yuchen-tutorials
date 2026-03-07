# Skill 教程模块 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在网站新增独立的 Skill 教程模块（9 章），包含概念、查找、使用、推荐、创建、调试、分享、实战应用和进阶编排，并在首页和侧边栏激活该模块入口。

**Architecture:** 在 `src/content/docs/` 下新建 `skill/` 目录，每章一个 Markdown 文件，遵循现有 OpenCode/OpenClaw 的 frontmatter 和章节结构。同时修改 `astro.config.mjs` 添加侧边栏配置，修改 `src/pages/index.astro` 将 Skill 卡片从 disabled 变为 clickable。

**Tech Stack:** Astro + Starlight, Markdown content collections, Tailwind CSS

---

### Task 1: 创建 Skill 模块目录

**Files:**
- Create: `src/content/docs/skill/` (directory)

**Step 1: 创建目录**

Run: `mkdir -p src/content/docs/skill`

**Step 2: 验证目录存在**

Run: `ls -la src/content/docs/skill`
Expected: 空目录

**Step 3: Commit**

```bash
# 空目录无需 commit，后续文件创建时一起提交
```

---

### Task 2: 创建 index.md（概览页）

**Files:**
- Create: `src/content/docs/skill/index.md`

**Step 1: 创建文件**

```markdown
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
| [06 分享与分发](/skill/06-share/) | 发布到 GitHub / clawhub / skill.sh | 能把 Skill 分享给其他人 |
| [07 实战应用](/skill/07-practice/) | cc-switch + OMO + Skill 协同工作流 | 能在真实项目中落地 Skill |
| [08 进阶编排](/skill/08-advanced/) | Skill x 记忆 x 子Agent x 定时任务 | 理解 Skill 在复杂系统中的编排模式 |

建议按顺序阅读。每章都是自包含的，但后续章节会依赖前面的概念基础。

---

## 下一步

[第 01 章：找 Skill -- 3 个渠道 + Find Skills 工具](/skill/01-find/)
```

**Step 2: 验证文件**

Run: `head -5 src/content/docs/skill/index.md`
Expected: 显示 frontmatter

**Step 3: Commit**

```bash
git add src/content/docs/skill/index.md
git commit -m "feat(skill): add skill tutorial module index page"
```

---

### Task 3: 创建 01-find.md（找 Skill）

**Files:**
- Create: `src/content/docs/skill/01-find.md`

**内容来源:** 03-07 文章 §02

**核心内容:**
- skill.sh（Vercel 生态）：`npx skills add vercel-labs/skills/find-skills` + `npx skills find`
- clawhub：网页浏览，分类齐全，支持一键安装到 OpenClaw
- GitHub 搜索：`awesome-claude-skills` 关键词，开源项目可 fork
- 三渠道对比表（特点 + 适合场景）
- baoyu-skills 推荐提及

**Step 1: 创建文件**

frontmatter:
```yaml
---
title: 找 Skill：3 个渠道 + Find Skills 工具
description: 掌握 Skill 搜索的三个主要渠道，快速找到你需要的 Skill
sidebar:
  order: 1
---
```

**Step 2: Commit**

```bash
git add src/content/docs/skill/01-find.md
git commit -m "feat(skill): add chapter 01 - finding skills"
```

---

### Task 4: 创建 02-use.md（用别人的 Skill）

**Files:**
- Create: `src/content/docs/skill/02-use.md`

**内容来源:** 03-07 文章 §03

**核心内容:**
- 3 种安装方式对比表：npx 安装 / 手动 clone / 对话安装
- 实战举例：anything-to-notebooklm
- 使用注意事项：先读 SKILL.md、先在测试环境跑、注意安全边界
- 加载优先级说明（全局 → 插件 → 项目级）

**Step 1: 创建文件**

frontmatter:
```yaml
---
title: 用别人的 Skill：安装方式与注意事项
description: 掌握三种 Skill 安装方式，了解安全边界和加载优先级
sidebar:
  order: 2
---
```

**Step 2: Commit**

```bash
git add src/content/docs/skill/02-use.md
git commit -m "feat(skill): add chapter 02 - using others' skills"
```

---

### Task 5: 创建 03-recommended.md（推荐 Skill）

**Files:**
- Create: `src/content/docs/skill/03-recommended.md`

**内容来源:** 01-24 文章（Everything Claude Code）+ 02-12 文章（Superpowers）+ 03-07 文章 + 新写

**核心内容:**

分 4 大类推荐：

**流程框架类：**
- Superpowers（obra/superpowers）：brainstorming → writing-plans → TDD → code-review → finishing-branch 全链路
- Everything Claude Code（affaan-m/everything-claude-code）：commands + rules + hooks + MCP 一站配置

**Skill 工具类：**
- Find Skills（vercel-labs/skills/find-skills）：命令行搜索 Skill 生态
- skill-creator（anthropics/skills）：Anthropic 官方 Skill 质量评估

**开发规范类：**
- vercel-react-best-practices：React/Next.js 编码规范
- systematic-debugging：系统化调试流程
- finishing-a-development-branch：分支收尾决策

**内容与效率类：**
- baoyu-skills 系列：公众号文章、小红书图片、信息图等内容生产
- anything-to-notebooklm：内容导入 NotebookLM 生成信息图/PPT
- wqq-x-bookmarks：社交平台书签导出 + 去重 + 摘要

每个 Skill 包含：一句话介绍、安装命令、适合场景、工具兼容性标注

**Step 1: 创建文件**

frontmatter:
```yaml
---
title: 推荐 Skill：值得装的 10+ 个 Skill
description: 分类推荐主流 Skill，覆盖流程框架、开发规范、内容生产等场景
sidebar:
  order: 3
---
```

**Step 2: Commit**

```bash
git add src/content/docs/skill/03-recommended.md
git commit -m "feat(skill): add chapter 03 - recommended skills"
```

---

### Task 6: 创建 04-create.md（从零写 Skill）

**Files:**
- Create: `src/content/docs/skill/04-create.md`

**内容来源:** 03-07 文章 §04

**核心内容:**
- 开发路线图（7 步）：搜索 → fork 改造 → 需求说清楚 → brainstorming 做设计 → 实现 → skill-creator 评估 → 实测验证
- frontmatter 规范（name / description / 触发条件）
- 真实案例：社交平台书签导出 Skill 的完整开发过程
- Step 4 brainstorming 重点展开：需求收敛的 5 个关键问题
- Step 6 skill-creator 使用方法

**Step 1: 创建文件**

frontmatter:
```yaml
---
title: 从零写一个 Skill：7 步完整路线
description: 掌握 Skill 开发全流程，从需求收敛到质量评估到实测验证
sidebar:
  order: 4
---
```

**Step 2: Commit**

```bash
git add src/content/docs/skill/04-create.md
git commit -m "feat(skill): add chapter 04 - creating skills from scratch"
```

---

### Task 7: 创建 05-debug.md（调试与验证）

**Files:**
- Create: `src/content/docs/skill/05-debug.md`

**内容来源:** 03-07 文章调试部分

**核心内容:**
- 4 类常见问题排查表：不触发 / 触发错误 / 改了没生效 / Skill 冲突
- 各工具的调试方式差异（Claude Code vs OpenCode vs OpenClaw）
- frontmatter 检查清单
- 依赖与环境变量验证

**Step 1: 创建文件**

frontmatter:
```yaml
---
title: 调试与验证：Skill 不生效的排查指南
description: 快速定位 Skill 不触发、执行错误、冲突等常见问题
sidebar:
  order: 5
---
```

**Step 2: Commit**

```bash
git add src/content/docs/skill/05-debug.md
git commit -m "feat(skill): add chapter 05 - debugging skills"
```

---

### Task 8: 创建 06-share.md（分享与分发）

**Files:**
- Create: `src/content/docs/skill/06-share.md`

**内容来源:** 03-07 文章 §06

**核心内容:**
- 4 种分享方式对比表：GitHub 开源 / 提交 clawhub / skill.sh 发布 / 本地自用
- SKILL.md 规范化建议
- 版本管理最佳实践

> 注：clawhub 和 skill.sh 的具体发布流程待后续补充

**Step 1: 创建文件**

frontmatter:
```yaml
---
title: 分享与分发：把 Skill 发布出去
description: 掌握 Skill 的分享渠道和发布规范
sidebar:
  order: 6
---
```

**Step 2: Commit**

```bash
git add src/content/docs/skill/06-share.md
git commit -m "feat(skill): add chapter 06 - sharing and distributing skills"
```

---

### Task 9: 创建 07-practice.md（实战应用）

**Files:**
- Create: `src/content/docs/skill/07-practice.md`

**内容来源:** 02-15 文章（cc-switch + OMO）+ 02-17 文章（Codex 实战）+ 01-24 文章（Everything Claude Code）

**核心内容:**

**1. cc-switch 管理模型池**
- 添加 / 编辑 / 移除 / 回滚 provider 的标准流程
- 供应商模板（Codex / Antigravity，脱敏版）
- smoke 验证：`/models` + 固定任务回归

**2. OMO 编排 + Skill 协同**
- 三层架构 + 双闭环（模型闭环 + 任务闭环）
- Agent 分工策略表（Sisyphus / Oracle / Librarian / Explore / Frontend）
- ulw 快速模式 vs Prometheus → /start-work 稳定模式

**3. 推特书签导出完整复盘**
- brainstorming → writing-plans → executing-plans → TDD → 验收三连
- 需求收敛 6 问
- 工程 SOP 模板

**4. Everything Claude Code 落地 SOP**
- 最小闭环验收：/plan → /tdd → /code-review
- hooks 分三档启用策略
- MCP 选择建议（按噪音/收益比）

**Step 1: 创建文件**

frontmatter:
```yaml
---
title: 实战应用：cc-switch + OMO + Skill 协同工作流
description: 在真实项目中落地 Skill，覆盖模型管理、任务编排和工程复盘
sidebar:
  order: 7
---
```

**Step 2: Commit**

```bash
git add src/content/docs/skill/07-practice.md
git commit -m "feat(skill): add chapter 07 - practical applications"
```

---

### Task 10: 创建 08-advanced.md（进阶编排）

**Files:**
- Create: `src/content/docs/skill/08-advanced.md`

**内容来源:** 02-27 进阶配置文章

**核心内容:**
- Skill x Memory：让 Agent 记住上下文和偏好
- Skill x Sub-Agent：多 Agent 分工中的 Skill 路由
- Skill x Automation：定时任务 + Skill 自动执行
- 安全与 Gating：requires.bins / requires.env 等门控机制

> 注：本章素材较薄，先搭框架占位，后续补充实操案例

**Step 1: 创建文件**

frontmatter:
```yaml
---
title: 进阶编排：Skill x 记忆 x 子Agent x 定时任务
description: 理解 Skill 在复杂系统中的编排模式和安全边界
sidebar:
  order: 8
---
```

**Step 2: Commit**

```bash
git add src/content/docs/skill/08-advanced.md
git commit -m "feat(skill): add chapter 08 - advanced orchestration"
```

---

### Task 11: 修改 astro.config.mjs 添加 Skill 侧边栏

**Files:**
- Modify: `src/content/docs/../../astro.config.mjs` → `astro.config.mjs:31-44`

**Step 1: 在 sidebar 数组末尾添加 Skill 条目**

在现有的 OpenCode 条目后面追加：

```javascript
{
  label: 'Skill 编写指南',
  translations: { en: 'Skill Writing Guide' },
  collapsed: true,
  autogenerate: { directory: 'skill' },
},
```

**Step 2: 验证配置**

Run: `grep -A 3 'Skill' astro.config.mjs`
Expected: 能看到新增的 Skill sidebar 配置

**Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat(skill): add skill tutorial to sidebar config"
```

---

### Task 12: 修改首页激活 Skill 卡片

**Files:**
- Modify: `src/pages/index.astro:51-63`

**Step 1: 将 Skill 卡片从 disabled 改为 clickable**

将：
```html
<div class="tutorial-card tutorial-card--disabled">
  <span class="card-badge">即将上线</span>
  <div class="card-icon">🧩</div>
  <h3 class="card-title">Skill 编写</h3>
  <p class="card-desc">自定义技能开发指南</p>
</div>
```

改为：
```html
<a href="/skill/" class="tutorial-card tutorial-card--clickable">
  <div class="card-icon">🧩</div>
  <h3 class="card-title">Skill 编写</h3>
  <p class="card-desc">自定义技能开发指南</p>
  <div class="card-meta">
    <span>9 章节</span>
    <span class="card-cta">开始学习 →</span>
  </div>
</a>
```

**Step 2: 在 footer 教程链接区添加 Skill 链接**

在 footer-col 中 OpenCode 链接后面追加：
```html
<a href="/skill/" class="footer-link">Skill 编写</a>
```

**Step 3: 验证**

Run: `grep -n 'skill' src/pages/index.astro`
Expected: 能看到新的 clickable 卡片和 footer 链接

**Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(skill): activate skill tutorial card on homepage"
```

---

### Task 13: 本地构建验证

**Step 1: 运行构建**

Run: `npm run build`（或 `pnpm build`）
Expected: 构建成功，无报错

**Step 2: 本地预览**

Run: `npm run dev`
Expected:
- 首页 Skill 卡片可点击，跳转到 `/skill/`
- 侧边栏显示 "Skill 编写指南" 折叠菜单
- 展开后能看到所有 9 个章节

**Step 3: Commit（如有修复）**

```bash
git add -A
git commit -m "fix(skill): resolve build issues"
```

---

### Task 14: 最终提交与分支整理

**Step 1: 创建功能分支（如果还在 main）**

```bash
git checkout -b feat/skill-tutorial
```

**Step 2: 验证所有文件**

Run: `ls -la src/content/docs/skill/`
Expected: 9 个 .md 文件（index + 01~08）

Run: `git log --oneline -10`
Expected: 能看到所有 skill 相关的 commit

**Step 3: Push**

```bash
git push -u origin feat/skill-tutorial
```
