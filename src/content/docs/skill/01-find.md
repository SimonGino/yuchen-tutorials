---
title: 找 Skill：3 个渠道 + Find Skills 工具
description: 掌握 Skill 搜索的三个主要渠道，快速找到你需要的 Skill
sidebar:
  order: 1
---

## 本节目标

- 掌握 3 个找 Skill 的主要渠道
- 学会用 Find Skills 工具在命令行中快速搜索
- 知道不同渠道适合什么场景，按需选择

---

## 原则：不要上来就自己造

在动手写 Skill 之前，先搜搜有没有现成的。哪怕找到一个功能接近的，fork 下来改也比从零写快得多。

以下是三个主要的搜索渠道。

---

## 1. skill.sh（Vercel 生态）

Vercel 团队开源的 Skill 生态，提供了一个 `Find Skills` 工具。装上之后可以直接在命令行搜索 Skill。

### 安装 Find Skills 工具

```bash
npx skills add vercel-labs/skills/find-skills
```

### 搜索 Skill

```bash
npx skills find [关键词]
```

例如，搜索和 commit 相关的 Skill：

```bash
npx skills find commit
```

搜索结果会列出匹配的 Skill 名称、描述和安装命令，直接复制就能装。

**适合场景**：你已经知道自己想要什么功能，想快速按关键词定位。

---

## 2. clawhub

另一个聚合站点，专门收录各类 Skill。

核心特点：

- **分类清晰**：按用途分类展示，适合不确定自己要什么的时候逛逛看
- **网页浏览**：不需要命令行，打开浏览器就能看
- **一键安装**：支持一键安装到 OpenClaw

**适合场景**：没有明确需求，想看看社区里有哪些好用的 Skill，按分类浏览发现灵感。

---

## 3. GitHub 搜索

直接在 GitHub 上搜关键词：

- `awesome-claude-skills`
- `claude skill`
- `openclaw skill`

能找到不少开源项目。开源意味着你可以直接 fork 下来修改，也可以学习别人的 Skill 是怎么写的。

:::tip[推荐资源]
如果你是内容创作者，推荐关注宝玉老师的 **baoyu-skills**，里面有不少实用的内容类 Skill，覆盖写作、翻译、内容总结等场景。
:::

**适合场景**：需要深度定制，或者想学习 Skill 的写法。

---

## 三渠道对比

| 渠道 | 特点 | 适合场景 |
|------|------|----------|
| skill.sh | 命令行搜索，Vercel 官方维护 | 想快速按关键词找 Skill |
| clawhub | 网页浏览，分类齐全，支持一键安装 | 不确定要什么，想逛逛看 |
| GitHub | 开源项目，可 fork 修改 | 要深度定制或学习 Skill 写法 |

---

## 今天就能做的最小行动

1. 装一个 Find Skills 工具：

```bash
npx skills add vercel-labs/skills/find-skills
```

2. 搜一个你感兴趣的关键词：

```bash
npx skills find <你的需求>
```

3. 挑一个装上试试。

从找到第一个有用的 Skill 开始，你就会理解为什么说"没有 Skill 的 Agent 只是个摆设"。

---

## 下一步

找到 Skill 之后，怎么装、怎么用、有什么注意事项？

[第 02 章：用别人的 Skill -- 安装方式 + 注意事项](/skill/02-use/)
