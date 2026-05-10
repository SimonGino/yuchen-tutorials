---
title: 环境变量与权限精调
description: 关键环境变量与权限模型详解
sidebar:
  order: 3
---

![环境变量与权限精调](/images/claude-code/03-env-permissions.png)

上一篇我们搭好了 `.claude` 目录——CLAUDE.md、rules/、settings.json 都有了，Claude Code 已经认识你的项目了。

但用了几天你大概会碰到两个新问题：一是有些行为想改但不知道改哪个变量，比如想默认用 Opus、想关掉遥测、想让自动压缩的阈值高一点——这些不是 CLAUDE.md 能控制的，得靠环境变量；二是每次操作都要点确认很烦，但又不敢全开 YOLO——第一篇讲了四个权限模式是「大开关」，但你真正需要的是「精细旋钮」：npm test 自动跑、npm publish 必须确认、.env 文件禁止读。这篇就是 settings.json 的进阶手册，把环境变量和权限系统讲透。

## 本节目标

- 掌握 7 个常见场景下的关键环境变量，能在 settings.json 的 `env` 字段正确配置
- 理解 `allow / ask / deny` 规则语法，会写 Bash 命令通配符和文件路径匹配
- 能独立写出适合自己工作场景的 permissions 配置（个人/团队/全自动/中转用户）
- 理解权限系统的完整优先级链，遇到配置冲突时知道谁说了算

## 1. 环境变量：按场景找到你要的那个

Claude Code 有 100 多个环境变量，全列出来没人看得下去。所以我按**使用场景**分组——你属于哪种情况，就看哪一组。

### 怎么设置

三种方式，优先级从高到低：

```bash
# 方式 1：启动参数（最高优先级，当次有效）
claude --model opus --effort high

# 方式 2：终端 export（当次会话有效）
export CLAUDE_CODE_EFFORT_LEVEL=max
claude

# 方式 3：settings.json 的 env 字段（持久化，推荐）
```

```json
{
  "env": {
    "CLAUDE_CODE_EFFORT_LEVEL": "max"
  }
}
```

日常用推荐方式 3，写进配置不用每次敲。

