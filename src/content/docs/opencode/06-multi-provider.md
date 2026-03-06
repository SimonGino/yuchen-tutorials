---
title: 多供应商协同：cc-switch + 模型分工 + 成本优化
description: 用 cc-switch 管理多供应商模型池，实现按任务分工和成本控制
sidebar:
  order: 6
---

## 本节目标

读完本节，你应该拿到以下结果：

- 理解为什么需要多供应商，以及单一供应商的三大风险
- 理解两层架构：cc-switch（资源池管理）和 OMO（任务编排）各自的职责
- 完成 cc-switch 的安装与基础配置
- 能配置 Anthropic + OpenAI + Google 三家供应商并存的模型池
- 掌握按任务类型分配模型的分工策略
- 知道如何用便宜模型跑后台任务、按需切换高性能模型来控制成本
- 能执行供应商的切换与回滚操作

---

## 1. 为什么需要多供应商

如果你只接了一家模型供应商，短期能用，但长期一定会遇到这三个问题：

| 风险 | 典型表现 | 影响 |
|------|---------|------|
| **限流** | 高峰时段请求被 429 拒绝，任务中断 | 工作流卡住，等待时间不可控 |
| **宕机** | 供应商服务不可用，整个工具链瘫痪 | 无法切换到其他模型继续工作 |
| **成本不可控** | 所有任务都用同一个高价模型 | 简单任务浪费预算，月底账单超预期 |

多供应商的核心价值不是"用更多模型"，而是：

- **可用性**：一家挂了，另一家顶上
- **成本分层**：贵模型只用在关键路径，便宜模型处理日常杂活
- **能力互补**：不同模型在不同任务上表现不同，按需选用

一句话总结：**多供应商是从"能用"到"稳定可用"的必经之路。**

---

## 2. 两层架构：cc-switch vs OMO 的分工

很多人分不清 cc-switch 和 OMO 各自干什么。记住这个分工：

| 层级 | 工具 | 职责 | 管什么 |
|------|------|------|--------|
| **资源池层** | cc-switch | 管理模型来源 | 供应商增删、baseURL、apiKey、模型列表 |
| **任务编排层** | Oh My OpenCode (OMO) | 管理任务分配 | Agent 角色映射、MCP 接入、工作流编排 |

cc-switch 负责回答"有哪些模型可以用"，OMO 负责回答"哪个任务交给哪个模型"。

两者配合形成两个闭环：

1. **模型闭环**：cc-switch 配置供应商 -> `/models` 验证可用 -> OMO 映射到 Agent -> smoke 测试通过
2. **任务闭环**：Prometheus 规划任务 -> `/start-work` 执行 -> Agent 协作完成 -> 验证交付

只要按这两个闭环走，你的模型再多也不会乱。

常见误区：**不要把 OMO 当成模型管理器。** OMO 真正解决的是多 Agent 协作、长任务推进和外部知识接入。模型的增删和维护是 cc-switch 的事。

---

## 3. cc-switch 安装与配置

cc-switch 是一个本地运行的供应商管理工具，提供可视化界面来管理你的模型资源池。

### 3.1 安装

cc-switch 的安装地址可在 OpenCode 知识库中获取。安装完成后，你会得到一个本地管理界面，包含以下核心功能：

- 供应商列表页：查看所有已配置的供应商
- 新增/编辑/移除供应商入口
- JSON 编辑器：直接编辑供应商的完整配置

### 3.2 基础操作流程

建议固定为 4 步：

1. 在 cc-switch 界面点击 `+` 新增供应商
2. 填写 provider JSON（包含 `models`、`baseURL`、`apiKey` 等字段）
3. 保存后回到列表，可继续编辑或移除
4. 回到 OpenCode 执行 `/models`，确认模型已生效

### 3.3 配置文件位置

cc-switch 的供应商配置最终会写入 OpenCode 的配置体系：

- 全局配置：`~/.config/opencode/opencode.json`
- 项目级配置：`./opencode.json`（优先级更高）

注意：cc-switch 管理的是 `opencode.json` 中 `provider` 字段下的内容，不要和 `oh-my-opencode.json` 混淆。

---

## 4. 多供应商配置实战：三家并存

下面演示 Anthropic + OpenAI + Google 三家供应商并存的配置。你需要为每家准备好 `baseURL` 和 `apiKey`。

### 4.1 环境变量准备

先把密钥放到环境变量，避免明文入仓库：

```bash
export MY_CLAUDE_API_KEY="sk-xxxx"
export MY_OPENAI_API_KEY="sk-xxxx"
export MY_GEMINI_API_KEY="sk-xxxx"
```

