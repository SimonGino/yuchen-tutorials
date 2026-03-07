---
title: 进阶编排：Skill x 记忆 x 子Agent x 定时任务
description: 理解 Skill 在复杂系统中的编排模式和安全边界
sidebar:
  order: 8
---

## 本节目标

读完本节，你应该能：

- 理解 Skill 在多组件协同中的角色
- 了解 Skill 与 Memory、Sub-Agent、Automation 的组合模式
- 掌握 Skill 的安全与 Gating 机制

---

## 1. Skill x Memory：让 Agent 记住上下文

Skill 本身是无状态的——每次触发都从零开始。但结合 Memory 机制，可以让 Agent 在跨会话中积累经验。

**典型组合：**

| 场景 | Skill 职责 | Memory 职责 |
|------|-----------|------------|
| 代码审查 | 定义审查流程和检查清单 | 记住项目的编码规范和历史问题 |
| 需求收敛 | 引导 brainstorming 问答 | 记住用户的技术栈偏好和约束 |
| 书签导出 | 执行导出和去重逻辑 | 记住上次导出的位置，避免重复 |

**实践建议：**
- Skill 负责"怎么做"，Memory 负责"记住什么"
- 不要在 Skill 内部实现持久化逻辑——交给工具的 Memory 机制

---

## 2. Skill x Sub-Agent：多 Agent 分工

当任务复杂到需要多个 Agent 协作时，Skill 充当"调度规则"的角色。

**编排模式：**

```
主控 Agent（Sisyphus）
├── 用 /brainstorming Skill 收敛需求
├── 用 /writing-plans Skill 拆解任务
├── 分发子任务给子 Agent
│   ├── Oracle（用 systematic-debugging Skill 排错）
│   ├── Librarian（查文档、查实现）
│   └── Frontend Engineer（用前端规范 Skill 实现 UI）
└── 用 /code-review Skill 做最终验收
```

**关键原则：**
- 每个子 Agent 可以有自己的专属 Skill
- 主控 Agent 的 Skill 负责流程编排，不负责具体实现
- 子 Agent 之间通过主控 Agent 通信，不直接交互

---

## 3. Skill x Automation：定时任务

在 OpenClaw 等支持定时任务的工具中，Skill 可以被自动触发：

| 场景 | 触发方式 | Skill 作用 |
|------|---------|-----------|
| 每日书签导出 | 定时任务（每天 8:00） | 执行导出 + 去重 + 生成摘要 |
| 晨报 Digest | 定时任务（每天 7:00） | 汇总 Telegram 频道消息 + 分类 |
| 代码质量检查 | Git hook（push 前） | 执行 /code-review 流程 |

**实践建议：**
- 定时任务 + Skill 的组合需要确保幂等性（重复执行不产生副作用）
- 建议先手动跑通完整流程，再设置自动触发
- 监控执行日志，及时发现异常

---

## 4. 安全与 Gating 机制

当 Skill 生态扩大后，安全边界变得重要。

### 4.1 Gating（门控）

OpenClaw 支持在 Skill 中声明前置条件：

```yaml
---
name: my-skill
description: ...
requires:
  bins: [node, bun]           # 必须安装的命令行工具
  env: [API_KEY, SECRET_KEY]   # 必须设置的环境变量
---
```

加载 Skill 时，系统会自动检查这些条件。不满足则跳过加载，避免运行时报错。

### 4.2 安全边界

| 风险 | 防范 |
|------|------|
| 第三方 Skill 读取敏感数据 | 密钥只通过环境变量注入，不写入 Skill 文件 |
| Skill 执行破坏性命令 | 在沙箱或受限权限下运行第三方 Skill |
| Skill 版本被篡改 | 锁定 Git commit hash 而非跟踪 branch |
| 依赖链攻击 | 审查 Skill 的外部依赖，最小化信任范围 |

### 4.3 最佳实践

1. **第三方 Skill 当"不受信任代码"处理** — 先审查再使用
2. **敏感操作需要确认** — 在 Skill 中加入"执行前确认"步骤
3. **最小权限原则** — Skill 只请求它需要的权限
4. **版本锁定** — 生产环境使用固定版本，不跟踪 latest

:::note[待补充]
本章的实操案例（定时任务配置、多 Agent 编排的完整 walkthrough）将在后续更新中补充。
:::

---

## 课程总结

恭喜你完成了整个 Skill 教程。回顾一下你已经掌握的能力：

1. **找 Skill** — 3 个渠道快速搜索
2. **用 Skill** — 3 种安装方式 + 安全注意事项
3. **选 Skill** — 知道主流 Skill 各自解决什么问题
4. **写 Skill** — 7 步从零创建 + 质量评估
5. **调试 Skill** — 按症状快速定位问题
6. **分享 Skill** — 规范化 + 发布渠道
7. **用 Skill 工作** — 在真实项目中落地
8. **编排 Skill** — 与 Memory、Sub-Agent、Automation 协同

核心就一句话：**要么学会怎么找对你有用的 Skill，要么学会自己造一个。**

从找到第一个有用的 Skill 开始，你就会理解为什么说"没有 Skill 的 Agent 只是个摆设"。