![环境变量场景速查](https://oss.aiqqyc.com/2026/04/6f7ef97d0d38b66eb48de846d04d8293.png)

### 场景一：我用 API 中转

第一篇讲过配置方法，这里把必设变量和原因列清楚：

| 变量 | 用途 |
|------|------|
| `ANTHROPIC_BASE_URL` | 中转服务商的 API 地址 |
| `ANTHROPIC_AUTH_TOKEN` | API 密钥（自动加 `Bearer` 前缀） |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | 关掉遥测、自动更新、错误上报等非必要请求 |

`CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` 是一个组合开关，等于同时设了 `DISABLE_AUTOUPDATER` + `DISABLE_TELEMETRY` + `DISABLE_ERROR_REPORTING` + `DISABLE_FEEDBACK_COMMAND`。中转用户不设这个的话，Claude Code 会尝试向 Anthropic 官方服务器发送遥测数据，认证不匹配会导致报错。

### 场景二：我想默认 Opus + max effort

| 变量 | 用途 |
|------|------|
| `ANTHROPIC_MODEL` | 默认模型，支持别名（`opus`、`sonnet`、`haiku`、`opusplan`） |
| `CLAUDE_CODE_EFFORT_LEVEL` | 思考深度：`low` / `medium` / `high` / `max`（仅 Opus） |

也可以在 settings.json 顶层直接写 `"model": "opus[1m]"`，效果一样。

### 场景三：我想控制上下文和 Token

| 变量 | 用途 | 默认值 |
|------|------|--------|
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | 最大输出 token 数 | 因模型而异 |
| `API_TIMEOUT_MS` | API 请求超时（毫秒） | 600000（10 分钟） |
| `DISABLE_AUTO_COMPACT` | 设为 `1` 禁用自动压缩 | - |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | 自动压缩触发阈值（1-100） | ~95% |
| `CLAUDE_CODE_DISABLE_1M_CONTEXT` | 设为 `1` 禁用 1M 上下文 | - |

### 场景四：我在调试问题

Claude Code 出了奇怪的行为想查日志？加 `--debug` 启动，日志会写到 `CLAUDE_CODE_DEBUG_LOGS_DIR` 指定的路径。`CLAUDE_CODE_DEBUG_LOG_LEVEL` 控制日志详细程度，从 `verbose`（最详细）到 `error`（只看报错）。

还有个小细节：Claude Code 启动的 shell 环境里会自动设一个 `CLAUDECODE=1`，你的脚本可以用它来检测「当前是不是在 CC 里跑的」。

### 场景五：我想关掉一些功能

Claude Code 默认开了不少自动化功能，按需关掉：

- `DISABLE_AUTOUPDATER=1` — 关掉自动更新
- `DISABLE_TELEMETRY=1` — 关掉遥测数据
- `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` — 关掉自动记忆
- `CLAUDE_CODE_DISABLE_CLAUDE_MDS=1` — 不加载任何 CLAUDE.md
- `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS=1` — 去掉内置的 commit/PR 工作流指令
- `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1` — 关掉后台任务

### 场景六：Bash 行为微调

- `BASH_DEFAULT_TIMEOUT_MS` — 命令默认超时时间
- `BASH_MAX_TIMEOUT_MS` — 模型能设置的最大超时
- `BASH_MAX_OUTPUT_LENGTH` — 输出最大字符数，超了中间截断（防止 npm install 之类的日志撑爆上下文）
- `CLAUDE_CODE_SHELL` — 覆盖自动检测的 shell

### 场景七：安全与 UI

安全方面，`CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1` 最值得知道——它会从子进程环境里剥离 API 凭证，防止 prompt injection 攻击把你的密钥泄露出去。

UI 方面，如果你用 Claude Code 时终端画面经常闪烁或撕裂，设 `CLAUDE_CODE_NO_FLICKER=1` 切换到全屏渲染模式，体验会好很多。`CLAUDE_CODE_SCROLL_SPEED` 可以调鼠标滚轮速度（1-20 倍）。

### 实用技巧：多账户切换

```bash
alias claude-work='CLAUDE_CONFIG_DIR=~/.claude-work claude'
alias claude-personal='CLAUDE_CONFIG_DIR=~/.claude-personal claude'
```

用 `CLAUDE_CONFIG_DIR` 指向不同配置目录，就能在工作和个人账户之间一键切换。

## 2. 权限精调：从「大开关」到「精细旋钮」

第一篇讲过四个权限模式——Default、Auto-Accept、Auto、YOLO。这些是「大开关」，一开就是一大片。但实际使用中你需要的是更细的控制：这个命令放行、那个命令拦住、这个文件不准碰。

这就是 `permissions` 里的 `allow / ask / deny` 规则。

### 规则语法

![权限规则语法速查](https://oss.aiqqyc.com/2026/04/c2575b0bf57db7a2143fd5e8aac48dfd.png)

格式很简单：`Tool` 或 `Tool(specifier)`。

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git status)",
      "Read"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(curl *)",
      "Read(./.env)"
    ]
  }
}
```

**评估顺序：deny → ask → allow。** deny 优先级最高，永远先检查。不在任何列表里的操作，由当前权限模式决定（Default 模式下会弹确认）。

### Bash 命令匹配

通配符 `*` 可以放在命令的任意位置：

| 规则 | 匹配 | 不匹配 |
|------|------|--------|
| `Bash(npm run *)` | `npm run dev`、`npm run test` | `npm install` |
| `Bash(git * main)` | `git push main`、`git merge main` | `git push origin dev` |
| `Bash(* --version)` | `node --version`、`python --version` | `node index.js` |

**空格很重要：** `Bash(ls *)` 匹配 `ls -la` 但不匹配 `lsof`（空格强制单词边界）；`Bash(ls*)` 两个都匹配。

**Shell 操作符安全：** `Bash(safe-cmd *)` 不会授权 `safe-cmd && rm -rf /`。Claude Code 能识别 `&&`、`||`、`;` 等操作符，会为每个子命令单独检查权限。

### 文件路径匹配

Read / Edit / Write 的路径匹配遵循 gitignore 规范：

| 写法 | 含义 | 示例 |
|------|------|------|
| `Read(./.env)` | 当前目录下的 .env | 精确匹配 |
| `Read(./secrets/**)` | secrets 目录下所有文件（递归） | 目录保护 |
| `Edit(/src/**/*.ts)` | 项目根目录下 src 内的所有 .ts 文件 | 限定编辑范围 |
| `Read(//Users/alice/file)` | 文件系统绝对路径 | 注意双斜杠 |
| `Read(~/Documents/*.pdf)` | home 目录下的 PDF 文件 | ~ 展开 |

**注意：** `/Users/alice/file` 不是绝对路径！它是相对于项目根的路径。绝对路径要用 `//Users/alice/file`（双斜杠）。

**重要限制：** Read 和 Edit 的 deny 规则只作用于 Claude 的内置文件工具，**不影响 Bash 子进程**。`Read(./.env)` 的 deny 规则会阻止 Read 工具读 .env，但不会阻止 `cat .env`。要做到操作系统级阻止，需要开 sandbox。

### MCP 和 Agent 匹配

```json
{
  "permissions": {
    "allow": [
      "mcp__puppeteer__puppeteer_navigate"
    ],
    "deny": [
      "Agent(Explore)"
    ]
  }
}
```

MCP 工具用 `mcp__<server>__<tool>` 格式，支持通配符。Agent 用 `Agent(<name>)` 格式。

### 与 Hooks 的关系

Hooks 可以做运行时的权限判断——PreToolUse hook 以 exit code 2 退出 = 强制阻止，即使有 allow 规则也会被拦住。所以你可以：allow 列表放行 `Bash`（不弹确认），然后用 PreToolUse hook 拒绝特定危险命令。这比纯 allow/deny 灵活得多，第六篇会展开讲。

## 3. 四个实战配置方案

### 方案 1：个人日常开发

**思路：** 高频操作免确认，危险操作拦住，中间地带弹确认。

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Read",
      "Edit"
    ],
    "ask": [
      "Bash(git push *)",
      "Bash(git reset *)",
      "Bash(npm publish *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  }
}
```

三层各司其职：`allow` 放行日常操作不烦你，`ask` 确保关键操作过一眼（即使切到 Auto-Accept 模式也会弹确认），`deny` 直接拦住危险命令。

### 方案 2：全自动模式（并行会话用户）

**思路：** 同时跑 4-6 个会话，每个都弹确认根本没法切换。用 Git 兜底，全放行。

```json
{
  "permissions": {
    "allow": [
      "WebSearch", "WebFetch", "Bash", "Read", "Write",
      "Edit", "Glob", "Grep", "Task", "TodoWrite"
    ],
    "deny": [],
    "defaultMode": "bypassPermissions"
  },
  "skipDangerousModePermissionPrompt": true,
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "afplay /System/Library/Sounds/Blow.aiff"
      }]
    }]
  }
}
```

`skipDangerousModePermissionPrompt: true` 是关键——没有它，每次启动都会再问一遍「确定要跳过权限吗」。加上完成提示音 hook，会话跑完了会响一声。

**前提：** 有 Git 兜底，环境不是生产服务器，你能接受偶尔需要 `git checkout -- .` 回退。

### 方案 3：多人团队

**项目级** `.claude/settings.json`（提交到 Git，全员统一）：

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(pnpm run *)",
      "Bash(git status)",
      "Bash(git diff *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force *)",
      "Read(./.env)",
      "Read(./.env.*)"
    ]
  }
}
```

