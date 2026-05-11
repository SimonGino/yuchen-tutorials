---
title: .claude 目录与配置
description: 项目级配置体系与文件结构
sidebar:
  order: 2
---

![.claude 目录与配置](/images/claude-code/02-claude-directory.png)

上一篇我们从零走了一遍 Claude Code 的完整上手流程——安装、界面、模型、权限、Plan 模式，掌握那些之后你已经能用它干活了。

但用了一阵你大概会发现一个问题：每次新开一个会话，Claude 好像什么都不记得了。你上次告诉过它「这个项目用 pnpm 不用 npm」「测试要先跑 db:reset」「commit message 用中文」，下次它又从头问你一遍。更头疼的是技术栈的版本差异——你的项目用的是 MySQL 5.7，它给你写了个 8.0 才有的窗口函数；项目还跑在 JDK 8 上，它随手就用 `var` 和 `Records`；前端明明是 Vue 2，它上来就写 Composition API。这些问题本质都一样——**Claude 不了解你的项目背景**，每次都在用「通用最佳实践」猜，猜错了你还得花时间纠正，来回几轮对话全浪费在对齐上下文上。

这篇要解决的就是这个问题——**.claude 目录**。配好它，Claude Code 就从一个「每天来个新实习生」变成「读过你所有项目文档的老同事」。

## 本节目标

- 理解 `.claude` 目录的三层结构（知识层 / 行为层 / 能力层），建立整体心智模型
- 能独立写出一份有效的 `CLAUDE.md`，掌握该写什么、不该写什么
- 了解 `rules/` 和 Auto Memory 与 `CLAUDE.md` 的分工，知道何时拆分
- 能配出一份基础的 `settings.json`，完成从零搭建 `.claude` 目录的完整流程

## 1. .claude 目录全景概览

在深入每个配置文件之前，先建一个整体的心智模型。`.claude` 目录分两个地方，一个跟项目走，一个跟你走：

```text
your-project/                          # 项目级（提交到 Git，团队共享）
├── CLAUDE.md                          # 项目说明书
├── CLAUDE.local.md                    # 个人覆盖（自动 gitignore）
│
└── .claude/
    ├── settings.json                  # 权限 + 行为配置
    ├── settings.local.json            # 个人配置覆盖（自动 gitignore）
    ├── rules/                         # 模块化规则文件
    │   ├── code-style.md
    │   ├── testing.md
    │   └── api-conventions.md
    ├── skills/                        # 可复用技能包 → 第四篇详解
    ├── agents/                        # 自定义 AI 角色 → 第七篇详解
    └── output-styles/                 # 自定义输出风格

~/.claude/                             # 用户级（本地，跨项目生效）
├── CLAUDE.md                          # 全局个人偏好
├── settings.json                      # 全局配置
├── rules/                             # 用户级规则
├── skills/                            # 个人 Skills
├── agents/                            # 个人 Agents
└── projects/<project>/memory/         # Auto Memory 存储
```

看起来文件很多，但官方说得很明白：**大多数人只需要编辑 CLAUDE.md 和 settings.json，其余都是可选的。**

我把这些文件按功能分成三层来理解：

- **知识层**（告诉 Claude「你的项目是什么」）：CLAUDE.md、rules/、Auto Memory —— 本篇重点
- **行为层**（告诉 Claude「你喜欢怎么工作」）：settings.json —— 本篇讲基础，第三篇讲权限精调
- **能力层**（让 Claude 做更多事）：skills/、hooks、agents/ —— 后续专题详解
  - `skills/`：把重复操作封装成一键命令 → 第四篇
  - `hooks`：文件修改后自动跑 lint、提交前自动检查 → 第六篇
  - `agents/`：定义专用 AI 角色，Code Review Agent、Test Agent → 第七篇

今天这篇走完知识层和行为层。能力层先认个脸，知道有这些能力就行，不展开。

## 2. CLAUDE.md — 最重要的单一配置

CLAUDE.md 是 Claude Code 每次启动时自动读取的项目说明文件。你可以把它理解成给 AI 同事写的「入职手册」——读完这份文档，它就知道你的项目是什么、怎么跑、有什么规矩。

### 放在哪里

