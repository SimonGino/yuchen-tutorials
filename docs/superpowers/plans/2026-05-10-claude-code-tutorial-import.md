# Claude Code 教程系列导入 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `/Users/wqq/Documents/x-exports/` 下 9 篇 Claude Code 公众号成稿，重写为 9 章教程，导入 Astro Starlight 站点新建的 `claude-code/` 板块。

**Architecture:** 三批独立可部署的 PR — Phase 1 脚手架（sidebar / 封面 / index / 首页卡片 / 9 章占位），Phase 2 操作章 01-06，Phase 3 原理章 07-09。Cover 图本地化、正文图保留 OSS 外链。

**Tech Stack:** Astro Starlight, Tailwind CSS v4, pnpm, Cloudflare Pages, Wrangler

参见 spec：[`docs/superpowers/specs/2026-05-10-claude-code-tutorial-import-design.md`](../specs/2026-05-10-claude-code-tutorial-import-design.md)

---

## File Structure

**新增**：
- `src/content/docs/claude-code/index.md`（着陆页）
- `src/content/docs/claude-code/0[1-9]-*.md`（9 章 markdown）
- `public/images/claude-code/0[1-9]-*.png`（9 张封面）

**修改**：
- `astro.config.mjs`（sidebar 新增分类置顶）
- `src/pages/index.astro`（教程网格新增首页卡片）

---

## 写作约定（适用于所有内容章节）

### 删/留规则

- ❌ 删：「大家好，我是宇辰AI编程……」公众号开场
- ❌ 删：「欢迎加群交流」「关注我」结尾引流
- ❌ 删：原文 H1（`# 标题`），章节名进 frontmatter `title`
- ✅ 留：所有「我自己」「我的体验」「我踩过的坑」第一人称判断
- ✅ 留：所有 `https://oss.aiqqyc.com/...` 正文图链接，**不本地化**
- ✅ 留：所有代码块、表格、引用块原样

### 操作章模板（用于 01-06）

```markdown
---
title: <标题>
description: <一句话描述>
sidebar:
  order: <N>
---

![<标题>](/images/claude-code/<NN-slug>.png)

<简短开场 1-2 段，保留个人语气>

## 本节目标
- <3-4 个具体可验证的产出>

## 1. <主题块>
## 2. <主题块>
…

## 常见问题
（原文「踩过的坑」段整理成 FAQ）
```

### 原理章模板（用于 07-09）

```markdown
---
title: <标题>
description: <一句话描述>
sidebar:
  order: <N>
---

![<标题>](/images/claude-code/<NN-slug>.png)

<引子：保留原文「为什么要谈这个」>

## 一、概念铺陈
## 二、核心模型
## 三、实践层面
## 四、（可选）案例

## 小结
```

---

## Phase 1: 脚手架（feat/claude-code-scaffold）

### Task 1: 创建分支并复制 9 张封面图

**Files:**
- Create: `public/images/claude-code/0[1-9]-*.png`

- [ ] **Step 1: 创建 feature 分支**

```bash
git checkout main
git pull --ff-only
git checkout -b feat/claude-code-scaffold
```

- [ ] **Step 2: 创建目标目录**

```bash
mkdir -p public/images/claude-code
```

- [ ] **Step 3: 复制 9 张封面**

```bash
cp "/Users/wqq/Documents/x-exports/article-01-getting-started/cover/cover.png" public/images/claude-code/01-getting-started.png
cp "/Users/wqq/Documents/x-exports/article-02-claude-directory/cover/cover.png" public/images/claude-code/02-claude-directory.png
cp "/Users/wqq/Documents/x-exports/article-03-env-permissions/cover/cover.png" public/images/claude-code/03-env-permissions.png
cp "/Users/wqq/Documents/x-exports/article-04-skills/cover/cover.png" public/images/claude-code/04-skills.png
cp "/Users/wqq/Documents/x-exports/article-05-mcp/cover/cover.png" public/images/claude-code/05-mcp.png
cp "/Users/wqq/Documents/x-exports/article-06-hooks/cover/cover.png" public/images/claude-code/06-hooks.png
cp "/Users/wqq/Documents/x-exports/article-06-context-engineering/cover/cover.png" public/images/claude-code/07-context-engineering.png
cp "/Users/wqq/Documents/x-exports/article-07-harness-engineering/cover/cover.png" public/images/claude-code/08-harness-engineering.png
cp "/Users/wqq/Documents/x-exports/article-08-claude-code-on-the-web/cover/cover.png" public/images/claude-code/09-claude-code-on-the-web.png
```

