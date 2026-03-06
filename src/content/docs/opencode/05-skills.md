---
title: Skills 工作流：内置 Skills + 自定义 + 工程化实践
description: 掌握 Skills 机制，从使用内置 Skills 到编写自定义工作流
sidebar:
  order: 5
---

## 本节目标

读完本节，你应该拿到以下结果：

- 理解 Skills 的本质——不是命令别名，而是把工程行为标准化的流程模板
- 掌握 Skills 的加载机制和执行流程
- 能列出常用内置 Skills 并知道各自的使用场景
- 能编写一个自定义 Skill（文件格式、放置位置、frontmatter 结构）
- 了解多 Skills 的组织方式、优先级和复用模式

---

## 1. Skills 是什么

### 1.1 一句话定义

**OpenCode 是执行器，Skills 是方法论。**

Skills 把"该怎么做"固化成标准流程。它不是让你多输几条命令，而是把一套工程行为模板化——谁来做、先做什么、做到什么算完成，都写在 Skill 文件里。

### 1.2 和 Claude Code 的关系

如果你用过 Claude Code 的 Custom Instructions 或 Custom Commands，Skills 是同一类东西，但更结构化：

| 对比项 | Claude Code | OpenCode Skills |
| --- | --- | --- |
| 自定义指令 | `CLAUDE.md` 全局注入 | `OPENCODE.md` 全局注入（兼容 `CLAUDE.md`） |
| 命令模板 | Custom Commands（`.claude/commands/`） | Skills（`.opencode/skills/`） |
| 结构化程度 | Markdown 自由格式 | frontmatter + Markdown，有标准字段 |
| 分发方式 | 手动复制 | 支持插件分发（如 Superpowers） |

### 1.3 不用 Skills vs 用 Skills

| 对比项 | 不用 Skills | 用 Skills |
| --- | --- | --- |
| 需求阶段 | 一上来就让模型写代码 | 先用 `/brainstorming` 收敛需求 |
| 执行阶段 | 边聊边改，容易跑偏 | 用 `/writing-plans` 固定步骤与验收标准 |
| 实现阶段 | 单线程慢慢做 | 用并行子代理拆任务 |
| 质量阶段 | 提交前靠人工感觉 | 用 code review 流程兜底 |
| 结果稳定性 | 同题多次结果差异大 | 产出风格和过程更稳定 |

一句话总结：**Skills 帮你把"会用 AI"升级成"可重复交付"。**

---

## 2. Skills 加载和执行机制

### 2.1 加载位置

OpenCode 按以下顺序加载 Skills（后加载的同名 Skill 会覆盖先加载的）：

| 优先级 | 位置 | 作用域 | 说明 |
| --- | --- | --- | --- |
| 1（最低） | `~/.config/opencode/skills/` | 全局 | 所有项目共享的 Skills |
| 2 | 插件目录（如 Superpowers 安装的） | 全局 | 通过插件分发的 Skills |
| 3（最高） | `.opencode/skills/` | 项目级 | 当前项目专属的 Skills |

项目级 Skills 优先级最高，可以覆盖全局同名 Skill。

### 2.2 文件结构

每个 Skill 是一个目录，包含一个 `SKILL.md` 文件：

```
.opencode/skills/
  └── my-skill/
      └── SKILL.md
```

或者在全局目录：

```
~/.config/opencode/skills/
  └── superpowers/
      ├── brainstorming/
      │   └── SKILL.md
      ├── writing-plans/
      │   └── SKILL.md
      └── dispatching-parallel-agents/
          └── SKILL.md
```

### 2.3 执行方式

在 OpenCode 对话中，使用 `/` 加 Skill 名称来触发：

```
/brainstorming
/writing-plans
/dispatching-parallel-agents
```

OpenCode 会读取对应的 `SKILL.md`，将其中的指令注入到当前会话上下文，引导模型按照预设流程执行。

---

## 3. 内置 Skills 速览

