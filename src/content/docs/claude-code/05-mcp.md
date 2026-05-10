---
title: MCP 配置指南：连接外部世界
description: 接入浏览器、数据库与外部 API
sidebar:
  order: 5
---

![MCP 配置指南：连接外部世界](/images/claude-code/05-mcp.png)

上一章讲 Skills 的时候说过一句话：Skills 的能力还是在本地文件系统里打转。它能读你的代码、跑你的命令、生成文件，但如果你想让 Claude 帮你查一个网页的内容、连上数据库跑个查询、或者调一下第三方的 API——它做不到。

MCP 就是解决这个问题的。

## 本节目标

- 理解 MCP 的基本概念和通信方式（HTTP / stdio）
- 掌握 `claude mcp add` 命令的完整用法，包括三种作用域
- 知道实用 MCP Server 的配置方式（浏览器、搜索、数据库、文档）
- 了解 MCP 的上下文成本及优化手段（Tool Search、`/context`、断开不用的 Server）

## 1. MCP 是什么

MCP 全称 Model Context Protocol，是 Anthropic 推出的一个开源标准协议。你可以把它理解成 AI 世界的 USB 接口——电脑通过 USB 连接键盘、鼠标、U 盘，Claude Code 通过 MCP 连接浏览器、数据库、搜索引擎、任何外部服务。

没有 MCP 的 Claude Code 只能读写文件和跑 Bash。有了 MCP，它可以：

- 打开浏览器帮你调试前端页面
- 连上 PostgreSQL 跑 SQL 查询
- 调 GitHub API 创建 Issue 和 PR
- 搜索 Brave Search 查最新资料
- 甚至操控你正在浏览的网页

几个基本概念：

- **MCP Server**：提供能力的服务端，一个 Server 包含一组 Tools
- **Tool**：具体的动作，比如 `brave_web_search`、`puppeteer_navigate`
- **Resource**：数据源，比如数据库表、文件系统

通信方式有三种：**HTTP**（远程服务，推荐）、**SSE**（已废弃）、**stdio**（本地进程）。大部分情况下你不用关心这个，配好就行。

## 2. 从零配一个 MCP Server

配 MCP Server 最快的方式是用 `claude mcp add` 命令。

### 远程服务器（HTTP）

```bash
# 连接 Notion
claude mcp add --transport http notion https://mcp.notion.com/mcp

# 带认证的服务
claude mcp add --transport http stripe https://mcp.stripe.com \
  --header "Authorization: Bearer your-token"
```

### 本地服务器（stdio）

```bash
# Airtable
claude mcp add --transport stdio --env AIRTABLE_API_KEY=YOUR_KEY airtable \
  -- npx -y airtable-mcp-server
```

注意参数顺序：所有选项（`--transport`、`--env`、`--scope`）必须在服务器名之前。`--` 分隔符之后是传给 MCP 服务器的启动命令。

### 用 JSON 配置

也可以直接写 JSON：

```bash
claude mcp add-json weather '{"type":"http","url":"https://api.weather.com/mcp"}'
```

或者写在项目根目录的 `.mcp.json` 里，团队共享：

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/sse",
      "headers": {
        "Authorization": "Bearer ${SENTRY_AUTH_TOKEN}"
      }
    }
  }
}
```

`${SENTRY_AUTH_TOKEN}` 会自动展开成环境变量，所以密钥不用硬编码在配置文件里。

### 三种作用域

| 作用域 | 存储位置 | 什么时候用 |
|--------|----------|-----------|
| local（默认） | `~/.claude.json` | 个人实验、敏感凭据 |
| project | `.mcp.json` | 团队共享，提交到 Git |
| user | `~/.claude.json` 全局 | 跨项目的个人常用工具 |

```bash
# 团队共享
claude mcp add --transport http paypal --scope project https://mcp.paypal.com/mcp

# 跨项目个人使用
claude mcp add --transport http hubspot --scope user https://mcp.hubspot.com/anthropic
```

配好之后，在 Claude Code 里输入 `/mcp` 可以查看所有已连接的 Server、工具数量和状态。

## 3. 实用 MCP Server 推荐

这块我按使用场景来推荐，每个附配置方式。

### 浏览器自动化

这是 MCP 最让人兴奋的能力——让 Claude Code 直接操控浏览器。

**Chrome 集成**（推荐）

Claude Code 原生支持 Chrome 集成，用 `--chrome` 启动或在会话中输入 `/chrome`。它需要你安装 Claude in Chrome 扩展（v1.0.36+），然后 Claude 就能：

- 读取你当前浏览器页面的内容和 DOM
- 在 Console 里执行 JavaScript 调试
- 截图做视觉验证
- 操控页面元素（点击、填表、滚动）

最大的亮点是它**共享你的浏览器登录状态**——意味着 Claude 可以帮你操作 Google Docs、Notion、内部管理后台这些需要登录的应用，不用单独给它凭据。

**Playwright MCP**

如果你需要更强的自动化能力（比如跑端到端测试），Playwright MCP 更合适：

```bash
claude mcp add playwright -- npx @anthropic-ai/mcp-playwright
```

### 搜索

**Brave Search**

```bash
claude mcp add --transport stdio --env BRAVE_API_KEY=YOUR_KEY brave \
  -- npx -y @anthropic-ai/mcp-brave-search