- [ ] **Step 4: 验证 9 张图都到位**

```bash
ls public/images/claude-code/ | wc -l
```
Expected: `9`

---

### Task 2: 添加 sidebar 分类置顶

**Files:**
- Modify: `astro.config.mjs`（sidebar 数组开头）

- [ ] **Step 1: 定位 sidebar 数组**

```bash
grep -n "sidebar:" astro.config.mjs
```
Expected: 显示 `sidebar: [` 所在行号。

- [ ] **Step 2: 修改 astro.config.mjs**

在 `sidebar: [` 后第一项位置插入新分类：

```js
{
  label: 'Claude Code 完全手册',
  translations: { en: 'Claude Code Complete Guide' },
  collapsed: true,
  autogenerate: { directory: 'claude-code' },
},
```

确保它出现在 `'OpenClaw 从零到生产'` 之前。

- [ ] **Step 3: 语法校验**

```bash
node --input-type=module -e "import('./astro.config.mjs').then(() => console.log('OK')).catch(e => { console.error(e); process.exit(1); })"
```
Expected: 输出 `OK`，无 SyntaxError。

---

### Task 3: 写 index.md 着陆页

**Files:**
- Create: `src/content/docs/claude-code/index.md`

- [ ] **Step 1: 创建目录**

```bash
mkdir -p src/content/docs/claude-code
```

- [ ] **Step 2: 写 index.md**

```markdown
---
title: 概览：Claude Code 完全手册
description: Claude Code 教程总览，从订阅上手到 Harness Engineering
sidebar:
  order: 0
---

![Claude Code 完全手册](/images/claude-code/01-getting-started.png)

## 本课程目标

读完整门课程，你应该能熟练使用 Claude Code 完成日常 AI 编程工作：

- 完成订阅与首次跑通
- 理解 .claude 目录结构与配置体系
- 用 Skills / MCP / Hooks 三大扩展机制定制能力
- 掌握上下文工程与 Harness 思维，把 Claude 用作系统组件
- 在终端、Web、移动端之间无缝切换

---

## Claude Code 是什么

一句话总结：**Claude Code 是 Anthropic 官方推出的 CLI Agent，跑在终端里、读你的代码库、自己改文件跑命令。**

它代表了 AI 编程的第三代形态——从 Tab 补全（Copilot）到 IDE 编辑器（Cursor / Windsurf），再到自主执行的 CLI Agent。

---

## 适合谁读这门课

- 用过 Cursor / Windsurf 但想换更自主工具的开发者
- 已订阅但只用过基础对话功能、想榨干 Max 套餐的重度用户
- 关心 Claude 生态（Skills / MCP / Agent SDK）能力扩展的开发者
- 团队管理者，想让 AI 进入工程流程而非个人使用

不适合：从来没打开过终端、不熟悉 git/cd/ls 的纯小白。建议先花半小时熟悉基础命令再来。

---

## 课程结构

| # | 章节 | 性质 |
|---|---|---|
| 01 | 上手：从订阅到第一次对话 | 操作 |
| 02 | .claude 目录与配置 | 操作 |
| 03 | 环境变量与权限精调 | 查表/操作 |
| 04 | Skills 实战：写第一个 Skill | 操作 |
| 05 | MCP 配置指南：连接外部世界 | 操作 |
| 06 | Hooks 详解：自动化与质量三层 | 操作 |
| 07 | 上下文工程完全手册 | 原理/优化 |
| 08 | Harness Engineering：从 Prompt 到系统 | 架构思维 |
| 09 | Claude Code on the Web：异步与远程 | 平台扩展 |

---

## 怎么读

- **零基础读者**：从 01 开始按顺序读到 06，每章动手做一遍
- **已上手用户**：直接跳到 04-06 学三大扩展能力
- **追求深度**：07-08 是原理与架构，建议读完操作章后回头精读
- **关心异步工作流**：09 单独看即可
```

