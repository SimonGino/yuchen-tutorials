---
title: 概览：OpenCode 是什么、和 Claude Code / Cursor 的关系
description: OpenCode 课程概览，了解工具定位、核心能力和课程结构
sidebar:
  order: 0
---

## 本课程目标

读完整门课程，你将拥有一个可长期使用的终端 AI 编程工作流：

- 安装并跑通 OpenCode 最小可用闭环（能发指令、能改代码、能执行命令）
- 接入免费模型、API Key 或中转站，不绑定单一供应商
- 配置自定义 Provider 与模型清单，成本可控
- 用 Oh My OpenCode 实现多 Agent 团队协作
- 用 Skills 工作流把开发流程从"想到哪做到哪"变成"可复用、可验收"
- 用 cc-switch 管理多供应商、优化成本
- 快速定位和解决常见安装与配置问题

---

## 1. OpenCode 是什么

一句话定义：**OpenCode 是一个开源的终端 AI 编程 Agent，核心链路是「读代码 -> 改代码 -> 验证代码」。**

它不是聊天工具，而是一个可编排的智能体。你下指令，它拆任务、调用模型、读写文件、执行命令，最终交付可验证的结果。传统 AI 编码工具的心智模型是"我问 -> AI 答"；OpenCode 更接近"我下指令 -> AI 拆任务 -> 多 Agent 协作完成"。

核心架构：

- **终端原生**：运行在 Terminal 中，支持 TUI 界面、CLI 命令行和 Web 界面三种交互方式
- **多模型支持**：Anthropic (Claude)、OpenAI (GPT)、Google (Gemini)、DeepSeek、Groq 等 75+ Provider
- **工具链完整**：内置文件读写、命令执行、LSP 代码导航、MCP 服务器扩展
- **Agent 协作**：支持多 Agent 分工和并行子任务，把 AI 当团队用
- **完全开源**：GitHub 开源项目，配置透明可控，可深度定制

---

## 2. 和 Claude Code / Cursor / Aider 的对比

| 对比项 | OpenCode | Claude Code | Cursor | Aider |
|--------|----------|-------------|--------|-------|
| 开源 | 完全开源 | 闭源 | 闭源 | 开源 |
| 运行环境 | 终端 / Web / IDE 扩展 | 终端 | IDE（VS Code fork） | 终端 |
| 模型支持 | 75+ Provider，任意切换 | 仅 Claude | 多模型但受限于订阅 | 多模型 |
| 订阅复用 | Claude Pro/Max、ChatGPT Plus/Pro 订阅可直接用 | 需 Claude 订阅或 API Key | 需 Cursor 订阅 | 仅 API Key |
| Agent 协作 | 内置多 Agent + 并行子任务 | 单 Agent | 单 Agent | 单 Agent |
| MCP 扩展 | 原生支持 | 原生支持 | 有限支持 | 不支持 |
| LSP 支持 | 内置，可重构和导航 | 不支持 | IDE 内置 | 不支持 |
| 服务器/CI 场景 | 原生适配 | 可用 | 不适合 | 可用 |
| 成本控制 | 自定义 Provider + baseURL，完全可控 | 受限于 Anthropic 定价 | 受限于订阅 | 依赖 API 定价 |

一句话总结：**OpenCode 给你的是对模型来源、成本与协作方式的完全掌控权，这是 Cursor 和 Claude Code 给不了的自由度。**

---

## 3. 它能做什么

OpenCode 的核心场景：

- **需求澄清与任务拆解**：用 Skills 把模糊需求收敛为结构化计划，避免"一上来就写代码"
- **代码生成与重构**：读懂现有代码，生成新代码或重构旧代码，带 LSP 支持的精确重命名和跳转
- **自动化测试与验证**：执行测试命令、检查输出，把"看起来对"变成"能跑、能回归"
- **多 Agent 并行开发**：把独立任务拆给子 Agent 并行执行，主线程持续推进
- **Code Review 与质量把关**：提交前自动做行为回归、边界条件、测试缺口检查
- **文档生成与维护**：读代码生成文档，或根据文档反向校验实现

---

## 4. 你需要付出什么

### 环境要求

| 项目 | 最低要求 | 建议 |
|------|----------|------|
| 操作系统 | macOS / Linux / Windows (WSL) | macOS 或 Linux |
| Node.js | >= 20 | 最新 LTS |
| 终端 | 能执行 `npm` 或 `brew` | 支持 256 色的现代终端 |
| 网络 | 能访问 opencode.ai | 稳定的国际网络 |
| 模型来源 | 至少一个可用 Provider | Claude Pro/Max 或 API Key |

### 时间成本

| 阶段 | 预计时间 |
|------|----------|
| 安装 + 跑通最小闭环 | 20 分钟 |
| 模型接入 + Provider 配置 | 30 分钟 |
| Oh My OpenCode + Skills 工作流 | 1 小时 |
| 多供应商协同 + 成本优化 | 30 分钟 |
| 全部完成 | 约半天 |

---

## 5. 课程结构

| 章节 | 内容 | 你会拿到的结果 |
|------|------|----------------|
| [01 安装](/opencode/01-install/) | 环境准备 + 20 分钟跑通最小闭环 | OpenCode 可启动、模型可调用 |
| [02 模型接入](/opencode/02-model/) | 免费模型 / API Key / 中转站三条路线 | 至少一条路线跑通 |
| [03 Provider 配置](/opencode/03-provider/) | ai-sdk 自定义 + 模型清单 + 变体 | 自定义 Provider 生效 |
| [04 Oh My OpenCode](/opencode/04-omo/) | 从单兵模型到 Agent 团队协作 | Agent 团队可调度 |
| [05 Skills 工作流](/opencode/05-skills/) | 内置 Skills + 自定义 + 工程化实践 | 完整工作流可复用 |
| [06 多供应商协同](/opencode/06-multi-provider/) | cc-switch + 模型分工 + 成本优化 | 成本可控的多模型方案 |
| [07 排错手册](/opencode/07-troubleshooting/) | 按症状索引，快速收敛问题 | 常见问题自助解决 |

建议按顺序阅读。每章都是自包含的，但后续章节会依赖前面的安装和配置基础。

---

## 6. 开始之前的准备

在进入第一章之前，请确认：

1. **操作系统**：macOS、Linux 或 Windows (WSL) 均可
2. **Node.js**：运行 `node -v` 确认版本 >= 20，没有的话先装 Node
3. **网络**：确保能访问 `opencode.ai`
4. **模型账号**：至少准备一个模型来源（Claude / ChatGPT 订阅、API Key、或先用 OpenCode 官方免费额度）

准备好了，直接进入下一步。

---

## 下一步

[第 01 章：安装 -- 环境准备 + 20 分钟跑通最小闭环](/opencode/01-install/)