**个人** `.claude/settings.local.json`（不提交 Git，个人覆盖）：

```json
{
  "permissions": {
    "allow": [
      "Bash(docker compose *)",
      "Bash(kubectl get *)"
    ]
  }
}
```

数组类配置跨层级拼接，所以个人的 allow 列表会和团队的合并。标量配置（如 `defaultMode`）取最具体的值。

### 方案 4：API 中转用户最小配置

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://your-relay-provider.com",
    "ANTHROPIC_AUTH_TOKEN": "sk-xxxxxx",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  },
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git status)",
      "Read",
      "Edit"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Read(./.env)"
    ]
  }
}
```

环境变量和权限放在一起，一个文件搞定。

## 4. 沙箱与组织级配置

### 沙箱模式

权限系统控制的是 Claude 的「决策」——它能不能用某个工具。沙箱控制的是「执行」——Bash 子进程能不能访问某个文件或网络。

两层一起用 = 纵深防御：

- 权限 deny 规则阻止 Claude **尝试**访问受限资源
- 沙箱阻止 Bash 子进程**实际**越界（防 prompt injection 绕过）

沙箱配置在 settings.json 的 `sandbox` 字段，可以控制文件系统读写范围和网络允许域名。当沙箱启用且 `autoAllowBashIfSandboxed: true`（默认），沙箱化的 Bash 命令不再弹确认——因为操作系统层面已经限制了它能做什么。

### 完整优先级链

不管是环境变量还是权限规则，多层配置的生效优先级都遵循同一条链：

```
命令行参数（--model opus）     ← 最高
    ↓
