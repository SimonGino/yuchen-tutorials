---
title: 模型接入：免费模型 / API Key / 中转站三条路线
description: 三种模型接入方式对比，选择适合你的路线跑通链路
sidebar:
  order: 2
---

## 本节目标

读完本节，你应该拿到以下结果：

- 清楚三条模型接入路线的区别、成本和适用场景
- 至少跑通一条路线，在 OpenCode 中看到模型并完成一次问答
- 掌握接入后的验证方法和常见报错的排查顺序

---

## 1. 三条路线对比

先看全局，再选路线。

| 维度 | 路线 A：免费模型 / OAuth | 路线 B：API Key 直连 | 路线 C：中转站 |
|------|--------------------------|----------------------|----------------|
| 费用 | 0 元（有配额上限） | 按量付费（各厂商定价） | 按量付费（中转站定价） |
| 上手速度 | 最快，浏览器授权即可 | 中等，需注册厂商平台并生成 Key | 中等，需注册中转站并生成 Key |
| 模型可选范围 | 受限于 OAuth 支持的模型 | 单厂商全部模型 | 多厂商模型统一接入 |
| 网络要求 | 需能访问厂商 OAuth 端点 | 需能访问厂商 API | 取决于中转站部署位置 |
| 适合谁 | 想零成本体验的新手 | 已有厂商账号、只用单一厂商 | 需要多模型切换、长期使用的开发者 |
| 配置复杂度 | 低（一条命令） | 中（环境变量 + opencode.json） | 中（环境变量 + opencode.json） |

**选择建议**：新手先走路线 A 跑通链路，确认 OpenCode 能用后，再按需求切到 B 或 C。长期使用推荐路线 C，统一入口、按任务切模型。

---

## 2. 路线 A：免费模型接入（OAuth 授权）

OAuth 是 OpenCode 最快的接入方式：不用写配置文件，不用管 API Key，一条命令完成授权。

### 2.1 支持的 OAuth 提供商

OpenCode 内置支持以下 OAuth 登录：

| 提供商 | 命令 | 说明 |
|--------|------|------|
| OpenAI（Codex） | `opencode auth login` | 选择 OpenAI 进行 OAuth 授权 |
| Google | `opencode auth login` | 选择 Google 进行 OAuth 授权 |
| Anthropic | `opencode auth login` | 选择 Anthropic 进行 OAuth 授权（可用性取决于政策） |

### 2.2 操作步骤

1. 在终端执行：

```bash
opencode auth login
```

2. 选择你要授权的提供商（如 OpenAI）。
3. 浏览器会自动打开授权页面，登录并同意授权。
4. 回到终端，看到授权成功的提示即可。

授权完成后，凭据会保存在：

```text
~/.local/share/opencode/auth.json
```

### 2.3 验证

```bash
opencode auth list
```

能看到对应提供商的凭据状态，说明授权成功。

### 2.4 注意事项

- OAuth 授权获得的模型访问受限于提供商的免费配额策略，可能有调用次数或速率限制。
- 从 2026 年 1 月起，第三方 Claude OAuth 存在条款风险。如果你在生产环境使用，建议优先走 API Key 或合规代理（路线 B / C）。
- 如果浏览器无法自动打开，手动复制终端中输出的 URL 到浏览器完成授权。

---

## 3. 路线 B：API Key 直连

如果你只用一家厂商的模型，API Key 直连是最稳定的方案。

### 3.1 各厂商 Key 获取方式

| 厂商 | 获取地址 | 环境变量名（建议） |
|------|----------|---------------------|
| OpenAI | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | `OPENAI_API_KEY` |
| Anthropic | [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) | `ANTHROPIC_API_KEY` |
| Google (Gemini) | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | `GOOGLE_GENERATIVE_AI_API_KEY` |

### 3.2 配置方式

以 Anthropic 为例，两步完成：

第 1 步：设置环境变量（写入你的 shell 配置文件）

```bash
export ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxx"
```

第 2 步：在 `opencode.json` 中使用内置 provider

OpenCode 内置了主流厂商的 provider，只要环境变量名正确，无需额外配置即可使用。如果你需要自定义 provider（例如自定义 baseURL），请参考下一章。

### 3.3 使用 `/connect` 命令添加凭据

除了环境变量，OpenCode 还支持通过交互式命令添加凭据：

```text
/connect
```

按提示输入 provider 和 API Key，凭据同样保存在 `~/.local/share/opencode/auth.json`。

---

## 4. 路线 C：中转站接入

### 4.1 什么是中转站

中转站（Relay Gateway）是一个 API 代理服务，把多家模型厂商的接口统一成一套 OpenAI 兼容的 API。

核心价值：

- 一个 `baseURL` + 一个 `apiKey` 就能调用多家模型
- 不需要分别注册每家厂商的账号
- 同一个 OpenCode 会话内可以快速切换不同厂商的模型

### 4.2 注册流程（以 UniAPI 为例）