```

让 Claude 可以搜索最新的信息，不再局限于训练数据的知识截止日期。

### 数据库

**PostgreSQL**

```bash
claude mcp add --transport stdio --env DATABASE_URL=postgresql://... postgres \
  -- npx -y @anthropic-ai/mcp-postgres
```

Claude 可以直接跑 SQL 查询、查看表结构、分析数据。

### 代码搜索

**grep.app**

在 GitHub 上百万个公开仓库里搜索真实的代码用法。当你不确定某个 API 怎么用的时候，让 Claude 去搜一下别人怎么写的，比看文档快。

### 文档查询

**Context7**

专门查最新的框架和库文档。解决 Claude 知识截止的问题——它训练数据里的 React 可能还是旧版 API，但 Context7 能查到最新的。

### IDE 集成

VS Code 和 JetBrains 的 Claude Code 扩展都支持配置 MCP Server，配置方式和 CLI 一样，在插件设置里填就行。

## 4. 自己写一个 MCP Server

大部分场景用社区现成的 Server 就够了。但如果你要连接内部 API、私有服务，可能需要自己写一个。

用 Python 的 FastMCP 框架，几十行就能搞定：

```python
from fastmcp import FastMCP

mcp = FastMCP("weather")

@mcp.tool()
def get_weather(city: str) -> str:
    """获取指定城市的天气信息"""
    # 调用你的天气 API
    return f"{city}: 晴天, 28°C"

