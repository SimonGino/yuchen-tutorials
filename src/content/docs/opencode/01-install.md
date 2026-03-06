---
title: 安装：环境准备 + 20 分钟跑通最小闭环
description: 从环境检查到首次对话，跑通 OpenCode 最小可用闭环
sidebar:
  order: 1
---

## 本节目标

读完本节，你应该拿到以下结果：

- OpenCode 安装成功，`opencode --version` 输出正确版本号
- 至少完成一个 Provider 认证，模型可正常调用
- 跑通最小闭环：能发指令、能改代码、能执行命令
- 知道常见安装问题的排查方式

还不需要配置多模型、中转站或 Skills 工作流——那是后面的事。先把「装完能用」这件事做实。

---

## 1. 安装前环境检查

在安装 OpenCode 之前，先确认以下四项：

| 检查项 | 要求 | 验证命令 |
|--------|------|----------|
| Node.js | >= 20 | `node -v` |
| npm 或 brew | 可正常执行 | `npm -v` 或 `brew -v` |
| 网络 | 能访问 opencode.ai | `curl -I https://opencode.ai` |
| 模型来源 | 至少一个（OAuth 登录或 API Key） | 下一步认证时验证 |

如果 Node.js 版本不够，先升级：

```bash
# 使用 nvm 升级（推荐）
nvm install 20
nvm use 20

# 或使用 Homebrew（macOS）
brew install node@20
```

如果你打算用 `go install` 方式安装，还需要 Go 环境：

```bash
go version
# 需要 Go 1.21+
```

---

## 2. 安装 OpenCode

提供四种安装方式，选一种即可。

### 方式一：一键安装脚本（推荐）

```bash
curl -fsSL https://opencode.ai/install | bash
```

适用于 macOS 和 Linux（包括 WSL）。脚本会自动检测系统架构并安装到合适的位置。

### 方式二：npm 全局安装

```bash
npm install -g @anthropic-ai/opencode
```

适合已有 Node.js 环境的开发者。

### 方式三：Homebrew（macOS）

```bash
brew install sst/tap/opencode
```

适合习惯用 Homebrew 管理工具的 macOS 用户。

### 方式四：Go 安装

```bash
go install github.com/sst/opencode@latest
```

适合 Go 开发者，需要 Go 1.21+。

### 验证安装成功

安装完成后，执行：

```bash
opencode --version
# 应该显示版本号，如 v1.0.150 或更高

which opencode
# 应该显示安装路径
```

如果提示 `command not found`，先重载 shell 配置：

```bash
# zsh 用户
source ~/.zshrc

# bash 用户
source ~/.bashrc
```

还不行就开一个新终端窗口再试。

---

## 3. 首次启动

进入你的项目目录，启动 OpenCode：

```bash
cd your-project
opencode
```

看到 TUI（终端界面）就算启动成功。界面包含三个区域：

- **顶部**：当前模型和会话信息
- **中间**：对话区域
- **底部**：输入框和快捷键提示

### Windows (WSL) 用户注意

如果你在 Windows 上使用，需要先安装 WSL：

1. 按微软官方文档完成 WSL 安装：https://learn.microsoft.com/en-us/windows/wsl/install
2. 在 WSL 终端中执行安装命令
3. 启动时需要在 WSL 终端内操作

```bash
# WSL 中进入项目目录
cd /mnt/c/Users/YourName/project

# 启动
opencode
```

---

## 4. 首次认证

启动后第一件事是绑定模型 Provider。在 OpenCode 界面中输入：

```text
/connect
```

按提示选择你的 Provider 并完成认证。

### 4.1 推荐认证路线

根据你的情况选一条最短路径：

| 你的情况 | 推荐路线 | 操作 |
|----------|----------|------|
| 什么账号都没有 | OpenCode 官方 | `/connect` -> 选 opencode -> 访问 https://opencode.ai/auth 获取 Key |
| 有 Claude Pro/Max 订阅 | Anthropic OAuth | `/connect` -> 选 Anthropic -> 浏览器完成 OAuth |
| 有 ChatGPT Plus/Pro 订阅 | OpenAI OAuth | `/connect` -> 选 OpenAI -> 浏览器完成 OAuth |
| 有 API Key | 直接设环境变量 | 见下方说明 |

