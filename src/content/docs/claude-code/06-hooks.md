---
title: Hooks 详解：自动化与质量三层
description: 自动格式化、文件保护、三层质量保障
sidebar:
  order: 6
---

![Hooks 详解：自动化与质量三层](/images/claude-code/06-hooks.png)

前面五篇我们给 Claude Code 配了项目知识、调了权限、装了 Skills、接了 MCP。能力确实很强了，但有一个问题一直没解决——**这些都是「你让它做什么」**。

举个例子：你在 CLAUDE.md 里写了「每次修改代码后必须跑 lint」。Claude 看到了吗？看到了。它每次都记得跑吗？不一定。忙起来就忘了，或者觉得这次改动太小不用跑。这就是 Hooks 要解决的问题：**把确定性的事情从 Claude 的「自觉」里拿出来，交给脚本强制执行。** 改了文件就自动跑 prettier，碰了 .env 就直接阻断，任务完成了自动响个铃——不靠 Claude 记住，靠代码保证。

## 本节目标

- 理解 Hooks 的触发机制与结构（事件 → matcher → hooks 数组）
- 能写出格式化、文件保护、完成通知三类常用 Hook
- 理解退出码（0 / 2 / 其他非零）对工具调用的控制逻辑
- 掌握 CLAUDE.md + Skill + Hook 三层叠加的质量保障架构

## 1. 5 分钟写你的第一个 Hook

先不讲概念，直接上手。在 `settings.json` 里加一段：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write",
            "statusMessage": "正在格式化..."
          }
        ]
      }
    ]
  }
}
```

这段配置的意思是：**每次 Claude 编辑完一个文件（PostToolUse + matcher: Edit），自动跑 prettier 格式化**。

配好之后你会发现，再也不用提醒 Claude「记得格式化」了。它改完代码的瞬间，prettier 自动跑一遍，输出都不进对话，干干净净。

结构很简单：**事件名 → matcher 过滤 → hooks 数组**。换句话说就是：什么时候触发 → 触发哪些操作 → 具体执行什么。

## 2. 能监听哪些事件

Claude Code 支持 26 个 Hook 事件，覆盖了整个会话的生命周期。你不需要全记住，按使用频率排，最常用的就这几个：

**高频（日常开发离不开）：**

- **`PostToolUse`** — 工具调用成功后触发。最常见的用法：Edit 后自动格式化、Write 后自动 lint
- **`PreToolUse`** — 工具调用前触发。用来拦截危险操作——比如阻止修改特定文件
- **`Stop`** — Claude 完成回复时触发。适合发通知（「活干完了」响个铃）

**中频（特定场景有用）：**

- **`SessionStart`** — 会话启动时触发。注入动态上下文（Git 分支、环境变量）
- **`UserPromptSubmit`** — 用户发消息前触发。可以预处理或拦截输入
- **`FileChanged`** — 被监视的文件在磁盘上变更时触发。自动重载 .env 等

**低频但关键：**

- **`PreCompact` / `PostCompact`** — 上下文压缩前后触发。用来在压缩前保存关键信息
- **`SubagentStart` / `SubagentStop`** — 子 Agent 生命周期
- **`PermissionRequest`** — 权限对话框弹出时。可以用 Hook 自动批准特定操作

每个事件都有 `matcher` 字段做进一步过滤。比如 `PostToolUse` 的 matcher 匹配工具名——`Edit`、`Bash`、`mcp__puppeteer__*` 都可以。matcher 支持正则，`Edit|Write` 表示编辑或写入时都触发。

## 3. 实用 Hook 案例

### 自动格式化（最高频）

开头已经展示了 prettier 的例子。如果你的项目是混合语言的（比如 Rust + Lua），可以按文件类型分发：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "file=$(jq -r '.tool_input.file_path'); case \"$file\" in *.rs) cargo check 2>&1 | head -30 ;; *.lua) luajit -b \"$file\" /dev/null 2>&1 | head -10 ;; *.ts|*.tsx) npx prettier --write \"$file\" ;; esac",
            "statusMessage": "正在检查..."
          }
        ]
      }
    ]
  }
}
```

Rust 文件跑 `cargo check`，Lua 文件跑语法检查，TypeScript 文件跑 prettier。每次编辑完立刻知道有没有错——这比「跑了一堆代码最后才发现第一行就挂了」舒服得多。

注意 `| head -30`——限制输出长度，防止 Hook 输出反过来污染上下文。

### 文件保护（阻断修改）

有些文件绝对不能让 Claude 碰：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "file=$(jq -r '.tool_input.file_path'); case \"$file\" in .env|.env.*|*.lock) echo 'BLOCKED: 禁止修改此文件' >&2; exit 2 ;; esac"
          }
        ]
      }
    ]
  }
}
```

`exit 2` 是关键——退出码 2 表示**强制阻断**，Claude 不能继续执行这个操作。和第三篇讲的 permissions deny 不同，Hook 的阻断是在运行时动态判断的，可以写更复杂的逻辑。

### 完成通知

同时跑好几个 Claude Code 会话的时候，你不可能一直盯着每一个。加个提示音：

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "afplay /System/Library/Sounds/Blow.aiff"
          }
        ]
      }
    ]
  }
}
```

Claude 干完活，Mac 响一声。这是 mvanhorn 的配置——他同时跑 4-6 个并行会话，没有这个提示音根本没法管。

想发到 Slack 或者桌面通知也行：

```json
{
  "type": "command",
  "command": "osascript -e 'display notification \"Claude Code 任务完成\" with title \"Claude Code\"'"
}
```

