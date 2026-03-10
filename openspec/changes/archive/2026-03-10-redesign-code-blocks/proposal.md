## Why

当前代码块样式过于朴素：深黑背景 + 灰色细边框 + macOS 三圆点装饰，视觉上单调且与整站单色调设计融合度不够。作为编程教程站点，代码块是最核心的内容元素，需要更精致、现代的视觉呈现来提升阅读体验和专业感。

## What Changes

- 移除 macOS 三圆点窗口装饰（frames 关闭），让代码块更简洁
- 代码块增加语言标签显示（如 `bash`、`javascript`），帮助读者快速识别代码类型
- 优化代码块圆角、内边距和字体大小，提升排版精致度
- 调整代码块背景色和边框，使其与整站 zinc 单色调配色更协调
- 统一亮色/暗色主题下的代码块风格

## Capabilities

### New Capabilities
- `code-block-styling`: 代码块视觉样式重设计，包括 Expressive Code 主题配置和 CSS 自定义样式

### Modified Capabilities

（无现有 spec 需要修改）

## Impact

- `astro.config.mjs` — 添加 Expressive Code 配置（主题、frames 等）
- `src/styles/global.css` — 调整代码块相关 CSS 样式
- 可能新增 `ec.config.mjs` — Expressive Code 独立配置文件
- 无 API 变更，无依赖新增，纯样式层改动
