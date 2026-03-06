---
title: 模型接入：云端 / 本地 / 中转站
description: 官方 API、中转 API、本地 Ollama 三种模型接入路线
sidebar:
  order: 2
---

## 本节目标

- 至少一个模型 provider 配置完成并可用
- 理解模型选择策略：稳定优先，按需切换
- 了解本地模型（Ollama）接入方式

---

## 1. 模型接入路线图

OpenClaw 支持三条模型接入路线：

| 路线 | 适合谁 | 特点 |
|------|--------|------|
| 官方 API / OAuth | 已有 Anthropic / OpenAI 等订阅 | 最稳，直接登录或填 Key |
| 中转 API | 使用第三方中转服务 | 灵活，baseUrl + apiKey |
| 本地模型（Ollama） | 有 Mac/GPU 设备 | 免费，数据不出本机 |

![OpenClaw 模型接入路线图](/images/openclaw/01-model-paths.png)

**先只跑通一条路线**，验证稳定后再加第二个 provider。不要同时改模型和其他配置。

---

## 2. 官方 API / OAuth 接入

如果你在安装向导中已选择了模型供应商并完成登录，这一步可以跳过。

常见供应商：

- OpenAI（API Key 或 Codex OAuth）
- Anthropic（API Key 或 Claude Code CLI）
- Qwen（OAuth）
- OpenRouter、Moonshot 等

验证当前模型是否可用：

```bash
openclaw health
openclaw status
```

---

## 3. 中转 API 接入

中转服务通常提供一个 `baseUrl` 和 `apiKey`，兼容 OpenAI 接口格式。

编辑 `~/.openclaw/openclaw.json`，最小配置：

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
  }
}
```

需要改的 5 个字段：

- `baseUrl`：中转服务地址
- `apiKey`：中转服务密钥
- `models[].id`：模型 ID
- `models[].name`：显示名称
- `agents.defaults.model.primary`：格式 `provider名/模型id`

改完重启验证：

```bash
openclaw daemon restart
openclaw health
```

---

## 4. 本地模型接入（Ollama）

### 4.1 硬件要求

推荐 Mac M 系列芯片 + 32G 内存起步。9B 模型在这个配置下运行流畅，但不适合高并发场景，建议只给自己用。

### 4.2 安装 Ollama

```bash
brew install ollama
brew services start ollama
```

注意：必须先启动服务，否则后续命令会报连接错误。

### 4.3 下载并运行模型

以 Qwen3.5-9B 为例：

```bash
ollama run qwen3.5:9b
```

自动下载并进入对话。输入 `/bye` 退出对话。

### 4.4 验证服务可用

```bash
curl http://localhost:11434/api/tags
```

返回 JSON 数据说明服务正常。

### 4.5 接入 OpenClaw

**方式一：隐式发现（推荐）**

设置环境变量（值随意填，OpenClaw 用它识别 provider）：

```bash
export OLLAMA_API_KEY="ollama-local"
```

或用 CLI：

```bash
openclaw config set models.providers.ollama.apiKey "ollama-local"
```

OpenClaw 会自动扫描本地 Ollama 已下载的模型。查看发现的模型：

```bash
openclaw models list
```

在配置中指定默认模型：

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "ollama/qwen3.5:9b"
      }
    }
  }
}
```

**方式二：显式配置（Ollama 在其他机器上时）**

```json
{
  "models": {
    "providers": {
      "ollama": {
        "baseUrl": "http://远程IP:11434/v1",
        "apiKey": "ollama-local",
        "api": "openai-completions"
      }
    }
  }
}
```

注意：用了显式配置后，自动发现会被跳过。本机使用推荐隐式发现。

### 4.6 Ollama 常用命令

| 命令 | 说明 |
|------|------|
| `brew services start ollama` | 启动服务（后台常驻） |
| `brew services stop ollama` | 停止服务 |
| `ollama run qwen3.5:9b` | 下载并运行模型 |
| `ollama list` | 查看已下载模型 |
| `ollama ps` | 查看运行中模型 |
| `ollama stop qwen3.5:9b` | 停止模型，释放内存 |
| `ollama rm qwen3.5:9b` | 删除模型 |

---

## 5. 模型选择策略

不要追求"最强"，先追求"最稳"。

| 场景 | 优先目标 | 建议 |
|------|----------|------|
| 日常对话和流程执行 | 稳定 + 成本 | 中档模型作为默认 |
| 复杂分析和长链推理 | 效果 | 高性能模型按需切换 |
| 后台定时任务 | 成本 | 便宜模型 |
| 本地 / 离线场景 | 可控 | 本地模型 |

实践建议：

- 把 `primary` 固定为稳定的中档模型
- 关键任务在对话中直接说"请使用最强模型完成"
- 后台任务（cron）可单独指定便宜模型

---

## 6. 本地模型的能力边界

以 Qwen3.5-9B 为例：

**强项**：知识问答、中文场景、长文本处理、指令遵循

**弱项**：代码编写、算法竞赛、高阶数学推理

9B 模型适合做日常对话、文本处理和知识问答。如果主要需求是写代码或数学推理，仍然需要云端大参数模型。

---

## 下一步

模型跑通了，接下来接入聊天渠道：

- [03-渠道接入](/openclaw/03-channel/)：Telegram / 飞书
