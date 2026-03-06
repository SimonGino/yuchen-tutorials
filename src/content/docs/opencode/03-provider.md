---
title: Provider 配置：ai-sdk 自定义 + 模型清单 + 变体
description: 深入 opencode.json 配置，掌握自定义 Provider 和模型管理
sidebar:
  order: 3
---

## 本节目标

读完本节，你应该拿到以下结果：

- 理解 opencode.json 的三层配置结构（provider 层 → models 层 → agent 映射层）
- 能为任意 OpenAI 兼容接口配置自定义 Provider
- 掌握 models 的完整字段（limit、modalities、variants）
- 能把模型映射到默认 agent 和 OMO agents
- 拿到一份可直接复用的完整配置模板

---

## 1. 为什么需要自定义 Provider

OpenCode 内置了 Anthropic、OpenAI、Google 等主流 provider。用 OAuth 或环境变量就能直接调用。

但以下场景，你需要自定义 Provider：

| 场景 | 原因 |
|------|------|
| 使用中转站（Relay Gateway） | 需要自定义 baseURL 指向中转站 |
| 使用国内模型厂商（讯飞、MiniMax 等） | 内置 provider 不包含这些厂商 |
| 需要通过代理访问 API | 需要自定义 baseURL 指向代理地址 |
| 需要精细控制模型参数 | 需要配置 limit、modalities、variants |
| 同一厂商配多个不同 Key | 需要区分 provider 实例 |

一句话总结：OpenCode 接三方模型的核心不是"模型名"，而是 **Provider 配置正确**。你只要把 4 个点对上，就能稳定调用：

1. provider id（如 `my-claude`）
2. npm 适配器（如 `@ai-sdk/anthropic`）
3. `baseURL`
4. `provider_id/model_id` 格式的完整模型 ID

---

## 2. opencode.json 配置结构解析

配置文件位置：`~/.config/opencode/opencode.json`

整个配置分为三层：

```text
opencode.json
├── provider 层      → 定义接入点（npm + baseURL + apiKey）
│   └── models 层    → 声明该 provider 下可用的模型及其参数
├── model 层         → 指定默认使用的模型（provider_id/model_id）
└── agent 映射层     → 把模型分配给不同 agent（结合 OMO 使用）
```

下面逐层讲解。

---

## 3. 第 1 步：配置 Provider

### 3.1 核心字段

```jsonc
{
  "provider": {
    "my-claude": {                              // provider id，自定义名称
      "npm": "@ai-sdk/anthropic",              // ai-sdk 适配器包名
      "name": "My Claude Proxy",               // 显示名称（可选）
      "options": {
        "baseURL": "https://your-proxy.com/v1", // API 接口地址
        "apiKey": "{env:MY_CLAUDE_API_KEY}"     // 引用环境变量
      },
      "models": {}                              // 下一步配置
    }
  }
}
```

### 3.2 npm 适配器选择

根据你的接口类型选择对应的 npm 包：

| 接口类型 | npm 包 | 适用场景 |
|----------|--------|----------|
| Anthropic 原生 | `@ai-sdk/anthropic` | Anthropic 官方 API 或兼容代理 |
| Google 原生 | `@ai-sdk/google` | Google AI Studio / Vertex AI |
| OpenAI 原生 | `@ai-sdk/openai` | OpenAI 官方 API 或兼容网关 |
| OpenAI 兼容 | `@ai-sdk/openai-compatible` | 任何兼容 OpenAI 接口的第三方平台 |

大多数中转站和国内厂商都兼容 OpenAI 接口，使用 `@ai-sdk/openai` 或 `@ai-sdk/openai-compatible` 即可。

### 3.3 apiKey 安全实践

不要在配置文件中明文写入密钥。推荐使用环境变量引用：

```jsonc
{
  "apiKey": "{env:MY_CLAUDE_API_KEY}"
}
```

对应在 shell 配置文件（如 `~/.zshrc`）中设置：

```bash
export MY_CLAUDE_API_KEY="sk-ant-xxxxxxxxxxxx"
```

### 3.4 多 Provider 示例

