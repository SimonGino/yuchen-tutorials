---
title: Skills 管理：内置、自定义与治理
description: Skills 加载机制、自定义开发与安全治理
sidebar:
  order: 7
---

## 本节目标

- 理解 Skills 的加载机制和优先级
- 能安装、更新和验证 Skills
- 建立门控和安全边界，避免"装了不生效"或"用了出问题"

---

## 1. Skills 是什么

Skills 是一种轻量级的开放格式，通过专业知识和工作流扩展助手的能力。

核心文件是每个技能目录下的 `SKILL.md`。一个技能的目录结构：

```
my-skill/
├── SKILL.md          # 必须：指令 + 元数据
├── scripts/          # 可选：可执行脚本
├── references/       # 可选：参考文档
└── assets/           # 可选：模板、资源
```

模型决定上限，Skills 决定稳定性。Skills 的真正价值是把流程标准化。

---

## 2. 加载优先级

![Skills 加载优先级](/images/openclaw/03-skills-priority.png)

默认加载路径（优先级从低到高）：

1. 内置 Skills
2. `~/.openclaw/skills`（全局）
3. `<workspace>/skills`（当前工作区）

同名冲突规则：工作区 > 全局 > 内置。

实践建议：

- 项目专用技能放工作区
- 全局通用技能放 `~/.openclaw/skills`
- 不要在多个目录放同名技能

---

## 3. 安装与更新

### ClawHub 方式

```bash
clawhub install <skill-slug>
clawhub update --all
clawhub sync --all
```

浏览 [clawhub.ai](https://clawhub.ai) 发现社区技能。

### npx skills 方式

```bash
npx skills find <query>          # 搜索技能
npx skills add <owner/repo@skill>  # 安装
npx skills update                # 更新
npx skills check                 # 检查
```

无交互安装：

```bash
npx skills add <owner/repo@skill> -g -y
```

建议：**先搜后装**，读 SKILL.md 确认用途再安装。

---

## 4. SKILL.md 质量标准

一个可维护的技能至少应有：

- 清晰名称和描述
- 输入输出说明
- 依赖要求（系统命令、环境变量）
- 使用示例
- 安全边界说明

最小 frontmatter：

```markdown
---
name: your-skill-name
description: What this skill does
---
```

规则写得越明确，助手调用越稳定。

---

## 5. 门控机制

OpenClaw 基于 `metadata.openclaw` 做加载时过滤。常见条件：

- `requires.bins`：依赖的二进制必须在 PATH 里
- `requires.env`：必须有环境变量
- `requires.config`：openclaw.json 中指定路径必须为真值
- `os`：仅在指定系统加载

**"装了但看不见"九成卡在门控条件。**

![Skills 门控流程](/images/openclaw/04-skills-gating-security.png)

### 配置覆盖

可在 `~/.openclaw/openclaw.json` 做 Skills 级配置：

```json
{
  "skills": {
    "entries": {
      "skill-name": {
        "enabled": true,
        "apiKey": "xxx",
        "env": { "SOME_VAR": "value" },
        "config": {}
      }
    }
  }
}
```

---

## 6. 安全边界

把第三方 Skills 当**不受信任代码**处理：

1. 先读 SKILL.md，确认会执行什么
2. 高风险操作放沙箱
3. 密钥只通过配置注入，不写入提示词或日志
4. 外发消息、删除文件、系统命令执行要有确认门槛

如果技能来自不熟悉的来源，先在隔离环境验证。

---

## 7. 热刷新与生效验证

Skills 列表通常在会话开始时快照。改了技能后：

1. 修改技能或配置
2. **开一个新会话**
3. 用固定测试指令回归

常用验证：

```bash
openclaw status
openclaw health
```

再用业务任务做一轮实际调用验证。

---

## 8. 实践建议

- 每个新技能走"安装 → 验证 → 回滚"三步
- 新技能先在测试工作区验证，再部署到生产
- 每次更新记录版本变更
- 不要追求技能数量，先管好优先级和门控

---

## 下一步

Skills 配好了，接下来学习多 Agent 协作：

- [08-多 Agent 协作](/openclaw/08-multi-agent/)：子 Agent、角色分工与协作模式
