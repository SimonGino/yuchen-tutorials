---
title: 定时任务与自动化：晨报 Digest、信息收集
description: Cron 定时任务配置和信息收集自动化
sidebar:
  order: 8
---

## 本节目标

- 理解 Cron 定时任务机制
- 搭建一个可用的晨报 Digest
- 掌握降噪、去重和成本控制

---

## 1. 定时任务（Cron）是什么

Cron 是 Gateway 内置的调度器。你设好时间表，助手会按时自动执行任务，不需要你手动触发。

任务持久化存储在 `~/.openclaw/cron/`，Gateway 重启不丢失。**但 Gateway 进程必须持续运行，任务才能触发。**

![Cron 定时任务速查](https://oss.aiqqyc.com/2026/02/c599671f92e283e8173f1045541172ec.png)

---

## 2. 两种执行模式

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| **主会话（main）** | 入队系统事件，下次心跳时运行 | 简单提醒 |
| **隔离式（isolated）** | 在独立会话中运行 | 定时汇报、数据采集、自动化流程 |

---

## 3. 三种调度方式

| 类型 | 格式 | 示例 |
|------|------|------|
| `at` | ISO 时间戳或相对时间 | `2026-03-05T08:00:00+08:00` 或 `2m` |
| `every` | 毫秒间隔 | `3600000`（每小时） |
| `cron` | 5 字段表达式 + 时区 | `0 7 * * *` + `Asia/Shanghai` |

---

## 4. 实战：搭建晨报 Digest

### 4.1 前置验收

先确认三件事可用：

```bash
openclaw daemon status     # Gateway 常驻
openclaw gateway status    # Gateway 在线
openclaw health            # 环境正常
```

Telegram 必须可对话（首次需要先给 Bot 发 `/start`），Web Search 必须配好（见 [03-渠道接入](/openclaw/03-channel/)）。

### 4.2 写规则文件

在 workspace 下创建：

```bash
cd ~/.openclaw/workspace
mkdir -p digest
```

创建 `digest/rules.md`：

```markdown
# Digest Rules (Low-noise)

## Scope
- Track A: OpenClaw 生态（发版、安全、重大集成）
- Track B: AI Agent 工具链（框架、评估、自动化）
- Track C: 模型定价/政策变化

## Hard Bar（只推满足以下任一条件的）
- 直接影响你本周的决策/配置/计划
- 影响系统稳定性/成本/安全
- 行业级重大事件

## Output Format
最多 2 条。每条：标题 + 发生了什么 + 为什么你该关注 + 下一步 + 链接

## Silence Rule
没有满足标准的内容，输出：HEARTBEAT_OK

## Dedup Rule
读取 digest/seen.json，已推过的 URL 跳过。新推的写入 seen.json。只保留最近 500 条。
```

创建 `digest/seen.json`：

```json
{
  "items": []
}
```

### 4.3 先手动跑一次

```bash
openclaw cron add \
  --name "Digest (test)" \
  --at "2m" \
  --delete-after-run \
  --session isolated \
  --message "Read digest/rules.md and digest/seen.json. Use web_search for each track. Filter with hard bar. Update seen.json. Output digest or HEARTBEAT_OK." \
  --announce \
  --channel telegram \
  --to "<YOUR_TG_ID>"
```

想立刻跑不等 2 分钟：

```bash
openclaw cron list
openclaw cron run <job_id>
```

查看运行历史：

```bash
openclaw cron runs --id <job_id> --limit 20
```

### 4.4 上定时

手动验证通过后，删掉测试任务，创建正式定时：

**每天 8 点晨报：**

```bash
openclaw cron add \
  --name "Morning Brief" \
  --cron "0 8 * * *" \
  --tz "Asia/Shanghai" \
  --session isolated \
  --message "Read digest/rules.md and digest/seen.json. Use web_search for each track. Filter with hard bar. Update seen.json. Output digest or HEARTBEAT_OK." \
  --announce \
  --channel telegram \
  --to "<YOUR_TG_ID>"
```

**每天 3 次（工作日 9/13/18 点）：**

```bash
openclaw cron add \
  --name "Digest 3x" \
  --cron "0 9,13,18 * * 1-5" \
  --tz "Asia/Shanghai" \
  --session isolated \
  --message "..." \
  --announce \
  --channel telegram \
  --to "<YOUR_TG_ID>"
```

---

## 5. 更多 Cron 示例

**一次性提醒：**

```bash
openclaw cron add \
  --name "开会提醒" \
  --at "2026-03-05T16:00:00+08:00" \
  --session main \
  --system-event "该开会了！" \
  --wake now \
  --delete-after-run
```

**修改已有任务：**

```bash
openclaw cron edit <job_id> --cron "0 10 * * 1-5" --tz "Asia/Shanghai"
openclaw cron edit <job_id> --message "新提示词"
```

---

## 6. 管理命令速查

```bash
openclaw cron list                          # 列出所有任务
openclaw cron run <jobId> --force           # 手动立即运行
openclaw cron runs --id <jobId> --limit 50  # 查看运行历史
openclaw cron edit <jobId> --message "..."  # 修改提示词
openclaw cron rm <jobId>                    # 删除任务
```

---

## 7. 降噪与成本控制

**降噪四条规则（写进 rules.md）：**

1. 范围你定，不许越界
2. 宁缺毋滥，每天最多 1-2 条
3. 标准要硬，能改变决策才配推送
4. 输出要短，4 行以内

**成本控制：** Cron 任务用便宜模型：

```bash
openclaw cron edit <job_id> \
  --model "my-api/your-cheap-model" \
  --thinking low
```

深度分析留给手动触发，Digest 只保留链接和摘要。

---

## 8. 常见问题

| 症状 | 原因 | 处理 |
|------|------|------|
| Cron 完全不跑 | Gateway 没常驻 | `openclaw daemon status` |
| 跑了但 Telegram 没收到 | `--to` 写错 / 触发了静默 | 查 `cron runs` 历史 |
| 推送都是垃圾 | 规则太宽 | 收紧 scope 和硬标准 |
| 重复推同一条 | seen.json 未读写 | 检查规则中去重指令 |

---

## 下一步

自动化配好了，接下来关注安全和成本：

- [09-安全与成本](/openclaw/09-security-cost/)：防火墙、降本、用量监控