---

### Task 4: 创建 9 章占位 markdown

**Files:**
- Create: `src/content/docs/claude-code/0[1-9]-*.md`（9 个文件）

- [ ] **Step 1: 创建 01-getting-started.md**

```markdown
---
title: 上手：从订阅到第一次对话
description: 订阅选择、安装、首次跑通
sidebar:
  order: 1
---

![上手：从订阅到第一次对话](/images/claude-code/01-getting-started.png)

> 本章筹备中。

## 本节目标
- 占位
```

- [ ] **Step 2: 创建 02-claude-directory.md**

```markdown
---
title: .claude 目录与配置
description: 项目级配置体系与文件结构
sidebar:
  order: 2
---

![.claude 目录与配置](/images/claude-code/02-claude-directory.png)

> 本章筹备中。

## 本节目标
- 占位
```

- [ ] **Step 3: 创建 03-env-permissions.md**

```markdown
---
title: 环境变量与权限精调
description: 关键环境变量与权限模型详解
sidebar:
  order: 3
---

![环境变量与权限精调](/images/claude-code/03-env-permissions.png)

> 本章筹备中。

## 本节目标
- 占位
```

- [ ] **Step 4: 创建 04-skills.md**

```markdown
---
title: Skills 实战：写第一个 Skill
description: Skills 系统与从零写一个
sidebar:
  order: 4
---

![Skills 实战：写第一个 Skill](/images/claude-code/04-skills.png)

> 本章筹备中。

## 本节目标
- 占位
```

- [ ] **Step 5: 创建 05-mcp.md**

```markdown
---
title: MCP 配置指南：连接外部世界
description: 接入浏览器、数据库与外部 API
sidebar:
  order: 5
---

![MCP 配置指南：连接外部世界](/images/claude-code/05-mcp.png)

> 本章筹备中。

## 本节目标
- 占位
```

- [ ] **Step 6: 创建 06-hooks.md**

```markdown
---
title: Hooks 详解：自动化与质量三层
description: 自动格式化、文件保护、三层质量保障
sidebar:
  order: 6
---

![Hooks 详解：自动化与质量三层](/images/claude-code/06-hooks.png)

> 本章筹备中。

## 本节目标
- 占位
```

- [ ] **Step 7: 创建 07-context-engineering.md**

```markdown
---
title: 上下文工程完全手册
description: Token / 缓存 / 压缩 / 结构化原理
sidebar:
  order: 7
---

![上下文工程完全手册](/images/claude-code/07-context-engineering.png)

> 本章筹备中。
```

- [ ] **Step 8: 创建 08-harness-engineering.md**

```markdown
---
title: Harness Engineering：从 Prompt 到系统
description: 系统化使用 AI 的思维框架
sidebar:
  order: 8
---

![Harness Engineering：从 Prompt 到系统](/images/claude-code/08-harness-engineering.png)

> 本章筹备中。
```

- [ ] **Step 9: 创建 09-claude-code-on-the-web.md**

```markdown
---
title: Claude Code on the Web：异步与远程
description: 本地、远程、移动端的无缝工作流
sidebar:
  order: 9
---

![Claude Code on the Web：异步与远程](/images/claude-code/09-claude-code-on-the-web.png)

> 本章筹备中。
```

- [ ] **Step 10: 验证文件齐全**

```bash
ls src/content/docs/claude-code/ | sort
```
Expected:
```text
01-getting-started.md
02-claude-directory.md
03-env-permissions.md
04-skills.md
05-mcp.md
06-hooks.md
07-context-engineering.md
08-harness-engineering.md
09-claude-code-on-the-web.md
index.md
```

---

### Task 5: 在首页 src/pages/index.astro 教程网格中加卡片

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: 定位教程卡片网格**

```bash
grep -n "openclaw\|opencode\|skill" src/pages/index.astro | head -30
```

定位到教程卡片所在的网格容器 / `<a>` 卡片重复区。

