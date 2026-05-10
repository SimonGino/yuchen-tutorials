---
title: Skills 实战：写第一个 Skill
description: Skills 系统与从零写一个
sidebar:
  order: 4
---

![Skills 实战：写第一个 Skill](/images/claude-code/04-skills.png)

你有没有遇到过这种情况：每次让 Claude Code 帮你做代码审查，你都要重复说一遍「先看命名规范、再查有没有硬编码密钥、最后检查测试覆盖」？或者每次部署前都要提醒它「先跑测试、再改版本号、最后生成 changelog」？

说了三遍之后我就烦了。这些东西不应该每次都重复说，应该写下来让它自己记住。这就是 Skills 要解决的问题——**把你的经验封装成 Claude Code 能调用的技能包**，写一次，用无数次。

## 本节目标

- 理解 Skills 的完整结构（文件夹、SKILL.md、frontmatter 字段）
- 掌握三种 Skill 类型的写法：检查清单型、工作流型、领域专家型
- 了解 `context: fork`、工具限制、调用频率策略等高级用法
- 知道市面上几个值得装的 Skills 插件及其适用场景

## 1. Skills 是什么

有个类比我觉得很贴切：MCP 给了 Claude 一间专业厨房，锅碗瓢盆一应俱全；但光有厨房不够，你还得给它菜谱。**Skills 就是那份菜谱。**

经常有人误解 Skills「只不过是 markdown 文件」。其实 Skills 是**文件夹**——可以包含脚本、资源文件、参考文档、模板，Claude 会自动发现和使用这些内容。一个 Skill 的完整结构长这样：

```
my-skill/
├── SKILL.md           # 核心说明（必须有）
├── template.md        # 模板，让 Claude 填充
├── references/
│   └── api.md         # 参考文档（按需读取，不占常驻上下文）
└── scripts/
    └── validate.sh    # Claude 可以执行的脚本
```

和 MCP、Hooks、Subagent 的边界也很清晰：

- **MCP** = 给 Claude 新的动作能力（连接浏览器、数据库）
- **Skills** = 给 Claude 一套工作方法（怎么做一件事）
- **Hooks** = 强制约束和审计（做完之后自动检查）
- **Subagent** = 隔离执行环境（独立跑一个任务）

如果你之前用过 `.claude/commands/` 下的自定义命令——它已经合并进 Skills 了。旧的 commands 文件还能用，但新建的话建议直接用 `skills/` 目录。

## 2. 内置 Skills：开箱即用

在自己写 Skill 之前，先看看 Claude Code 自带的几个——直接能用，不需要任何配置。

### /simplify — 自动代码审查 + 重构

每次写完一段代码就跑一遍。它会并行启动三个审查 Agent：代码复用审查（找重复代码）、代码质量审查（查逻辑错误和边界情况）、效率审查（找性能瓶颈），然后汇总发现并自动修复。

```
/simplify                          # 审查所有最近变更
/simplify focus on error handling   # 聚焦错误处理
```

相当于写完代码自动 Code Review + 自动重构，省掉一轮人工审查。

### /batch — 大规模并行变更

把一个大任务拆成 5-30 个独立单元，每个在隔离的 Git Worktree 里并行执行。适合模式化的批量迁移——框架迁移、API 版本升级、给整个项目加 TypeScript 类型。

```
/batch migrate src/ from Jest to Vitest
/batch add TypeScript types to all JavaScript files in lib/
```

### /loop — 定时轮询

按间隔重复执行一个命令。监控部署、检查 CI 状态用得上。

```
/loop 5m check if the deploy finished
/loop 1h check for new PR comments
```

### skill-creator — 用 AI 写 AI 的技能

要创建新 Skill 不用手写，直接告诉 Claude「帮我创建一个 deploy 技能」，它会自动调用 skill-creator 帮你生成 SKILL.md、配好 frontmatter、建好目录结构。修改现有 Skill 也行：「修改我的 commit 技能，添加 changelog 生成」。

## 3. 写你的第一个 Skill

