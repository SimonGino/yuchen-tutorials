## ADDED Requirements

### Requirement: 代码块移除窗口装饰
代码块 SHALL 不显示 macOS 风格的三圆点窗口装饰（frames）。代码块 SHALL 呈现为纯净的矩形区域。

#### Scenario: 代码块无窗口装饰
- **WHEN** 页面渲染包含代码块的 Markdown 内容
- **THEN** 代码块不显示三圆点、标题栏等窗口装饰元素

### Requirement: 代码块显示语言标签
代码块 SHALL 在右上角区域显示对应的编程语言标签（如 bash、javascript）。标签 SHALL 使用较小的字号和低对比度颜色，不干扰代码阅读。

#### Scenario: 有语言标注的代码块
- **WHEN** Markdown 中的代码块指定了语言（如 ```bash）
- **THEN** 代码块右上角显示该语言名称标签

#### Scenario: 无语言标注的代码块
- **WHEN** Markdown 中的代码块未指定语言
- **THEN** 代码块不显示语言标签

### Requirement: 代码块背景色与整站色系协调
代码块 SHALL 使用与整站 zinc 色系协调的背景色。亮色主题下 SHALL 使用浅灰背景；暗色主题下 SHALL 使用深灰背景。

#### Scenario: 亮色主题代码块配色
- **WHEN** 用户处于亮色主题
- **THEN** 代码块使用浅灰背景（zinc-50 区间）和浅灰边框（zinc-200 区间）

#### Scenario: 暗色主题代码块配色
- **WHEN** 用户处于暗色主题
- **THEN** 代码块使用深灰背景（zinc-900 区间）和中灰边框（zinc-700 区间）

### Requirement: 代码块排版优化
代码块 SHALL 使用 `0.75rem` 圆角、适当的内边距和 `0.85rem` 字号。代码块 SHALL 保持良好的横向滚动体验（长代码行不截断）。

#### Scenario: 代码块基本排版
- **WHEN** 页面渲染代码块
- **THEN** 代码块具有圆角、适当内边距，代码文字清晰可读

#### Scenario: 长代码行横向滚动
- **WHEN** 代码行超出代码块可视宽度
- **THEN** 代码块出现横向滚动条，代码行不折行