### 4.2 使用 API Key 认证

如果你有 API Key，可以通过环境变量设置：

```bash
# Anthropic (Claude)
export ANTHROPIC_API_KEY="your-key"

# OpenAI
export OPENAI_API_KEY="your-key"

# Google Gemini
export GOOGLE_API_KEY="your-key"
```

设置后重新启动 OpenCode 即可生效。

### 4.3 验证认证成功

认证完成后，在 OpenCode 中执行：

```text
/models
```

能看到可用模型列表，说明认证成功。尝试切换到你想用的模型。

---

## 5. 验证最小闭环

认证通过后，跑一遍最小工作流，验证三个核心能力都能正常工作。

### 5.1 能发指令（读代码）

在 OpenCode 中输入：

```text
读取当前项目的目录结构，列出主要文件和目录
```

预期结果：OpenCode 调用文件读取工具，返回项目结构。

### 5.2 能改代码（写文件）

```text
在项目根目录创建一个 test-opencode.txt 文件，内容写 "OpenCode is working"
```

预期结果：文件被创建，内容正确。手动验证：

```bash
cat test-opencode.txt
# 输出：OpenCode is working
```

### 5.3 能执行命令（跑终端）

```text
执行 node -v 命令，告诉我当前的 Node.js 版本
```

预期结果：OpenCode 执行命令并返回版本号。

如果三项都通过，说明最小闭环已经跑通。清理测试文件：

```bash
rm test-opencode.txt
```

### 5.4 基础命令速查

在 OpenCode 中输入 `/` 可以看到所有命令：

| 命令 | 作用 |
|------|------|
| `/connect` | 添加 Provider 认证 |
| `/models` | 切换模型 |
| `/agents` | 切换 Agent |
| `/compact` | 压缩上下文（token 不够时用） |
| `/share` | 分享当前会话 |
| `/help` | 查看帮助 |

快捷键：

| 快捷键 | 作用 |
|--------|------|
| `Ctrl+T` | 切换模型变体（low/medium/high/max） |
| `Ctrl+C` | 中断当前生成 |
| `Ctrl+D` | 退出 OpenCode |

---

## 6. 常见安装问题

| 现象 | 根因 | 处理方式 |
|------|------|----------|
| 安装后输入 `opencode` 提示命令不存在 | 当前 shell 未加载新 PATH | `source ~/.zshrc` 或重开终端 |
| `curl` 安装脚本下载失败 | 网络问题，无法访问 opencode.ai | 检查网络连接，或换用 npm/brew 安装 |
| npm install 报权限错误 | 全局安装权限不足 | 加 `sudo` 或配置 npm prefix |
| `/connect` 后看不到想要的模型 | Provider 认证未完成或未生效 | 重新执行 `/connect`，确认 OAuth 流程走完 |
| 能读文件但不能执行命令 | 工具权限未放开 | 在 `~/.config/opencode/opencode.json` 中配置权限（见下方） |
| TUI 界面显示异常/乱码 | 终端不支持或字体缺失 | 换用现代终端（iTerm2、Warp、Windows Terminal） |
| WSL 中安装后启动报错 | WSL 版本过旧或缺少依赖 | 确认 WSL 2 + Ubuntu 22.04+，运行 `sudo apt update && sudo apt upgrade` |

### 权限配置

如果遇到权限阻塞，编辑 `~/.config/opencode/opencode.json`：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "read": "allow",
    "edit": "allow",
    "bash": "allow",
    "webfetch": "allow"
  }
}
```

保存后重启 OpenCode 生效。

---

## 7. 20 分钟自检清单

完成以下四项就算本章目标达成：

- [ ] `opencode --version` 输出正确版本号
- [ ] `/connect` 认证成功，`/models` 能看到可用模型
- [ ] 能发指令让 OpenCode 读取项目文件
- [ ] 能让 OpenCode 创建/修改文件并执行命令

全部通过，进入下一章。

---

## 下一步

[第 02 章：模型接入 -- 免费模型 / API Key / 中转站三条路线](/opencode/02-model/)
