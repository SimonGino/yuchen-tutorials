---
title: 用别人的 Skill：安装方式与注意事项
description: 掌握三种 Skill 安装方式，了解安全边界和加载优先级
sidebar:
  order: 2
---

## 本节目标

读完本节，你应该拿到以下结果：

- 掌握 3 种 Skill 安装方式（npx 安装 / 手动 clone / 对话安装），并能根据场景选择
- 能正确安装一个第三方 Skill 并跑通
- 理解安全边界——知道哪些事情必须在安装前确认
- 理解 Skill 的加载优先级规则，以及不同工具之间的差异

---

## 1. 三种安装方式对比

找到 Skill 之后，怎么装到本地？主要有 3 种方式：

| 方式 | 命令 / 操作 | 适用场景 | 优点 | 缺点 |
|------|-------------|----------|------|------|
| **npx 安装** | `npx skills add <owner/repo@skill>` | 标准生态内的 Skill（skill.sh） | 一行命令搞定，自动处理路径 | 只支持 skill.sh 生态内的 Skill |
| **手动 clone** | `git clone` 到 skills 目录 | 需要改代码、不在生态内、想深度定制 | 完全可控，方便修改和调试 | 需要手动管理路径和更新 |
| **对话安装** | 直接告诉 AI "安装 [GitHub URL]" | 最快的方式，不想记命令 | 零门槛，AI 帮你执行所有步骤 | 依赖 AI 的执行准确性 |

### 1.1 npx 安装

适用于 skill.sh 生态内的 Skill。用 `npx skills find` 搜到之后，直接复制安装命令：

```bash
# 搜索
npx skills find notebooklm

# 安装（示例）
npx skills add joeseesun/anything-to-notebooklm
```

安装后 Skill 会自动放到正确的目录下，不需要手动处理路径。

### 1.2 手动 clone

如果 Skill 不在 skill.sh 生态内，或者你想 fork 之后做修改，手动 clone 是最稳的方式。

**Claude Code 用户：**

```bash
# 全局安装
git clone https://github.com/<owner>/<repo>.git ~/.claude/skills/<skill-name>

# 项目级安装
git clone https://github.com/<owner>/<repo>.git .claude/skills/<skill-name>
```

**OpenCode 用户：**

```bash
# 全局安装
git clone https://github.com/<owner>/<repo>.git ~/.config/opencode/skills/<skill-name>

# 项目级安装
git clone https://github.com/<owner>/<repo>.git .opencode/skills/<skill-name>
```

**OpenClaw 用户：**

```bash
# 全局安装
git clone https://github.com/<owner>/<repo>.git ~/.claude/skills/<skill-name>

# 项目级安装（工作区）
git clone https://github.com/<owner>/<repo>.git .claude/skills/<skill-name>
```

### 1.3 对话安装

最省事的方式——直接在对话中告诉 AI：

```
安装 https://github.com/joeseesun/anything-to-notebooklm
```

AI 会自动帮你 clone 仓库、放到正确目录、确认 Skill 可用。这种方式在 Claude Code、OpenCode、OpenClaw 中都适用。

---

## 2. 实战举例：anything-to-notebooklm

用 joeseesun 的 `anything-to-notebooklm` 来演示完整的安装和使用流程。

这个 Skill 的核心能力是把各种内容（视频链接、文章、文档等）导入 NotebookLM，然后利用 NotebookLM 生成信息图、PPT、报告、思维导图等可视化产出。比如给它一个财经视频的 URL，它可以自动搜索相关信息并总结成一张信息图。

安装方式（任选其一）：

```bash
# 方式一：npx
npx skills add joeseesun/anything-to-notebooklm

# 方式二：手动 clone（Claude Code 为例）
git clone https://github.com/joeseesun/anything-to-notebooklm.git \
  ~/.claude/skills/anything-to-notebooklm

# 方式三：对话安装
# 直接在 AI 对话中输入：
# 安装 https://github.com/joeseesun/anything-to-notebooklm
```

