## Why

首页"开源项目"板块目前只有 ArcReel 一个项目，内容较单薄。新增 [AI Pulse Tab](https://github.com/SimonGino/ai-pulse-tab) 可以丰富项目展示，同时为用户提供更多实用的 AI 工具推荐。AI Pulse Tab 是一个 Chrome 扩展，可在新标签页实时显示 Claude AI 的用量配额，实用性强，与站点 AI 编程主题高度契合。

## What Changes

- 在首页"开源项目"列表中新增 AI Pulse Tab 项目卡片，放在 ArcReel **之前**（优先级最高）
- 卡片包含项目图标、名称、简短描述、GitHub 外链

## Capabilities

### New Capabilities
- `homepage-project-entry`: 在首页开源项目列表中添加新的项目条目

### Modified Capabilities
<!-- 无需修改现有 spec -->

## Impact

- **受影响文件**: `src/pages/index.astro`（首页模板，新增一行列表项）
- **其他**: 无 API、依赖或构建配置变更，纯前端静态内容修改
