## Context

首页 `src/pages/index.astro` 的"开源项目"板块当前仅展示 ArcReel 一个项目。项目列表使用统一的 `.list` / `.list-row` 组件样式，每行包含图标、名称、描述、元信息和箭头。现需在列表最前面插入 AI Pulse Tab 项目条目。

## Goals / Non-Goals

**Goals:**
- 在"开源项目"列表中以最高优先级（第一位）展示 AI Pulse Tab
- 保持与现有 ArcReel 条目完全一致的 HTML 结构和样式

**Non-Goals:**
- 不修改列表组件的 CSS 样式
- 不调整页面布局或其他板块
- 不新增组件文件或依赖

## Decisions

**直接复用现有 list-row 结构**
- 理由：已有 ArcReel 条目作为参考模板，结构简单明确（`<a class="list-row">` + 内部 spans），无需抽象
- 替代方案：提取为可复用组件 → 对仅两个条目来说过度设计，不采用

**放置于 ArcReel 之前**
- 理由：用户明确要求"优先级最高"，即列表第一项

**图标选择：使用 `📊` emoji**
- 理由：AI Pulse Tab 核心功能是用量配额的可视化展示，📊 直观表达"数据/图表"含义，与现有 ArcReel 的 🎬 风格一致

## Risks / Trade-offs

- **项目数量增长** → 如未来项目超过 4-5 个，可能需要重新考虑列表展示方式（分类、分页等），但当前仅 2 个，无需处理