- [ ] **Step 2: 仿照已有 OpenClaw 卡片新增「Claude Code 完全手册」卡片**

新卡片字段：
- 标题：`Claude Code 完全手册`
- 描述：`从订阅上手到 Harness Engineering 的 9 章完全教程`
- 链接：`/claude-code/`
- 封面：`/images/claude-code/01-getting-started.png`

将卡片放在卡片列表**第一位**（与 sidebar 置顶一致）。

- [ ] **Step 3: 简单本地校验**

```bash
grep -c "claude-code" src/pages/index.astro
```
Expected: ≥ 2（至少链接 + cover 路径两处匹配）。

---

### Task 6: 构建与本地验证

- [ ] **Step 1: pnpm install（如尚未装依赖）**

```bash
pnpm install
```

- [ ] **Step 2: 构建**

```bash
pnpm build
```
Expected: 构建成功，无 error。

- [ ] **Step 3: 启动 dev 服务并人工验证**

```bash
pnpm dev
```

打开 `http://localhost:4321`（或控制台显示的端口），逐项检查：
- ✅ 首页有「Claude Code 完全手册」卡片，且在第一位
- ✅ 点击卡片进入 `/claude-code/` 着陆页，cover 图加载
- ✅ Sidebar 中「Claude Code 完全手册」分类置顶，9 章按 01-09 顺序显示
- ✅ 任选 2 章进入，cover 图加载，「本章筹备中」占位内容显示

完成后 Ctrl+C 关闭 dev 服务。

---

### Task 7: Commit 并发 PR

- [ ] **Step 1: 查看变更**

```bash
git status
git diff --stat
```
Expected: 9 张新增 png + 10 个新 md 文件 + 2 个修改文件 (`astro.config.mjs`、`src/pages/index.astro`)。

- [ ] **Step 2: 提交**

```bash
git add public/images/claude-code/ src/content/docs/claude-code/ astro.config.mjs src/pages/index.astro
git commit -m "$(cat <<'EOF'
feat: Claude Code 教程系列脚手架（sidebar / index / 占位 9 章）

- 新增 src/content/docs/claude-code/ 目录与 index.md 着陆页
- 9 张章节封面入 public/images/claude-code/
- 9 章占位 markdown（待后续 PR 填充正文）
- astro.config.mjs sidebar 新增「Claude Code 完全手册」并置顶
- src/pages/index.astro 教程网格新增首页卡片

参见 docs/superpowers/specs/2026-05-10-claude-code-tutorial-import-design.md
EOF
)"
```

- [ ] **Step 3: 推送并发 PR**

```bash
git push -u origin feat/claude-code-scaffold
gh pr create --title "feat: Claude Code 教程系列脚手架" --body "$(cat <<'EOF'
## Summary
- 新增 claude-code/ 教程系列脚手架（sidebar 置顶、首页卡片、9 张封面、index 着陆页、9 章占位）
- 后续两个 PR 分别填充操作章（01-06）与原理章（07-09）

## Test plan
- [x] pnpm build 通过
- [x] 首页卡片可点击进入着陆页，cover 图加载
- [x] Sidebar 9 章按 01-09 顺序显示
- [x] 任选 2 章进入，cover hero + "本章筹备中" 占位正常

参见 docs/superpowers/specs/2026-05-10-claude-code-tutorial-import-design.md
EOF
)"
```

⚠️ **等本 PR 合并到 main 后再开始 Phase 2。**

---

## Phase 2: 操作章 01-06（feat/claude-code-ops-chapters）

### Task 8: 切换到主分支并创建新分支

- [ ] **Step 1: 切回 main 并拉最新**

```bash
git checkout main
git pull --ff-only
```

- [ ] **Step 2: 创建新分支**

```bash
git checkout -b feat/claude-code-ops-chapters
```

---

### Task 9: 重写第 01 章 上手

**Files:**
- Source: `/Users/wqq/Documents/x-exports/article-01-getting-started/从 0 到 1 完整上手 Claude Code.md`
- Modify: `src/content/docs/claude-code/01-getting-started.md`

- [ ] **Step 1: 通读原文**

