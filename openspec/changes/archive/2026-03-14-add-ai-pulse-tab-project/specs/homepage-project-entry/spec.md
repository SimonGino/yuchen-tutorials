## ADDED Requirements

### Requirement: 首页展示 AI Pulse Tab 项目条目
首页"开源项目"列表必须（SHALL）包含 AI Pulse Tab 项目条目，且该条目必须（SHALL）出现在列表第一位（ArcReel 之前）。

条目必须（SHALL）包含以下信息：
- 图标：📊
- 名称：AI Pulse Tab
- 描述：Chrome 新标签页 Claude 用量监控
- 元信息：GitHub
- 链接指向：https://github.com/SimonGino/ai-pulse-tab（新窗口打开）

#### Scenario: AI Pulse Tab 条目在列表中正确展示
- **WHEN** 用户访问首页
- **THEN** "开源项目"列表的第一行显示 AI Pulse Tab，第二行显示 ArcReel

#### Scenario: 点击 AI Pulse Tab 条目跳转到 GitHub
- **WHEN** 用户点击 AI Pulse Tab 条目
- **THEN** 浏览器在新标签页中打开 https://github.com/SimonGino/ai-pulse-tab
