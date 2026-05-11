---
title: Claude Code on the Web：异步与远程
description: 本地、远程、移动端的无缝工作流
sidebar:
  order: 9
---

![Claude Code on the Web：异步与远程](/images/claude-code/09-claude-code-on-the-web.png)

> 你最近一次改完代码，是在哪里改的？
>
> 终端？浏览器？手机？桌面 App？
>
> 这个问题半年前答案只有一个：终端。现在答案可以是以上任何一个。

几个月前，Claude Code 还只是一个躺在终端里的 CLI 工具。你 `cd` 进项目目录、敲一句 `claude`、等它接管键盘，一切都围绕着那一个窗口发生。

现在不一样了。Web、Desktop、Mobile、Chrome 扩展、GitHub Actions、Slack、Telegram、Discord、iMessage——Claude Code 已经是一个**跨设备、跨模态的 Agent 平台**。Anthropic 最近几个月的新主线也很明确：**本地 ↔ 远程 ↔ 移动端无缝切换**。

这篇的思路不是"你应该同时开几个终端"，而是——**哪种任务，放到哪里**。

上一篇讲了 Harness Engineering 的框架，Claude Code 是模型之外的工作环境。这篇给你真正的空间维度扩展：本地写代码、云端跑 PR 修复、手机监控进度、CI 做自动审查、Chrome 做视觉走查、Telegram 做远程触达。不同地方干不同事。

## 一、从单机到平台：六个入口、一次思路转变

### 半年前 vs 现在

半年前你在 Twitter 上看到"我同时开了 4 个 Claude Code 窗口"的截图，还会觉得这是大神操作——因为确实费脑子：一台机器的屏幕空间、注意力带宽、文件系统全是共享的，开多了必然打架。

现在你再看同样一句话，画面完全变了：

- 一个窗口在**你手边的终端**，改着当前分支
- 一个在**浏览器的 claude.ai/code** 里，跑着 `/autofix-pr` 盯 CI
- 一个在**手机 App**，出门路上继续之前的 Dispatch 任务
- 一个在 **Claude Code Desktop**，做着 PR 的可视化审查
- 还有一个定时任务在**云端调度器**里，每天早上 8 点自动汇总 issue

这五个"Claude"不在同一台机器上，不共享上下文、不抢资源、不打架。它们各司其职。

这不是一个"多开窗口"的技巧，是一次**工作范式的转变**。

### 六个入口

目前 Claude Code 实际可用的入口：

| 入口 | 形态 | 核心能力 |
|------|------|---------|
| 本地终端 `claude` | CLI / tmux / IDE 内嵌 | 最强的本地掌控、最快的反馈环 |
| Claude Code on the Web | claude.ai/code | 云端会话、不占本地资源、长任务友好 |
| Claude Code Desktop | macOS / Windows App | 可视化 diff、live preview、computer use |
| Mobile App | iOS / Android | Dispatch 任务、监控进度、`/teleport` 发起点 |
| Claude in Chrome | 浏览器扩展 | 让 Claude 直接读你正在看的页面 |
| Channels | Telegram / Discord / iMessage | 异步双向通信（研究预览） |

加上 GitHub Actions 和 Slack 这两条偏 workflow 的集成，总共是**八个接入点**——对比半年前只有一个 CLI，生态丰满得完全不是一个物种了。

### 思路转变：不是并行，是分工

我在社群里看到最多的误解是这样的：

> "你让我开这么多入口，我脑子不够用啊"

确实不够用，但**你本来就不应该同时全用上**。

正确的思路是：**每种任务有它最适合的地方**。

- 需要反复编辑、调试、盯着日志的——本地终端
- 长时间跑、结果丢给你的——Web
- 需要肉眼看 UI 效果的——Desktop
- 不在电脑边但想推进一下的——手机
- 正在浏览网页、想直接接入的——Chrome 扩展
- 异步事件驱动的（CI 成功 / 有人 @ 我）——Channels

这不是"并行"，是"分工"。你要学的不是手速，是**把任务扔对地方**的判断力。

## 二、云端能力全景：Web、Auto Mode 与核心命令