CLAUDE.md 支持多层级，各层的内容是**拼接加载**的，不是覆盖：

| 层级 | 位置 | 用途 | 共享范围 |
|------|------|------|---------|
| 项目说明 | `./CLAUDE.md` 或 `./.claude/CLAUDE.md` | 团队共享的项目文档 | 通过 Git 共享 |
| 用户偏好 | `~/.claude/CLAUDE.md` | 个人跨项目偏好 | 仅自己 |
| 本地覆盖 | `./CLAUDE.local.md` | 个人项目定制 | 仅自己（自动 gitignore） |

最常用的就是在项目根目录放一个 `CLAUDE.md`，团队提交到 Git，所有人共享。

有几个细节值得注意：

- **子目录也可以放 CLAUDE.md**：工作目录上方的 CLAUDE.md 在启动时全量加载，子目录的则是 Claude 读到对应目录的文件时才按需加载
- **`/compact` 后不会丢失**：压缩上下文后，Claude Code 会重新从磁盘读取 CLAUDE.md 注入——所以写在 CLAUDE.md 里的规则比聊天里说的更持久
- **HTML 注释会被自动去除**：`<!-- 这段不会进上下文 -->` 可以用来写给人看的备注，不浪费 token。但代码块内的注释不受影响

还有一个导入语法，可以在 CLAUDE.md 里引用其他文件：

```markdown
参考项目文档 @README.md 和 @package.json

# 引用外部指令
- git 工作流 @docs/git-instructions.md
- 个人偏好 @~/.claude/my-project-instructions.md
```

路径基于当前文件所在目录解析，支持递归导入，最大 5 层深度。

如果你的项目里有 `AGENTS.md`（比如从其他 AI 工具迁移过来的），注意 Claude Code **不读** AGENTS.md，需要在 CLAUDE.md 里用 `@AGENTS.md` 导入。

### 该写什么

一份好的 CLAUDE.md 通常包含这六个板块：

| 板块 | 写什么 | 举例 |
|------|-------|------|
| **项目概述** | 一句话说明这是什么项目 | "Express REST API, Node 20, PostgreSQL via Prisma" |
| **常用命令** | 构建、测试、部署命令 | `pnpm dev` / `pnpm test` / `pnpm build` |
| **架构边界** | 关键目录和模块划分 | "handlers 在 src/handlers/，domain 逻辑在 src/domain/" |
| **编码规范** | 命名、风格、约定 | "用 zod 做请求校验，返回格式统一 { data, error }" |
| **安全底线** | NEVER 列表 | "不准改 .env、lockfile、CI secrets" |
| **压缩指令** | Compact Instructions | "压缩时必须保留：架构决策、已改文件、验证状态" |

