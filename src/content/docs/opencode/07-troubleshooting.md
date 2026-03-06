---
title: 排错手册：按症状索引，快速收敛问题
description: 常见问题按症状分类，10 分钟内定位和解决
sidebar:
  order: 7
---

## 本节目标

遇到问题时，按症状找到对应段落，快速定位原因并修复。不需要通读全文，直接跳到你遇到的症状分类即可。

---

## 1. 排查思路总览

不管遇到什么问题，先按这三步走：

| 步骤 | 做什么 | 怎么做 |
|------|--------|--------|
| **第一步：看日志** | 确认报错的具体信息 | 查看终端输出和日志文件（见本章第 7 节） |
| **第二步：查配置** | 对照配置文件逐项检查 | 重点看 `opencode.json` 和 `oh-my-opencode.json` |
| **第三步：搜社区** | 用报错关键词搜索 | GitHub Issues、Discord、搜索引擎 |

90% 的问题在前两步就能解决。如果你跳过前两步直接去社区提问，大概率会被要求"先贴日志和配置"。

---

## 2. 安装类问题

### 2.1 npm install 报错：权限不足

**症状**：执行 `npm install -g @anthropic-ai/opencode` 时报 `EACCES` 或 `permission denied`。

**原因**：全局 npm 目录没有写入权限。

**解决**：

```bash
# 方案一：用 sudo（快但不推荐长期使用）
sudo npm install -g @anthropic-ai/opencode

# 方案二：修改 npm 全局目录（推荐）
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
# 把下面这行加到 ~/.zshrc 或 ~/.bashrc
export PATH=~/.npm-global/bin:$PATH
source ~/.zshrc
npm install -g @anthropic-ai/opencode
```

### 2.2 安装后命令不识别

**症状**：安装完执行 `opencode` 提示 `command not found`。

**原因**：安装路径不在系统 PATH 中。

**解决**：

```bash
# 检查安装位置
which opencode
npm list -g @anthropic-ai/opencode

# 如果用 brew 安装
brew install sst/tap/opencode

# 重开终端再试
exec $SHELL
opencode --version
```

### 2.3 版本太低，功能不生效

**症状**：插件报错、配置项不识别、某些命令不存在。

**原因**：OpenCode 版本低于所需最低版本。OMO 等插件通常需要 1.0.150+。

**解决**：

```bash
# 检查当前版本
opencode --version

# 更新到最新版
curl -fsSL https://opencode.ai/install | bash

# 或用 npm 更新
npm update -g @anthropic-ai/opencode
```

### 2.4 bunx / npx 执行 OMO 安装报错

**症状**：执行 `bunx oh-my-opencode install` 时报 `Cannot find module` 或类似错误。

**原因**：Bun 的安装方式不正确（常见于 Ubuntu/Debian 的 Snap 安装）。

**解决**：

```bash
# 用官方脚本重装 Bun
curl -fsSL https://bun.sh/install | bash

# 或者换用 npx
npx oh-my-opencode install
```

---

## 3. 认证类问题

### 3.1 OAuth 登录后没反应

**症状**：浏览器完成 OAuth 登录后，OpenCode 终端无反应或提示认证失败。

**原因**：回调端口被占用，或浏览器没有正确重定向。

**解决**：

1. 关闭 OpenCode，确保端口释放
2. 重新执行 `opencode auth login`
3. 确保浏览器允许 localhost 重定向
4. 如果多次失败，尝试清除认证缓存：删除 `~/.config/opencode/auth.json` 后重试

### 3.2 API Key 无效（401 Unauthorized）

**症状**：调用模型时返回 `401 Unauthorized`。

**原因**：

- API Key 过期或被撤销
- Key 复制时多了空格或少了字符
- 使用了错误的 Key（比如用了 OpenAI 的 Key 去调 Anthropic 的 API）

**解决**：

1. 去对应供应商的控制台确认 Key 仍然有效
2. 重新复制 Key，注意不要多余空格
3. 确认 `apiKey` 和 `baseURL` 属于同一个供应商
4. 如果用环境变量，检查变量是否正确导出：`echo $MY_CLAUDE_API_KEY`

### 3.3 403 Forbidden

**症状**：调用返回 `403 Forbidden`。

**原因**：

- 账号没有该模型的使用权限
- API Key 的权限范围不包含目标模型
- 中转站限制了可用模型

**解决**：

1. 去供应商控制台确认你的账号/Key 对目标模型有权限
2. 如果用中转站，确认中转站支持你配置的模型 ID
3. 部分供应商需要单独开通某些模型的访问权限