你可以同时配置多个 provider，每个 provider 独立管理自己的接口和模型：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "my-claude": {
      "npm": "@ai-sdk/anthropic",
      "options": {
        "baseURL": "https://your-proxy.com/v1",
        "apiKey": "{env:MY_CLAUDE_API_KEY}"
      },
      "models": {}
    },
    "my-gemini": {
      "npm": "@ai-sdk/google",
      "options": {
        "baseURL": "https://your-proxy.com/v1beta",
        "apiKey": "{env:MY_GEMINI_API_KEY}"
      },
      "models": {}
    },
    "my-openai": {
      "npm": "@ai-sdk/openai",
      "options": {
        "baseURL": "https://your-proxy.com/v1",
        "apiKey": "{env:MY_OPENAI_API_KEY}"
      },
      "models": {}
    }
  }
}
```

---

## 4. 第 2 步：配置模型清单

Provider 打通后，在 `models` 中声明该 provider 下可用的模型。

### 4.1 最小配置

只写模型 ID 和显示名称就能用：

```jsonc
{
  "models": {
    "claude-sonnet-4-5": {
      "name": "Claude Sonnet 4.5"
    }
  }
}
```

### 4.2 完整字段说明

```jsonc
{
  "models": {
    "claude-opus-4-6": {
      "name": "Claude Opus 4.6",               // 显示名称
      "limit": {
        "context": 200000,                      // 上下文 token 上限
        "output": 128000                        // 单次最大输出 token
      },
      "modalities": {
        "input": ["text", "image", "pdf"],      // 模型可接收的输入类型
        "output": ["text"]                      // 模型可输出的类型
      },
      "variants": {}                            // 推理变体（见下文）
    }
  }
}
```

各字段的作用：

| 字段 | 说明 | 不填会怎样 |
|------|------|-----------|
| `name` | 模型在 `/models` 列表中的显示名称 | 显示原始 ID |
| `limit.context` | 上下文 token 上限，决定单次可带多少历史/文档内容 | 使用默认值 |
| `limit.output` | 单次最大输出 token，决定回答最长能写多长 | 使用默认值 |
| `modalities.input` | 模型可接收的输入类型；包含 `image`/`pdf` 才能做识图和 PDF 理解 | 默认仅 text |
| `modalities.output` | 模型可输出的类型，当前大多数是 `text` | 默认 text |
| `variants` | 同一模型的推理档位配置 | 无推理变体可选 |

建议即使某些网关不强校验这些字段，也把它们写上。团队协作和后续排错会清晰很多。

### 4.3 variants（推理变体）

variants 不是新模型，而是同一模型的不同推理档位。适用于支持 reasoning 参数的模型（如 GPT-5.2 Codex 系列）。

```jsonc
{
  "models": {
    "gpt-5.2": {
      "name": "GPT-5.2",
      "limit": { "context": 400000, "output": 128000 },
      "modalities": {
        "input": ["text", "image", "pdf"],
        "output": ["text"]
      },
      "variants": {
        "none": {
          "reasoningEffort": "none",
          "reasoningSummary": "auto",
          "textVerbosity": "medium"
        },
        "low": {
          "reasoningEffort": "low",
          "reasoningSummary": "auto",
          "textVerbosity": "medium"
        },
        "medium": {
          "reasoningEffort": "medium",
          "reasoningSummary": "auto",
          "textVerbosity": "medium"
        },
        "high": {
          "reasoningEffort": "high",
          "reasoningSummary": "detailed",
          "textVerbosity": "medium"
        },
        "xhigh": {
          "reasoningEffort": "xhigh",
          "reasoningSummary": "detailed",
          "textVerbosity": "medium"
        }
      }
    }
  }
}
```

各变体参数说明：

| 参数 | 说明 | 常用值 |
|------|------|--------|
| `reasoningEffort` | 推理深度档位 | `none` / `low` / `medium` / `high` / `xhigh` |
| `reasoningSummary` | 推理摘要强度 | `auto`（日常使用）/ `detailed`（复杂排错） |
| `textVerbosity` | 回答详略程度 | `medium`（推荐默认值） |

---

## 5. 第 3 步：模型映射到 Agent

### 5.1 设置默认模型

在 `opencode.json` 根级设置默认使用的主模型和轻量模型：

```jsonc
{
  "model": "my-claude/claude-opus-4-6",
  "small_model": "my-gemini/gemini-3-flash"
}
```

注意格式必须是 `provider_id/model_id`，不能只写模型名。

### 5.2 映射到 OMO Agents

如果你使用了 Oh My OpenCode 插件，可以在 `oh-my-opencode.json` 中把不同模型分配给不同 agent：

文件位置：`~/.config/opencode/oh-my-opencode.json`

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "agents": {
    "Sisyphus": {
      "model": "my-claude/claude-opus-4-6"
    },
    "oracle": {
      "model": "my-openai/gpt-5.2"
    },
    "librarian": {
      "model": "my-openai/gpt-5.2"
    },
    "explore": {
      "model": "my-gemini/gemini-3-flash"
    },
    "document-writer": {
      "model": "my-gemini/gemini-3-flash"
    }
  }
}
```

映射的顺序和依赖关系：

1. 先在 `opencode.json` 中配好 provider + models（确保模型可用）
2. 再在 `oh-my-opencode.json` 中引用 `provider_id/model_id`

顺序反了会导致 agent 可选但模型不可用。

---

## 6. 验证链路

配置完成后，按以下顺序验证：

### 6.1 检查模型列表

```text
/models
```

你应该看到所有自定义 provider 下的模型，格式为 `provider_id/model_id`，例如：

- `my-claude/claude-opus-4-6`
- `my-openai/gpt-5.2`
- `my-gemini/gemini-3-flash`

如果列表为空或缺少模型，回到第 3 步检查 provider 配置。

### 6.2 做一次问答验证