### Claude Code on the Web

最直接的定义：**claude.ai/code 上的云端 Claude Code 会话**。

它是一个跑在 Anthropic 服务器上的 Claude Code 实例，接你的 GitHub 仓库，在云端 checkout、运行、改代码、推分支、开 PR。你的本地电脑可以一直关着。

这听起来像是另一个 GitHub Copilot Workspace，但它不是——Web 端和你本地终端里的 Claude Code 是**同一个产品**，共享上下文、共享命令、共享订阅。区别只是跑在哪。

Web 会话可以从四个地方起：

1. **本地终端**：`claude --remote` 启动云端会话（命令在终端里输，会话在云端跑）
2. **浏览器直接打开** claude.ai/code
3. **手机 App** 发 Dispatch 任务
4. **`/ultraplan`** 在浏览器里审阅规划（下面会专门讲）

第一次开 Web 端，在 claude.ai/code 里输：

```text
/web-setup
```

它会带你走完 GitHub 授权流程，让 Web 端 Claude 能 clone 你的仓库、开分支、推 commit。这一步做一次就够了。

注意：Web 端 Claude 默认**只能看到它 clone 出来的那份代码**。你本地未提交的改动、未 push 的分支，它看不到。这个边界很重要。

### Auto Mode：异步自动化的权限底座

前面讲 Web 全景时提到「关电脑它继续修」「凌晨 3 点云端在跑」——这些异步场景有一个共同前提：**Claude 得能自主执行，而不是每一步都等你按 yes**。

这个前提以前靠 `--dangerously-skip-permissions` 强行绕过所有确认。毛病很明显——名字里都写了 "dangerously"，裸奔没护栏。

2026 年开始 Claude Code 引入**权限模式循环**（Permission Mode Cycle），Auto Mode 是其中最新也最关键的一档。讲清它，后面讲 `/autofix-pr`、`/schedule`、Channels 才能真正理解"异步自动化"是怎么成立的。

在会话中按 **`Shift+Tab`** 循环切换：

| 模式 | 行为 | 适合场景 |
|------|------|---------|
| **Default** | 每次文件编辑、每条 shell 命令都问你 | 新手、不熟悉的项目、改关键代码 |
| **Auto-accept edits** | 文件编辑和 `mkdir/mv` 等常见文件操作自动批准，其他命令仍问 | 熟悉的项目、小范围改动、心流不想被打断 |
| **Plan mode** | 只读分析，出计划后等你批准再动手 | 探索陌生代码库、大型重构前 |
| **Auto mode**（研究预览） | **后台做安全评估后自动执行所有操作** | 长任务、异步 workflow、`/autofix-pr` 类场景 |

Auto Mode 和 `--dangerously-skip-permissions` 的关键差别在：它**不是跳过检查**，是**把检查搬到后台**。Claude 内部用一层规则评估——这个操作是否可能不可逆地破坏数据？是否涉及敏感文件？是否在你配置的 deny 列表里？评估过了再执行，没过会回退到询问你。

三种启用方式：

**1. 会话内临时切换（最常用）**

按几下 `Shift+Tab` 循环到 Auto mode。

**2. 启动时指定**

```bash
claude --permission-mode auto
```

**3. 配合 `settings.json` 做细粒度控制**

```json
{
  "permissions": {
    "allow": ["Bash(npm test:*)", "Bash(gh pr:*)", "Bash(git status)"],
    "deny": ["Bash(rm -rf:*)", "Read(.env*)", "Write(.env*)"]
  }
}
```

真正安全的自动化是 **Auto Mode + `permissions.deny` 组合**——Auto Mode 给 Claude 放上限，`deny` 给你兜底下限，两头夹出一个"可控放权区"。

简单说：**dangerous 是裸奔，Auto 是穿着护具跑**。

注意：对**远程系统操作**（数据库、API、部署命令）仍会询问——这类操作的安全评估难度超出本地文件，Anthropic 选择保守。`resume` 一个旧会话时，Auto Mode 授权需要重新确认，防止无意识进入自动模式。

### `/autofix-pr`：云端自动修 PR

