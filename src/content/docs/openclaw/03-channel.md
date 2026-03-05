---
title: 渠道接入：Telegram / 飞书 / 微信 / 浏览器
description: 四大聊天渠道接入实战教程
sidebar:
  order: 3
---

## 本节目标

- 至少接通一个聊天渠道，能和助手正常对话
- 理解配对（pairing）审批机制
- 了解浏览器自动化的四种方案

先跑通一个渠道，不要一口气全接。推荐 Telegram（最简单）或飞书（团队场景）。

---

## 1. Telegram 接入（推荐入门）

### 1.1 创建 Bot

在 Telegram 搜索 `@BotFather`：

1. 发送 `/newbot`
2. 设置 Bot 名称
3. 设置唯一用户名（建议以 `_bot` 结尾）
4. 保存返回的 Token

![Telegram 创建机器人](https://oss.mytest.cc/2026/02/ac993288d72006ac40fa28a3488e8762.png)

Token 是渠道凭证，务必妥善保管。

### 1.2 获取用户 ID

在 Telegram 搜索 `@userinfobot`，记录你的数字 ID。用于设置管理员，防止他人调用你的模型额度。

### 1.3 配置渠道

向导方式（推荐）：

```bash
openclaw channels add
```

选择 Telegram，填入 Bot Token 和 Admin User ID。

配置文件方式：

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "123:abc",
      "dmPolicy": "pairing"
    }
  }
}
```

### 1.4 首次消息验证

给 Bot 发消息，首次会返回配对码：

![Telegram 配对码](https://oss.mytest.cc/2026/02/4d5cd12f57c561d0e11c0abf1178c893.png)

执行审批：

```bash
openclaw pairing approve telegram <code>
```

![Telegram 授权成功](https://oss.mytest.cc/2026/02/17d1d00b5641b93387842e3e29cdeda2.png)

再发一条消息，收到正常回复说明链路已通。

![Telegram 对话验证成功](https://oss.mytest.cc/2026/02/c5ecd0340dcce1b579404f308959a2bf.png)

---

## 2. 飞书接入

### 2.1 创建应用

入口：<https://open.feishu.cn/app>（Lark 国际版用 open.larksuite.com）

1. 点击"创建企业自建应用"
2. 填写名称、描述、图标

![创建飞书应用](https://mintcdn.com/clawdhub/6NERQ7Dymau_gJ4k/images/feishu-step2-create-app.png?fit=max&auto=format&n=6NERQ7Dymau_gJ4k&q=85&s=a3d0a511fea278250c353f5c33f03584)

### 2.2 获取凭证

在"凭证与基础信息"复制 `App ID` 和 `App Secret`。

![获取飞书凭证](https://mintcdn.com/clawdhub/6NERQ7Dymau_gJ4k/images/feishu-step3-credentials.png?fit=max&auto=format&n=6NERQ7Dymau_gJ4k&q=85&s=3a6ac22e96d76e4b85a1171ea207608b)

### 2.3 配置权限与机器人

1. 在"权限管理"导入最小权限集合
2. 在"应用能力 > 机器人"开启机器人能力

![配置权限](https://mintcdn.com/clawdhub/6NERQ7Dymau_gJ4k/images/feishu-step4-permissions.png?fit=max&auto=format&n=6NERQ7Dymau_gJ4k&q=85&s=a386d201628f65771d9d423056d9dc59)

![启用机器人](https://mintcdn.com/clawdhub/6NERQ7Dymau_gJ4k/images/feishu-step5-bot-capability.png?fit=max&auto=format&n=6NERQ7Dymau_gJ4k&q=85&s=4c330500fd7db2e72569dc2a379697ee)

### 2.4 事件订阅

在"事件订阅"页面：

1. 选择"使用长连接接收事件（WebSocket）"
2. 添加 `im.message.receive_v1`

![事件订阅](https://mintcdn.com/clawdhub/6NERQ7Dymau_gJ4k/images/feishu-step6-event-subscription.png?fit=max&auto=format&n=6NERQ7Dymau_gJ4k&q=85&s=00aeb4809d9df159d846e0be19bc871e)

### 2.5 发布应用

创建版本 → 提交审核 → 管理员批准。最容易漏的是"改了权限但没发布"。

### 2.6 OpenClaw 侧配置

向导方式：

```bash
openclaw channels add
```

选择 Feishu，输入 App ID 和 App Secret。

配置文件方式：

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "dmPolicy": "pairing",
      "accounts": {
        "main": {
          "appId": "cli_xxx",
          "appSecret": "xxx",
          "botName": "我的AI助手"
        }
      }
    }
  }
}
```

Lark 国际版加 `"domain": "lark"`。

### 2.7 联调验证

在飞书给机器人发消息，拿到配对码后：

```bash
openclaw pairing approve feishu <配对码>
```

再发一条消息，稳定回复即通过。

---

## 3. 浏览器自动化（四种方案）

OpenClaw 不只能聊天，还能操控浏览器。四种方案由浅入深：

### 3.1 青铜：Web Fetch + Web Search（零配置）

内置工具，不需要浏览器：

- `web_search`：调用搜索引擎 API（推荐 Brave Search，有免费额度）
- `web_fetch`：抓取 URL 内容，输出干净 Markdown

局限：不执行 JavaScript，无法处理 SPA 和需要登录的页面。

配置 Web Search：

```json
{
  "tools": {
    "web": {
      "search": {
        "enabled": true,
        "provider": "brave",
        "apiKey": "YOUR_BRAVE_API_KEY"
      },
      "fetch": {
        "enabled": true
      }
    }
  }
}
```

### 3.2 白银：Skill 扩展（API 情报站）

通过 ClawHub 安装第三方 Skill，用 API 接入社交媒体等平台。

```bash
clawhub install <skill-slug>
```

适合社交媒体情报搜集、跨平台数据汇总。

### 3.3 钻石：托管独立浏览器（24/7 自动化）

OpenClaw 启动一个独立 Chrome 实例，通过 CDP 完全控制：

```json
{
  "browser": {
    "enabled": true,
    "headless": false,
    "defaultProfile": "openclaw",
    "profiles": {
      "openclaw": {
        "cdpPort": 18800
      }
    }
  }
}
```

启动后手动登录一次攒好 Cookie，之后 AI 可复用登录状态。

适合定时任务、JS 页面抓取、需要登录的操作。

### 3.4 王者：Chrome Relay 扩展（接管当前浏览器）

安装 Chrome 扩展，让 AI 直接操作你正在使用的浏览器：

```bash
openclaw browser extension install
```

在 Chrome 中加载扩展，点击图标激活标签页。

适合高信任度操作、复用现有登录态。注意：AI 误操作会直接影响真实账号。

### 选型速查

| 方案 | 需要浏览器 | 适用场景 |
|------|-----------|----------|
| 青铜 | 否 | 公开网页抓取、搜索 |
| 白银 | 否 | 社交媒体情报、API 数据 |
| 钻石 | 是（独立实例） | 定时任务、JS 页面、登录后操作 |
| 王者 | 是（当前浏览器） | 高信任度操作、复用登录 |

---

## 4. 配对审批机制

所有渠道默认使用 `dmPolicy: pairing`，首次私聊必须审批：

```bash
openclaw pairing list <channel>
openclaw pairing approve <channel> <code>
```

这是安全底线：未审批的用户无法调用你的模型额度。

---

## 下一步

渠道接通了，接下来给助手定义身份和人格：

- [04-身份与人格](/openclaw/04-soul/)：Soul 定义与语气调教