![CLAUDE.md 六大板块速查](https://oss.aiqqyc.com/2026/04/b4df70c2d5f32eb09069cb1f28ec57b6.png)

### 不该写什么

同样重要的是知道什么**不该**塞进去：

- ❌ 大段背景介绍（Claude 不需要你的公司历史）
- ❌ 完整 API 文档（用 `@path` 导入链接就好）
- ❌ 空泛原则（"写高质量代码" —— Claude 无法执行这种指令）
- ❌ Claude 通过读仓库即可推断的信息（它会自己 `ls` 和 `cat`）
- ❌ 已经在 linter / formatter 配置里的东西（别重复）
- ❌ 大量低频任务知识（放到 Skills 里按需加载）

**控制在 200 行以内。** Anthropic 官方自己的 CLAUDE.md 大约只有 2.5K tokens。写太长反而会挤占上下文空间，导致 Claude 对后续对话的响应质量下降——这个在第八篇上下文工程会详细讲。

## 3. CLAUDE.md 实战模板

说了这么多原则，直接看几个真实模板。

### 模板一：开发者项目

```markdown
# Project: Acme API

## Commands
npm run dev          # Start dev server
npm run test         # Run tests (Jest)
npm run lint         # ESLint + Prettier check
npm run build        # Production build

## Architecture
- Express REST API, Node 20
- PostgreSQL via Prisma ORM
- All handlers live in src/handlers/
- Shared types in src/types/

## Conventions
- Use zod for request validation in every handler
- Return shape is always { data, error }
- Never expose stack traces to the client
- Use the logger module, not console.log

## Watch out for
- Tests use a real local DB, not mocks. Run `npm run db:test:reset` first
- Strict TypeScript: no unused imports, ever
```

不到 20 行，但 Claude 读完就知道怎么跑你的项目、代码该怎么写、哪些坑不能踩。

### 模板二：工程化完整版

如果项目更复杂，可以加上安全底线和压缩指令：

```markdown
# Project Contract

## Build And Test
- Install: `pnpm install`
- Dev: `pnpm dev`
- Test: `pnpm test`
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint`

## Architecture Boundaries
- HTTP handlers live in `src/http/handlers/`
- Domain logic lives in `src/domain/`
- Do not put persistence logic in handlers
- Shared types live in `src/contracts/`

## Coding Conventions
- Prefer pure functions in domain layer
- Do not introduce new global state without explicit justification
- Reuse existing error types from `src/errors/`

## NEVER
- Modify `.env`, lockfiles, or CI secrets without explicit approval
- Remove feature flags without searching all call sites
- Commit without running tests

## ALWAYS
- Show diff before committing
- Update CHANGELOG for user-facing changes

## Verification
- Backend changes: `make test` + `make lint`
- API changes: update contract tests under `tests/contracts/`
- UI changes: capture before/after screenshots

## Compact Instructions
Preserve:
1. Architecture decisions (NEVER summarize)
2. Modified files and key changes
3. Current verification status (pass/fail commands)
4. Open risks, TODOs, rollback notes
```

这个模板来自 Tw93 的实战总结。注意最后的 `Compact Instructions`——它告诉 Claude 在压缩上下文时哪些信息必须保留，不留这个的话压缩算法可能把关键的架构决策也丢掉。

### 模板三：非开发者 / 内容创作者

CLAUDE.md 不只是给程序员用的。如果你用 Claude Code 做内容创作、数据分析，同样可以配：

```markdown
# 我的信息
- 职业：内容运营
- 主要工作：写文章、整理素材、数据分析

# 工作规则
- 所有输出用中文
- 文件命名格式：YYYY-MM-DD-标题
- 保存路径：~/Documents/工作/

# 风格偏好
- 写作风格：简洁、口语化
- 输出格式：优先用 Markdown
```

100 字不到，但 Claude 知道了你是谁、怎么命名文件、用什么语言输出。

### 怎么写出你自己的 CLAUDE.md

模板看了三个，但你的项目情况肯定和别人不一样。与其抄一份改改，不如掌握写 CLAUDE.md 的方法。

**方法一：让 Claude 帮你生成初版**

最快的方式——在项目目录下输入 `/init`，Claude 会自动分析你的项目结构、package.json、代码风格，生成一份 CLAUDE.md 初稿。你在这个基础上删删改改，比从零开始写快得多。

如果你想要更智能的初始化，可以设置环境变量 `CLAUDE_CODE_NEW_INIT=1`，启用交互式多阶段流程——Claude 会先用子 Agent 探索你的项目，问你几个问题，然后生成一份更精准的提案让你审查确认。

**方法二：从踩坑开始写**

一开始什么都不写，直接用。等你发现 Claude 犯了一个错——比如你的项目用 pnpm 它给你写 npm，你的数据库是 MySQL 5.7 它给你用窗口函数，你的 commit message 要求中文它写英文——纠正它之后，马上加一行到 CLAUDE.md 里。

Claude Code 创始人 Boris Cherny 推荐的方法更直接：每次纠正完错误后让 Claude 自己更新——

> "Update your CLAUDE.md so you don't make that mistake again."

**每次被坑一次就补一条，这就是最好的迭代方式。** 用两三周下来，你的 CLAUDE.md 就自然长成了一份精准的项目说明书，而且每一条都是真正有用的。

**方法三：问自己三个问题**

如果你想从第一天就写一份还不错的 CLAUDE.md，问自己这三个问题：

1. **新人入职第一天，你会告诉他什么？** — 怎么跑项目、代码放哪里、有什么规矩
2. **你被 Claude 坑过什么？** — 用错版本、改错文件、格式不对，统统写进去
3. **你重复说过哪些话？** — 每次都要提醒的事就该写进配置里，不要靠嘴说

写完之后 `/insight` 让 Claude 分析当前会话，它会主动提炼出值得沉淀的规则。定期 review，删掉过时条目。

### 常见误区

| 误区 | 后果 | 正确做法 |
|------|------|---------|
| 写太长（500+ 行） | 上下文先被自己污染，指令遵循度下降 | 控制在 200 行以内，拆到 rules/ |
| 写太笼统（"写高质量代码"） | Claude 无法执行，等于没写 | 写具体可执行的指令 |
| 把代码全文贴进去 | 浪费大量 token | 用 `@path` 导入引用 |
| 写完就不管了 | 项目演进后 CLAUDE.md 过时 | 和项目一起迭代 |

## 4. rules/ + Auto Memory — 知识层的两个补充

CLAUDE.md 是「入职手册」，但有些东西放在里面不太合适——比如强制约束、路径相关的规则、以及 Claude 自己积累的经验。这两个补充机制解决了这些问题。

### rules/：红线清单

`.claude/rules/` 下放 .md 文件，每个文件覆盖一个主题。和 CLAUDE.md 的分工是：**CLAUDE.md 放上下文信息，rules 放硬性约束。**

最直接的用法——当你的 CLAUDE.md 超过 200 行时，把强制规则拆出来：

```text
.claude/rules/
├── code-style.md          # 代码风格约束
├── testing.md             # 测试规范
└── api-conventions.md     # API 设计规则
```

rules 还支持一个 CLAUDE.md 做不到的事：**按路径限定生效范围**。比如前端和后端需要不同的规则：

```yaml
---
paths:
  - "src/api/**/*.ts"
---

# API 开发规则
- 所有 API 端点必须包含输入校验
- 使用标准错误响应格式
- 不要在 handler 里写持久化逻辑
```

这个规则只在 Claude 读到 `src/api/` 下的 TypeScript 文件时才加载，不会污染处理前端组件时的上下文。

支持的 glob 模式：`**/*.ts`、`src/**/*`、`*.{ts,tsx}` 等。支持子目录递归和符号链接。

用户级规则放在 `~/.claude/rules/`，对所有项目生效，加载优先级低于项目级。

**什么时候用 rules 而不是 CLAUDE.md：**
- CLAUDE.md 太长需要拆分时
- 不同目录需要不同规则时
- 规则是强制约束而非上下文信息时

### Auto Memory：Claude 自己的笔记本

CLAUDE.md 是你写给 Claude 的，Auto Memory 反过来——**是 Claude 写给自己的**。

Claude Code 在工作过程中会自动记录有用的信息：这个项目用什么构建工具、之前调试时发现了什么坑、你的代码风格偏好是什么。这些笔记存在 `~/.claude/projects/<project>/memory/` 下，下次开会话时自动加载前 200 行。

你也可以主动让它记：「记住我们用 pnpm 不用 npm」，它会写到 memory 文件里。

```text
~/.claude/projects/<project>/memory/
├── MEMORY.md              # 主记忆文件（前 200 行自动加载）
├── debugging.md           # 主题记忆（按需读取）
└── api-conventions.md     # 主题记忆（按需读取）
```

几个关键点：
- 默认开启，可通过 `/memory` 命令或 `autoMemoryEnabled` 配置项关闭
- **机器本地**存储，不通过 Git 共享——每个人的 memory 是独立的
- 同一个 Git 仓库的所有 worktree 共享同一份 memory
- 主题文件（如 `debugging.md`）不自动加载，Claude 需要时才去读

### 三者分工

| | CLAUDE.md | rules/ | Auto Memory |
|---|---|---|---|
| **谁写的** | 你 | 你 | Claude |
| **是什么** | 入职手册 | 红线清单 | 工作笔记 |
| **何时加载** | 每次启动 | 启动 / 按路径触发 | 每次启动（前 200 行） |
| **提交 Git** | ✅ | ✅ | ❌（本地） |
| **典型内容** | 项目概述、命令、规范 | 强制约束、路径规则 | 经验、发现、偏好 |

用 `/memory` 命令可以查看当前会话加载了哪些 CLAUDE.md、rules 和 memory 文件。

## 5. settings.json — 行为层配置

settings.json 控制的是 Claude Code 的**行为偏好**——用什么模型、哪些操作需要确认、注入什么环境变量。

### 文件位置和优先级

和 CLAUDE.md 类似，settings.json 也有多层：

| 优先级 | 位置 | 用途 | 提交 Git |
|--------|------|------|---------|
| 最高 | `.claude/settings.local.json` | 个人项目覆盖 | ❌ |
| 中 | `.claude/settings.json` | 团队共享配置 | ✅ |
| 最低 | `~/.claude/settings.json` | 个人全局配置 | ❌ |

优先级高的覆盖低的。数组类配置（如权限规则）会拼接去重，标量配置取最具体的值。

### 最常用的配置项

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test *)",
      "Read(~/.zshrc)"
    ],
    "deny": [
      "Bash(curl *)",
      "Read(./.env)",
      "Read(./.env.*)"
    ]
  },
  "env": {
    "CLAUDE_CODE_EFFORT_LEVEL": "max"
  }
}
```

几个要点：
- **`$schema` 行**：加上它，在 VS Code / Cursor 里编辑 settings.json 时会有自动补全和校验
- **`permissions`**：控制哪些操作免确认（allow）、哪些直接禁止（deny）。这里只讲基础用法，allow / ask / deny 的完整语法和实战案例在第三篇展开
- **`env`**：注入环境变量，不用每次在终端 `export`
- **`hooks`**、**`mcpServers`**：也在 settings.json 里配置，分别在第六篇和第五篇详解

用 `/config` 命令可以在 Claude Code 里直接查看和修改配置，比手动编辑 JSON 方便。

### settings.json 怎么分层

settings.json 有全局和项目两层，什么放哪里？一个简单的判断标准：

**放全局**（`~/.claude/settings.json`）的是跟**你这个人**走的偏好：
- 默认模型和 effort 级别（比如你是 Max 用户就全局设 Opus）
- API 中转的地址和密钥（第一篇讲过）
- 你个人习惯的环境变量

**放项目级**（`.claude/settings.json`）的是跟**这个项目**走的规则：
- 权限配置（哪些命令免确认、哪些文件禁止读）
- 项目特定的环境变量
- 提交到 Git，团队统一

权限的基本思路就一句话：**高频操作免确认，危险操作拦住。** 比如 `pnpm run *` 放行（开发时跑 dev/test/lint 太频繁了），`rm -rf *` 和 `.env` 文件禁掉。具体的权限语法和更多实战案例，下一篇展开讲。

## 6. 从零搭一套 .claude 目录

说了这么多概念和模板，最后来一个实操步骤，从零开始搭建。

### Step 1：用 /init 生成初版 CLAUDE.md

在项目目录下启动 Claude Code，输入：

```text
/init
```

它会分析你的项目结构，自动生成一份 CLAUDE.md 初稿。如果已经有 CLAUDE.md，它会建议改进而不是覆盖。

如果你想要更智能的初始化，可以设置环境变量 `CLAUDE_CODE_NEW_INIT=1`，启用交互式多阶段流程——Claude 会先用子 Agent 探索你的项目，问你几个问题，然后生成一份更精准的提案让你审查确认。

### Step 2：补 rules/

如果你的 CLAUDE.md 已经超过 200 行，或者不同目录需要不同规则，就开始拆分：

```bash
mkdir -p .claude/rules
```

把 CLAUDE.md 里的强制约束（NEVER / ALWAYS 列表、特定目录的编码规范）拆成独立文件。需要路径限定的加 YAML frontmatter。

### Step 3：配 settings.json

```bash
# 创建项目级配置
cat > .claude/settings.json << 'EOF'
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git status)",
      "Bash(git diff *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Read(./.env)"
    ]
  }
}
EOF
```

### Step 4：确认 Git 提交策略

| 提交到 Git | 不提交（自动 gitignore） |
|-----------|------------------------|
| `CLAUDE.md` | `CLAUDE.local.md` |
| `.claude/settings.json` | `.claude/settings.local.json` |
| `.claude/rules/` | `~/.claude/` 下所有内容 |
| `.claude/skills/` | Auto Memory |
| `.claude/agents/` | |

Claude Code 会自动把 `.local` 文件加入 gitignore，不需要你手动操作。

### Step 5：持续维护

- **和项目一起迭代**：新增了模块？更新 CLAUDE.md 的架构部分。改了构建方式？更新常用命令
- **每次 Claude 犯错 → 让它更新 CLAUDE.md**：这是复利，用得越久越少犯同样的错
- **用 `/insight` 提炼经验**：让 Claude 分析当前会话，找出值得沉淀的规则
- **定期 review**：每隔一两周看一眼，删掉过时条目

渐进式的搭建路径可以这么走：

```text
/init 生成 CLAUDE.md
    ↓
加 settings.json（基本的 allow/deny）
    ↓
用一阵子，发现重复操作 → 写第一个 Skill（第四篇会讲）
    ↓
CLAUDE.md 太长 → 拆到 rules/
    ↓
有跨项目的个人偏好 → 写 ~/.claude/CLAUDE.md
```

不用一步到位。先把 CLAUDE.md 写好，其他的用着用着自然知道什么时候该加。

## 7. 配好之后的效果

说了这么多配置，你可能想问：配完了真的有用吗？

分享一个我自己的真实体验。配 .claude 目录之前，我每次开新会话都要花 5-10 分钟对齐上下文——告诉它项目结构、技术栈、命名规范、测试怎么跑。一天开四五个会话，光这个就浪费半小时以上。

配好之后，新会话一启动就直接进入状态。我说「帮我给用户模块加个导出功能」，它已经知道项目用的是什么框架、代码放哪个目录、测试怎么跑、commit message 用什么格式。省掉的不只是时间，而是**你不再需要把精力花在「教 AI 了解你的项目」上，可以直接聚焦在业务问题本身**。

而且 Auto Memory 带来的复利效应是真实的——用了两三周之后，Claude 对项目的熟悉程度会明显提升。它记住了你上次踩的坑、你偏好的写法、你项目里的特殊约定。这种感觉就像一个实习生终于转正了。

## 常见问题

**Q：CLAUDE.md 和 rules/ 内容有重叠，该怎么分？**

CLAUDE.md 放「让 Claude 理解项目背景」的上下文信息；rules/ 放「Claude 必须遵守」的硬性约束。简单判断：如果是「告诉 Claude 这个项目是什么」就放 CLAUDE.md，如果是「这件事绝对不能做」就放 rules/。CLAUDE.md 超过 200 行时也可以把 NEVER/ALWAYS 列表拆到 rules/ 里。

**Q：CLAUDE.md 写太长会有什么问题？**

会挤占对话的上下文窗口。Claude 的上下文是有限的，CLAUDE.md 占的越多，留给实际对话的空间越少。我踩过的坑是早期把整个 README 粘进去，结果发现它对后面的指令响应开始变慢、遗漏细节。控制在 200 行以内，大文档用 `@path` 导入引用。

**Q：Auto Memory 会不会记错误信息？**

会的，这是真实存在的问题。如果你发现 Claude 固执地重复某个错误的做法，`/memory` 查看一下记忆内容，手动删掉有问题的条目就好。或者主动说「不对，我们的约定是 X，请更新你的记忆」，它会修正。

**Q：settings.json 的权限写错了会怎样？**

不会崩溃，只是可能导致原本应该拦截的操作没拦住（deny 写漏了），或者原本应该放行的操作一直弹确认框（allow 没加）。建议加上 `$schema` 行，编辑器会给出校验提示。

**Q：`CLAUDE.local.md` 和 `settings.local.json` 真的会自动 gitignore 吗？**

是的，Claude Code 会自动处理，不需要手动加到 `.gitignore`。但如果你的仓库有自定义的 gitignore 规则，建议验证一下——`git status` 看到这两个文件显示 ignored 就没问题。

**Q：团队成员如果不用 Claude Code，这些配置文件会影响他们吗？**

不会。`CLAUDE.md` 就是普通的 Markdown 文件，`.claude/settings.json` 就是普通的 JSON 文件，对不用 Claude Code 的人来说完全无感。唯一需要沟通的是让团队把这些文件纳入正常的 code review 流程，毕竟权限配置涉及安全。
