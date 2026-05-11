---
title: Harness Engineering：从 Prompt 到系统
description: 系统化使用 AI 的思维框架
sidebar:
  order: 8
---

![Harness Engineering：从 Prompt 到系统](/images/claude-code/08-harness-engineering.png)

这是 Claude Code 系列的第八篇。和前面七篇不一样，这篇不教你任何新的命令或配置。它做的事情是：**给你过去七篇学到的所有东西一个统一的理论框架**。

前七篇你做了很多事——写 CLAUDE.md、调 settings.json、装 Skills、接 MCP、管上下文。如果我问你「你在做什么」，你可能会说「在配置 Claude Code」。

但实际上你在做的事有个更准确的名字：**Harness Engineering**。

一个公式：**Agent = Model + Harness**。

模型是 Anthropic 训练的，你管不了。**Harness 是模型之外的一切**——文件系统、工具链、沙箱、验证闭环、Hooks、压缩机制、记忆系统。你的 CLAUDE.md、settings.json、Skills、MCP 配置，加在一起就是你的 Harness。

> 如果你不是模型，你就是 Harness。

这不是我造的词。Anthropic 自己在工程博客里专门写过一篇《Harness Design for Long-Running Apps》，讲的就是怎么用 Harness 让 Agent 完成长时间自主任务。社区里的讨论也越来越多——有人分析了一个 35000 Star 的 Agent 项目的源码，结论是「整个开发流程大概率是 TDD 或者叫 Harness engineering 出来的」。还有一个很有说服力的数据：**同一个模型（Opus 4.6），仅仅通过改善 Harness，就能让 benchmark 排名从 Top 30 提升到 Top 5**。

模型是一样的。改变的只是工作环境。

这篇文章做三件事：

1. **理清脉络**——从 Prompt Engineering 到 Context Engineering 再到 Harness Engineering，三代演进的区别在哪
2. **给出原则**——五条可操作的 Harness 设计原则：约束优于指令、TDD 优先、确定性逻辑外置、文件系统作为记忆、工具设计优先于提示词
3. **回看前七篇**——你搭的那套 .claude 配置，每一层对应 Harness 的哪个组件

不教新命令，但读完之后你看前七篇的视角会完全不同。

## 一、三代演进：从教模型说话到给模型搭环境

AI 编程方法论经历了三代演进。不是工具在变，是**控制权在转移**：