```bash
cat "/Users/wqq/Documents/x-exports/article-01-getting-started/从 0 到 1 完整上手 Claude Code.md"
```

- [ ] **Step 2: 按操作章模板重写**

完整覆盖 `src/content/docs/claude-code/01-getting-started.md`。

frontmatter 保持：
```yaml
title: 上手：从订阅到第一次对话
description: 订阅选择、安装、首次跑通
sidebar:
  order: 1
```

正文按操作章模板：cover hero → 简短开场 → 本节目标 → 章节主体 → 常见问题。

应用「写作约定」全部删/留规则（见本文档顶部）。

建议主体大纲：
- AI 编程工具的三代演进
- 谁适合用 Claude Code
- 模型与套餐选择（保留 Opus / Max 套餐个人吐槽）
- 订阅（保留国内信用卡踩坑提示）
- 安装与首次运行
- 常见问题（FAQ 形式）

- [ ] **Step 3: 本地预览验证**

```bash
pnpm dev
```

打开 `http://localhost:4321/claude-code/01-getting-started/`，检查：
- 章节标题、frontmatter 渲染正常
- cover hero 图加载
- 至少 3 张正文 OSS 图加载
- 表格、代码块渲染正常
- 个人语气段落保留

```bash
grep -E "大家好|加群|关注我|本章筹备中" src/content/docs/claude-code/01-getting-started.md
```
Expected: 0 行匹配。

- [ ] **Step 4: Commit**

```bash
git add src/content/docs/claude-code/01-getting-started.md
git commit -m "feat(claude-code): 第 01 章 上手"
```

---

### Task 10: 重写第 02 章 .claude 目录

**Files:**
- Source: `/Users/wqq/Documents/x-exports/article-02-claude-directory/.claude 目录配置指南：CLAUDE.md、Rules 与 Settings.md`
- Modify: `src/content/docs/claude-code/02-claude-directory.md`

- [ ] **Step 1: 通读原文**

```bash
cat "/Users/wqq/Documents/x-exports/article-02-claude-directory/.claude 目录配置指南：CLAUDE.md、Rules 与 Settings.md"
```

- [ ] **Step 2: 按操作章模板重写**

frontmatter 保持：
```yaml
title: .claude 目录与配置
description: 项目级配置体系与文件结构
sidebar:
  order: 2
```

应用「写作约定」全部删/留规则。

- [ ] **Step 3: 本地预览验证**

打开 `http://localhost:4321/claude-code/02-claude-directory/`。

```bash
grep -E "大家好|加群|关注我|本章筹备中" src/content/docs/claude-code/02-claude-directory.md
```
Expected: 0 行匹配。

- [ ] **Step 4: Commit**

```bash
git add src/content/docs/claude-code/02-claude-directory.md
git commit -m "feat(claude-code): 第 02 章 .claude 目录与配置"
```

---

### Task 11: 重写第 03 章 环境变量与权限

**Files:**
- Source: `/Users/wqq/Documents/x-exports/article-03-env-permissions/Claude Code 环境变量与权限精调完全手册.md`
- Modify: `src/content/docs/claude-code/03-env-permissions.md`

- [ ] **Step 1: 通读原文**

```bash
cat "/Users/wqq/Documents/x-exports/article-03-env-permissions/Claude Code 环境变量与权限精调完全手册.md"
```

- [ ] **Step 2: 按操作章模板重写**

frontmatter 保持：
```yaml
title: 环境变量与权限精调
description: 关键环境变量与权限模型详解
sidebar:
  order: 3
```

注意：本章是查表型操作章，可加重表格的使用，「常见问题」可以更长。应用「写作约定」全部删/留规则。

- [ ] **Step 3: 本地预览验证**

打开 `http://localhost:4321/claude-code/03-env-permissions/`。

```bash
grep -E "大家好|加群|关注我|本章筹备中" src/content/docs/claude-code/03-env-permissions.md
```
Expected: 0 行匹配。

- [ ] **Step 4: Commit**

```bash
git add src/content/docs/claude-code/03-env-permissions.md
git commit -m "feat(claude-code): 第 03 章 环境变量与权限精调"
```

