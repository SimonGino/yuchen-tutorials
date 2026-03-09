## Context

当前站点使用 Astro Starlight 构建，sidebar 在 `astro.config.mjs` 中配置为单一数组，包含所有教程系列。Starlight 原生不支持路由级别的侧边栏隔离。但项目已有 `CustomSidebar.astro` 组件覆盖，可以利用 `Astro.locals.starlightRoute` 获取当前页面路由信息进行过滤。

当前主题色为灰色调（zinc palette），但存在残留的绿色强调色（emerald）在 CSS 变量和内联样式中。

## Goals / Non-Goals

**Goals:**
- 进入教程路由时侧边栏仅显示当前系列的章节（sidebar 隔离）
- 顶栏显示当前教程系列名称而非全站名称
- 全站统一为黑白灰单色调（移除所有绿色强调色）
- 首页配色方案与内容页保持一致的极简风格

**Non-Goals:**
- 不引入新的外部依赖（如 starlight-sidebar-topics 插件）
- 不改变内容文件的目录结构
- 不更改 Starlight 框架本身
- 不做国际化（i18n）方面的改动
- 不修改教程内容本身

## Decisions

### 1. 侧边栏隔离：使用 CustomSidebar 组件过滤

**选择**：在现有 `CustomSidebar.astro` 中利用 `Astro.locals.starlightRoute` 检测当前路由，过滤 sidebar 条目。

**替代方案**：使用 `starlight-sidebar-topics` 插件。

**理由**：项目已有 CustomSidebar 覆盖；引入插件增加依赖且可能需要重构目录结构。利用 Starlight 的 route data API 即可实现，零新依赖。

**实现方式**：
- 从 `Astro.locals.starlightRoute.id` 提取当前 section（`openclaw` / `opencode` / `skill`）
- 遍历 sidebar 数据，仅保留与当前 section 匹配的条目
- 将过滤后的 sidebar 传递给默认 Sidebar 组件

### 2. 顶栏标识切换：覆盖 SiteTitle 或 Header 组件

**选择**：创建 `CustomHeader.astro` 或 `CustomSiteTitle.astro` 组件覆盖，根据当前路由动态显示教程系列名称。

**映射关系**：
- `/openclaw/*` → "OpenClaw 从零到生产"
- `/opencode/*` → "OpenCode 从零到生产级"
- `/skill/*` → "Skill 编写指南"
- 其他页面 → "宇辰AI编程"（默认）

### 3. 单色调主题：修改 CSS 变量

**选择**：直接修改 `global.css` 中的颜色变量和样式规则。

**关键改动**：
- 移除所有 `emerald` / 绿色相关的 CSS 值
- `--sl-color-accent` 系列统一使用 zinc gray 色阶
- sidebar 激活项改为灰色背景圆角高亮（参考截图样式）
- 链接颜色使用正文色 + 下划线，hover 变灰
- 代码块移除绿色左边框，统一灰色边框
- 内联代码背景改为灰色调

### 4. 首页改造：去除终端风格装饰

**选择**：保留卡片布局结构，但移除 `$` 前缀、monospace 标题字体等终端风格元素。

**关键改动**：
- 移除 `.section-prefix`（`$` 符号）
- section 标题改为普通衬线/非衬线字体
- CTA 按钮改为黑色背景白色文字（符合单色调）
- hero 区域简化，移除网格背景
- 保持卡片和列表的基本结构不变

## Risks / Trade-offs

- **[Sidebar 过滤复杂度]** → Starlight 的 sidebar 数据结构可能嵌套较深。需要递归过滤。通过先确认数据结构，写健壮的过滤逻辑来缓解。
- **[顶栏标识硬编码]** → 教程系列名称硬编码在组件中。→ 如果新增教程需要同步更新。可接受，因为新增教程频率低。
- **[暗色模式兼容]** → 单色调在暗色模式下需要确保对比度。→ Starlight 的 CSS 变量系统已处理明暗主题切换，只需确保 accent 色在两种模式下可读。
- **[首页无 sidebar]** → 首页使用 `template: 'splash'` 本身无 sidebar，不受隔离逻辑影响。