这是最近半年 Claude Code on the Web 最有感知的新命令，完美体现"解放本地"的思路。

**一句话**：让远程 Claude 盯着你的 PR，CI 失败或审查者留评论就自动推修复。

在你本地终端的 Claude Code 里，切到要监控的分支，然后：

```text
/autofix-pr
```

就这样。它会：

1. 通过 `gh` CLI 找到当前分支对应的 PR
2. 在云端起一个长驻会话盯着这个 PR
3. CI 失败了 → 读日志，分析原因，改代码，push 修复
4. 有人留 review 评论 → 读评论，理解诉求，改代码，push 修复
5. 一直循环，直到 CI 全绿 + 没有未解决的 comment

如果你想限制它的权力，加一句自然语言描述：

```text
/autofix-pr only fix lint and type errors
```

```text
/autofix-pr fix CI failures but ask me before touching tests
```

想监控**其他**分支的 PR，本地先 `git checkout` 过去再起：

```bash
git checkout feature/payment-refactor
claude
```

然后输入 `/autofix-pr`。

依赖：`gh` CLI 必须装好且已登录（`gh auth status` 确认）；Claude Code on the Web 已经开通（`/web-setup` 跑过一次）；本地 Claude Code v2.1.80+（版本以官方 Commands 文档为准）。

**三种典型场景**

场景一：**下班前推 PR，第二天早上 CI 已经全绿**。你周五下午赶完活推了个 PR，CI 要跑 25 分钟。以前选项是等着或周一回来发现红了再修。现在你敲一句 `/autofix-pr` 就走。周一早上回来，CI 已经绿了，或者它已经尝试过 N 轮修复、把修不动的问题留在最后一次推送的 commit message 里告诉你。

场景二：**审查者晚上留评论，回到电脑时修复已经 push 了**。国内外团队时差是真实问题。你在北京推 PR，欧洲同事晚上 10 点给你留了三条 review 评论。加了 `/autofix-pr` 之后，那三条评论被云端 Claude 读到，如果是"把这个变量改名"、"这段加一下错误处理"、"别用 any"这类明确的改动，它已经推完了。

场景三：**多个 PR 同时挂着**。你手上同时挂 3 个 PR，挨个 `git checkout` 过去、起 `/autofix-pr`、切到下一个。三个云端会话并行运行，你坐着喝茶。

和传统做法对比：

| 方式 | 谁在值班 | 能解决的问题 | 代价 |
|------|---------|-------------|------|
| 自己盯 | 你 | 全部 | 你的注意力 |
| GitHub Actions 写脚本 | 脚本 | 预先定义的套路（比如 auto-format） | 写脚本的时间 + 维护 |
| Renovate / Dependabot | bot | 依赖更新 | 只管依赖 |
| **`/autofix-pr`** | 云端 Claude | CI 失败 + review 评论里**有明确意图**的改动 | 订阅费 |

注意第四行的限定词："有明确意图"。如果 reviewer 留的是"这里设计不太对，考虑一下"，Claude 会识别出这是需要人决策的、不会擅自改。它只修确定性的东西。

### `/ultraplan`：云端规划，浏览器审阅

在终端里审阅一份 2000 字的实施方案，体验很差——没法对某一段提意见，没法跳转、没法批注。`/ultraplan` 把"规划"这件事**搬到了浏览器里**。

在本地 Claude Code 终端：

```text
/ultraplan 把认证服务从 session 迁移到 JWT
```

接下来发生的事：

1. Claude 在云端启动一个规划会话，开始**读你的代码库**、理解现状
2. 它起草一份详细的实施方案（路由改动、迁移脚本、rollback 策略、风险点）
3. 终端**立刻释放**，你可以继续干别的
4. 浏览器弹出（或手动打开 claude.ai/code）
5. 你在浏览器里**像审阅 Google Doc 一样**读方案：对具体段落加批注、打表情反应、在大纲里快速跳转、让 Claude 根据反馈改方案，反复迭代
6. 满意之后二选一：**让云端直接执行**，或**把方案传回终端**（`/tp` 拉回来，在本地执行）

Anthropic 工程师 Thariq 对这个命令的定位讲得很到位：