![SKILL.md 结构解剖](https://oss.aiqqyc.com/2026/04/a2a502b356f6004f1f4f63106455e691.png)

### 最小示例

在 `.claude/skills/review/` 下创建 `SKILL.md`：

```yaml
---
name: review
description: Review code changes for quality, security, and style issues
---

## Steps
1. Run `git diff --cached` to get staged changes
2. For each changed file, check:
   - Naming conventions match project style
   - No hardcoded secrets or credentials
   - Error handling is present
   - Tests cover the change
3. Output a summary: issues found, severity, suggested fixes

## Output Format
- ✅ Pass: No issues
- ⚠️ Warning: Minor issues (list them)
- ❌ Fail: Critical issues (list them with fix suggestions)
```

保存后在 Claude Code 里输入 `/review`，它就会按这个流程审查你的代码。

### Frontmatter 字段

`---` 之间的 YAML 头部控制 Skill 的行为：

| 字段 | 作用 |
|------|------|
| `name` | 显示名，省略则用目录名 |
| `description` | **最重要的字段**——Claude 靠这个判断什么时候该用这个 Skill |
| `disable-model-invocation` | 设为 `true`，Claude 不能自动调用，只能你手动 `/name` |
| `allowed-tools` | 这个 Skill 激活时 Claude 能用哪些工具 |
| `model` | 指定模型（比如用 Opus 做审查） |
| `context: fork` | 在独立上下文里跑，不污染主对话 |
| `agent` | 搭配 `context: fork` 用，指定跑在哪个 Agent 上 |
| `paths` | 只在匹配的文件路径下激活（如 `*.rs, src/**/*.ts`） |

### 参数和动态注入

Skill 支持参数传递：`/deploy staging` 会把 `staging` 填入 `$ARGUMENTS`。

更强大的是 `` !`command` `` 语法——在 Skill 内容发给 Claude 之前先跑一段 shell 命令，把输出注入进去：

```yaml
---
name: pr-summary
description: Summarize changes in a pull request
context: fork
agent: Explore
---

## Pull request context
- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`
- Changed files: !`gh pr diff --name-only`

## Your task
Summarize this pull request...
```

这样 Claude 读到的 Skill 内容已经包含了最新的 PR 数据，不需要它再去跑命令。

## 4. 三种 Skill 类型

写了几十个 Skill 之后，你会发现它们基本落在三种类型里：

### 类型一：检查清单型（质量门禁）

发布前跑一遍，确保不漏项：

```yaml
---
name: release-check
description: Use before cutting a release to verify build, version, and smoke test.
disable-model-invocation: true
---

## Pre-flight (All must pass)
- [ ] `cargo build --release` passes
- [ ] `cargo clippy -- -D warnings` clean
- [ ] Version bumped in Cargo.toml
- [ ] CHANGELOG updated
- [ ] `kaku doctor` passes on clean env

## Output
Pass / Fail per item. Any Fail must be fixed before release.
```

`disable-model-invocation: true` 是关键——发布是高风险操作，只能你手动触发，不让 Claude 自己决定要不要跑。

### 类型二：工作流型（标准化操作）

把多步骤操作固化下来，内置回滚方案：

```yaml
---
name: config-migration
description: Migrate config schema. Run only when explicitly requested.
disable-model-invocation: true
---

## Steps
1. Backup: `cp ~/.config/kaku/config.toml ~/.config/kaku/config.toml.bak`
2. Dry run: `kaku config migrate --dry-run`
3. Apply: remove `--dry-run` after confirming output
4. Verify: `kaku doctor` all pass

## Rollback
`cp ~/.config/kaku/config.toml.bak ~/.config/kaku/config.toml`
```

### 类型三：领域专家型（封装决策框架）

运行时出问题，让 Claude 按固定路径收集证据，不要瞎猜：

```yaml
---
name: runtime-diagnosis
description: Use when app crashes, hangs, or behaves unexpectedly at runtime.
---

## Evidence Collection
1. Run `kaku doctor` and capture full output
2. Last 50 lines of `~/.local/share/kaku/logs/`
3. Plugin state: `kaku --list-plugins`

## Decision Matrix
| Symptom | First Check |
|---|---|
| Crash on startup | doctor output → Lua syntax error |
| Rendering glitch | GPU backend / terminal capability |
| Config not applied | Config path + schema version |

## Output Format
Root cause / Blast radius / Fix steps / Verification command
```

## 5. 高级用法

### `context: fork` — 不污染主对话

有些 Skill 会产生大量输出（比如扫全仓库、跑完整测试），塞进主对话会挤占上下文。设 `context: fork` 让它在独立的子 Agent 里跑，只把结果摘要返回主线程。

### 工具限制

```yaml
allowed-tools: Read Grep Glob
```

只允许这个 Skill 用读取类工具，不能写文件也不能跑 Bash。适合审查类 Skill——你不希望审查员顺手改了代码。

### 调用频率策略

每个启用的 Skill，它的 `description` 会常驻在上下文里，占 token。所以：

- **高频（>1 次/会话）** → 保持默认，优化 description 长度
- **低频（<1 次/会话）** → 设 `disable-model-invocation: true`，手动触发
- **极低频（<1 次/月）** → 直接移除 Skill，改写到文档里

## 6. 写好 Skill 的原则与反模式

### description 是最重要的字段

Claude 靠 `description` 判断「什么时候该用这个 Skill」。写得太短会误触发，写得太长浪费上下文：

```yaml
# ❌ 太短，任何后端工作都会触发
description: help with backend

# ❌ 太长，浪费 45 tokens
description: |
  This skill helps you review code changes in Rust projects.
  It checks for common issues like unsafe code, error handling...
  Use this when you want to ensure code quality before merging.

# ✅ 精准，只有 9 tokens
description: Use for PR reviews with focus on correctness.
```

### 常见反模式

| 反模式 | 后果 | 正确做法 |
|--------|------|---------|
| description 写得模糊 | Claude 在不该用的时候用了 | 写清楚「when to use」，不是「what it does」 |
| 正文太长（几百行） | 上下文被挤占 | 大资料拆到 `references/` 目录，按需加载 |
| 一个 Skill 干五件事 | 触发逻辑混乱，每次调用都多余 | 拆成多个单一职责的 Skill |
| 有副作用却允许自动调用 | Claude 可能在不合适的时候触发高风险操作 | 设 `disable-model-invocation: true` |

之前看到有人分享说自己写了 30 个 Skills，读完 Anthropic 官方文章后发现基本全用错了。他犯的最典型的错误就是把 Skill 当成「保存的 Prompt」——写了一大段指令塞进 SKILL.md，没有步骤、没有输出格式、没有停止条件。结果就是 Claude 每次调用这个 Skill 的表现都不一样，有时候做多了，有时候少了一步。

后来他按官方建议重写：每个 Skill 有明确的触发条件、分步骤的操作流程、固定的输出格式。改完之后效果立竿见影——**Skill 不是模板，是工作流**，这个区别很关键。

## 7. 四个值得装的 Skills 插件

自己写 Skill 固然好，但社区里已经有人把整套方法论打包好了。这几个我都用过一段时间，说说真实感受。

先说背景：这几个插件本质上在解决同一个问题——**AI Agent 写代码太随性了**，容易跳过规划直接动手、质量忽高忽低、改完一个地方坏了另外三个。它们的解决思路都是用工作流来约束 AI，但侧重点很不一样。

### Superpowers — 流程纪律派

社区里 Star 最多的 Skills 框架，装上之后 Claude 每一轮都会走完整流程：先写 spec → 出计划 → 拆任务 → 执行 → 跑测试 → 代码审查 → 提交。

里面有几个 Skill 是真的解决了痛点：

- **verification-before-completion** — Claude 最让人头疼的毛病就是「说修好了但其实没修好」。这个 Skill 强制它在宣称完成之前跑验证，必须拿到通过的证据才算完
- **systematic-debugging** — 不让 Claude 瞎猜 bug 原因，按四阶段收集证据、定位根因
- **test-driven-development** — 强制先写测试再写实现，不是写完代码再补测试

说实话，大任务用 Superpowers 效果很好。但小任务——比如改个按钮样式、加个字段——也按这套完整流程走，就太重了。一个五分钟能搞定的事被拉成半小时，授权确认点到手酸，token 也烧得快。

### Compound Engineering — 知识复利派

这个插件的核心理念是「80% 规划和评审，20% 执行」。听起来像废话，但它有一个别人没有的杀手级功能：`/ce:compound`。

每次完成一个任务后跑一遍 `/ce:compound`，它会把这次犯的错、学到的东西、踩过的坑沉淀到知识库里。下次遇到类似情况，Claude 不会再犯同样的错。这就是它叫「复利」的原因——用得越久，Claude 越聪明。

另一个有意思的是 `/ce:ideate`，它会针对项目提出改善建议，还会排优先级、过滤掉不重要的。不过说实话，我实际用下来，它提出的改善点经常不痛不痒，需要你自己判断哪些值得做。

### Gstack — 产品打磨派

YC 现任总裁 Garry Tan 做的。这个定位就不太一样了——其他框架关注的是「怎么把代码写好」，Gstack 关注的是「你到底应不应该写这段代码」。

它把 Claude Code 变成一支 23 个 Agent 组成的虚拟团队，最让我印象深刻的是 `/office-hours`——真的像 YC 的 office hours 一样，对你的产品逻辑进行灵魂拷问。「你的用户是谁？」「这个功能解决了什么问题？」「有没有更简单的方案？」被 AI 追问几轮之后，很多你以为想清楚的事其实没想清楚。

`/plan-ceo-review` 从战略视角挑战你的计划，`/retro` 做每周复盘，`/learn` 把项目知识持续积累。不过它偏产品思维，如果你只是做纯技术重构、改个 bug，这套工具就有点大材小用了。

### Baoyu Skills — 不写代码的人也能用

如果你像我一样，不只是写代码，还做公众号、写内容，那 Baoyu Skills 必装。19 个 Skills 覆盖了内容创作全链路——从信息图生成（21 种布局 × 20 种风格）到 Markdown 转微信排版再到一键发布公众号。

这个系列文章的所有信息图和封面图就是用它生成的。

### 我的搭配方式

这几个不是互斥的，可以组合：

- **从 0 做产品** → 先用 Gstack 的 `/office-hours` 打磨方向，确认要做了再用 Superpowers 执行
- **日常开发** → Superpowers 就够了，但小任务关掉它直接对话
- **长期维护的项目** → Compound Engineering 沉淀知识，减少团队重复踩坑

## 8. Plugins 机制

上面这几个都是通过 Plugins 机制安装的。Plugins 是 Skills 的分发包——把 Skills、Agents、Hooks、MCP Server 打包成一个可安装的插件。用 `/plugin` 命令管理：

```bash
# 查看已安装的插件
/plugin list

# 从 Marketplace 安装
/plugin install plugin-name@marketplace-name

# 卸载
/plugin uninstall plugin-name
```

官方 Marketplace 在 `/plugin` 命令里直接浏览，分为代码智能、外部集成、开发工作流、输出样式四大类。GitHub 上搜 `claude-skills` 也能找到大量社区贡献的 Skills。

### 什么时候用 Skill，什么时候直接对话

| 场景 | 用 Skill | 直接对话 |
|------|---------|---------|
| 重复做同一件事（>3 次） | ✅ | |
| 需要固定步骤和输出格式 | ✅ | |
| 高风险操作需要内置安全检查 | ✅ | |
| 一次性的简单任务 | | ✅ |
| 还在探索怎么做的阶段 | | ✅ |

## 常见问题

**Q: Skill 装得越多越好吗？**

我自己最深的教训是早期装了太多 Skill，每个都开着自动调用，结果上下文被描述符占了一大块，Claude 反而变迟钝了。后来把低频的全改成手动触发、极低频的直接删掉，才恢复正常。**Skills 不是装得越多越好，而是每一个都要有明确的存在理由。**

**Q: 写了 Skill 但 Claude 从不用它/总在不该用的时候用，怎么办？**

九成是 `description` 写得不对。回头检查：它写的是「what it does」还是「when to use」？后者才是 Claude 的触发依据。另外确认没有设 `disable-model-invocation: true`——设了就只能手动触发。

**Q: Skill 内容很长，会占掉很多 token 吗？**

`description` 会常驻上下文，但 SKILL.md 正文和 `references/` 目录里的文件只在 Skill 被调用时才加载。所以正文可以写得详细，长资料塞 `references/` 目录，description 保持精简（10-15 tokens 为宜）。

**Q: 旧的 `.claude/commands/` 文件还能用吗？**

能用。Claude Code 会继续识别旧格式。但新建的建议直接用 `skills/` 目录，结构更清晰，支持子目录和脚本文件。

**Q: 有副作用的 Skill（比如部署、数据库迁移）怎么防止误触发？**

一定要设 `disable-model-invocation: true`。这样 Claude 永远不会主动调用它，只有你手动输入 `/skill-name` 才会执行。高风险操作必须如此。
