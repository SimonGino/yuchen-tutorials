---
title: 多 Agent 协作：子 Agent、角色分工与协作模式
description: 配置子 Agent，实现任务分派与协作
sidebar:
  order: 8
---

## 本节目标

- 理解子 Agent 的工作机制
- 能让主助手分派并行任务
- 配置省钱策略：主助手用好模型，子 Agent 用便宜模型

---

## 1. 什么是子 Agent

当任务复杂时，一个助手忙不过来。子 Agent 让主助手"分身"——在后台同时处理多件事，完成后自动汇报结果。

比如做一个调研任务，主助手可以同时派出多个子 Agent 分别查不同方向的资料，最后汇总。

![子 Agent 分身术](https://oss.aiqqyc.com/2026/02/0b1542092e71efbf432034f3ad4c406d.png)

---

## 2. 核心规则

| 规则 | 说明 |
|------|------|
| 独立会话 | 子 Agent 在独立会话中运行，不阻塞主助手 |
| 禁止套娃 | 子 Agent 不能再生成子 Agent |
| 并发上限 | 默认最多同时跑 8 个 |
| 自动通告 | 完成后自动向主助手回传结果 |

---

## 3. 使用方式

你可以直接在对话中描述需求，助手会自动判断是否需要启动子 Agent。

也可以用斜杠命令手动控制：

```bash
/subagents spawn <agentId> <任务描述>   # 启动
/subagents list                         # 查看所有
/subagents log <id>                     # 查看日志
/subagents send <id> <消息>             # 发消息
/subagents steer <id> <消息>            # 引导方向
/subagents kill <id|all>                # 终止
```

---

## 4. 省钱配置

主助手用好模型保证质量，子 Agent 用便宜模型控制成本：

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "gemini-2.5-flash",
        "maxConcurrent": 8
      }
    }
  }
}
```

模型优先级（从高到低）：

1. 启动时显式指定
2. 每个 Agent 的覆盖配置
3. 全局默认 `agents.defaults.subagents.model`
4. 继承主助手的模型

---

## 5. 工具权限

子 Agent 默认获得除会话工具外的所有工具。以下工具被禁用（防止套娃）：

- `sessions_list` / `sessions_history` / `sessions_send` / `sessions_spawn`

自定义权限：

```json
{
  "tools": {
    "subagents": {
      "tools": {
        "deny": ["gateway", "cron"],
        "allow": ["read", "exec", "process"]
      }
    }
  }
}
```

`deny` 优先于 `allow`。设置了 `allow` 就变成白名单模式。

---

## 6. 通告机制

子 Agent 完成后自动发布通告，包含：

- **Status**：`success` / `error` / `timeout` / `unknown`
- **Result**：结果摘要
- **Notes**：错误详情
- 运行统计：耗时、Token 用量、预估成本

如果子 Agent 回复 `ANNOUNCE_SKIP`，则不发布通告。

---

## 7. 实践建议

- 先在简单任务上试（比如"同时搜三个关键词"），确认机制可用
- 子 Agent 适合独立、可并行的任务，不适合需要上下文串联的任务
- 通过 `/subagents log <id>` 查看子 Agent 的完整执行过程
- 注意成本：8 个并发子 Agent 用贵模型，费用会很高

---

## 下一步

会分身了，接下来让助手自动定时干活：

- [09-定时任务与自动化](/openclaw/09-automation/)：晨报 Digest、信息收集