> 实现代码有时候需要本地环境（跑测试、看日志、连接 VPN），但**规划本身只需要读代码和理解意图**，完全可以放在云端做。

规划是**读 + 思考 + 写文档**——三件事云端都能做，而且做得更好。实现是**改代码 + 跑本地环境 + 看具体反馈**——这些本地做更顺。所以 `/ultraplan` 不是"把所有任务搬云端"，是**把规划这一步搬到云端**。

### `/schedule`：云端定时任务

让 Claude 定期跑一个任务，**不需要你的电脑开着**。

在终端里：

```text
/schedule
```

它会交互式引导你创建：Cron 表达式（或自然语言："每周一早 8 点"）、任务描述、通知方式（邮件 / Telegram / 不通知）、权限范围（read-only / 可改代码 / 可 push）。

创建好之后任务**跑在云端**，重启浏览器、关机、出差都不受影响。

典型场景：

- 每天早 8 点：扫昨晚的 issue 和 PR，分类，推个日报到 Slack
- 每小时：检查依赖更新（比 Dependabot 更灵活，可以带判断"只更新 patch"）
- 每周一：扫一遍 `TODO:` 注释，把技术债统计成报告
- 每月 1 号：从合并的 PR 里写 release notes 草稿
- 凌晨 3 点（低峰）：跑一次 repo 全量 lint + type check，结果推邮件

社区经常混淆这三个：

| 命令 | 跑在哪 | 生命周期 | 典型用途 |
|------|-------|---------|---------|
| `/loop` | 当前会话内 | 会话结束就没了 | "一直跑 test 直到绿" |
| `CronCreate` MCP | 本地 cron（用 MCP 工具的话） | 本地持久 | 本机定时任务 |
| **`/schedule`** | 云端调度器 | 云端持久 | 不依赖本地设备的任何定时 |

这是 Claude 和 Codex 最硬的差异点之一。OpenAI 2026/02 发的 Codex Desktop 也做了定时任务（Automations），但**必须 App 开着、项目在本机**才会触发——本质上还是本地 cron 的图形化封装。Anthropic 的 `/schedule` 是**真正的云端调度**。一个字之差，把"你的电脑是否需要开机"这件事从用户视角抹掉了。

## 三、跨设备无缝切换：`/teleport`、Desktop 与 Chrome

### `/teleport`：把 Web 会话拉回终端

场景：你早上在浏览器里起了一个长任务"重构 auth 模块"，中午回到工位想继续——不是从头跟，是**接着那个会话**继续。

在本地终端 Claude Code 里：

```text
/teleport
```

或者更短：

```text
/tp
```

它会列出你最近的 Web 会话，挑一个，"瞬间移动"到当前终端——对话历史、当前分支、未提交的改动全部一并带过来。

这个命令解决的是 Web 端和本地终端之间的**上下文断层**。以前你想继续，得手动把分支 checkout 过来、把对话历史复制粘贴过来、重新告诉 Claude 上下文——累。`/tp` 一条命令搞定。

> 需要 claude.ai 订阅，免费额度通常不包含跨设备迁移能力。

### `/desktop`：把会话带入桌面 App

Desktop 端有几个终端里做不了的事：

- **可视化 diff**：改动并排显示，比终端里看 diff 舒服一百倍
- **Live preview**：前端项目改完代码能实时看到页面效果
- **Computer use**：Claude 可以直接接管你的鼠标键盘操作其他应用
- **多会话 side-by-side**：左右分屏同时看两个 Claude 对话

如果当前任务需要"看效果"——比如改了一个前端样式、或者要让 Claude 去操作某个 macOS 应用——在终端里输：

```text
/desktop
```

或 `/app`，效果一样。当前会话会带着上下文切到 Desktop App 里继续。

目前 Desktop 只支持 macOS 和 Windows，Linux 用户暂时通过浏览器版绕一下。

### 完整流转示例

把上面几个命令串起来用：

