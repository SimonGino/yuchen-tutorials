---
title: 浏览器自动化：四种方案由浅入深
description: Web Fetch、Skill 扩展、托管浏览器、Chrome Relay 四种浏览器自动化方案
sidebar:
  order: 4
---

## 本节目标

- 了解浏览器自动化的四种方案及适用场景
- 至少跑通一种方案，能让助手访问网页

OpenClaw 不只能聊天，还能操控浏览器。四种方案由浅入深：

---

## 1. 青铜：Web Fetch + Web Search（零配置）

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

## 2. 白银：Skill 扩展（API 情报站）

通过 ClawHub 安装第三方 Skill，用 API 接入社交媒体等平台。

```bash
clawhub install <skill-slug>
```

适合社交媒体情报搜集、跨平台数据汇总。

## 3. 钻石：托管独立浏览器（24/7 自动化）

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

## 4. 王者：Chrome Relay 扩展（接管当前浏览器）

安装 Chrome 扩展，让 AI 直接操作你正在使用的浏览器：

```bash
openclaw browser extension install
```

在 Chrome 中加载扩展，点击图标激活标签页。

适合高信任度操作、复用现有登录态。注意：AI 误操作会直接影响真实账号。

## 选型速查

| 方案 | 需要浏览器 | 适用场景 |
|------|-----------|----------|
| 青铜 | 否 | 公开网页抓取、搜索 |
| 白银 | 否 | 社交媒体情报、API 数据 |
| 钻石 | 是（独立实例） | 定时任务、JS 页面、登录后操作 |
| 王者 | 是（当前浏览器） | 高信任度操作、复用登录 |

---

## 下一步

浏览器能力配好了，接下来给助手定义身份和人格：

- [05-身份与人格](/openclaw/05-soul/)：Soul 定义与语气调教
