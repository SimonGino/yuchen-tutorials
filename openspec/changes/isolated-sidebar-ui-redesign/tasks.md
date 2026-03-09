## 1. 单色调主题 (monochrome-theme)

- [x] 1.1 修改 `src/styles/global.css` 中的 accent 颜色变量，将 emerald 替换为 zinc gray 色阶
- [x] 1.2 修改 sidebar 激活项样式：移除绿色左边框，改为灰色背景圆角高亮
- [x] 1.3 修改链接样式：正文色 + 下划线，hover 变灰
- [x] 1.4 修改代码块样式：移除绿色左边框，统一灰色边框
- [x] 1.5 修改内联代码背景色为灰色调（移除绿色 tint）
- [x] 1.6 修改 admonition 样式为统一灰色调

## 2. 首页单色调改造

- [x] 2.1 修改 `src/pages/index.astro` 中 CTA 按钮为黑色背景白色文字
- [x] 2.2 移除 section 标题的 `$` 前缀和 monospace 字体
- [x] 2.3 移除 hero 区域的网格背景 (.hero-bg)
- [x] 2.4 调整 featured card 的强调色从绿色改为灰色调
- [x] 2.5 调整 hover 状态和 tag/badge 配色为灰色调

## 3. 侧边栏隔离 (isolated-sidebar)

- [x] 3.1 修改 `src/components/CustomSidebar.astro`：利用 `Astro.locals.starlightRoute` 检测当前路由 section，过滤 sidebar 条目仅显示当前系列
- [x] 3.2 确保 WeChat QR code 社群区域在过滤后仍正常显示
- [x] 3.3 处理非教程页面（如首页、独立页面）的 fallback 逻辑，显示完整 sidebar

## 4. 顶栏标识切换

- [x] 4.1 创建 `CustomSiteTitle.astro` 组件覆盖（或修改现有 header 组件），根据当前路由 section 动态显示教程系列名称
- [x] 4.2 在 `astro.config.mjs` 中注册新的组件覆盖
- [x] 4.3 配置教程系列名称映射（openclaw→"OpenClaw 从零到生产"，opencode→"OpenCode 从零到生产级"，skill→"Skill 编写指南"，默认→"宇辰AI编程"）

## 5. 验证与测试

- [x] 5.1 运行 `pnpm build` 确保构建成功无报错
- [x] 5.2 本地 `pnpm dev` 验证各教程页面的 sidebar 隔离效果
- [x] 5.3 验证顶栏标题在不同教程 section 间正确切换
- [x] 5.4 验证暗色模式下单色调主题的对比度和可读性
- [x] 5.5 验证首页样式改造效果