![AI 编程方法论三代演进](https://oss.aiqqyc.com/2026/04/f3bdeea8bfb1a2e2c1a3fe5eb82e41fa.png)

**第一代：Prompt Engineering — 你在教模型**

关注点是「怎么把提示词写得更好」。角色设定、思维链、Few-shot 示例——这些在 ChatGPT 刚出来的时候确实有用。

但到了 Claude Code 这种 Agent 级别的产品，你会发现 prompt 的边际收益急剧下降。「作为一名资深高级工程师，请你…」和「帮我改一下这段代码」的效果差别已经很小了。

**第二代：Context Engineering — 你在管理信息**

上一篇讲的内容。关注点从「怎么写 prompt」转移到「怎么管理模型能看到的全部信息」。信噪比、Prompt Caching、Compaction、HANDOFF.md。

提升是量级的——同样的模型、同样的 prompt，上下文管理好不好的差距是「能干」和「干不了」。

**第三代：Harness Engineering — 你在设计系统**

关注点再往外扩一层：**不只管模型看到什么，还要管模型工作的整个环境**。前面已经定义过，Harness 是模型之外的一切。**Harness 的设计是你的事，而且它的天花板比 prompt 高得多。**

有人总结过 AI 编程的 8 个等级，从 Tab 补全到自主 Agent 团队。第 6 级就是 Harness Engineering——核心原则是「给智能体的不只是编辑器，而是完整的反馈循环」。

| 代际 | 你在做什么 | 典型产物 |
|------|-----------|---------|
| Prompt Engineering | 写更好的提示词 | 一个精心设计的 Prompt 模板 |
| Context Engineering | 优化上下文信噪比 | /compact 策略、HANDOFF.md |
| Harness Engineering | 设计 AI 的工作环境 | 一套完整的 .claude 配置 + Hooks + Skills + MCP |

## 二、五条可操作的 Harness 设计原则

### 原则 1：约束优于指令

这条和很多人的直觉相反。

传统做法是告诉模型一步一步该做什么：「先跑测试，然后检查覆盖率，再看有没有 lint 错误，最后 commit」。模型可能忘了第三步、跳过第四步。

Harness Engineering 的做法完全不同：

> **「这是我想要的结果。一直做，直到通过所有这些测试。」**

这句话比写十条指令更有效。因为你不是在教模型怎么做（它自己知道），而是在告诉它什么算做完。

看几个具体场景：

**场景：提交前要通过测试**

```text
❌ Prompt 做法（写在对话里）：
「请在提交代码前先跑一遍测试，确保所有测试通过，然后再 git commit」

问题：Claude 可能忘记、可能跳过、可能觉得这次改动太小不用测
```

```text
✅ Harness 做法（三层叠加）：

1. CLAUDE.md 里写：
   ## NEVER
   - Commit without running tests

2. Skills 里写一个 /pre-commit：
   ---
   name: pre-commit
   description: Run before committing code changes
   ---
   ## Steps
   1. Run `pnpm test`
   2. Run `pnpm lint`
   3. If all pass, proceed with commit
   4. If any fail, fix issues first

3. Hooks 里配：
   {
     "hooks": {
       "PreToolUse": [{
         "matcher": "Bash",
         "hooks": [{
           "type": "command",
           "command": "if echo \"$TOOL_INPUT\" | grep -q 'git commit'; then pnpm test --silent || (echo 'Tests failed, commit blocked' && exit 2); fi"
         }]
       }]
     }
   }
```

三层的区别：

- CLAUDE.md 声明意图 — 可能被忽略
- Skill 定义方法 — 可能不被调用
- **Hook 强制兜底 — 无法绕过**

这就是「约束优于指令」的意思。你不是在「请求」Claude 做什么，你是在用系统机制**保证**它不得不做。

**场景：不能修改 .env 文件**

```text
❌ Prompt 做法：「请不要修改 .env 和 .env.local 文件」
   → Claude 忙起来可能忘了

✅ Harness 做法：
   settings.json permissions:
   "deny": ["Read(./.env)", "Read(./.env.*)"]
   
   + PreToolUse Hook:
   exit 2 阻断任何对 .env 的 Edit/Write 操作
   → 系统级阻断，Claude 想改也改不了
```

**场景：代码风格统一**

```text
❌ Prompt 做法：「请用 2 空格缩进，用 single quote，行末不要分号」
   → Claude 偶尔会忘、混用

✅ Harness 做法：
   PostToolUse Hook 自动跑 prettier：
   每次 Edit 之后，prettier 自动格式化
   → 不管 Claude 怎么写，最终结果都是统一的
```

Claude Code 创建者 Boris Cherny 分享过团队的做法，其中有一条和这个原则直接相关：每次纠正 Claude 的错误后，让它自己更新 CLAUDE.md——「Update your CLAUDE.md so you don't make that mistake again」。这不是在对话里叮嘱一次，而是让约束沉淀到文件系统里，下次启动自动生效。Boris 说 Claude 给自己写规则写得「出奇地好」。

### 原则 2：TDD 优先——测试是最强的验证闭环

很多人追求「让 Claude 一次做对」。但在工程实践中，**能验证比一次做对更重要**。

具体操作：

**第一步：让 Claude 先写测试**

```text
帮我给用户注册功能写测试，测试以下场景：
1. 正常注册成功
2. 邮箱已存在
3. 密码强度不够
4. 必填字段缺失
```

Claude 会生成一组测试。跑一遍，确认全红（测试都失败，因为功能还没写）。

**第二步：让 Claude 写实现，跑到绿**

```text
现在实现用户注册功能，让所有测试通过
```

Claude 写实现代码，跑测试。如果有测试没过，它会自动修。一直到所有测试变绿。

**第三步：/simplify 重构**

```text
/simplify
```

自动审查刚改的代码，检查复用性、质量和效率，有问题直接修。

这个流程的妙处在于：**你不需要检查 Claude 写的每一行实现代码**。只要测试覆盖了核心场景，测试全通过了，实现大概率是对的。你的审查精力可以集中在测试本身——测试覆盖了该覆盖的场景吗？边界条件考虑到了吗？

TDD 只是验证闭环的一部分。完整的验证体系分三层：

| 层级 | 手段 | 说明 |
|------|------|------|
| **最低层** | 命令退出码、lint、typecheck、单测 | 自动化，最快 |
| **中间层** | 集成测试、截图对比、contract test | 半自动化 |
| **最高层** | 人工审查、生产监控 | 最慢但最准 |

这个分层有人称之为**回压（Backpressure）**——类型系统、测试、linter、pre-commit 钩子把错误推回给 Agent，让它自己纠正。你不需要检查它的每一行代码，你需要的是一套能自动告诉它「你错了」的系统。

有一个很好的四象限模型：

![什么任务适合给 Agent](https://oss.aiqqyc.com/2026/04/c435ed9377241e4d2d7c8e69b85b909e.png)

**Harness 的终极目标是把任务推向右上角**——让目标明确、让验证自动化。做到了，Agent 就能自主闭环。

实际判断标准也很简单：**如果一个任务你都说不清楚「Claude 怎么才算做对了」，那它大概率也不适合直接丢给 Claude 自动完成。**

### 原则 3：确定性逻辑外置

第六篇已经讲过这条原则的概念。这里给完整的对照表和实操代码：

| 你想让 Claude 做的事 | Prompt 做法（不可靠） | Harness 做法（可靠） |
|---------------------|---------------------|---------------------|
| 每次都跑测试 | 对话里提醒 | PreToolUse Hook 拦截 git commit |
| 检查文件是否改了 | 让模型自己 git diff | Hook 自动跑 git diff 注入消息 |
| 记住用 pnpm 不用 npm | 每次对话都提 | 写到 CLAUDE.md 里 |
| 编辑后格式化 | 提醒「记得跑 prettier」 | PostToolUse Hook 自动跑 |
| 不动 .env 文件 | 写在 prompt 里 | permissions deny + Hook exit 2 |
| 提交前更新 changelog | 写在规范文档里 | Skill + Hook 联动 |

右列比左列可靠 10 倍的原因只有一个：**Prompt 可能被遗忘，Hooks 和 permissions 是强制执行的**。

如果你的项目同时用 Rust 和 TypeScript（或者 Java + Python、Go + Lua 等任何组合），可以按文件类型分发检查：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [{
          "type": "command",
          "command": "file=$(jq -r '.tool_input.file_path'); case \"$file\" in *.rs) cargo check 2>&1 | head -30 ;; *.ts|*.tsx) npx prettier --write \"$file\" && npx tsc --noEmit 2>&1 | head -20 ;; *.py) black \"$file\" && ruff check \"$file\" 2>&1 | head -10 ;; esac",
          "statusMessage": "自动检查中..."
        }]
      }
    ]
  }
}
```

每次编辑完立刻知道有没有错——这比「跑了一堆代码最后才发现第一行就挂了」舒服得多。

**实测数据**：在 100 次编辑的会话中，每次 Hook 检查节省 30-60 秒的人工确认时间，累积节省 1-2 小时。

### 原则 4：文件系统作为外部记忆

模型的上下文窗口是有限的（即使 1M），但文件系统是无限的。Anthropic 在官方博文里总结过长任务 Agent 失败的三大原因：做着做着「失忆」、目标越做越偏、看似完成其实没做完。他们的解法不是强化模型，而是用文件（feature list / progress log / git）保存状态，每轮「重新加载世界」。

借用认知科学的分层来理解 Claude Code 的记忆机制（这不是官方架构划分，是帮助你建立直觉的类比）：

| 层级 | 存储方式 | 类比 | 加载时机 |
|------|---------|------|---------|
| **工作记忆** | 上下文窗口 | 大脑当前在想的 | 实时，但有限 |
| **程序性记忆** | Skills | 怎么做某件事 | 按需加载 |
| **情景记忆** | JSONL 会话历史 | 发生了什么 | `--resume` 恢复 |
| **语义记忆** | MEMORY.md / Auto Memory | 重要的事实 | 启动时加载前 200 行 |

这四层的设计原则是一样的：**尽量少放在工作记忆（上下文窗口）里，尽量多放在文件系统里**。

跨会话续跑的最佳实践：

**方法 1：写一份交接文件（上一篇讲过）**

让 Claude 写一份结构化的进度文件（你可以叫它 `HANDOFF.md`、`progress.md`，文件名不重要），新会话只读这个文件就能接着做。

**方法 2：功能清单用 JSON 而不是 Markdown**

```json
{
  "tasks": [
    {"id": 1, "name": "用户认证", "status": "done"},
    {"id": 2, "name": "订单状态机", "status": "in_progress", "notes": "enum 方案已确认"},
    {"id": 3, "name": "支付回调", "status": "todo"}
  ]
}
```

为什么用 JSON 不用 Markdown？**结构化格式更适合模型稳定修改**。模型改 Markdown 列表时偶尔会丢格式，但改 JSON 的准确率几乎 100%。

**方法 3：Ralph Loops（续跑模式）**

更高级的做法是让 Harness 拦截模型的退出尝试，在干净上下文里重新注入原始 prompt，强制继续工作。文件系统使这成为可能——每次迭代从新上下文开始，但从上一轮的文件系统状态读取。

这其实就是 `/loop` 命令的底层原理。

### 原则 5：工具设计优先于提示词设计

有人写了 30 个 Skills，读完 Anthropic 官方文章才发现基本全用错了。Claude Code 工程师 Thariq 专门写过一篇《Seeing like an Agent》，讲的就是怎么给 Agent 设计工具。他的核心观点是：工具要适配模型的能力，而不是你觉得好用的形状。判断方法不是猜，是观察模型的行为——「You learn to see like an agent」。从中可以提炼出三条可操作的原则：

**原则 1：观察，不要猜。**

模型「喜不喜欢」调用某个工具，就是最真实的设计反馈。如果一个工具配了 auto-invoke 但 Claude 从来不主动用它，说明 description 写得不好或者这个工具不解决模型遇到的问题。

**原则 2：定期复盘工具假设。**

模型能力半年一个台阶，当初加的限制可能已不成立。Thariq 在原文里举了一个亲身经历：早期 Claude 需要 TodoWrite 工具来记住任务列表，团队甚至每 5 轮插一次系统提醒。但模型变强后，这个提醒反而让 Claude 觉得必须严格按列表走，无法灵活调整；再后来 Opus 4.5 擅长用 subagents 了，多个 subagent 又无法共享同一个 Todo 列表——于是 TodoWrite 被 Task Tool 取代，核心目的从「帮模型记住目标」变成「帮多个 agent 互相协调」。

> As model capabilities increase, the tools that your models once needed might now be constraining them. — Thariq

**原则 3：给地图，别给百科全书。**

让模型自己决定要什么信息——先看到索引和导航，再按需拉取细节。这就是 Skills 的 `references/` 目录和 MCP 的 `defer_loading` 做的事。

大多数工具选择错误的原因不在模型能力，**在工具描述不准确**。调试 Agent 时应该先检查工具定义：

- description 是否明确告诉模型「何时用我」（而不是「我是干什么的」）
- 返回格式是否清晰（JSON Schema 只描述类型，需要示例才能教会调用方式）
- 错误信息是否教模型怎么修（不只返回 error code）

加了示例之后，工具调用准确率可以从 72% 提升到 90%。

## 三、回看前七篇——你一直在做 Harness Engineering


这可能是整篇文章最关键的一节。看看你前七篇做的事，换一个视角：

![你一直在做 Harness Engineering](https://oss.aiqqyc.com/2026/04/c68ab5e8906121780bd0c877c3413339.png)

每一篇文章教你的不是「怎么和 AI 聊天」，而是「怎么设计 AI 的工作环境」。

从这个框架出发，你看前七篇的视角会完全不同：

- CLAUDE.md 不再是「配置文件」，而是 Harness 的系统提示层
- Settings 不再是「偏好设置」，而是 Harness 的约束层
- Skills 不再是「快捷命令」，而是 Harness 的工作流层
- MCP 不再是「插件」，而是 Harness 的工具层
- 上下文管理不再是「省 token」，而是 Harness 的资源层

你不再是一个「使用 AI 工具的人」。你是一个 **Harness Engineer**——设计 AI 工作环境的工程师。

## 四、一套完整的 Harness 配置参考与自检清单

### 完整布局参考

下面是一个可以直接抄的项目级 Harness 完整布局，覆盖了前七篇讲的所有组件：

```text
your-project/
├── CLAUDE.md                          # 系统提示层：项目契约（< 200 行）
│   ├── ## 项目概述
│   ├── ## 常用命令
│   ├── ## 架构边界
│   ├── ## 编码规范
│   └── ## NEVER 列表
│
├── .claude/
│   ├── settings.json                  # 配置层
│   │   ├── permissions.allow          # 高频命令免确认
│   │   ├── permissions.deny           # 危险操作阻断
│   │   ├── hooks.PostToolUse          # 编辑后自动格式化/检查
│   │   ├── hooks.Stop                 # 完成后通知
│   │   └── env.ENABLE_TOOL_SEARCH     # MCP 工具延迟加载
│   │
│   ├── rules/                         # 约束层
│   │   ├── code-style.md              # 代码风格约束
│   │   ├── testing.md                 # 测试规范
│   │   └── api-conventions.md         # API 设计规则（paths: src/api/**）
│   │
│   ├── skills/                        # 工作流层
│   │   ├── pre-commit/SKILL.md        # 提交前检查
│   │   ├── review/SKILL.md            # 代码审查
│   │   └── deploy/SKILL.md            # 部署流程（disable-model-invocation: true）
│   │
│   └── agents/                        # 隔离层
│       └── explorer.md                # 只读探索 Agent（Haiku，省成本）
│
└── .mcp.json                          # 工具层：团队共享的 MCP Server
```

每一层都有明确的职责：

- **CLAUDE.md** 告诉 Claude「你的项目是什么」
- **settings.json** 控制「Claude 怎么工作」
- **rules/** 定义「什么不能做」
- **skills/** 封装「怎么做特定任务」
- **agents/** 隔离「需要独立上下文的工作」
- **.mcp.json** 连接「外部工具和数据」

### 自检清单：你的 Harness 够好吗

最后给一份自检清单，11 项全做到的人不多：

**基础配置**

- [ ] 有 CLAUDE.md 且不超过 200 行
- [ ] CLAUDE.md 里有 NEVER 列表
- [ ] settings.json 配了 allow / deny 权限规则

**能力扩展**

- [ ] 至少有 1 个自己写的 Skill（不是只装了插件）
- [ ] MCP Server 按需接入，开了 `ENABLE_TOOL_SEARCH=true`
- [ ] 不用的 MCP Server 及时断开

**质量保障**

- [ ] 至少有 1 个 PostToolUse Hook（自动格式化是最低要求）
- [ ] 重要操作有验证闭环（测试、lint、typecheck）
- [ ] 高风险 Skill 设了 `disable-model-invocation: true`

**上下文管理**

- [ ] 知道 60% / 80% 上下文的对应操作
- [ ] 做过至少一次跨会话交接（交接文件 + 新会话续跑）

做到 7 条以上，你的 Harness 就比大多数人好了。做到全部 11 条，你已经在做真正的 Harness Engineering。

### 从哪下手

体检完你会知道自己缺什么。但别一次补完，**先挑一个做**，感受到效果再扩展。

**实验 1：写你的第一个 Hook（推荐新手先做这个）**

如果你的 Harness 还没有任何 Hook，从最简单的开始——Edit 之后自动格式化：

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit",
      "hooks": [{
        "type": "command",
        "command": "npx prettier --write \"$(jq -r '.tool_input.file_path')\"",
        "statusMessage": "格式化中..."
      }]
    }]
  }
}
```

