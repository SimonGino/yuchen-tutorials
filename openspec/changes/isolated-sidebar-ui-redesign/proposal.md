## Why

当前站点在侧边栏中将所有教程系列（OpenClaw、OpenCode、Skill）混在一起显示。用户浏览 OpenClaw 教程时，侧边栏也展示 OpenCode 和 Skill 的导航条目，造成视觉干扰和认知负担。参考截图中 NotebookLM Web Importer 文档站的设计——每个产品/项目拥有独立的侧边栏导航、干净的顶栏和简洁的内容区——需要将站点改造为"每个教程系列拥有独立侧边栏"的结构，同时整体 UI 风格（首页、内容页）向截图中的极简黑白灰风格靠拢。

## What Changes

- **侧边栏隔离**：进入某个教程路由（如 `/openclaw/`）时，侧边栏仅显示该教程系列的章节导航，不再展示其他教程系列。
- **顶栏标识切换**：在教程页中，顶栏左侧显示当前教程系列名称（如"OpenClaw 从零到生产"），而非全站名称，提供清晰的上下文。
- **整体 UI 精简**：去除绿色主题色，改为纯黑白灰单色调。侧边栏激活项使用灰色圆角高亮而非绿色左边框。链接、代码块等元素统一使用灰色调。
- **首页风格调整**：首页保持教程列表卡片布局，但配色方案改为黑白灰，去掉 terminal/monospace 风格的装饰元素（如 `$` 前缀），让整体更接近截图中的简洁文档风格。
- **内容页排版优化**：保持中文长文阅读的行高和间距设置，但移除绿色强调色相关样式，统一为灰色调。

## Capabilities

### New Capabilities
- `isolated-sidebar`: 每个教程系列拥有独立的侧边栏导航，进入特定教程路由时只显示该系列的章节。顶栏标识随教程系列切换。
- `monochrome-theme`: 全站黑白灰单色调主题，取代当前的绿色主题色方案。覆盖侧边栏、链接、代码块、admonition 等所有 UI 元素。

### Modified Capabilities

（无现有 spec 需要修改）

## Impact

- **astro.config.mjs**：sidebar 配置需要重构，可能需要使用 Starlight 的多 sidebar 功能或自定义 sidebar 组件逻辑。
- **src/components/CustomSidebar.astro**：需要根据当前路由过滤侧边栏条目。
- **src/components/CustomSocialIcons.astro**：可能需要修改顶栏标题显示逻辑。
- **src/styles/global.css**：大量样式需要从绿色主题色改为灰色调。
- **src/pages/index.astro**：首页样式需要调整配色方案。
- **依赖**：无新依赖，均为 Starlight 现有能力范围内的自定义。