---

## 4. 模型类问题

### 4.1 模型列表为空

**症状**：执行 `/models` 后看不到任何模型，或只看到默认的 `opencode` 模型。

**原因**：

- Provider 配置未生效
- JSON 语法错误导致配置文件解析失败
- `apiKey` 或 `baseURL` 配错了

**解决**：

```bash
# 检查配置文件语法
cat ~/.config/opencode/opencode.json | python3 -m json.tool

# 如果用 .jsonc 格式，确认后缀正确
ls -la ~/.config/opencode/opencode.*
```

逐项检查：

1. `provider` 字段下是否有你的供应商配置
2. 每个供应商的 `npm`、`baseURL`、`apiKey` 是否填写正确
3. `models` 字段下是否有至少一个模型定义
4. 没有多余的逗号或缺少引号

### 4.2 模型不可用（404 model not found）

**症状**：选择模型后调用报 `404` 或 `model not found`。

**原因**：模型 ID 和供应商实际支持的 ID 不一致。

**解决**：

**模型名以供应商控制台显示的真实 ID 为准，不要凭印象手写。** 比如你写了 `gemini-3-pro`，但控制台真实 ID 是 `gemini-3-pro-preview`，就会 404。

1. 去供应商控制台或中转站后台确认真实的模型 ID
2. 更新 `opencode.json` 中 `models` 里的 key 为真实 ID
3. 重启 OpenCode，再次 `/models` 验证

### 4.3 响应超时

**症状**：模型调用后长时间无响应，最终超时报错。

**原因**：

- 网络波动或网关拥塞
- 输入内容过长，模型处理时间超出默认超时
- 供应商服务端负载过高

**解决**：

1. 先重试一次，排除临时网络问题
2. 换一个模型试试，确认是特定模型的问题还是全局网络问题
3. 调整超时时间：

```json
{
  "provider": {
    "my-claude": {
      "options": {
        "timeout": 600000
      }
    }
  }
}
```

4. 如果经常超时，考虑切换中转站或使用更近的接入点

### 4.4 上下文长度超限（context length exceeded）

**症状**：报错 `context length exceeded` 或类似信息。

**原因**：输入内容（历史对话 + 文件内容 + 系统提示）超出了模型的 `limit.context`。

**解决**：

1. 执行 `/compact` 压缩上下文
2. 开启自动压缩：在 `opencode.json` 中设置 `"compaction": { "auto": true, "prune": true }`
3. 拆分任务，减少单次输入量
4. 切换到上下文窗口更大的模型（如 Gemini 系列支持 1M token）

---

## 5. Provider 类问题

### 5.1 baseURL 配错

**症状**：所有请求报网络错误或 404。

**原因**：`baseURL` 格式不对，常见错误包括多了斜杠、少了路径前缀、用了错误的协议。

**解决**：

常见的正确格式：

| 供应商类型 | baseURL 格式示例 |
|-----------|-----------------|
| OpenAI 兼容 | `https://api.example.com/v1` |
| Anthropic | `https://api.example.com/v1` |
| Google | `https://api.example.com/v1beta` |
| 中转站 | 以中转站文档为准 |

注意事项：

- 结尾不要多加 `/`
- 确认协议是 `https://` 而不是 `http://`（除非是本地服务）
- 中转站的 baseURL 以其文档为准，不要自己猜

### 5.2 npm 适配器包名错误

**症状**：启动 OpenCode 时报 `Cannot find module` 或供应商加载失败。

**原因**：`npm` 字段填错了适配器包名。

**解决**：

确认你用的适配器和供应商 API 类型匹配：

| API 类型 | 正确的 npm 值 |
|---------|--------------|
| Anthropic 原生 API | `@ai-sdk/anthropic` |
| OpenAI 兼容 API | `@ai-sdk/openai` |
| Google 原生 API | `@ai-sdk/google` |
| 通用 OpenAI 兼容 | `@ai-sdk/openai-compatible` |

大多数中转站使用 OpenAI 兼容接口，所以 `npm` 应该填 `@ai-sdk/openai`。

### 5.3 provider_id/model_id 格式不匹配

**症状**：`/models` 能看到模型，但在 OMO 中 Agent 报 model not found。

**原因**：`oh-my-opencode.json` 中的 `model` 字段和 `opencode.json` 中的 provider id + model id 不一致。

**解决**：

OMO 中的 model 格式必须是 `provider_id/model_id`，其中：