---

### Task 12: 重写第 04 章 Skills 实战

**Files:**
- Source: `/Users/wqq/Documents/x-exports/article-04-skills/Claude Code Skills 实战：从写第一个到避开所有坑.md`
- Modify: `src/content/docs/claude-code/04-skills.md`

- [ ] **Step 1: 通读原文**

```bash
cat "/Users/wqq/Documents/x-exports/article-04-skills/Claude Code Skills 实战：从写第一个到避开所有坑.md"
```

- [ ] **Step 2: 按操作章模板重写**

frontmatter 保持：
```yaml
title: Skills 实战：写第一个 Skill
description: Skills 系统与从零写一个
sidebar:
  order: 4
```

应用「写作约定」全部删/留规则。

- [ ] **Step 3: 本地预览验证**

打开 `http://localhost:4321/claude-code/04-skills/`。

```bash
grep -E "大家好|加群|关注我|本章筹备中" src/content/docs/claude-code/04-skills.md
```
Expected: 0 行匹配。

- [ ] **Step 4: Commit**

```bash
git add src/content/docs/claude-code/04-skills.md
git commit -m "feat(claude-code): 第 04 章 Skills 实战"
```

---

### Task 13: 重写第 05 章 MCP 配置

**Files:**
- Source: `/Users/wqq/Documents/x-exports/article-05-mcp/MCP 配置指南：让 Claude Code 连接浏览器、数据库与外部 API.md`
- Modify: `src/content/docs/claude-code/05-mcp.md`

- [ ] **Step 1: 通读原文**

```bash
cat "/Users/wqq/Documents/x-exports/article-05-mcp/MCP 配置指南：让 Claude Code 连接浏览器、数据库与外部 API.md"
```

- [ ] **Step 2: 按操作章模板重写**

frontmatter 保持：
```yaml
title: MCP 配置指南：连接外部世界
description: 接入浏览器、数据库与外部 API
sidebar:
  order: 5
```

应用「写作约定」全部删/留规则。

- [ ] **Step 3: 本地预览验证**

打开 `http://localhost:4321/claude-code/05-mcp/`。

```bash
grep -E "大家好|加群|关注我|本章筹备中" src/content/docs/claude-code/05-mcp.md
```
Expected: 0 行匹配。

- [ ] **Step 4: Commit**

```bash
git add src/content/docs/claude-code/05-mcp.md
git commit -m "feat(claude-code): 第 05 章 MCP 配置指南"
```

---

### Task 14: 重写第 06 章 Hooks 详解

**Files:**
- Source: `/Users/wqq/Documents/x-exports/article-06-hooks/Claude Code Hooks 详解：自动格式化、文件保护与三层质量保障.md`
- Modify: `src/content/docs/claude-code/06-hooks.md`

- [ ] **Step 1: 通读原文**

```bash
cat "/Users/wqq/Documents/x-exports/article-06-hooks/Claude Code Hooks 详解：自动格式化、文件保护与三层质量保障.md"
```

- [ ] **Step 2: 按操作章模板重写**

frontmatter 保持：
```yaml
title: Hooks 详解：自动化与质量三层
description: 自动格式化、文件保护、三层质量保障
sidebar:
  order: 6
```

应用「写作约定」全部删/留规则。

- [ ] **Step 3: 本地预览验证**

打开 `http://localhost:4321/claude-code/06-hooks/`。

```bash
grep -E "大家好|加群|关注我|本章筹备中" src/content/docs/claude-code/06-hooks.md
```
Expected: 0 行匹配。

- [ ] **Step 4: Commit**

```bash
git add src/content/docs/claude-code/06-hooks.md
git commit -m "feat(claude-code): 第 06 章 Hooks 详解"
```

---

### Task 15: Phase 2 整体构建验证

- [ ] **Step 1: 全量构建**

```bash
pnpm build
```
Expected: 无 error。

- [ ] **Step 2: 全 6 章 grep 公众号词**

```bash
grep -E "大家好|加群|关注我|本章筹备中" src/content/docs/claude-code/0[1-6]-*.md
```
Expected: 0 行匹配。

