## Context

当前站点使用 Astro Starlight 默认的 Expressive Code 渲染代码块。未做任何 Expressive Code 配置，仅在 `global.css` 中覆盖了背景色 `#0d1117` 和添加了圆角边框。

现状问题：
- macOS 三圆点窗口装饰（frames）与整站简洁风格不搭
- 没有语言标签，读者无法快速识别代码类型
- 背景色过深，与整站 zinc 灰色调不协调
- 视觉上缺乏层次感和精致度

## Goals / Non-Goals

**Goals:**
- 代码块视觉风格与整站 zinc 单色调一致
- 移除窗口装饰，显示语言标签
- 保持亮色/暗色主题自适应
- 保持代码可读性和复制功能

**Non-Goals:**
- 不更换语法高亮配色方案（Shiki 主题）—— 如果需要后续单独处理
- 不改变代码块的功能行为（复制按钮、行号等）
- 不添加行高亮、diff 显示等新功能

## Decisions

### 1. 通过 Starlight expressiveCode 配置项调整，而非新建 ec.config.mjs

**方案**: 在 `astro.config.mjs` 的 `starlight()` 配置中使用 `expressiveCode` 字段。

**理由**: Starlight 内置了 Expressive Code 集成，直接在现有配置文件中添加即可，无需引入额外配置文件。对于我们的需求（关闭 frames、设置样式覆盖），这种方式足够。

### 2. 关闭 frames，使用纯净代码块样式

**方案**: 设置 `frames: false` 移除 macOS 三圆点和标题栏装饰。

**理由**: 三圆点装饰与整站简洁单色调风格不搭，移除后代码块更干净。语言标签通过 CSS 自定义实现。

### 3. CSS 实现语言标签

**方案**: 利用 Expressive Code 生成的 `data-language` 属性，通过 CSS `::before` 伪元素显示语言标签。

**理由**: 不需要额外 JS 或插件，纯 CSS 方案轻量且可控。标签显示在代码块右上角，不占用代码区域空间。

### 4. 背景色调整为与 zinc 色系协调的深灰

**方案**: 亮色主题使用 `#fafafa`（zinc-50）背景 + `#e4e4e7`（zinc-200）边框；暗色主题使用 `#18181b`（zinc-900）背景 + `#3f3f46`（zinc-700）边框。

**理由**: 与整站 zinc 色系保持一致，避免代码块背景色与页面其余部分产生突兀的对比。

## Risks / Trade-offs

- **[语言标签可能遮挡代码]** → 标签放在代码块外部（上方）或使用绝对定位在右上角，留足间距
- **[关闭 frames 后失去文件名显示能力]** → 当前教程内容未使用文件名标注，影响不大；未来如需要可单独启用 `title` 属性
- **[Expressive Code 版本升级可能改变 DOM 结构]** → CSS 选择器尽量使用稳定的 data 属性而非嵌套层级