### 4.2 完整的 opencode.json 配置

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["oh-my-opencode"],
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

    "my-openai": {
      "npm": "@ai-sdk/openai",
      "name": "My OpenAI Proxy",
      "options": {
        "baseURL": "https://your-proxy.com/v1",
        "apiKey": "{env:MY_OPENAI_API_KEY}",
        "reasoningEffort": "medium",
        "reasoningSummary": "auto",
        "textVerbosity": "medium"
      },
      "models": {
        "gpt-5.2-codex": {
          "name": "GPT 5.2 Codex",
          "limit": { "context": 272000, "output": 128000 },
          "modalities": {
            "input": ["text", "image"],
            "output": ["text"]
          },
          "variants": {
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
    },

    "my-gemini": {
      "npm": "@ai-sdk/google",
      "name": "My Gemini Proxy",
      "options": {
        "baseURL": "https://your-proxy.com/v1beta",
        "apiKey": "{env:MY_GEMINI_API_KEY}"
      },
      "models": {
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": {
            "input": ["text", "image", "pdf"],
            "output": ["text"]
          }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": {
            "input": ["text", "image", "pdf"],
            "output": ["text"]
          }
        }
      }
    }
  },

  "model": "my-claude/claude-opus-4-6",
  "small_model": "my-gemini/gemini-3-flash-preview"
}
```

### 4.3 关键字段说明

| 字段 | 含义 | 注意事项 |
|------|------|---------|
| `npm` | 适配器包名，决定用哪个 SDK 驱动 API | Anthropic 用 `@ai-sdk/anthropic`，OpenAI 用 `@ai-sdk/openai`，Google 用 `@ai-sdk/google` |
| `baseURL` | 接口地址 | 必须和你的中转站或官方 API 地址完全一致 |
| `apiKey` | 认证密钥 | 建议用 `{env:XXX}` 引用环境变量 |
| `limit.context` | 上下文上限 | 决定单次可带多少历史和文档内容 |
| `limit.output` | 最大输出长度 | 决定回答最多能写多长 |
| `modalities` | 输入/输出类型支持 | 包含 `image`/`pdf` 才能做识图和 PDF 理解 |
| `variants` | 同一模型的推理档位 | 不是不同模型，而是 `reasoningEffort` 等参数的组合 |

### 4.4 验证配置

保存后启动 OpenCode，执行：

```text
/models
```

你应该能看到 `my-claude/*`、`my-openai/*`、`my-gemini/*` 三组模型。如果某一组没出现，先检查对应 provider 的 `baseURL` 和 `apiKey` 是否正确。

---

## 5. 模型分工策略

配好多供应商后，关键问题是：哪个任务用哪个模型？

### 5.1 推荐的分工表

| 任务类型 | 推荐模型 | 理由 |
|---------|---------|------|
| 主控编排 / 复杂规划 | `my-claude/claude-opus-4-6` | 多文件改造、架构重构、长链路任务推进能力强 |
| 疑难攻坚 / 深度推理 | `my-openai/gpt-5.2-codex`（high variant） | 边界条件推理、复杂修复方案对比能力突出 |
| 前端视觉 / UI 设计 | `my-gemini/gemini-3-pro-preview` | 视觉理解和 UI 方案输出质量高 |
| 快速探索 / 代码扫描 | `my-gemini/gemini-3-flash-preview` | 速度快、成本低，适合非关键路径 |
| 文档整合 / 资料总结 | `my-gemini/gemini-3-flash-preview` | 大上下文窗口，适合处理大量文本 |
| Code Review / 架构审查 | `my-openai/gpt-5.2-codex`（medium variant） | 平衡速度与深度 |

### 5.2 在 OMO 中落地分工

将分工策略写入 `~/.config/opencode/oh-my-opencode.json`：

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "agents": {
    "Sisyphus": {
      "model": "my-claude/claude-opus-4-6"
    },
    "prometheus": {
      "model": "my-claude/claude-opus-4-6"
    },
    "oracle": {
      "model": "my-openai/gpt-5.2-codex",
      "variant": "high"
    },
    "librarian": {
      "model": "my-openai/gpt-5.2-codex",
      "variant": "medium"
    },
    "explore": {
      "model": "my-gemini/gemini-3-flash-preview"
    },
    "frontend-ui-ux-engineer": {
      "model": "my-gemini/gemini-3-pro-preview"
    },
    "document-writer": {
      "model": "my-gemini/gemini-3-flash-preview"
    },
    "multimodal-looker": {
      "model": "my-gemini/gemini-3-flash-preview"
    }
  },
  "categories": {
    "quick": {
      "model": "my-openai/gpt-5.2-codex",
      "variant": "medium"
    },
    "visual-engineering": {
      "model": "my-gemini/gemini-3-pro-preview"
    }
  }
}
```

这份配置的读法：

- `Sisyphus` / `prometheus`：主控角色，给最稳定的高性能模型
- `oracle`：攻坚角色，用高推理档位
- `frontend-ui-ux-engineer`：前端角色，单独给 Gemini Pro 保证 UI 质量
- `explore` / `document-writer` / `multimodal-looker`：辅助角色，用 Gemini Flash 控制成本
- `quick` 分类用 `medium` 档，减少无谓高推理消耗

关键守则：**`provider_id/model_id` 必须和 `opencode.json` 中 cc-switch 配置的实际 provider id 和 model id 完全一致。** 比如你 provider 叫 `my-openai`，模型叫 `gpt-5.2-codex`，那 OMO 里就必须写 `my-openai/gpt-5.2-codex`。

---

## 6. 成本优化建议

多供应商的核心成本策略是：**把贵模型用在关键路径，便宜模型用在可并行环节。**

### 6.1 三档成本模型

| 档位 | 代表模型 | 适用场景 | 成本等级 |
|------|---------|---------|---------|
| 高性能档 | Claude Opus 4.6、GPT-5.2 Codex (xhigh) | 主控决策、架构重构、疑难攻坚 | 高 |
| 平衡档 | GPT-5.2 Codex (medium)、Gemini 3 Pro | 日常编码、Code Review、前端开发 | 中 |
| 经济档 | Gemini 3 Flash、GPT-5.2 Codex (low) | 代码扫描、文档生成、快速探索 | 低 |

### 6.2 实操建议

1. **后台任务统一用经济档**：`explore`、`document-writer`、`multimodal-looker` 这类辅助 Agent 用 Gemini Flash 就够了，不需要高推理模型
2. **按需升档，不默认拉满**：`variants` 日常用 `medium`，只在遇到复杂问题时临时切到 `high` 或 `xhigh`
3. **利用 `small_model` 字段**：OpenCode 配置中的 `small_model` 用于标题生成等轻量任务，设成最便宜的模型
4. **定期审查用量**：看看哪些 Agent 消耗最多 token，考虑是否可以用更轻的模型替代
5. **善用 `quick` 分类**：OMO 中的 `quick` 分类专门处理简单任务，设 `medium` 档位即可

### 6.3 渐进式升级路径

不建议一上来就配满三家供应商的所有模型。推荐路径：

1. **起步**：先用一家供应商跑通（比如只配 OpenAI），所有 Agent 用同一个模型
2. **分层**：加入第二家供应商（比如 Gemini），把辅助 Agent 切过去降成本
3. **优化**：按实际任务表现微调分工，替换主控和攻坚角色的模型

每次只改一个变量，观察 3-5 次任务的速度、质量和成本再决定是否继续调整。

---

## 7. 切换与回滚操作

### 7.1 在 cc-switch 中切换供应商

在 cc-switch 界面中：

1. 点击目标供应商的编辑按钮
2. 修改 `baseURL`、`apiKey` 或 `models` 字段
3. 保存配置

### 7.2 在 OpenCode 中验证切换

每次切换后，固定做两步回归：

1. **检查模型列表**：在 OpenCode 中执行 `/models`，确认新模型出现、旧模型正确移除
2. **跑 smoke 测试**：执行一次固定的小任务（例如"读代码 + 小改动 + 测试"），确认模型真的能干活

### 7.3 回滚策略

如果切换后发现问题，按以下顺序回滚：

1. **配置回滚**：在 cc-switch 中恢复上一版 provider JSON。如果你用 Git 管理配置文件，直接 `git checkout` 即可
2. **验证回滚**：再次执行 `/models` + smoke 测试，确认恢复正常
3. **记录问题**：把导致切换失败的原因记下来（baseURL 变了？模型 ID 改了？额度用完了？），避免下次踩同一个坑

建议：在切换供应商之前，先备份当前的 `opencode.json`，或者把配置文件纳入版本控制。

### 7.4 在 OpenCode 会话中临时切换模型

如果只是想在当前会话中临时换一个模型试试，不需要改配置文件：

```text
/models
```

在弹出的模型列表中直接选择目标模型即可。这个切换只影响当前会话，不会修改配置文件。

---

## 下一步

模型池和分工策略配好了，日常使用中难免遇到各种问题。下一章是排错手册，按症状索引帮你快速定位。

[第 07 章：排错手册 -- 按症状索引，快速收敛问题](/opencode/07-troubleshooting/)