- [ ] **Step 3: dev 服务整批人工抽查**

```bash
pnpm dev
```

逐章打开 `http://localhost:4321/claude-code/0[1-6]-*/`，确认：
- cover hero 图加载
- 至少 1 张 OSS 正文图加载
- 表格 / 代码块 / admonition 渲染正常
- 个人语气段落保留

完成后 Ctrl+C 关闭 dev。

---

### Task 16: 推送并发 PR

- [ ] **Step 1: 推送**

```bash
git push -u origin feat/claude-code-ops-chapters
```

- [ ] **Step 2: 发 PR**

```bash
gh pr create --title "feat(claude-code): 操作章 01-06 内容" --body "$(cat <<'EOF'
## Summary
- 重写并填充操作章 01-06：上手 / .claude 目录 / 环境变量权限 / Skills / MCP / Hooks
- 删除公众号引流话术，保留第一人称体验语气
- 正文图保持 OSS 外链不动

## Test plan
- [x] pnpm build 通过
- [x] 6 章 cover + 正文图加载正常
- [x] grep 「大家好｜加群｜关注我｜本章筹备中」 = 0 行
- [x] 表格 / 代码块 / admonition 渲染正常

参见 docs/superpowers/specs/2026-05-10-claude-code-tutorial-import-design.md
EOF
)"
```

⚠️ **等本 PR 合并到 main 后再开始 Phase 3。**

---

## Phase 3: 原理章 07-09（feat/claude-code-concept-chapters）

### Task 17: 切换到主分支并创建新分支

- [ ] **Step 1: 切回 main 并拉最新**

```bash
git checkout main
git pull --ff-only
git checkout -b feat/claude-code-concept-chapters
```

---

### Task 18: 重写第 07 章 上下文工程

**Files:**
- Source: `/Users/wqq/Documents/x-exports/article-06-context-engineering/Claude Code 上下文工程完全手册.md`
- Modify: `src/content/docs/claude-code/07-context-engineering.md`

- [ ] **Step 1: 通读原文**

```bash
cat "/Users/wqq/Documents/x-exports/article-06-context-engineering/Claude Code 上下文工程完全手册.md"
```

- [ ] **Step 2: 按原理章模板重写**

完整覆盖 `src/content/docs/claude-code/07-context-engineering.md`。

frontmatter 保持：
```yaml
title: 上下文工程完全手册
description: Token / 缓存 / 压缩 / 结构化原理
sidebar:
  order: 7
```

正文按原理章模板：cover hero → 引子 → 一/二/三 节铺陈 → 小结。原理章不强求"本节目标 / 步骤"结构，可保留原文长文叙事节奏。

应用「写作约定」全部删/留规则。

- [ ] **Step 3: 本地预览验证**

```bash
pnpm dev
```

打开 `http://localhost:4321/claude-code/07-context-engineering/`，检查：
- cover hero 图加载
- 至少 3 张正文 OSS 图加载
- 长文叙事段落保留
- 标题层级清晰

```bash
grep -E "大家好|加群|关注我|本章筹备中" src/content/docs/claude-code/07-context-engineering.md
```
Expected: 0 行匹配。

- [ ] **Step 4: Commit**

```bash
git add src/content/docs/claude-code/07-context-engineering.md
git commit -m "feat(claude-code): 第 07 章 上下文工程完全手册"
```

---

### Task 19: 重写第 08 章 Harness Engineering

**Files:**
- Source: `/Users/wqq/Documents/x-exports/article-07-harness-engineering/Harness Engineering：从 Prompt 工程到系统工程.md`
- Modify: `src/content/docs/claude-code/08-harness-engineering.md`

- [ ] **Step 1: 通读原文**

```bash
cat "/Users/wqq/Documents/x-exports/article-07-harness-engineering/Harness Engineering：从 Prompt 工程到系统工程.md"
```

- [ ] **Step 2: 按原理章模板重写**

frontmatter 保持：
```yaml
title: Harness Engineering：从 Prompt 到系统
description: 系统化使用 AI 的思维框架
sidebar:
  order: 8
```

应用「写作约定」全部删/留规则。

- [ ] **Step 3: 本地预览验证**