### 会话启动时注入动态上下文

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '{\"context\": \"当前分支: '$(git branch --show-current)', 最近提交: '$(git log --oneline -1)'\"}'"
          }
        ]
      }
    ]
  }
}
```

每次开会话，自动把当前 Git 分支和最近提交注入进去。Claude 不用再问「你现在在哪个分支」。

## 4. 决策控制与高级用法

### 退出码决定一切

- **退出码 0** = 继续执行（Hook 通过）
- **退出码 2** = 强制阻断（工具调用被拦住）
- **其他非零** = Hook 执行失败，但不阻断工具调用

所以你可以用 Hook 做比 permissions 更灵活的权限控制：allow 列表放行 `Bash`（不弹确认），然后用 PreToolUse Hook 拒绝特定危险命令。这比静态的 allow/deny 列表灵活得多——你可以写任意逻辑，比如「只允许在工作时间执行 git push」。

### 三种非脚本类型的 Hook

除了最常用的 `command` 类型，还有三种：

**Prompt Hook** — 返回自然语言指令，Claude 会按指令行动：

```json
{
  "type": "prompt",
  "prompt": "请在提交代码前检查是否所有测试都通过了"
}
```

**Agent Hook** — 启动一个子 Agent 来处理事件：

```json
{
  "type": "agent",
  "prompt": "分析这次工具调用是否有安全风险"
}
```

**HTTP Hook** — 调用外部 API：

```json
{
  "type": "http",
  "url": "http://localhost:8080/hooks/tool-use",
  "headers": { "Authorization": "Bearer $MY_TOKEN" }
}
```

用 `/hooks` 命令可以查看当前所有已配置的 Hook 和它们的状态。

## 5. 三层叠加：CLAUDE.md + Skill + Hook

![三层质量保障体系](https://oss.aiqqyc.com/2026/04/6f7a2215b3ed086ef5fdda66e2c376d5.png)

这是 Tw93 在那篇「你不知道的 Claude Code」里总结的方法论，我觉得是整个系列最有价值的架构思路。

假设你的需求是「提交前必须通过测试和 lint」：

**只靠 CLAUDE.md**：你在里面写了「NEVER commit without running tests」。Claude 看到了，但经常当没看见——忙起来就跳过了。

**加上 Skill**：你写了一个 `/pre-commit` Skill，定义了测试的顺序、怎么看失败、怎么修复。Claude 知道怎么做了，但它不一定记得主动调用。

**再加上 Hook**：你配了一个 PreToolUse Hook，matcher 匹配 `Bash`，在 Claude 要执行 `git commit` 之前检查是否所有测试通过。没通过？exit 2，直接阻断。

三层各管各的：

- **CLAUDE.md** = 声明意图（「我们要这么做」）
- **Skill** = 定义方法（「具体怎么做」）
- **Hook** = 强制兜底（「不做不行」）

**少任何一层都有漏洞。** 只写 CLAUDE.md，Claude 经常忘；只靠 Hook，复杂的判断做不了；只有 Skill，没人保证它每次都被调用。三层放在一起才稳。

### 什么适合放 Hook，什么不适合

**适合**：确定性的、可以用脚本表达的

- 格式化 / lint / 轻量编译检查
- 阻断修改特定文件
- 发通知
- 注入环境信息

**不适合**：需要语义理解的、复杂推理的

- 判断代码逻辑是否正确（这是 Skill 的事）
- 分析架构合理性（这是 Plan Mode 的事）
- 需要读大量上下文做决策的（Hook 不进上下文）

还有一条实践经验：**Hook 太多会拖慢每次操作**。每个 PostToolUse Hook 都会在每次编辑后执行——如果你配了 5 个 Hook，每次编辑后要跑 5 个脚本。Claude Code 创始人 Boris Cherny 的建议是：**重复做了 3 次的事才值得写成 Hook 自动化**。

## 常见问题

**Q：Hook 和 CLAUDE.md 里写的规则有什么区别？**

CLAUDE.md 的规则是给 Claude 看的——它读到了，但执行全靠自觉。Hook 是代码层面的强制执行，Claude 没有绕过的余地。两者不是替代关系，是互补的：CLAUDE.md 声明意图，Hook 保证落地。

**Q：exit 2 和其他非零退出码有什么区别？**

exit 2 是唯一能真正阻断工具调用的退出码。其他非零（比如 exit 1）只表示 Hook 脚本自身执行出错，Claude Code 会记录错误但仍然继续执行原来的工具调用。要拦截操作，必须用 exit 2。

**Q：Hook 能拿到什么上下文信息？**

Hook 通过 stdin 接收 JSON 格式的工具调用信息。`PostToolUse` 的 payload 包含 `tool_name`、`tool_input`（比如 `file_path`）和 `tool_result`。可以用 `jq` 解析。注意 Hook 脚本不在 Claude 的对话上下文里——它看不到之前的对话内容。

**Q：配了 Hook 之后操作变慢了怎么办？**

我自己用下来，Hook 数量控制在 3 个以内基本感觉不到延迟。超过这个数量每次编辑都能感觉到卡顿。Boris Cherny 的建议是「重复了 3 次才自动化」——不要把所有事情都塞进 Hook，只把真正高频且确定性强的操作放进去。

**Q：同一个事件可以配多个 Hook 吗？**

可以，hooks 数组里可以放多个对象，会按顺序依次执行。但要注意：如果前面的 Hook exit 2 了，后面的 Hook 不会再跑。

**Q：PreToolUse 和 permissions deny 都能阻止操作，用哪个？**

permissions deny 是静态的黑名单，配置简单但不灵活。PreToolUse Hook 可以写任意判断逻辑——比如根据文件路径、时间、环境变量动态决定是否阻断。我踩过的坑是：一开始什么都往 permissions 里写，后来发现很多场景需要「根据条件判断」，才换成 Hook 来处理。
