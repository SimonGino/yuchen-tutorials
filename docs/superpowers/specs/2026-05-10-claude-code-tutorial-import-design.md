# Claude Code 教程系列导入设计

**日期**：2026-05-10
**作者**：宇辰AI编程
**状态**：设计已确认，待 plan 落地

## 目标

把 `/Users/wqq/Documents/x-exports/` 下已有的 9 篇 Claude Code 系列公众号成稿（源目录中 `article-01` 至 `article-08`，其中编号 `article-06` 有 hooks 与 context-engineering 两篇并存），重写并导入到本站，以新的 `claude-code/` 教程系列形式呈现，作为与 `openclaw` / `opencode` / `skill` 平级的第四个教程板块。

## 非目标（显式 out-of-scope）

- ❌ 英文翻译（`en/claude-code/`）—— 中文版先上
- ❌ 把正文 OSS 图迁移到本地 —— 保留 `https://oss.aiqqyc.com/...` 外链
- ❌ 导入 `research-notes.md` 与 infographic prompts —— 不属于站点内容
- ❌ 修改 `openclaw` / `opencode` / `skill` 现有内容
- ❌ 修改 Starlight 主题或 `src/components/` 组件结构

## 章节学习路径（9 章）

排序原则：基础操作 → 三大扩展能力（按学习曲线）→ 进阶原理 → 平台扩展。

| # | 章节 | 来源原文 | 性质 |
|---|---|---|---|
| 01 | 上手：从订阅到第一次对话 | `article-01-getting-started` | 操作 |
| 02 | `.claude` 目录与配置 | `article-02-claude-directory` | 操作 |
| 03 | 环境变量与权限精调 | `article-03-env-permissions` | 查表/操作 |
| 04 | Skills 实战：写第一个 Skill | `article-04-skills` | 操作 |
| 05 | MCP 配置指南：连接外部世界 | `article-05-mcp` | 操作 |
| 06 | Hooks 详解：自动化与质量三层 | `article-06-hooks` | 操作 |
| 07 | 上下文工程完全手册 | `article-06-context-engineering` | 原理/优化 |
| 08 | Harness Engineering：从 Prompt 到系统 | `article-07-harness-engineering` | 架构思维 |
| 09 | Claude Code on the Web：异步与远程 | `article-08-claude-code-on-the-web` | 平台扩展 |

**两点偏离原文编号的解释**：
- 「上下文工程」原编号为 06b，后移到 07：这是「已经会用」之后的优化原理，前置过早会劝退基础读者。
- 解决了原 article-06 编号冲突（hooks 与 context 都标 06）。

## 写作风格

- **去掉**公众号引流话术：「大家好，我是宇辰AI编程……」开场、「欢迎加群交流」结尾。
- **保留**第一人称判断与个人体验：「我自己用下来」「我踩过的坑是」「我的选型是」。
- 原文 H1（`# 标题`）改成 frontmatter `title`，正文从 H2 起。

### 操作章模板（01-06）

```markdown
---
title: 章节标题
description: 一句话描述
sidebar:
  order: N
---

简短开场（1-2 段，保留个人语气）

## 本节目标
- 读完后你应该……（3-4 个具体可验证的产出）

## 1. 主题块一
## 2. 主题块二
…

## 常见问题
（原文里的踩坑段整理成 FAQ）
```

### 原理章模板（07-09）

```markdown
---
title: 章节标题
description: 一句话描述
sidebar:
  order: N
---

引子（保留原文「为什么要谈这个」的叙事）

## 一、概念铺陈
## 二、核心模型
## 三、实践层面
## 四、（可选）案例

## 小结
```

### 通用 Markdown 约定

- 表格、代码块沿用 Starlight / GFM 语法
- 提示框使用 Starlight `:::tip` / `:::note` / `:::caution` admonition
- 代码块使用 zinc 配色（已由 `776ea76` commit 定义为站点风格）

## 资产管理

### Cover 图本地化（仅 cover）

`public/images/claude-code/` 下放 9 张封面图：

```text
01-getting-started.png
02-claude-directory.png
03-env-permissions.png
04-skills.png
05-mcp.png
06-hooks.png
07-context-engineering.png
08-harness-engineering.png
09-claude-code-on-the-web.png
```

来源：`/Users/wqq/Documents/x-exports/article-XX-*/cover/cover.png` 直接拷贝改名。每章正文开头作为 hero 引用：

```markdown
![章节名](/images/claude-code/NN-slug.png)
```

### 正文图保留 OSS 外链

正文中的 `https://oss.aiqqyc.com/...` 一律不动、不下载。

## 项目配置

### `astro.config.mjs` Sidebar

新增分类，**置顶**于 OpenClaw 之前：

```js
sidebar: [
  {
    label: 'Claude Code 完全手册',
    translations: { en: 'Claude Code Complete Guide' },
    collapsed: true,
    autogenerate: { directory: 'claude-code' },
  },
  // ...原有 openclaw / opencode / skill
]
```

### `src/content/docs/claude-code/index.md`

参照 `openclaw/index.md` 风格，含：
- 本课程目标
- 适合谁
- 课程结构（9 章导览）
- 怎么读

`sidebar.order: 0`。

### 首页 `src/pages/index.astro`

在教程卡片网格中新增一张「Claude Code 完全手册」卡片，链接到 `/claude-code/`。

## 实施分批原则

具体粒度交给 plan 阶段决定，但遵循以下原则：

- **先脚手架，后内容**：先落地 sidebar 分类、`index.md`、9 张封面、首页卡片（章节内容可先占位），让 sidebar 一次性完整。
- **操作章先 → 原理章后**：01-06 操作章模板统一，先做以验证模板；07-09 长文叙事，最后做。
- **每批可独立部署**：每个 PR 合并后线上不破不少。

## 完成标准（验收）

- `pnpm build` 通过，无构建错误
- 本地 `pnpm dev` 后 sidebar 出现「Claude Code 完全手册」分类，9 章按序显示
- 首页可见新教程卡片
- 任选 3 章抽查：cover hero 图加载、OSS 正文图加载、表格 / 代码块渲染正常
- 外链遵循已有 `noreferrer` 策略（如新增非 OSS 外链）

## 涉及文件清单

**新增**：
- `src/content/docs/claude-code/index.md`
- `src/content/docs/claude-code/01-getting-started.md`
- `src/content/docs/claude-code/02-claude-directory.md`
- `src/content/docs/claude-code/03-env-permissions.md`
- `src/content/docs/claude-code/04-skills.md`
- `src/content/docs/claude-code/05-mcp.md`
- `src/content/docs/claude-code/06-hooks.md`
- `src/content/docs/claude-code/07-context-engineering.md`
- `src/content/docs/claude-code/08-harness-engineering.md`
- `src/content/docs/claude-code/09-claude-code-on-the-web.md`
- `public/images/claude-code/*.png`（9 张封面）

**修改**：
- `astro.config.mjs`（sidebar 新增分类，置顶）
- `src/pages/index.astro`（首页教程卡片网格新增一张）