以下是通过 [Superpowers](https://github.com/obra/superpowers) 插件提供的常用内置 Skills：

### 3.1 需求与规划类

| Skill | 命令 | 用途 |
| --- | --- | --- |
| **brainstorming** | `/brainstorming` | 需求收敛。让模型先把需求问清楚，输出结构化的需求确认稿，不直接写代码 |
| **writing-plans** | `/writing-plans` | 计划制定。把需求确认稿变成可执行计划，明确每一步的产出和验收标准 |

### 3.2 执行与协作类

| Skill | 命令 | 用途 |
| --- | --- | --- |
| **dispatching-parallel-agents** | `/dispatching-parallel-agents` | 并行执行。把独立任务拆给子代理并行处理 |
| **subagent-driven-development** | `/subagent-driven-development` | 子代理驱动开发。更细粒度的任务委派模式 |

### 3.3 质量保障类

| Skill | 命令 | 用途 |
| --- | --- | --- |
| **code-review** | `/code-review` | 提交前代码审查，覆盖行为回归、边界条件、测试缺口 |

### 3.4 工具类

| Skill | 命令 | 用途 |
| --- | --- | --- |
| **playwright** | `/playwright` | 浏览器自动化测试 |
| **git-master** | `/git-master` | 原子化 Git 提交，保持提交历史清晰 |

### 3.5 标准工作流

对于中大型任务，推荐按以下顺序组合使用 Skills：

```
/brainstorming          --> 收敛需求，输出需求确认稿
/writing-plans          --> 制定执行计划
/dispatching-parallel-agents  --> 并行实现
/code-review            --> 提交前审查
```

每一步都有明确的输入和输出，前一步的产出是后一步的输入。

---

## 4. Superpowers 安装

Superpowers 是目前最成熟的 Skills 合集。安装方式如下。

### 4.1 让 AI 安装（推荐）

把以下文字粘贴到 OpenCode 对话框：

```
Clone https://github.com/obra/superpowers to ~/.config/opencode/superpowers, then create directory ~/.config/opencode/plugins, then symlink ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js to ~/.config/opencode/plugins/superpowers.js, then symlink ~/.config/opencode/superpowers/skills to ~/.config/opencode/skills/superpowers, then restart opencode.
```

### 4.2 验证安装

```bash
# 检查插件链接
ls -la ~/.config/opencode/plugins

# 检查 skills 链接
ls -la ~/.config/opencode/skills
```

确认 `superpowers.js` 和 `superpowers` 目录的软链接指向正确路径。

启动 OpenCode 后，输入 `/brainstorming` 测试。如果模型按照需求收敛流程引导你，说明安装成功。

---

## 5. 自定义 Skills 编写

### 5.1 文件格式

每个 Skill 由一个目录和其中的 `SKILL.md` 文件组成。`SKILL.md` 包含两部分：frontmatter（元数据）和正文（指令内容）。

```markdown
---
name: my-custom-skill
description: 这个 Skill 的用途说明
---

# Skill 正文

这里写具体的指令内容。模型在执行这个 Skill 时，会把正文作为上下文注入。

## 执行步骤

1. 第一步：做什么
2. 第二步：做什么
3. 第三步：做什么

## 验收标准

- 条件 A 满足
- 条件 B 满足
```

### 5.2 frontmatter 字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | Skill 名称，也是 `/` 命令触发时的标识符 |
| `description` | 是 | 简短描述，帮助模型理解何时使用这个 Skill |

### 5.3 放置位置

| 作用域 | 路径 | 适用场景 |
| --- | --- | --- |
| 项目级 | `.opencode/skills/<skill-name>/SKILL.md` | 只在当前项目使用 |
| 全局 | `~/.config/opencode/skills/<skill-name>/SKILL.md` | 所有项目共享 |

项目级 Skill 会覆盖同名的全局 Skill。

### 5.4 正文编写原则

写 Skill 正文时，遵循以下原则：

1. **明确角色**——告诉模型它在这个流程中扮演什么角色
2. **拆解步骤**——用编号列表写清楚执行顺序
3. **定义输入输出**——说明这个 Skill 接收什么、产出什么
4. **设定验收标准**——让模型知道"做到什么算完成"
5. **限制范围**——明确告诉模型不该做什么，避免发散

---

## 6. 实战示例：写一个自定义 Skill

下面写一个实际可用的 Skill：`api-design`，用于在开发 API 之前先做接口设计评审。

### 6.1 创建目录

```bash
mkdir -p .opencode/skills/api-design
```

### 6.2 编写 SKILL.md

在 `.opencode/skills/api-design/SKILL.md` 中写入：

```markdown
---
name: api-design
description: API 接口设计评审，在写代码之前先确认接口规范
---

# API 接口设计评审

你现在是一位 API 设计评审员。在用户开始写实现代码之前，先帮助他们把接口设计做扎实。

## 执行步骤

1. 询问用户要设计的 API 功能和业务背景
2. 列出所有需要的 API 端点（方法 + 路径 + 简要说明）
3. 对每个端点，明确以下内容：
   - 请求参数（路径参数、查询参数、请求体）
   - 响应结构（成功响应、错误响应）
   - 认证要求
   - 速率限制（如有）
4. 检查以下常见问题：
   - 命名是否一致（复数/单数、驼峰/下划线）
   - 是否有遗漏的错误码
   - 分页、排序、过滤是否统一
   - 是否符合 RESTful 规范
5. 输出最终的接口文档（Markdown 格式）

## 输出格式

最终产出一份 Markdown 格式的 API 接口文档，包含：
- 端点列表总览
- 每个端点的详细定义
- 公共错误码定义
- 使用示例

## 限制

- 这个阶段只做设计，不写实现代码
- 不要假设技术栈，先问用户
- 如果用户的需求不清晰，先追问，不要猜
```

### 6.3 使用

在 OpenCode 中直接输入：

```
/api-design
```

模型会按照 SKILL.md 中定义的流程，引导你完成 API 接口设计评审。

---

## 7. Skills 工程化实践

### 7.1 多 Skills 组织方式

当你的 Skills 越来越多时，按以下方式组织：

```
.opencode/skills/
  ├── brainstorming/          # 需求收敛（来自 Superpowers）
  │   └── SKILL.md
  ├── writing-plans/          # 计划制定（来自 Superpowers）
  │   └── SKILL.md
  ├── api-design/             # 自定义：API 设计评审
  │   └── SKILL.md
  ├── db-migration/           # 自定义：数据库迁移流程
  │   └── SKILL.md
  └── deploy-checklist/       # 自定义：部署检查清单
      └── SKILL.md
```

命名建议：

- 用小写字母和连字符（`api-design`，不要 `ApiDesign`）
- 名称即用途，看名字就知道干什么

### 7.2 优先级规则

当项目级和全局存在同名 Skill 时：

| 场景 | 结果 |
| --- | --- |
| 全局有 `brainstorming`，项目没有 | 使用全局版本 |
| 全局有 `brainstorming`，项目也有 | 使用项目版本（覆盖全局） |
| 全局没有，项目有 `api-design` | 使用项目版本 |

利用这个机制，你可以：

- 在全局放通用 Skills（适用于所有项目）
- 在项目级放定制 Skills（覆盖或补充全局）

### 7.3 复用模式

**模式一：团队共享**

把项目级 Skills 提交到 Git 仓库，团队所有人拉取后自动生效：

```
your-project/
  ├── .opencode/
  │   └── skills/
  │       ├── api-design/
  │       ├── code-review/
  │       └── deploy-checklist/
  ├── src/
  └── ...
```

**模式二：个人全局库**

把你常用的 Skills 放在全局目录，所有项目共享：

```
~/.config/opencode/skills/
  ├── brainstorming/
  ├── writing-plans/
  └── my-common-skills/
```

**模式三：插件分发**

像 Superpowers 一样，把一组 Skills 打包成插件，通过 Git 仓库 + 符号链接分发。适合在组织内大规模推广。

### 7.4 与 Rules 的配合

Skills 和 Rules 各有分工：

| 机制 | 作用 | 触发方式 |
| --- | --- | --- |
| Rules（`OPENCODE.md`） | 全局行为约束，始终生效 | 自动注入每次对话 |
| Rules（`.opencode/rules/*.md`） | 目录级行为约束 | 进入对应目录时自动注入 |
| Skills | 任务流程模板，按需触发 | 用 `/skill-name` 手动触发 |

最佳实践：

- Rules 放"始终要遵守的规则"（代码风格、命名规范、安全约束）
- Skills 放"特定任务的执行流程"（需求评审、API 设计、部署检查）

---

## 8. 常见问题

### Skill 命令输入后没反应

检查清单：

1. Skill 目录名和 SKILL.md 中的 `name` 字段是否一致
2. 文件是否放在了正确的路径（`.opencode/skills/<name>/SKILL.md`）
3. frontmatter 格式是否正确（`---` 包裹，YAML 语法）

### 自定义 Skill 和内置 Skill 冲突

项目级 Skill 会覆盖全局同名 Skill。如果你想保留内置版本，给自定义 Skill 换个名字。

### 什么时候不需要用 Skills

- 改一行文案、修一个拼写错误——直接说就行
- 一次性脚本验证，生命周期很短——不需要套完整流程
- 已经非常明确知道要做什么——直接执行更快

Skills 的价值在中大型任务和团队协作场景中最明显。小任务不需要强行使用。

### Superpowers 更新后怎么同步

```bash
cd ~/.config/opencode/superpowers
git pull
```

符号链接会自动指向最新内容，不需要重新安装。

---

## 9. 下一步

Skills 解决了"单个项目内的工作流标准化"问题。但当你同时使用多个模型供应商，需要按任务类型做模型分工和成本优化时，就需要更系统的多供应商协同方案。

下一章我们进入 [多供应商协同](/opencode/06-multi-provider/)，学习如何用 cc-switch 管理模型资源池，实现按任务分工和成本控制。