- `provider_id` = `opencode.json` 中 `provider` 对象的 key 名
- `model_id` = 该 provider 下 `models` 对象的 key 名

例如，如果你的 `opencode.json` 是这样：

```json
{
  "provider": {
    "my-claude": {
      "models": {
        "claude-opus-4-6": { ... }
      }
    }
  }
}
```

那 OMO 中必须写 `my-claude/claude-opus-4-6`，不能写 `anthropic/claude-opus-4-6` 或 `claude-opus-4-6`。

---

## 6. OMO 类问题

### 6.1 Agent 映射失败

**症状**：`/agents` 能看到 Agent 列表，但执行时报错或用了错误的模型。

**原因**：

- `oh-my-opencode.json` 中 agent 的 `model` 字段指向了不存在的模型
- 只配了 OMO，没配 provider

**解决**：

1. 先确认 provider 层是否配好：执行 `/models` 看模型是否可见
2. 对照检查 `oh-my-opencode.json` 中每个 agent 的 `model` 值是否在 `/models` 列表中
3. 确保先配 `opencode.json`（provider + models），再配 `oh-my-opencode.json`（agent 映射）

### 6.2 插件未加载

**症状**：OMO 的 Agent 和功能完全不可用，`/agents` 只有默认选项。

**原因**：`opencode.json` 中没有正确声明插件。

**解决**：

```bash
# 检查插件配置
cat ~/.config/opencode/opencode.json | grep -A5 '"plugin"'
```

确保 `plugin` 数组包含 `oh-my-opencode`：

```json
{
  "plugin": ["oh-my-opencode"]
}
```

如果你还用了 Antigravity 或 OpenAI Codex 认证插件，也要加进去：

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@1.2.8",
    "opencode-openai-codex-auth@4.3.0"
  ]
}
```

### 6.3 MCP 连接不上

**症状**：使用 Context7、Grep.app 等 MCP 时报连接失败或超时。

**原因**：

- MCP 服务端不可用
- 网络问题（尤其是国内环境）
- MCP 被禁用了

**解决**：

1. 检查是否被禁用：确认 `oh-my-opencode.json` 中 `disabled_mcps` 没有包含目标 MCP
2. 测试网络连通性：尝试用浏览器访问 MCP 对应的服务地址
3. 如果 MCP 持续不可用，可以在 `disabled_mcps` 中临时禁用，不影响主流程

```json
{
  "disabled_mcps": ["context7"]
}
```

---

## 7. 网络类问题

### 7.1 代理配置

**症状**：在需要代理的网络环境中，OpenCode 无法连接到供应商 API。

**解决**：

```bash
# 设置 HTTP 代理
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890

# 或者设置全局代理后再启动
export ALL_PROXY=socks5://127.0.0.1:7890
opencode
```

注意：代理设置需要在启动 OpenCode 之前生效。如果你把代理写在 `.zshrc` 或 `.bashrc` 中，重开终端即可。

### 7.2 DNS 解析失败

**症状**：报错 `ENOTFOUND` 或 `getaddrinfo failed`。

**解决**：

```bash
# 测试 DNS 解析
nslookup api.anthropic.com
nslookup api.openai.com

# 如果解析失败，尝试换 DNS
# macOS
sudo networksetup -setdnsservers Wi-Fi 8.8.8.8 1.1.1.1

# 或在 /etc/hosts 中手动指定（临时方案）
```

### 7.3 中转站连不上

**症状**：配置了中转站的 `baseURL`，但请求全部失败。

**排查顺序**：

1. **先用 curl 测试**：

```bash
curl -v https://your-gateway.example.com/v1/models \
  -H "Authorization: Bearer your-api-key"
```

2. **确认中转站状态**：登录中转站控制台，查看服务状态和余额
3. **确认 baseURL 正确**：对照中转站文档，注意路径（`/v1`、`/v1beta` 等）
4. **确认 apiKey 有效**：在中转站控制台重新生成 Key 测试

---

## 8. 其他常见问题

### 8.1 JSON 写了注释导致解析失败

**症状**：配置不生效，报 JSON 解析错误。

**解决**：JSON 格式不支持注释。两个选择：

- 把文件后缀改为 `.jsonc`（OpenCode 支持 JSONC 格式）
- 删除所有 `//` 和 `/* */` 注释，以及尾部逗号

### 8.2 大仓库卡顿、CPU 飙高

**症状**：OpenCode 启动慢，CPU 占用高。

**原因**：watcher 扫描了 `node_modules` 等大目录。