配完之后让 Claude 随便改几个文件，你会发现**不管它怎么写，输出都是格式统一的**。这就是"确定性逻辑外置"的直接体感——你再也不需要在对话里提醒「记得跑 prettier」了。

**实验 2：做一次"Prompt → Harness"迁移**

从你的 CLAUDE.md 里找一条你写过但 Claude 偶尔忽略的规则，把它迁移到 Hook 或 Permission 里。比如「不要修改 .env 文件」，从 CLAUDE.md 里的文字约束，改成 settings.json 里的 `"deny": ["Edit(./.env)", "Edit(./.env.*)"]`。

然后**故意不在对话里提这件事**，直接让 Claude 干活。你会发现它碰到被 deny 的文件会直接被系统拦截，不需要你提醒。对比之前写在 CLAUDE.md 里偶尔被忽略的体验，差距是肉眼可见的。

**实验 3：做一次跨会话交接**

找一个正在做的任务，做到一半的时候告诉 Claude：

```text
把当前进度写成一份交接文件，包括：已完成的、正在做的、尝试过但失败的、下一步建议。写到 progress.md
```

然后开一个全新的会话，只发一句话：

```text
读一下 progress.md，接着做
```

你会发现新 Claude 实例不需要任何额外解释就能继续工作。这就是"文件系统作为记忆"——上下文窗口会丢，但文件不会。

## 小结

怎么知道你的 Harness 在变好？有一个简单的指标：**你在对话里重复说的话越来越少**。

如果你还在每次对话开头提醒 Claude 用什么包管理器、跑什么测试命令、不能动哪些文件——说明这些知识还停留在 prompt 层，没有沉淀到 Harness 里。

当你发现自己只需要说「做这个功能」，剩下的 Claude 自己知道怎么做、做完自动检查、格式自动统一——那就对了。

这篇文章的核心不是新命令，而是一件更重要的事——**给你一个框架，让你看清自己在做什么**。命令会过时、功能会变化、产品会迭代，但**设计好的工作环境让 Agent 更强**这个原则不会变。
