---
title: 调试与验证：Skill 不生效的排查指南
description: 快速定位 Skill 不触发、执行错误、冲突等常见问题
sidebar:
  order: 5
---

## 本节目标

读完本节，你应该能：

- 快速判断 Skill 不生效属于哪一类问题
- 按排查表逐步定位根因
- 了解各工具的调试差异

---

## 1. 四类常见问题排查表

| 问题 | 排查方向 | 修复方式 |
|------|----------|---------|
| Skill 没被触发 | 检查 frontmatter 的 `description` 是否和你的指令匹配 | 调整 description 关键词，确保 AI 能关联到 |
| 触发了但执行错误 | 检查依赖是否安装、环境变量是否配置 | 补装依赖，配置缺失的环境变量 |
| 改了 Skill 没生效 | 很多工具在会话开始时快照 Skill 列表 | 开一个新会话再试 |
| 和其他 Skill 冲突 | 检查 name 是否重名 | 调整优先级或重命名 |

---

## 2. frontmatter 检查清单

Skill 不触发时，先逐项检查 frontmatter：

```markdown
---
name: my-skill          # 必填，唯一标识
description: ...        # 必填，AI 靠这个判断是否匹配
---
```

| 检查项 | 正确示例 | 常见错误 |
|--------|---------|---------|
| `name` 唯一 | `wqq-x-bookmarks` | 和已有 Skill 重名 |
| `description` 包含关键词 | "导出社交平台书签到 Markdown" | 描述太泛："处理数据" |
| YAML 格式正确 | 冒号后有空格 | `name:my-skill`（缺空格） |
| 文件名正确 | `SKILL.md`（大写） | `skill.md`（部分工具不识别） |

---

## 3. 依赖与环境变量验证

如果 Skill 触发了但执行失败，优先检查：

**依赖检查：**

```bash
# 检查 Node.js 是否可用
node -v

# 检查 bun 是否可用（部分 Skill 依赖）
bun -v

# 检查 Python 是否可用
python3 --version
```

**环境变量检查：**

```bash
# 查看某个环境变量是否已设置
echo $API_KEY_NAME

# 检查 .env 文件是否存在
cat .env
```

:::tip[Gating 机制]
OpenClaw 支持 `requires.bins` 和 `requires.env` 字段，可以在 Skill 加载前自动检查依赖。如果你的 Skill 有外部依赖，建议在 frontmatter 中声明：

```yaml
---
name: my-skill
description: ...
requires:
  bins: [node, bun]
  env: [API_KEY]
---
```
:::

---

## 4. 各工具的调试差异

| 工具 | 查看已加载 Skill | 重新加载方式 | 调试建议 |
|------|-----------------|-------------|---------|
| Claude Code | 对话中问 "列出所有可用 skills" | 开新会话 | 检查 `~/.claude/skills/` 目录 |
| OpenCode | 会话中查看 Skill 列表 | 重启 OpenCode | 检查 `~/.config/opencode/skills/` 软链接 |
| OpenClaw | 管理面板查看 Skill 状态 | 热刷新或重启 Gateway | 检查 SKILL.md 格式和路径 |
| Codex | 启动时自动发现 | 重启 Codex | 检查 `~/.agents/skills/` 软链接目标 |

---

## 5. 排查流程总结

遇到 Skill 问题时，按这个顺序排查：

1. **文件存在吗？** — 确认 SKILL.md 在正确的目录下
2. **格式对吗？** — 检查 frontmatter 的 YAML 语法
3. **描述匹配吗？** — description 是否包含你指令中的关键词
4. **依赖齐全吗？** — 外部命令和环境变量是否就绪
5. **会话刷新了吗？** — 开新会话排除快照缓存问题
6. **有冲突吗？** — 检查是否有同名 Skill 覆盖

---

## 下一步

[第 06 章：分享与分发 -- 把 Skill 发布出去](/skill/06-share/)
