---
title: 安装：三种路线，20 分钟跑通
description: 三种运行环境选择，Node.js 准备，安装到首次对话
sidebar:
  order: 1
---

## 本节目标

读完本节，你应该拿到以下结果：

- OpenClaw 安装完成
- Gateway 进程正常运行
- 能通过至少一种方式（TUI / Dashboard）和助手对话

还不需要接入 Telegram 或飞书——那是下一步的事。先把"本地能跑"这件事做实。

---

## 1. 运行环境怎么选

OpenClaw 需要一台"宿主机"常驻运行 Gateway。你有三种选择：

| 方案 | 优点 | 缺点 | 适合谁 |
| --- | --- | --- | --- |
| 云服务器（推荐长期使用） | 24x7 在线，不占本机资源 | 有月租成本 | 确定要长期跑的用户 |
| 闲置设备（Mac Mini / 旧笔记本 / NAS 旁的小主机） | 低成本，数据留在本地 | 断电或关机会下线 | 家里有常开设备的用户 |
| 当前电脑 | 零门槛，立刻开跑 | 关机即下线 | 先体验再决策的用户 |

建议：不确定就先在当前电脑跑通体验，决定长期用再迁到云服务器或闲置设备。

---

## 2. 安装前准备

### 2.1 Node.js 22+

OpenClaw 对 Node 版本有硬要求：**22 以上**。

检查当前版本：

```bash
node -v
```

