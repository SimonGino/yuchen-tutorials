---
title: 安全与成本：防火墙、降本、用量监控
description: 安全防护、成本控制和监控配置
sidebar:
  order: 9
---

## 本节目标

- 建立安全边界：Allowlist、最小权限、认知防火墙
- 控制模型成本：默认模型降档 + 自动降级
- 掌握"改配置不翻车"的操作流程

---

## 1. 改配置不翻车：三步操作流程

在做任何进阶改动之前，先建立安全网：

### 1.1 备份

```bash
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak
```

### 1.2 每次只改一处

改一处 → 重启 → 验收 → 再改下一处。不要一把梭。

### 1.3 回滚剧本

改崩了立刻回滚：

```bash
cp ~/.openclaw/openclaw.json.bak ~/.openclaw/openclaw.json
openclaw daemon restart
openclaw health
```

---

## 2. 安全边界

### 2.1 Allowlist

只允许你自己的账号下指令，防止公开入口消耗模型额度：

```json
{
  "channels": {
    "telegram": {
      "allowlist": [123456789]
    }
  }
}
```

### 2.2 最小权限原则

- 文件读写限制在 workspace 内
- 能不用 root 就不用
- 有条件用专门系统账号跑
- 远程用内网组网（Tailscale/WireGuard），不暴露公网

### 2.3 配对审批

所有渠道默认用 `dmPolicy: pairing`。未审批的用户无法与助手交互。

---

## 3. 认知防火墙

你会读大量帖子和教程来优化 OpenClaw。问题是：很多"看起来像教程"的内容是 AI 拼出来的伪技术文，照抄就崩。

把这三条写进 `AGENTS.md`：

```text
1) 任何优化建议都必须给：来源 + 可复现步骤 + 失败边界。
2) 无法验证就明确说"不确定"，并给一个最小实验方案。
3) 不允许只看一篇帖子/教程就改生产配置。
```

建议让助手每次给建议都按这个模板输出：

```text
结论（1 句话）：
证据（链接/文档/源码）：
我如何验证（最小步骤）：
可能翻车的边界（2-3 条）：
是否建议现在改生产（是/否，理由）：
```

---

## 4. 成本控制

### 4.1 默认模型降档

把日常用的默认模型从最贵降到中档：

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "my-api/your-mid-model"
      }
    }
  }
}
```

改完重启验收：

```bash
openclaw daemon restart
openclaw status
openclaw health
```

### 4.2 按需使用强模型

默认用中档，关键任务在对话中指定：

```text
这条是关键任务，请使用最强模型完成。
```

反向版本：

```text
这条只是后台整理，请使用便宜模型。
```

### 4.3 子 Agent 和 Cron 用便宜模型

子 Agent：

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "model": "my-api/your-cheap-model"
      }
    }
  }
}
```

Cron 任务：

```bash
openclaw cron edit <job_id> --model "my-api/your-cheap-model"
```

### 4.4 让助手帮你改配置

如果你不想直接编辑配置文件，把这段发给助手：

```text
我要做"降本 + 不断线"的最小改动：
1) 先备份 ~/.openclaw/openclaw.json
2) 把默认模型改成中档（给我 2 个候选让我选）
3) 加一个便宜模型作为 fallback
4) 改完重启并验收
5) 列出改了哪些字段、原值和新值
```

你只需要盯两件事：它有没有备份，有没有给你改动清单。

---

## 5. 验收三条命令

每次改完配置都跑一遍：

```bash
openclaw status
openclaw gateway status
openclaw health
```

通过再继续。失败先看 `openclaw daemon logs`，仍不确定就回滚。

---

## 6. 安全检查清单

- [ ] Allowlist 配置了只允许自己
- [ ] 渠道用 pairing 模式
- [ ] 文件操作限制在 workspace
- [ ] 远程访问用内网组网，不暴露公网
- [ ] AGENTS.md 写了认知防火墙规则
- [ ] 配置文件有备份

---

## 下一步

安全和成本都控好了，最后一个模块是排错手册：

- [10-排错手册](/openclaw/10-troubleshooting/)：按症状索引，10 分钟收敛问题