mcp.run()
```

TypeScript 版本用 `@anthropic-ai/sdk` 也差不多。写完之后用 stdio 方式注册：

```bash
claude mcp add weather -- python weather_server.py
```

什么时候该自建：

- 要连接公司内部的 API（不会有公开的 MCP Server）
- 要封装特定的业务逻辑（比如把多个 API 调用组合成一个工具）
- 现有的 MCP Server 不满足你的需求

什么时候不该自建：

- 能用 Bash + curl 解决的事（不需要 MCP）
- 只需要静态知识（用 Skills 的 references 目录就行）

### 给 Agent 设计工具和给人设计 API 不是一回事

这点很多人踩过坑。直觉上你会把现有的 REST API 一个接口封装成一个 MCP 工具——create_file 一个、write_content 一个、set_permissions 一个。但 Agent 用起来就很痛苦，它得协调三个工具才能完成一件事，中间还容易出错。

更好的做法是按 Agent 的目标来设计：直接给一个 `create_script(path, content, executable)` 一步搞定。这个思路叫 ACI（Agent-Computer Interface），和传统的 HCI（给人用的界面）是一样的道理——工具要适配使用者，不是让使用者来适配工具。

几个实用原则：

- **工具名按系统分层**：`github_pr_create`、`jira_issue_search`，Claude 看名字就知道是干什么的
- **错误信息要教 Agent 怎么修**：不要只返回一个 error code，告诉它「参数 X 格式应该是 YYYY-MM-DD」
- **大响应支持精简模式**：加一个 `response_format: concise` 选项，Agent 不需要看完整 JSON
- **每个工具附 1-2 个调用示例**：JSON Schema 只能描述参数类型，示例才能教会 Agent 怎么用。加了示例后工具调用准确率可以从 72% 提升到 90%

## 5. MCP 的隐形代价

MCP 很强，但有代价，而且这个代价很多人没意识到。

### 上下文成本

每个 MCP Server 启动后，它的所有工具定义会被加载到上下文里。一个典型的 MCP Server 有 20-30 个工具定义，每个约 200 tokens，合计 4000-6000 tokens。

**接 5 个 MCP Server，光工具定义的固定开销就到了 25000 tokens——占 200K 上下文的 12.5%。**

这是 Tw93 在他那篇「你不知道的 Claude Code」里算出来的数字，我第一次看到的时候也吃了一惊。在需要读大量代码的场景，这 12.5% 真的很关键。

### Tool Output 噪声：另一个隐形杀手

上面算的是工具定义的固定开销，但还有一个动态的坑：**工具返回的数据也吃上下文**。

MCP 和 Skills 在这点上有一个很大的区别——很多 MCP Server 会把完整结果直接返回给 Claude，一次查询就可能灌回来几千 tokens。比如你让它查一个 GitHub Issue 列表，返回的 JSON 可能包含了每个 Issue 的完整描述、所有标签、所有评论。Claude 不需要看这么多，但只要数据进了上下文，token 就实打实消耗了。

相比之下，Skills 通常更轻量——它走的是 CLI + 短描述的方式，更接近 Claude 熟悉的调用模式。所以在那些「可以过滤、可以拼接」的数据读取场景里，能用 Skill 解决的就不要上 MCP。MCP 的真正优势是需要维护状态的任务（比如 Playwright 操控浏览器）。

### 怎么优化

**Tool Search（官方方案）**

Claude Code 有一个 Tool Search 机制来缓解工具定义的开销。设了 `ENABLE_TOOL_SEARCH=true` 之后，MCP 工具不会全量加载到上下文里——Claude Code 只发送轻量级的 stub（只有工具名），Claude 需要用某个工具时通过 ToolSearch 按需查询完整定义。这样缓存前缀保持稳定，固定开销从几万 tokens 降到几乎为零。

```json
{
  "env": {
    "ENABLE_TOOL_SEARCH": "true"
  }
}
```

**限制返回数据量**

`MAX_MCP_OUTPUT_TOKENS` 可以限制 MCP 工具返回的最大 token 数，防止某个工具一次性灌回来太多数据。

**及时断开不用的 Server**

`/mcp` 命令可以查看每个 Server 的连接状态和工具数量，该关的关掉。5 个 Server 全开但你只用其中 2 个，白白浪费 60% 的工具定义开销。

**用 /context 盯着你的上下文**

这是很多人不知道的命令——输入 `/context`，Claude Code 会显示当前上下文的 token 占用结构：系统提示占了多少、MCP 工具定义占了多少、对话历史占了多少、文件内容占了多少。

装了 MCP 之后一定要跑一次 `/context` 看看。你可能会发现光 MCP 工具定义就吃掉了 15%-20% 的上下文，这时候就该考虑开 Tool Search 或者关掉不常用的 Server 了。

![/context 命令实际输出](https://oss.aiqqyc.com/2026/04/4d7e1795dfdb79be492bdeb00cd5bb39.png)

![context上下文](https://oss.aiqqyc.com/2026/04/a9a7f772b433fa3fa5f9234b0ca6ab76.png)

还有一点：**尽量不要让上下文被挤到自动压缩**。Claude Code 在上下文快满的时候会自动触发 Compaction（压缩），把早期对话总结成摘要。问题是压缩算法不完美——它可能把你之前做的架构决策、约定好的规范一起丢掉了，然后 Claude 后面的行为就开始「变笨」。

经验值：Status Line 显示上下文用量超过 60% 就要注意了，超过 80% 主动 `/compact` 或者开新会话。别等它自动压缩。

### 安全

MCP Server 有完整的系统权限——它能读你的文件、访问你的网络、执行任意命令。所以：

- 只装你信任的 MCP Server
- 用第三篇讲的 `mcp__<server>__<tool>` 权限规则控制哪些工具可以自动调用
- 敏感凭据用环境变量传入，不要硬编码在配置文件里

## 常见问题

**Q: MCP Server 装得越多越好吗？**

我自己用下来，最大的坑就是一口气接了七八个 Server，光工具定义就把上下文吃掉了 20%。后来发现有几个根本很少用到。现在的原则是：一个 Server 一周用不到两次的，断掉；需要的时候再重新连。`/mcp` 看一眼状态，用 `/context` 确认开销，随时调整。

**Q: 配了 Server 但 `/mcp` 看不到它，怎么排查？**

先确认命令有没有报错——很多 stdio Server 首次运行需要 npx 下载依赖，可能因为网络问题卡住或失败。重新跑一遍 `claude mcp add` 命令，看终端有没有输出。如果是本地 Server，先手动跑启动命令确认它能正常启动再让 Claude 接入。

**Q: `.mcp.json` 提交到 Git 里安全吗？**

只要密钥用 `${ENV_VAR}` 引用而不是硬编码，就可以提交。`${SENTRY_AUTH_TOKEN}` 这种写法会在运行时从环境变量展开，配置文件本身不包含敏感信息。硬编码的 token 绝对不能提交。

**Q: 工具调用失败报错，怎么办？**

先看报错信息——MCP Server 设计好的话，错误信息会告诉你具体哪里出问题。如果是权限报错，检查第三篇里配的 `mcp__<server>__<tool>` 权限规则。如果是 API Key 失效，更新环境变量后重连 Server。实在不行，`/mcp disconnect <server>` 断开再重连。

**Q: 用 Playwright MCP 操控浏览器，Claude 能访问需要登录的网站吗？**

Playwright MCP 启动的是独立的浏览器进程，没有你现有的 Cookie 和登录状态，所以不能直接访问需要登录的页面。如果需要共享登录状态，用原生的 Chrome 集成（`/chrome`）——它直接接入你正在运行的 Chrome，共享所有 Cookie。

**Q: 上下文被自动压缩了，Claude 行为变了怎么办？**

Compaction 之后 Claude 可能忘掉之前的约定和决策。最简单的办法是把关键约定写进 CLAUDE.md——那里的内容每次对话都会加载，不会被压缩掉。实在不行开新会话，把 CLAUDE.md 维护好比担心压缩更重要。
