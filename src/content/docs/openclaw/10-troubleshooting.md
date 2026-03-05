---
title: 排错手册：按症状索引，10 分钟收敛问题
description: 按症状定位问题的排查流程
sidebar:
  order: 10
---

## 本节目标

- 建立固定的排错流程：先状态、再日志、后配置
- 按症状快速定位问题
- 掌握快速恢复剧本

---

## 1. 排错总原则

永远按这个顺序：

1. **看状态**（进程是否在线）
2. **看日志**（错误发生在哪一层）
3. **再改配置**（避免盲改）

![排错决策树](/images/openclaw/05-troubleshooting-tree.png)

先执行基础检查：

```bash
openclaw status
openclaw gateway status
openclaw health
```

三项都正常，问题大概率不在基础设施层。

---

## 2. 安装类问题

### Node 版本不够

症状：安装脚本报错，或 `openclaw` 命令无法执行。

```bash
node -v  # 确认 22+
nvm install 22 && nvm use 22
```

### 安装脚本中断

用 CLI 兜底：

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

### Windows 环境问题

不建议原生 Windows，切到 WSL2。

---

## 3. Gateway / Dashboard 问题

### Dashboard 打不开

按顺序排查：

1. `openclaw gateway status` → 确认 running
2. URL 是否带了 `?token=...` 参数
3. 端口是否被防火墙拦截

### Token 错误

```bash
openclaw configure --section gateway
openclaw daemon restart
```

### Gateway 反复退出

```bash
openclaw daemon logs  # 看最近日志
```

通常是模型凭证配置有误（API Key 错误或过期）。

---

## 4. 模型类问题

### 模型不回复 / 回复报错

常见原因：

- API Key 填错或过期
- 模型 ID 不匹配
- `provider/model` 前缀写错
- 改了配置但没重启

最小修复：

```bash
openclaw health        # 看模型连接状态
openclaw daemon restart
```

仍失败就回退到"单 provider + 单模型"再测。

---

## 5. 渠道类问题

### Telegram 不回消息

按顺序检查：

1. Bot Token 是否正确
2. Admin 用户 ID 是否正确
3. 是否完成配对审批
4. Gateway 是否运行中

```bash
openclaw pairing list telegram
openclaw pairing approve telegram <code>
openclaw daemon logs
```

### 飞书不回消息

按顺序检查：

1. `im.message.receive_v1` 是否订阅
2. 应用是否已发布到最新版本
3. 是否完成配对审批
4. Gateway 是否运行中

```bash
openclaw pairing approve feishu <code>
```

### 明明在线但回复慢

优先排查模型 provider：

```bash
openclaw health
```

模型侧抖动就先换到更稳定模型，不要先怀疑渠道。

---

## 6. Skills 类问题

### 装了但看不见

检查顺序：

1. 目录是否正确（`<workspace>/skills` 或 `~/.openclaw/skills`）
2. 是否被高优先级同名技能覆盖
3. `requires.*` 条件是否满足（bins / env / config / os）
4. 是否在旧会话里测试

每次改动后**开新会话**再验证。

### 调用失败

先确认技能的依赖是否满足（环境变量、二进制工具），再检查 `skills.entries` 配置。

---

## 7. Cron 类问题

### 完全不跑

```bash
openclaw daemon status   # Gateway 是否常驻
openclaw cron list       # 任务是否存在
```

99% 的原因：Gateway 没在运行。

### 跑了但没推送

```bash
openclaw cron runs --id <job_id> --limit 50
```

常见原因：

- `--to` 写错了
- `--channel` 没写
- 规则触发了静默（输出了 HEARTBEAT_OK，这是预期行为）

---

## 8. 快速恢复剧本

当问题复杂、定位发散时，用最小化恢复：

1. 只保留一个模型 provider
2. 只保留一个渠道
3. 关闭新增技能
4. 重启并做回归

```bash
openclaw daemon restart
openclaw status
openclaw gateway status
openclaw health
```

回归测试：

```text
你好，请用三句话告诉我你现在是否工作正常。
```

能稳定回复，再逐项恢复功能。

如果改配置改崩了：

```bash
cp ~/.openclaw/openclaw.json.bak ~/.openclaw/openclaw.json
openclaw daemon restart
openclaw health
```

---

## 9. 常用命令速查

```bash
openclaw status
openclaw gateway status
openclaw health
openclaw configure
openclaw daemon restart
openclaw daemon logs
openclaw pairing list telegram
openclaw pairing approve telegram <code>
openclaw pairing approve feishu <code>
openclaw cron list
openclaw cron runs --id <jobId> --limit 50
```

---

排错体系搭好后，你的 OpenClaw 就进入了"可维护状态"。后续新增任何渠道、模型或技能，都可以按这套路径稳定扩展。

---

## 课程总结

从安装到排错，11 个模块覆盖了 OpenClaw 的核心功能链路：

| 已完成 | 能力 |
|--------|------|
| 安装 | Gateway 稳定运行 |
| 模型接入 | 云端 / 本地 / 中转 |
| 渠道接入 | Telegram / 飞书 / 浏览器 |
| 身份与人格 | 三件套定义 |
| 记忆管理 | 跨会话持久记忆 |
| Skills | 能力扩展与治理 |
| 多 Agent | 并行任务分派 |
| 自动化 | 定时任务与晨报 |
| 安全与成本 | 边界控制与降本 |
| 排错 | 按症状收敛 |

接下来就是在实际使用中持续迭代：调 SOUL、积累记忆、安装 Skills、优化成本。助手会越用越懂你。