```text
手机（通勤路上）
  → 在 Claude App 里 Dispatch 一个任务："调研一下 Rust 的 async runtime 选型"
  → Claude 在云端起会话，慢慢干

[30 分钟后到工位]

浏览器（claude.ai/code）
  → 打开刚才那个会话，看调研结果
  → 补一句："我们 HTTP 框架用 axum，优先这个生态"
  → Claude 继续补充

终端（主工作区）
  → /tp 把会话拉过来
  → 根据调研结论开始写 Cargo.toml 和第一版代码

Claude Code Desktop（需要跑起来看）
  → /desktop 切过去
  → 用 live preview 看接口 response 结构
  → 多会话并排：一个看 async 实现、一个看错误处理
```

整个过程**你从来没有重复讲过一次上下文**。会话跟着你走。

### Chrome 与浏览器即服务

Chrome 是 Claude Code 的「另一个交互前端」——而且最近出现了**远程化**的新形态。

**Claude in Chrome 扩展**的定位不是"在浏览器里再装一个 Claude"，而是**让 Claude 接入你正在浏览的页面**。装上之后，它能读取当前页面的完整内容（DOM + 可见文字）、读取开发者工具里的 network 请求和响应、和本地 Claude Code 会话同步，还能用你已登录的浏览器会话操作页面（不需要再给 Playwright 填一遍密码）。

对比 Playwright 自动化最大的差别是**复用已登录会话**。你手动登进公司内网、打开某个后台页面，扩展已经在里面了，直接能用。Playwright 要从零登陆。

**Chrome DevTools MCP（Chrome 146+）**：Chrome 146 开始，浏览器原生暴露 Chrome DevTools Protocol 给 MCP 客户端。Claude Code 可以**直接连接你已经打开的浏览器调试上下文**，做到读取任何页面、看 network panel（包括公司系统的隐藏 API）、跑 performance audit、断点看调用栈、调 console 跑 JavaScript。

典型用法：

- **设计走查**：配一份设计稿（图片或 Figma），让 Claude 自动对比页面和设计的差异
- **交互测试**：描述一个用户流程，让 Claude 依次点击验证
- **性能排查**：让它打开 performance panel 跑一轮、给出优化建议

安装：`https://github.com/ChromeDevTools/chrome-devtools-mcp`

**Cloudflare Browser Rendering**：2026 年 4 月，Cloudflare 把 Browser Rendering 的 Chrome DevTools Protocol 开放了。你的 MCP 客户端可以直连**云端远程 Chrome**。

官方原话：

> Browser Rendering now exposes the Chrome DevTools Protocol, which means you can give your MCP clients access to a remote browser. Update your MCP config and your agent can navigate pages, take screenshots, run performance audits, and debug JavaScript.

这把浏览器能力推进到**浏览器即服务（Browser as a Service, BaaS）**——不用本地装 Chrome、不污染本地浏览器会话、可以在 CI 里跑、可以并行开 N 个实例、用完即销毁。

更有意思的是和 `/autofix-pr` 的组合——**CI 修完代码后顺手开一台远程 Chrome 跑视觉回归**。以前这种"修完代码自动跑 E2E"的链路要自己搭 GitHub Actions + Playwright + 截图对比。现在 Claude 自己就能串起来。

三种形态对比：

| 形态 | 谁装的 | 典型场景 | 上手成本 |
|------|-------|---------|---------|
| Claude in Chrome 扩展 | 本地 Chrome 装扩展 | 人机共驾、借用登录会话 | 低 |
| Chrome DevTools MCP（本地） | 本地 Chrome 146+ | 程序化接管自己的浏览器 | 中 |
| Cloudflare Browser Rendering（云端） | 无（配 MCP endpoint） | 无界面、无设备、CI 友好 | 中 |

选择建议：日常调试本地站用扩展，自动化测试用本地 DevTools MCP，上 CI 或批量任务用云端 Cloudflare。

## 四、异步通信、本地并行与完整 PR 生命周期

### Channels：双向通信（研究预览）

Channels 目前是研究预览状态，主要接 Telegram / Discord / iMessage。

安装：

```bash
/plugin install telegram@claude-plugins-official
```

（Discord / iMessage 类似，换 plugin 名即可）

它能干什么：