**解决**：

```json
{
  "watcher": {
    "ignore": [
      "node_modules/**",
      "dist/**",
      ".git/**",
      ".next/**",
      "build/**",
      "target/**",
      "*.log"
    ]
  }
}
```

### 8.3 Token 用完，对话中断

**症状**：对话到一半报错 token 超限。

**解决**：

1. 手动执行 `/compact` 压缩上下文
2. 开启自动压缩：`"compaction": { "auto": true, "prune": true }`
3. OMO 默认开启预防性压缩（85% 时自动压缩），确认没有禁用 `preemptive-compaction` hook

### 8.4 多模态任务模型回复"看不到图片"

**症状**：上传图片后模型回答"我看不到图片"。

**原因**：模型配置中 `modalities.input` 未包含 `image`，或者模型本身不支持多模态。

**解决**：

1. 确认模型配置的 `modalities.input` 包含 `image` 和/或 `pdf`
2. 切换到支持多模态的模型（如 Gemini 系列）

---

## 9. 日志位置和查看方式

当终端输出的信息不够定位问题时，查看详细日志：

| 信息来源 | 查看方式 |
|---------|---------|
| 终端实时输出 | 直接看 OpenCode 运行时的终端窗口 |
| 配置文件 | `cat ~/.config/opencode/opencode.json` |
| OMO 配置 | `cat ~/.config/opencode/oh-my-opencode.json` |
| 认证信息 | `cat ~/.config/opencode/auth.json`（注意：包含敏感信息） |
| OpenCode 版本 | `opencode --version` |
| 插件状态 | 启动 OpenCode 后查看加载日志 |

排查时建议的信息收集顺序：

```bash
# 1. 版本信息
opencode --version

# 2. 配置文件内容（脱敏后）
cat ~/.config/opencode/opencode.json

# 3. OMO 配置
cat ~/.config/opencode/oh-my-opencode.json

# 4. 插件是否加载
cat ~/.config/opencode/opencode.json | grep -A10 '"plugin"'

# 5. 检查环境变量
env | grep -i api_key
env | grep -i proxy
```

---

## 10. 还是解决不了？

如果按上面的步骤排查后问题仍然存在，可以通过以下渠道寻求帮助。

### 10.1 社区资源

| 资源 | 地址 | 适用场景 |
|------|------|---------|
| OpenCode GitHub Issues | [github.com/anomalyco/opencode/issues](https://github.com/anomalyco/opencode) | Bug 报告、功能请求 |
| OpenCode Discord | [opencode.ai/discord](https://opencode.ai/discord) | 实时交流、快速提问 |
| Oh My OpenCode GitHub | [github.com/code-yeongyu/oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode) | OMO 相关问题 |
| OpenCode 官方文档 | [opencode.ai/docs](https://opencode.ai/docs/) | 配置参考 |

### 10.2 提 Issue 时的信息模板

提 Issue 前，先准备好以下信息，能大幅加快问题定位：

```
## 环境信息
- OS：macOS / Linux / Windows (WSL)
- OpenCode 版本：（opencode --version 的输出）
- Node 版本：（node -v 的输出）
- 插件列表：（opencode.json 中 plugin 字段的内容）

## 问题描述
简述你遇到的问题。

## 复现步骤
1. ...
2. ...
3. ...

## 期望行为
你预期应该发生什么。

## 实际行为
实际发生了什么（贴报错信息或截图）。

## 相关配置（脱敏）
- opencode.json（删除 apiKey 等敏感信息后贴出）
- oh-my-opencode.json（如果相关）
```

按这个模板提问，社区响应速度会快很多。

---

## 回顾

恭喜你完成了 OpenCode 教程的全部 7 章内容。到这里，你应该已经拥有：

- 一个安装完成、认证通过的 OpenCode 环境
- 可自定义的 Provider 和模型配置
- Oh My OpenCode 驱动的多 Agent 协作能力
- 可复用的 Skills 工作流
- 成本可控的多供应商协同方案
- 遇到问题时的自助排查能力

如果你想继续深入，推荐以下方向：

- **OpenCode 官方文档**：[opencode.ai/docs](https://opencode.ai/docs/) -- 了解更多高级配置项
- **Oh My OpenCode GitHub**：[github.com/code-yeongyu/oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode) -- 跟进插件更新和新功能
- **OpenCode Discord 社区**：[opencode.ai/discord](https://opencode.ai/discord) -- 和其他用户交流实战经验

[返回课程概览](/opencode/)