切换到目标模型后，执行一次简单提问：

```text
告诉我当前使用的模型名称。
```

正常返回即验证通过。

### 6.3 检查 Agent 映射（使用 OMO 时）

```text
/agents
```

确认每个 agent 关联的模型与你的配置一致。

---

## 7. 安全提醒：第三方 OAuth 合规风险

两个边界需要提前知道：

1. **ohmyopencode.com 不是官方站点**。OMO 只认 GitHub Releases：`https://github.com/code-yeongyu/oh-my-opencode/releases`。
2. **从 2026 年 1 月起，第三方 Claude OAuth 存在条款风险**。Anthropic 已限制第三方通过 OAuth 使用 Claude Code 订阅。如果你在生产环境使用，优先选择 API Key 直连或合规的中转站方案。

---

## 8. 可复用配置模板

以下是一份完整的 `opencode.json` 模板，覆盖三家厂商的代理接入。按你的实际情况替换 `baseURL` 和模型 ID 即可。

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "disabled_providers": ["opencode"],
  "provider": {
    "my-claude": {
      "npm": "@ai-sdk/anthropic",
      "name": "My Claude Proxy",
      "options": {
        "baseURL": "https://your-proxy.com/v1",
        "apiKey": "{env:MY_CLAUDE_API_KEY}"
      },
      "models": {
        "claude-opus-4-6": {
          "name": "Claude Opus 4.6",
          "limit": { "context": 200000, "output": 128000 },
          "modalities": {
            "input": ["text", "image", "pdf"],
            "output": ["text"]
          }
        },
        "claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": {
            "input": ["text", "image", "pdf"],
            "output": ["text"]
          }
        }
      }
    },
    "my-gemini": {
      "npm": "@ai-sdk/google",
      "name": "My Gemini Proxy",
      "options": {
        "baseURL": "https://your-proxy.com/v1beta",
        "apiKey": "{env:MY_GEMINI_API_KEY}"
      },
      "models": {
        "gemini-3-pro-high": {
          "name": "Gemini 3 Pro High",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": {
            "input": ["text", "image", "pdf", "video", "audio"],
            "output": ["text"]
          }
        },
        "gemini-3-flash": {
          "name": "Gemini 3 Flash",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": {
            "input": ["text", "image", "pdf", "video", "audio"],
            "output": ["text"]
          }
        }
      }
    },
    "my-openai": {
      "npm": "@ai-sdk/openai",
      "name": "My OpenAI Proxy",
      "options": {
        "baseURL": "https://your-proxy.com/v1",
        "apiKey": "{env:MY_OPENAI_API_KEY}"
      },
      "models": {
        "gpt-5.2": {
          "name": "GPT-5.2",
          "limit": { "context": 400000, "output": 128000 },
          "modalities": {
            "input": ["text", "image", "pdf"],
            "output": ["text"]
          },
          "variants": {
            "none": {
              "reasoningEffort": "none",
              "reasoningSummary": "auto",
              "textVerbosity": "medium"
            },
            "low": {
              "reasoningEffort": "low",
              "reasoningSummary": "auto",
              "textVerbosity": "medium"
            },
            "medium": {
              "reasoningEffort": "medium",
              "reasoningSummary": "auto",
              "textVerbosity": "medium"
            },
            "high": {
              "reasoningEffort": "high",
              "reasoningSummary": "detailed",
              "textVerbosity": "medium"
            },
            "xhigh": {
              "reasoningEffort": "xhigh",
              "reasoningSummary": "detailed",
              "textVerbosity": "medium"
            }
          }
        }
      }
    }
  },
  "model": "my-claude/claude-opus-4-6",
  "small_model": "my-gemini/gemini-3-flash"
}
```

对应的环境变量：

```bash
export MY_CLAUDE_API_KEY="sk-ant-xxxxxxxxxxxx"
export MY_GEMINI_API_KEY="sk-xxxxxxxxxxxx"
export MY_OPENAI_API_KEY="sk-xxxxxxxxxxxx"
```

如果你只使用中转站（单一网关统一接入），配置可以更简单：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "gateway": {
      "npm": "@ai-sdk/openai",
      "name": "My Gateway",
      "options": {
        "baseURL": "https://api.your-gateway.com/v1",
        "apiKey": "{env:GATEWAY_API_KEY}"
      },
      "models": {
        "claude-opus-4-6": { "name": "Claude Opus 4.6" },
        "gpt-5.2": { "name": "GPT-5.2" },
        "gemini-3-pro-preview": { "name": "Gemini 3 Pro" }
      }
    }
  },
  "model": "gateway/claude-opus-4-6"
}
```

---

## 下一步

Provider 和模型清单配好之后，下一步是用 Oh My OpenCode 把多个模型组织成 Agent 团队，实现按任务自动分工。

下一章 [Oh My OpenCode：从单兵模型到 Agent 团队协作](/opencode/04-omo/) 会带你完成插件安装和 Agent 编排。