- **CI 事件推送**：你的 CI 挂了，Telegram 群里 Claude 自动收到、直接尝试修
- **远程权限审批**：出差时 Claude 需要确认某个操作，直接在 Telegram 里问你、你回个"yes"就行
- **Webhook 路由**：把任何外部事件（Sentry 报错、Grafana 告警、Stripe 事件）路由到 Claude 处理
- **主动触达**：Claude 做完任务后不是留在 dashboard 里等你看，而是主动推消息给你

Channels 这个产品线值不值得做？看一个同形态的开源项目就有答案了。

上面是网易开源的 LobsterAI（「小龙虾」）的真实使用场景。作者 Tw93 出门在外，用 Telegram 远程操控 LobsterAI 在他本地电脑上读完 2025 年全年的「潮流周刊」代码、挑出 Top 20 推荐内容。他用完之后的总结很到位：

> 它有一套跨会话的持久化记忆系统，记住了我的偏好。底层是**本地优先**的设计，能真正在你机器上执行操作，不只是云端对话完就算了，延迟、隐私、断网这些问题也就自然规避掉了。**每一步操作对你完全透明**，不是黑盒在跑，随时都有完整的控制权。

四个关键特征：跨会话持久化记忆、本地优先执行、全程透明可审计、异步远程触达（Telegram / 飞书 / 钉钉 / Discord / 邮箱）。

Claude Code Channels 在设计哲学上和 LobsterAI 是一致的——**异步 + 远程 + 本地优先 + 透明可控**。这不是"再加一个通知渠道"，是让 Agent 从"坐在你电脑里的程序"变成"能和你异步协作的同事"。

### Git Worktree 与 Headless：本地并行的底座

虽然本篇的新主线是云端，但**本地并行**依然有独特价值——反馈快、可审计、不依赖网络、成本为零。

多 Agent 同时操作一个项目时，最怕的是互相踩文件。worktree 是解药：

```bash
# 为某个任务开独立 worktree
git worktree add ../myproject-refactor feature/auth-refactor

# 在新 worktree 里起 Claude
cd ../myproject-refactor
claude
```

Claude Code 原生支持 `--worktree` 参数，自动完成 worktree 创建：

```bash
claude --worktree feature/auth-refactor
```

Boris Cherny（Claude Code 作者）自己的原话：

> Spin up 3–5 git worktrees at once, each running its own Claude session in parallel. It's the single biggest productivity unlock, and the top tip from the team.

