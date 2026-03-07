---
title: 分享与分发：把 Skill 发布出去
description: 掌握 Skill 的分享渠道和发布规范
sidebar:
  order: 6
---

## 本节目标

读完本节，你应该能：

- 了解 4 种分享 Skill 的渠道
- 知道发布前需要做哪些规范化
- 选择适合自己的分发方式

---

## 1. 四种分享渠道

| 方式 | 操作 | 适合场景 |
|------|------|----------|
| GitHub 开源 | 创建仓库，包含 SKILL.md + 代码 | 想让更多人用、接受 PR |
| 提交到 clawhub | 按平台规范提交 | 想进入 OpenClaw 聚合生态 |
| skill.sh 发布 | 通过 Vercel Skills 生态发布 | 想被 `npx skills find` 搜到 |
| 本地自用 | 放在 `~/.claude/skills/` 或工作区 | 只给自己用，不想公开 |

---

## 2. 发布前的规范化清单

不管分不分享，建议都把 SKILL.md 写规范。哪怕是给自己看的，三个月后你回来改的时候会感谢自己。

### 2.1 必须有的字段

```yaml
---
name: your-skill-name        # 唯一标识，用英文和连字符
description: 一句话说明功能     # AI 靠这个匹配触发
---
```

### 2.2 建议补充的字段

```yaml
---
name: your-skill-name
description: 一句话说明功能
version: 1.0.0
author: your-name
requires:
  bins: [node]               # 运行时依赖
  env: [API_KEY]             # 需要的环境变量
---
```

### 2.3 检查清单

- [ ] `name` 全局唯一，不和常见 Skill 冲突
- [ ] `description` 包含核心关键词，AI 能正确匹配
- [ ] 正文有明确的步骤和验收标准
- [ ] 外部依赖在 `requires` 中声明
- [ ] 敏感信息通过环境变量注入，不硬编码

---

## 3. GitHub 开源发布

最通用的方式。推荐的仓库结构：

```
my-skill/
├── SKILL.md          # Skill 定义文件
├── README.md         # 使用说明（给人看的）
├── scripts/          # 辅助脚本（如果有）
└── examples/         # 示例输入输出
```

发布后，其他人可以通过以下方式安装：

```bash
# 方式 1：npx
npx skills add your-username/your-skill

# 方式 2：手动 clone
git clone https://github.com/your-username/your-skill ~/.claude/skills/your-skill

# 方式 3：对话安装
# 直接告诉 AI："安装 https://github.com/your-username/your-skill"
```

---

## 4. 版本管理建议

- 使用 Git tag 标记版本：`git tag v1.0.0`
- 重大变更时更新 `description`，避免触发逻辑出错
- 保持向后兼容——如果必须破坏性变更，在 README 中说明迁移方式

:::note[待补充]
clawhub 和 skill.sh 的具体发布流程将在后续更新中补充。如果你已经在使用这两个平台，欢迎贡献经验。
:::

---

## 下一步

[第 07 章：实战应用 -- cc-switch + OMO + Skill 协同工作流](/skill/07-practice/)
