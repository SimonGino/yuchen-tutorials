---
title: 记忆管理：机制、治理与清理
description: 理解记忆体系，掌握治理和清理策略
sidebar:
  order: 6
---

## 本节目标

- 理解 OpenClaw 的记忆机制（文件驱动，不是模型内部记忆）
- 搭建可用的记忆文件结构
- 配置记忆治理策略，防止记忆越用越臃肿

---

## 1. 记忆的本质

OpenClaw 的记忆不是"模型内部的上下文"，而是**工作空间中的 Markdown 文件**。

模型只"记住"写入磁盘的内容。没写入的，下次会话全忘。

![记忆体系](https://oss.aiqqyc.com/2026/02/b0623ab947765b0b94d6c05a434bec56.png)

---

## 2. 记忆文件结构

默认使用两层记忆：

```
MEMORY.md              ← 核心索引：关键信息和文件引用
memory/
  ├── projects.md      ← 项目状态和任务追踪
  ├── infra.md         ← 基础设施配置速查
  ├── lessons.md       ← 问题记录和解决方案
  └── 2026-03-05.md    ← 每日对话日志
```

| 文件 | 写什么 | 什么时候读 |
|------|--------|-----------|
| `MEMORY.md` | 决策、偏好、持久性事实 | 每次私人会话开始时 |
| `memory/YYYY-MM-DD.md` | 日常笔记、运行上下文 | 会话开始时读今天和昨天 |

---

## 3. 何时写入记忆

- 决策和偏好 → 写入 `MEMORY.md`
- 日常笔记和运行上下文 → 写入 `memory/YYYY-MM-DD.md`
- 有人说"记住这个" → 立刻写入文件（不只是存在上下文里）
- 想持久保存的内容 → 主动要求助手写入记忆

关键：如果不写入文件，下次会话就没了。

---

## 4. 向量记忆搜索

OpenClaw 会在记忆文件上构建小型向量索引，支持语义查询——即使措辞不同也能找到相关笔记。

默认自动启用，嵌入提供商按优先级选择：

1. 本地模型（如果配置了 `memorySearch.local.modelPath`）
2. OpenAI（如果有 API Key）
3. Gemini（如果有 API Key）
4. 以上都没有 → 禁用

想索引额外目录：

```json
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "extraPaths": ["../team-docs", "/srv/shared-notes/overview.md"]
      }
    }
  }
}
```

---

## 5. memoryFlush：上下文快满时自动保存

当对话接近上下文窗口限制时，OpenClaw 会触发压缩。启用 memoryFlush 后，压缩前会先让助手把重要信息写入文件：

```json
{
  "agents": {
    "defaults": {
      "compaction": {
        "reserveTokensFloor": 20000,
        "memoryFlush": {
          "enabled": true,
          "softThresholdTokens": 4000,
          "systemPrompt": "Session nearing compaction. Store durable memories now.",
          "prompt": "Write any lasting notes to memory/YYYY-MM-DD.md; reply with NO_REPLY if nothing to store."
        }
      }
    }
  }
}
```

---

## 6. 记忆治理：防止越用越臃肿

记忆需要新陈代谢。推荐把记忆分三个优先级：

```
[P0] 永不自动清理（身份/安全/关键规则）
[P1] 90 天未引用 → 归档
[P2] 30 天未引用 → 归档
```

归档而不是删除。把这段发给助手，让它建一个每周自动归档任务：

```text
帮我做一个"每周记忆归档"任务：
1) 打开 MEMORY.md
2) P2：ref 超过 30 天 → 移到 MEMORY-ARCHIVE.md
3) P1：ref 超过 90 天 → 移到 MEMORY-ARCHIVE.md
4) P0 永远保留
5) 不允许永久删除，只做归档
6) 每次运行后给我简短报告
7) 设为每周日早上 6 点自动运行
```

先跑两周看效果，再调阈值。

---

## 7. 实践建议

- **先跑通基础**：确认 `MEMORY.md` 和 `memory/` 目录存在
- **做一次验证**：对助手说"记住我喜欢简洁的回复"，然后检查它是否真的写入了文件
- **不要过度设计**：先用默认的两层结构，觉得不够再扩展
- **定期回顾**：每月看一次 MEMORY.md，清理冲突和过时内容

记忆体系的最大价值：摆脱上下文窗口限制，让助手具备跨会话长效执行和自我进化的能力。

---

## 下一步

记忆配好了，接下来用 Skills 扩展助手的能力：

- [07-Skills 管理](/openclaw/07-skills/)：内置、自定义与治理