如果版本不足，用 nvm 升级：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 22
nvm use 22
```

macOS 如未安装 Homebrew，可先装：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2.2 Windows 用户：先装 WSL2

Windows 原生跑 OpenClaw 兼容性较差，建议在 WSL2 里按 Linux 方式安装：

```powershell
wsl --install
```

装好后进入 WSL 终端，后续所有命令在 WSL 内执行。

### 2.3 模型凭证

安装向导会让你选择模型来源。你需要提前准备好以下任一项：

- **OAuth 登录**：如果你已有 Anthropic / OpenAI 订阅，向导里直接登录即可
- **API Key**：在对应平台生成，按量计费

先准备好就行，详细的模型选择和配置在 [02-模型接入](/openclaw/02-model/) 中展开。

---

## 3. 三种安装路线

### 路线 A：官方向导（推荐新手）

一行命令启动安装 + 自动向导：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

安装脚本会自动拉取依赖并进入 onboard 向导。

如果你所在环境无法执行脚本（比如网络受限），可以走 CLI 方式：

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

效果相同，只是手动分两步。

### 路线 B：手动配置（熟手）

如果你熟悉配置文件，不想走向导，可以直接：

```bash
npm install -g openclaw@latest
openclaw configure --section gateway
openclaw gateway start
```

这条路线需要你自己编辑 `openclaw.json` 配置文件。最小配置模板：

```json
{
  "models": {
    "providers": {
      "my-api": {
        "baseUrl": "https://your-endpoint/v1",
        "apiKey": "your-api-key",
        "api": "openai-completions",
        "models": [
          {
            "id": "model-id",
            "name": "Model Name",
            "reasoning": false,
            "input": ["text"],
            "contextWindow": 200000,
            "maxTokens": 8192
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "my-api/model-id"
      }
    }
  },
  "gateway": {
    "port": 18789,
    "bind": "loopback",
    "auth": {
      "mode": "token",
      "token": "your-gateway-token"
    }
  }
}
```

### 路线 C：让编码 Agent 代装

如果你日常用 Claude Code 或 OpenCode，可以把官方文档链接丢给它，让它执行安装、配置与启动，你只需复核结果。

官方文档：<https://docs.openclaw.ai>

---

## 4. 向导怎么选

走路线 A 的话，向导会依次让你做几个选择。新手按下面的推荐走：

![安装向导-QuickStart 选项](https://oss.mytest.cc/2026/02/fc0255c99b9b5ba1ca34ecf9a9b59937.png)

**1) 安装模式**：选 `QuickStart`。目标只有一个——跑通最小链路。

**2) 模型来源**：你已经在哪家付费/有额度，就选哪家。别为了"最强"先折腾。

![安装向导-模型供应商选择](https://oss.mytest.cc/2026/02/5fc4f4204255c9b7d6e32c4f6e0f423f.png)

**3) 鉴权方式**：向导会给多种方式（API Key、OAuth 登录等），选你最稳定能用的那种。

**4) 渠道**：这一步可以先跳过，后续在 [03-渠道接入](/openclaw/03-channel/) 中单独配置。如果想顺手接，选 Telegram 最简单。

**5) Daemon（后台守护进程）**：选 `Yes`。这样 Gateway 会常驻后台运行，关掉终端也不会停。

![安装向导-包管理器选择](https://oss.mytest.cc/2026/02/8df8909bc999af68eb9747ecaa9e0ea6.png)

向导走完后，你会看到 Gateway 启动的提示。

---

## 5. 安装后验证

跑完向导后，依次执行这三条命令确认一切正常：

```bash
openclaw gateway status
openclaw health
openclaw status
```

- `gateway status` 显示 `running` → Gateway 正常
- `health` 无报错 → 环境健康
- `status` 显示模型和基本配置 → 系统就绪

三项都通过，安装就完成了。

---

## 6. 三种对话方式

安装完成后，你有三种方式和助手对话（不需要接入外部渠道）：

### TUI（终端对话，最稳）

```bash
openclaw tui
```

直接在终端里和助手聊天。适合调试和快速验证。

### Dashboard（网页面板）

```bash
openclaw dashboard
```

会输出一个带 Token 的 URL，在浏览器打开即可。注意 URL 需要带 `?token=...` 参数，否则连不上。

偏管理和调试，可以看状态、看日志、调配置。

### 桌面 App（macOS）

更接近原生体验，但能力与稳定性取决于当前版本。新手建议先用 TUI 或 Dashboard。

**验证方式**：在任一对话入口发送"你好"，收到回复就说明最小链路已通。

外部渠道（Telegram / 飞书 / 微信 / 浏览器）的接入在 [03-渠道接入](/openclaw/03-channel/) 中展开。

---

## 7. 常用命令速查

安装完成后这 6 条命令够你覆盖日常维护：

| 命令 | 用途 |
| --- | --- |
| `openclaw status` | 查看整体状态 |
| `openclaw gateway status` | 查看 Gateway 运行状态 |
| `openclaw health` | 环境健康检查 |
| `openclaw configure` | 修改配置 |
| `openclaw daemon restart` | 重启后台进程 |
| `openclaw daemon logs` | 查看后台日志 |

遇到问题时，先跑 `health` 和 `daemon logs`，80% 的问题能从这里定位。

---

## 8. 常见安装问题

### Node 版本不够

症状：安装脚本报错，或 `openclaw` 命令无法执行。

```bash
node -v  # 确认是否 22+
```

不够就用 nvm 升级（见 2.1 节）。

### Dashboard 无法连接

按顺序排查：

1. Gateway 是否在跑：`openclaw gateway status`
2. URL 是否带了 Token 参数
3. 端口是否被防火墙拦截

### Gateway 未启动或意外退出

```bash
openclaw daemon logs  # 看最近日志
openclaw daemon restart  # 尝试重启
```

如果反复退出，通常是模型凭证配置有误（API Key 错误或过期），检查 `openclaw configure` 中的模型配置。

### Windows 原生安装失败

不建议在 Windows 原生环境安装。切到 WSL2 后按 Linux 流程走，兼容性好很多。

---

## 下一步

安装完成，Gateway 在跑，能通过 TUI 或 Dashboard 对话了。接下来：

- [02-模型接入](/openclaw/02-model/)：配置云端模型、本地模型（Ollama）、中转站
- [03-渠道接入](/openclaw/03-channel/)：接入 Telegram / 飞书 / 微信 / 浏览器
