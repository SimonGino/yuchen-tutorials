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
- 理解 `.claude` 目录结构与配置体系
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

不适合：从来没打开过终端、不熟悉 `git`/`cd`/`ls` 的纯小白。建议先花半小时熟悉基础命令再来。

---

## 课程结构

| # | 章节 | 性质 |
|---|---|---|
| 01 | 上手：从订阅到第一次对话 | 操作 |
| 02 | `.claude` 目录与配置 | 操作 |
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