1. 打开注册页面，完成注册并登录控制台。
2. 进入「令牌管理」，点击「新增」创建 API Key（只展示一次，立即复制保存）。
3. 在控制台文档页确认 `baseURL`。
4. 在「可用模型」列表确认你账号支持的模型 ID。

到这一步，你手上应该有三样东西：

- `apiKey`
- `baseURL`
- 可用的模型 ID 列表

### 4.3 配置 opencode.json

配置文件位置：`~/.config/opencode/opencode.json`

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "uniapi": {
      "npm": "@ai-sdk/openai",
      "name": "UniAPI Gateway",
      "options": {
        "baseURL": "https://api.uniapi.io/v1",
        "apiKey": "{env:UNIAPI_API_KEY}"
      },
      "models": {
        "claude-opus-4-6": {
          "name": "Claude Opus 4.6"
        },
        "gpt-5.2": {
          "name": "GPT-5.2"
        },
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro"
        }
      }
    }
  },
  "model": "uniapi/gpt-5.2"
}
```

关键点说明：

- `npm`：中转站一般兼容 OpenAI 接口，使用 `@ai-sdk/openai` 或 `@ai-sdk/openai-compatible`。
- `options.baseURL`：填中转站控制台给出的接口地址。
- `options.apiKey`：建议用 `{env:UNIAPI_API_KEY}` 引用环境变量，不要明文写入配置文件。
- `models`：显式列出你要用的模型，模型 ID 必须与中转站控制台一致。
- `model`：设置默认模型，格式为 `provider_id/model_id`。

对应的环境变量：

```bash
export UNIAPI_API_KEY="your_real_api_key"
```

### 4.4 中转站的优势

与逐个配置厂商 API Key 相比：

| 维度 | 逐个厂商 | 中转站 |
|------|----------|--------|
| Key 管理 | 每家一个 Key | 只需一个 Key |
| baseURL | 每家不同 | 统一一个 |
| 模型切换 | 改配置 + 换 Key | 只换模型 ID |
| 排错路径 | 逐个排查 | 统一入口，排错更快 |

---

## 5. 接入后验证

无论你走哪条路线，接入后都要做两步验证。

### 5.1 第 1 步：检查模型列表

启动 OpenCode 后执行：

```text
/models
```

你应该看到你配置的模型出现在列表中。如果用的是 OAuth，会看到对应提供商的默认模型；如果用的是自定义 provider，会看到 `provider_id/model_id` 格式的模型名。

### 5.2 第 2 步：做一次问答

随便提一个问题，确认模型能正常响应：

```text
用一句话解释什么是 OpenCode。
```

如果返回了正常回答，说明链路完全打通。

### 5.3 第 3 步（可选）：检查凭据状态

```bash
opencode auth list
```

可以看到当前已配置的所有凭据及其状态。

---

## 6. 常见问题

### 6.1 401 Unauthorized

**原因**：API Key 无效、过期或未生效。

排查顺序：

1. 确认 Key 是否复制完整（不要有多余空格）。
2. 确认 Key 在厂商/中转站控制台仍处于启用状态。
3. 如果用环境变量，确认变量名拼写一致，且当前 shell 已 `source` 过配置文件。

### 6.2 /models 列表为空或看不到自定义模型

**原因**：provider 配置有误。

排查顺序：

1. 检查 `opencode.json` 的 JSON 语法是否正确（多余逗号、缺少引号等）。
2. 确认 `provider` 中的 key（如 `uniapi`）与 `models` 中的模型 ID 对应。
3. 确认 `npm` 包名称正确（OpenAI 兼容用 `@ai-sdk/openai-compatible` 或 `@ai-sdk/openai`）。
4. 重启 OpenCode 会话使配置生效。

### 6.3 404 Model Not Found

**原因**：模型 ID 与厂商/中转站实际 ID 不一致。

关键原则：**模型 ID 以控制台真实 ID 为准，不要凭印象手写。**

例如你写了 `gemini-3-pro`，但控制台实际 ID 是 `gemini-3-pro-preview`，就会 404。

### 6.4 默认模型不生效

**原因**：`model` 字段的格式不正确。

必须写成 `provider_id/model_id` 的完整格式：

```json
{
  "model": "uniapi/gpt-5.2"
}
```

而不是只写模型名 `gpt-5.2`。

### 6.5 调用超时

可能原因：

- 网络波动或厂商 API 拥塞。
- 中转站网关负载过高。

先重试一次，如果持续超时，切换到另一个模型验证是否是特定模型的问题。

### 6.6 配置改了不生效

检查要点：

1. JSON 语法是否正确（用编辑器的 JSON 校验功能确认）。
2. 是否保存了文件。
3. 退出并重新启动 OpenCode 会话。

---

## 下一步

模型接入完成后，你可能想更精细地控制 Provider 配置——比如设置模型的上下文上限、输入输出模态、推理变体等。

下一章 [Provider 配置：ai-sdk 自定义 + 模型清单 + 变体](/opencode/03-provider/) 会带你深入 `opencode.json` 的完整配置结构。
