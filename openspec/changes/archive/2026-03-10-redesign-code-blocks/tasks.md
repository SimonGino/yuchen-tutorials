## 1. Expressive Code 配置

- [x] 1.1 在 `astro.config.mjs` 的 `starlight()` 中添加 `expressiveCode` 配置，关闭 `frames`
- [x] 1.2 配置 Expressive Code 的 `styleOverrides`，设置代码块背景色、边框色、圆角等基础样式变量

## 2. CSS 样式调整

- [x] 2.1 更新 `src/styles/global.css` 中现有的代码块样式（`.sl-markdown-content pre` 等），替换为新的 zinc 色系配色
- [x] 2.2 添加语言标签 CSS：利用 `data-language` 属性通过 `::after` 伪元素在代码块右上角显示语言名称
- [x] 2.3 调整代码块字号、内边距、圆角等排版细节
- [x] 2.4 确保暗色主题下代码块样式正确（使用 `:root[data-theme='dark']` 或 Starlight 的暗色变量）

## 3. 验证

- [x] 3.1 本地 `pnpm dev` 启动，检查亮色主题下代码块样式
- [x] 3.2 切换暗色主题，验证代码块配色协调
- [x] 3.3 检查有语言标注和无语言标注的代码块，确认标签显示/隐藏正确
- [x] 3.4 检查长代码行的横向滚动是否正常