不过也有反例。[steipete](https://steipete.me) 的工作流明确反 worktree：

> 试过 worktree 那套，只会拖慢速度。只要你仔细选择工作区域，完全可以同时在多个地方干活，不会互相影响。

他的配置：3840×1620 的 4K 显示器，同时看 4 个 Claude Code 窗口 + Chrome，都在主分支上操作。方法是靠自己仔细规划每个窗口干不同的事（一个改 auth、一个改支付、一个改前端 CSS），不让它们改同一批文件。

这种做法要求你对项目结构足够熟、注意力足够集中、review 习惯好，适合**单人深度工作流**。

**没有一定对的方法**。Boris 的团队推 worktree 是因为他们有几十号人在同一个仓库上爬；steipete 不用 worktree 是因为他独立工作、心流不想被打断。

`claude -p` 是非交互（headless）模式——不开 REPL，直接执行一条指令然后退出：

```bash
# 最基本用法
claude -p "审查一下这次 diff 里有没有安全问题"

# 结构化输出（给下游脚本用）
claude -p "列出所有 TODO 注释" --output-format json

# 流式结构化输出
claude -p "..." --output-format stream-json

# 跳过所有自动加载，最快启动
claude -p "quick check" --bare

# 限制预算
claude -p "..." --max-budget-usd 0.50
```

典型场景：CI/CD 管线（pre-merge 检查、自动 code review、PR 标题规范检查）、pre-commit hook（提交前自动跑一次 safety check）、批量处理（给 `find` 找出来的一堆文件批量做同一件事）、和其他脚本组合（`gh pr list --json | claude -p "给这批 PR 做紧急程度分类"`）。

### 实战：一个 PR 的完整生命周期

把前面所有能力串起来，跑一遍完整流程。假设任务：**把现有 Session 认证迁移到 JWT**。

**第 1 步：规划阶段（`/ultraplan`）**

```text
/ultraplan 把认证从 Session 迁移到 JWT，要求：
- 兼容现有 session（双写过渡期）
- 迁移脚本能 rollback
- 列出所有需要改的路由
```

Claude 云端起草，你去吃午饭。回来时浏览器里已经有一份 4000 字的方案。你和同事两个人在浏览器里对具体段落加批注（"这里的过渡期太短"、"rollback 不够详细"），让 Claude 按反馈改了两版。满意。点"传回终端"。

**第 2 步：开发阶段（本地 `--worktree`）**

```bash
claude --worktree feature/jwt-migration
```

自动开了独立 worktree，不影响主工作区。按方案实施改动。需要看 UI 效果的时候 `/desktop` 切到 Desktop 做可视化验证。

**第 3 步：提交阶段（`git push`）**

```bash
git add .
git commit -m "feat(auth): migrate to JWT with fallback to session"
git push -u origin feature/jwt-migration
gh pr create --title "..." --body "..."
```

**第 4 步：CI 阶段（`/autofix-pr`）**

```text
/autofix-pr fix CI failures and type errors only
```

云端开始盯。你可以关电脑去吃饭。

**第 5 步：审查阶段**

同事在 GitHub 上留了三条评论：
- "这个变量改名吧，`tkn` 不够清楚" ← `/autofix-pr` 自动改
- "加个边界测试" ← `/autofix-pr` 自动加
- "这块设计我觉得不太对，考虑一下要不要把 refresh token 也迁移" ← Claude 识别出这需要人决策，给你推送一条消息："需要你确认，这条评论涉及设计决策"

**第 6 步：监控阶段（手机 App）**

你在通勤路上，手机 App 看到推送。打开，看完评论，决策："refresh token 下一个 PR 再说"。留一条 reply："这个后续迭代处理，当前 PR 不改"。Claude 在 GitHub 上把回复帮你贴上去。

**第 7 步：合并阶段（Desktop 最终审查）**

回到电脑。所有 CI 都绿了，所有 comment 都解决了（或者推迟了）。`/desktop` 切到 Desktop 做 diff 可视化验证 + 手动端到端冒烟测试。确认无误，合并。

**整个过程你做了什么？**

做了：写了一句规划需求、和同事审阅了方案、动手实施了主要代码改动、决策了一个设计层面的 review 评论、做了最终审查合并。

没做：没有一直盯着终端等、没有自己读 CI 日志、没有自己改小的 review 评论、没有在"需要看 UI"和"需要纯写代码"之间手动切环境、没有在"走出电脑"和"回到电脑"之间丢掉上下文。

Claude 在不同设备上**各司其职**。

## 小结

半年前教大家"Claude Code 高效用法"的文章，重点通常是"怎么多开几个终端窗口"。那是单机时代的优化手段。

现在的重点不一样了：**哪种任务，放到哪个地方**。

- 高反馈环、要眼手并用的 → 本地终端
- 长任务、不想占本地资源的 → Web
- 需要视觉验证的 → Desktop
- 出门路上想推进的 → 手机
- 接入页面上下文的 → Chrome 扩展
- 批量自动化、云端无状态的 → Cloudflare Browser Rendering
- 异步事件驱动的 → Channels
- CI 里的 → `-p` headless

你本身不需要手快——你只需要**判断力**，知道什么任务该去哪里，然后派它出去。Claude 在你指派的地方自己跑。

---

延伸阅读：官方文档里以下几页最直接相关——

- Claude Code on the Web 主入口：code.claude.com/docs/en/claude-code-on-the-web
- Commands 参考（所有新命令）：code.claude.com/docs/en/commands
- Remote Control（QR 码、spawn 模式）：code.claude.com/docs/en/remote-control
- Web Scheduled Tasks：code.claude.com/docs/en/web-scheduled-tasks
- Headless：code.claude.com/docs/en/headless
- Channels：code.claude.com/docs/en/channels