本地配置（.claude/settings.local.json）
    ↓
项目配置（.claude/settings.json）
    ↓
全局配置（~/.claude/settings.json）  ← 最低
```

记住这个顺序，配置冲突时就知道谁说了算。

## 常见问题

**Q：`CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` 和分别设 `DISABLE_TELEMETRY` 有区别吗？**

有区别，主要是覆盖范围不同。组合开关 `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1` 同时关掉了：`DISABLE_AUTOUPDATER`（自动更新）、`DISABLE_TELEMETRY`（遥测）、`DISABLE_ERROR_REPORTING`（错误上报）、`DISABLE_FEEDBACK_COMMAND`（反馈命令）。用中转的话直接设组合开关，省事且不会漏。

**Q：deny 规则加了 `Read(./.env)`，但 Claude 还是读到了 .env 里的内容，为什么？**

因为 deny 规则只拦截 Claude 的内置 Read 工具。如果 Claude 用 `cat .env` 或 `bash -c 'source .env && ...'`，走的是 Bash 子进程，deny 规则不生效。要做到操作系统级阻断，需要启用沙箱（`sandbox` 字段）。我自己用的做法是 deny + 在 CLAUDE.md 里明确写「不要读取 .env 文件」，两层结合。

**Q：`ask` 列表和 `deny` 列表有什么本质区别？**

`deny` = 永远拒绝，没有商量余地。`ask` = 无论当前是什么权限模式（哪怕是 YOLO/bypassPermissions），这条操作都会弹确认框。所以 `ask` 适合放那些「我不想每次都点确认，但偶尔遇到必须我来决定」的操作，比如 `git push` 或 `npm publish`。

**Q：个人 settings.local.json 的 allow 列表会覆盖还是合并团队 settings.json 的 allow？**

合并（拼接）。数组类字段跨层级是追加合并，不是覆盖。标量字段（如 `defaultMode`、`model`）才是覆盖，取最具体的那层。所以你在个人配置里加 allow 规则，不会删掉团队统一配置里的规则。

**Q：通配符 `Bash(git *)` 会不会太宽泛，放行了危险的 git 操作？**

会有风险。`Bash(git *)` 会同时允许 `git push --force` 和 `git reset --hard`。我的建议是 allow 只列具体的高频命令（`git status`、`git diff *`、`git log *`），把 `git push *` 和 `git reset *` 放进 ask 列表，需要确认时再确认。

**Q：`CLAUDE_CODE_EFFORT_LEVEL=max` 设了没用？**

`max` effort 只在 Opus 模型下有效。如果你用的是 Sonnet，设这个没有效果。需要同时设 `ANTHROPIC_MODEL=opus`（或在 settings.json 顶层写 `"model": "opus"`）才能生效。

**Q：`BASH_MAX_OUTPUT_LENGTH` 设多少合适？**

我自己用下来，对于普通项目默认值够用。跑 `npm install` 或 `docker build` 之类日志很长的命令时，考虑设小一点（比如 20000 字符），避免日志撑爆上下文窗口，导致后续对话压缩过早。如果你发现 Claude 经常"忘记"之前的操作，可以检查一下是不是某个命令的输出太长了。
