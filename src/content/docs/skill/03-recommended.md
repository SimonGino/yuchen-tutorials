---
title: 推荐 Skill：值得装的 10+ 个 Skill
description: 分类推荐主流 Skill，覆盖流程框架、开发规范、内容生产等场景
sidebar:
  order: 3
---

## 本节目标

- 了解 4 大类主流 Skill，知道每个解决什么问题
- 根据自己的工作场景，选出 2-3 个先装上
- 掌握每个 Skill 的安装方式和兼容工具

---

## 一、流程框架类

这一类 Skill 的核心价值是：**把 AI 从"随机发挥"约束成"可复用的工程流程"。** 它们不是教 AI 写更好的代码，而是教 AI 按流程交付结果。

### 1. Superpowers

> 工程流程全家桶 -- brainstorming、writing-plans、TDD、code-review、finishing-branch 一站式覆盖。

- **仓库**：[github.com/obra/superpowers](https://github.com/obra/superpowers)
- **解决什么**：把 AI 协作从"想到哪做到哪"变成标准工程流程。覆盖需求收敛、计划拆解、并行执行、测试驱动、代码审查、分支收尾的完整闭环。
- **兼容工具**：Claude Code / OpenCode / Codex / OpenClaw

**核心工作流**：

1. `/brainstorming` -- 需求收敛，把模糊想法变成明确设计
2. `/writing-plans` -- 把设计变成可执行计划，明确每步产出和验收标准
3. `/dispatching-parallel-agents` 或 `/subagent-driven-development` -- 并行实现，把独立任务拆给子代理
4. `/requesting-code-review` -- 提交前做质量检查
5. `/finishing-a-development-branch` -- 分支收尾决策

**安装方式（以 OpenCode 为例）**：

```bash
# 1. 克隆仓库
git clone https://github.com/obra/superpowers.git ~/.config/opencode/superpowers

# 2. 创建插件目录并软链接
mkdir -p ~/.config/opencode/plugins
ln -s ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js \
      ~/.config/opencode/plugins/superpowers.js

# 3. 软链接 skills
ln -s ~/.config/opencode/superpowers/skills \
      ~/.config/opencode/skills/superpowers

# 4. 重启 OpenCode
```

Claude Code 用户可以直接将 skills 目录软链接到 `~/.claude/skills/superpowers`；Codex 用户参考：

```bash
git clone https://github.com/obra/superpowers.git ~/.codex/superpowers
mkdir -p ~/.agents/skills
ln -s ~/.codex/superpowers/skills ~/.agents/skills/superpowers
```

:::tip[最小验收]
安装完成后，输入 `/brainstorming` 能触发需求收敛流程，说明 Skill 已生效。
:::

### 2. Everything Claude Code

> commands + rules + hooks + MCP 一站配置，主打 `/plan` → `/tdd` → `/code-review` 验收闭环。

- **仓库**：[github.com/affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
- **解决什么**：把 Claude Code 变成可复用的工作流系统。提供一组斜杠命令（`/plan`、`/tdd`、`/build-fix`、`/code-review`、`/refactor-clean`、`/setup-pm`），配合 rules、hooks、MCP 配置参考，让输出稳定、可验收。
- **兼容工具**：Claude Code（原生插件）

**安装方式 A -- 插件安装（推荐）**：

```text
/plugin marketplace add affaan-m/everything-claude-code
/plugin install everything-claude-code@everything-claude-code
```

**安装方式 B -- 手动安装**：

```bash
git clone https://github.com/affaan-m/everything-claude-code.git
mkdir -p ~/.claude/{agents,rules,commands,skills}
cp everything-claude-code/agents/*.md ~/.claude/agents/
cp everything-claude-code/rules/*.md ~/.claude/rules/
cp everything-claude-code/commands/*.md ~/.claude/commands/
cp -r everything-claude-code/skills/* ~/.claude/skills/
```

**核心闭环**：

| 步骤 | 命令 | 输出 |
|------|------|------|
| 拆需求 | `/plan` | 步骤拆解、边界、验收方式 |
| 加功能 | `/tdd` | RED/GREEN/REFACTOR 顺序 + 测试命令 |
| 修构建 | `/build-fix` | 复现方式 + 最小修复 + 验证命令 |
| 拉质量 | `/code-review` | 风险点 + 安全检查 + 验证项 |

:::tip[建议]
先把 commands 跑通（`/plan` → `/tdd` → `/code-review`），再少量启用 hooks 和 MCP。配太多反而会让上下文窗口缩水，模型变"钝"。
:::

---

## 二、Skill 工具类

这一类 Skill 帮你更高效地发现和评估 Skill 本身。

### 3. Find Skills

> 命令行搜索 Skill 的工具，Vercel 官方维护。

- **来源**：[vercel-labs/skills/find-skills](https://github.com/vercel-labs/skills)（skill.sh 生态）
- **解决什么**：想装 Skill 但不知道有什么可选的。一条命令搜索，结果带名称、描述和安装命令。
- **兼容工具**：Claude Code / OpenCode / Codex / OpenClaw（通用）

**安装和使用**：

```bash
# 安装
npx skills add vercel-labs/skills/find-skills

# 搜索
npx skills find [关键词]
```

例如搜索 commit 相关的 Skill：

```bash
npx skills find commit
```

搜索结果会列出匹配的 Skill，直接复制安装命令即可。

### 4. skill-creator

> Anthropic 官方 Skill 质量评估工具，帮你检查自己写的 Skill 是否规范。

- **来源**：[anthropics/skills/skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator)
- **解决什么**：自己写完 Skill 后不确定质量如何。它会从结构、描述、触发条件、安全边界等维度帮你检查，告诉你哪里还需要改。
- **兼容工具**：Claude Code / OpenClaw

**安装方式**：

直接在 Claude Code 对话中输入：

```text
安装更新 https://github.com/anthropics/skills/tree/main/skills/skill-creator
```

也可以手动 clone 后放到 `~/.claude/skills/` 目录。

:::tip[什么时候用]
当你从零写完一个 Skill、准备发布或分享之前，先用 skill-creator 跑一遍评估，能显著提升 Skill 质量。详见 [第 04 章](/skill/04-create/)。
:::

---

## 三、开发规范类

这一类 Skill 把团队的编码规范、调试流程、分支管理等经验固化成 AI 可执行的标准动作。

### 5. vercel-react-best-practices

> React / Next.js 编码规范 Skill，自动约束前端输出质量。

- **来源**：skill.sh 生态（可通过 `npx skills find react` 搜索）
- **解决什么**：前端项目中 AI 生成的代码风格不统一、不遵守最佳实践。这个 Skill 内置了 React / Next.js 的组件拆分、状态管理、性能优化等规范，让 AI 输出的代码自动符合团队标准。
- **兼容工具**：Claude Code / OpenCode / Codex / OpenClaw

**安装**：

```bash
npx skills add vercel-labs/skills/vercel-react-best-practices
```

### 6. systematic-debugging（Superpowers 内置）

> 按症状分类的系统化 debug 流程。

- **来源**：Superpowers 仓库内置（安装 Superpowers 即可使用）
- **解决什么**：遇到 bug 时不再"猜着改"。它按症状分类（构建失败、运行时异常、逻辑错误等），引导 AI 按固定路径排查：复现 → 定位 → 最小修复 → 回归验证。
- **兼容工具**：Claude Code / OpenCode / Codex / OpenClaw

无需单独安装，安装 Superpowers 后自动可用。当你描述 bug 症状时，AI 会自动匹配触发。

### 7. finishing-a-development-branch（Superpowers 内置）

> 分支收尾决策 -- merge / PR / cleanup 的标准流程。

- **来源**：Superpowers 仓库内置
- **解决什么**：功能开发完但分支收尾总是随意处理。这个 Skill 帮你决策：该直接 merge、该发 PR、还是该先 cleanup。确保分支状态干净、提交历史清晰。
- **兼容工具**：Claude Code / OpenCode / Codex / OpenClaw

无需单独安装，安装 Superpowers 后自动可用。在分支开发完成时使用 `/finishing-a-development-branch` 触发。

---

## 四、内容与效率类

这一类 Skill 面向内容生产和信息管理场景，不限于代码。

### 8. baoyu-skills 系列

> 公众号文章、小红书图片、信息图等内容生产 Skill 合集。

- **来源**：GitHub 搜索 `baoyu-skills`（宝玉老师维护）
- **解决什么**：内容创作者需要批量生成公众号文章、小红书配图、翻译稿、信息图等。这套 Skill 把内容生产的常见流程标准化，覆盖写作、排版、多平台适配等场景。
- **兼容工具**：Claude Code / OpenClaw

**安装方式**：

```bash
# 手动 clone 到 skills 目录
git clone https://github.com/baoyu-skills/[具体仓库] ~/.claude/skills/baoyu-skills
```

也可以直接在 Claude Code 对话中输入仓库地址让 AI 帮你安装。

### 9. anything-to-notebooklm

> 把各种内容导入 NotebookLM，生成信息图、PPT、报告、思维导图。

- **来源**：GitHub（joeseesun 维护）
- **解决什么**：你有一堆视频链接、文章、资料，想快速生成可视化的信息图或报告。这个 Skill 帮你把内容自动导入 NotebookLM，然后利用 NotebookLM 的能力生成各类可视化输出。
- **兼容工具**：Claude Code / OpenClaw

**使用方式**：给 AI 一个视频链接或内容 URL，它会自动搜索信息、总结内容、生成信息图。

### 10. wqq-x-bookmarks

> 社交平台书签批量导出 + 去重 + 摘要生成。

- **来源**：[github.com/SimonGino/wqq-wechat-skills](https://github.com/SimonGino/wqq-wechat-skills)（PR #2）
- **解决什么**：社交平台书签越收藏越多，但从来看不过来。这个 Skill 把书签批量导出为独立 Markdown 文件，支持幂等（重跑自动跳过已导出的）、空目录清理、模型自动分类和摘要生成。
- **兼容工具**：Claude Code / OpenCode / Codex

**核心能力**：

- 读取本地浏览器登录态，通过接口按页读取书签数据
- 每条书签转换为独立 Markdown 文件，目录名带时间和标题
- 支持媒体下载（图片/视频）
- 重复运行自动跳过已存在文件（幂等）
- 模型自动生成分类摘要（Summary）

**使用命令**：

```bash
# 导出最近 10 条书签
npx -y bun skills/wqq-x-bookmarks/scripts/main.ts --limit 10 --output /tmp/bookmarks

# 复跑验证幂等（第二轮应显示 skipped）
npx -y bun skills/wqq-x-bookmarks/scripts/main.ts --limit 10 --output /tmp/bookmarks

# 空目录检查（结果应为 0）
find /tmp/bookmarks -type d -empty | wc -l
```

**延伸玩法**：

- 定时任务：让 AI 每天自动导出最新书签，内置去重不会重复导出
- 日报生成：把每天的书签摘要做成日报，模型自动总结
- 知识沉淀：长期积累后形成可检索、可回顾的个人知识库

:::note[开发背景]
这个 Skill 的完整开发过程使用了 Superpowers 的 `brainstorming` → `writing-plans` → `executing-plans` 工作流，全程 TDD、每个 task 单独 commit。详见 [第 04 章](/skill/04-create/) 的实战案例。
:::

---

## 总览对比表

| Skill 名称 | 分类 | 一句话介绍 | 安装方式 | 兼容工具 |
|-------------|------|-----------|---------|---------|
| Superpowers | 流程框架 | 工程流程全家桶：brainstorming → plans → TDD → review | `git clone` + 软链接 | Claude Code / OpenCode / Codex / OpenClaw |
| Everything Claude Code | 流程框架 | `/plan` → `/tdd` → `/code-review` 验收闭环 | 插件安装 或 手动 copy | Claude Code |
| Find Skills | Skill 工具 | 命令行搜索 Skill | `npx skills add vercel-labs/skills/find-skills` | 通用 |
| skill-creator | Skill 工具 | Anthropic 官方 Skill 质量评估 | 对话安装 或 手动 clone | Claude Code / OpenClaw |
| vercel-react-best-practices | 开发规范 | React/Next.js 编码规范约束 | `npx skills add` | 通用 |
| systematic-debugging | 开发规范 | 按症状分类的系统化 debug | Superpowers 内置 | Claude Code / OpenCode / Codex / OpenClaw |
| finishing-a-development-branch | 开发规范 | 分支收尾决策流程 | Superpowers 内置 | Claude Code / OpenCode / Codex / OpenClaw |
| baoyu-skills | 内容效率 | 公众号/小红书/信息图内容生产 | `git clone` 到 skills 目录 | Claude Code / OpenClaw |
| anything-to-notebooklm | 内容效率 | 内容导入 NotebookLM 生成可视化 | 手动 clone 或对话安装 | Claude Code / OpenClaw |
| wqq-x-bookmarks | 内容效率 | 社交平台书签导出 + 去重 + 摘要 | `git clone` 到 skills 目录 | Claude Code / OpenCode / Codex |

---

## 下一步

知道该装哪些 Skill 之后，如果你想自己从零写一个呢？

[第 04 章：从零写 Skill -- 7 步创建流程 + 真实案例](/skill/04-create/)