打开 `http://localhost:4321/claude-code/08-harness-engineering/`。

```bash
grep -E "大家好|加群|关注我|本章筹备中" src/content/docs/claude-code/08-harness-engineering.md
```
Expected: 0 行匹配。

- [ ] **Step 4: Commit**

```bash
git add src/content/docs/claude-code/08-harness-engineering.md
git commit -m "feat(claude-code): 第 08 章 Harness Engineering"
```

---

### Task 20: 重写第 09 章 Claude Code on the Web

**Files:**
- Source: `/Users/wqq/Documents/x-exports/article-08-claude-code-on-the-web/v1-Claude Code on the Web：本地、远程、移动端的无缝工作流.md`
- Modify: `src/content/docs/claude-code/09-claude-code-on-the-web.md`

- [ ] **Step 1: 通读原文**

```bash
cat "/Users/wqq/Documents/x-exports/article-08-claude-code-on-the-web/v1-Claude Code on the Web：本地、远程、移动端的无缝工作流.md"
```

注意：article-08 目录下还有一份「让 Claude 替你值班：从 Dispatch 到 Design 的 7 个异步新能力.md」，**本任务只用 v1 那篇**。如发现 v1 缺关键内容，再考虑合并。

- [ ] **Step 2: 按原理章模板重写**（本章性质偏平台扩展，操作和原理混合）

frontmatter 保持：
```yaml
title: Claude Code on the Web：异步与远程
description: 本地、远程、移动端的无缝工作流
sidebar:
  order: 9
```

应用「写作约定」全部删/留规则。

- [ ] **Step 3: 本地预览验证**

打开 `http://localhost:4321/claude-code/09-claude-code-on-the-web/`。

```bash
grep -E "大家好|加群|关注我|本章筹备中" src/content/docs/claude-code/09-claude-code-on-the-web.md
```
Expected: 0 行匹配。

- [ ] **Step 4: Commit**

```bash
git add src/content/docs/claude-code/09-claude-code-on-the-web.md
git commit -m "feat(claude-code): 第 09 章 Claude Code on the Web"
```

---

### Task 21: Phase 3 整体构建验证

- [ ] **Step 1: 全量构建**

```bash
pnpm build
```
Expected: 无 error。

- [ ] **Step 2: 全 9 章 grep 公众号词与占位**

```bash
grep -E "大家好|加群|关注我|本章筹备中" src/content/docs/claude-code/0[1-9]-*.md
```
Expected: 0 行匹配。如果还有就立即修复并 commit 修复。

- [ ] **Step 3: dev 服务全 9 章人工抽查**

```bash
pnpm dev
```

逐章打开，确认：
- cover + 正文图加载
- 个人语气段落保留
- 表格 / 代码块 / admonition 渲染正常
- 没有占位「本章筹备中」遗留

完成后 Ctrl+C 关闭 dev。

---

### Task 22: 推送并发 PR

- [ ] **Step 1: 推送**

```bash
git push -u origin feat/claude-code-concept-chapters
```

- [ ] **Step 2: 发 PR**

```bash
gh pr create --title "feat(claude-code): 原理章 07-09 内容" --body "$(cat <<'EOF'
## Summary
- 重写并填充原理章 07-09：上下文工程 / Harness Engineering / Claude Code on the Web
- Claude Code 教程系列至此 9 章全部完成

## Test plan
- [x] pnpm build 通过
- [x] grep 「大家好｜加群｜关注我｜本章筹备中」 = 0 行
- [x] 9 章 cover + 正文图加载正常
- [x] 表格 / 代码块 / admonition 渲染正常

参见 docs/superpowers/specs/2026-05-10-claude-code-tutorial-import-design.md
EOF
)"
```

---

## 完成标准（与 spec 验收对齐）

- [x] `pnpm build` 通过，无构建错误
- [x] sidebar 出现「Claude Code 完全手册」分类，9 章按序显示
- [x] 首页可见新教程卡片
- [x] 任选 3 章抽查：cover hero / OSS 正文图 / 表格 / 代码块渲染正常
- [x] 全 9 章 grep 公众号引流词 = 0 行