安装后在对话中触发即可使用。

---

## 3. 使用注意事项

安装第三方 Skill 之前，有三件事必须做：

### 3.1 先读 SKILL.md

每个 Skill 的核心是 `SKILL.md` 文件。安装前先读一遍，搞清楚：

- **依赖**：是否需要安装额外的包或工具（比如 Playwright、FFmpeg）
- **环境变量**：是否需要配置 API Key 或其他凭证
- **触发方式**：是 `/命令` 手动触发，还是根据 description 自动匹配
- **预期行为**：它会做什么操作，是否会修改文件、访问网络、调用外部服务

不读 SKILL.md 就直接装，大概率遇到"装了没反应"或"跑了报错"。

### 3.2 先在测试环境跑一遍

不要直接在生产项目里试新 Skill。建议：

```bash
# 新建一个测试目录
mkdir ~/skill-test && cd ~/skill-test
git init

# 在这里安装和测试 Skill
```

确认 Skill 行为符合预期后，再在正式项目中使用。

### 3.3 注意安全边界

第三方 Skill 本质上是"不受信任的代码"，需要注意：

| 风险点 | 防范措施 |
|--------|----------|
| Skill 中可能包含恶意指令 | 安装前阅读 SKILL.md 全文，确认没有可疑的命令 |
| Skill 可能需要访问敏感数据 | 密钥和凭证只通过环境变量注入，不要硬编码到 Skill 文件中 |
| Skill 可能执行破坏性操作 | 先在隔离环境测试，确认不会删文件或覆盖数据 |
| Skill 来源不可信 | 优先使用 star 数多、维护活跃的仓库 |

一句话原则：**对待第三方 Skill，和对待第三方 npm 包一样谨慎。**

---

## 4. 加载优先级

Skill 的加载优先级决定了同名 Skill 谁会生效。不同工具的规则略有差异，但核心逻辑一致：**项目级覆盖全局**。

### 4.1 通用规则

```
全局 Skills（优先级最低）
  ↓ 被覆盖
插件 Skills（中间层）
  ↓ 被覆盖
项目级 Skills（优先级最高）
```

后加载的同名 Skill 会覆盖先加载的。

### 4.2 各工具的具体路径

| 优先级 | Claude Code | OpenCode | OpenClaw |
|--------|-------------|----------|----------|
| 1（最低）全局 | `~/.claude/skills/` | `~/.config/opencode/skills/` | `~/.claude/skills/` |
| 2 插件 | `.claude/skills/`（插件安装的） | 插件目录（如 Superpowers） | clawhub 安装的 |
| 3（最高）项目级 | `.claude/skills/`（当前项目） | `.opencode/skills/` | `.claude/skills/`（工作区） |

### 4.3 实际场景

| 场景 | 结果 |
|------|------|
| 全局有 `brainstorming`，项目没有 | 使用全局版本 |
| 全局有 `brainstorming`，项目也有 | 使用项目版本（覆盖全局） |
| 全局没有，项目有 `api-design` | 使用项目版本 |
| 插件装了 `code-review`，项目也写了同名的 | 使用项目版本（覆盖插件） |

利用这个机制，你可以：

- **全局目录**放通用 Skills——适用于所有项目的通用流程
- **项目目录**放定制 Skills——针对当前项目的特殊流程，或覆盖全局默认行为

### 4.4 排查技巧

如果 Skill 没有按预期生效，按以下顺序排查：

1. 确认 Skill 文件是否在正确路径下
2. 确认是否有同名 Skill 在更高优先级的目录中覆盖了它
3. 重启会话——很多工具在会话开始时就快照了 Skill 列表，中途新增的不会自动加载

---

## 下一步

知道怎么安装和使用 Skill 了，但面对几百个 Skill，该装哪些？下一章给你一份分类推荐清单。

[第 03 章：推荐 Skill -- 值得安装的 Skill 分类推荐](/skill/03-recommended/)
