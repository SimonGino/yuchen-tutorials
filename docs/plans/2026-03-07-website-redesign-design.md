# Website Redesign Design

Date: 2026-03-07

## Scope

- Homepage: major redesign
- Content pages (tutorials): visual tweaks
- Framework: keep Astro Starlight

## Goals

1. Stronger brand identity — move away from template feel
2. Higher information density — better use of screen space
3. Clearer user guidance — new visitors know where to start

## Visual Direction

Hardcore geeky style: terminal-like elements, code aesthetics, dark theme dominant, high contrast. Reference: GitHub, Warp.

## Homepage Design

### Page Structure (top to bottom)

1. Navbar (Starlight native)
2. Hero
3. Featured tutorial (1-2 large cards)
4. All tutorials (compact list)
5. Open source projects (compact list)
6. Footer

### Hero

- Title: large bold white text (~2.5rem), e.g. "从零开始，系统掌握 AI 编程工具"
- Subtitle: gray helper text, e.g. "实战教程 · 开源项目 · 持续更新"
- CTA button: "开始学习 →" linking to OpenClaw, emerald green solid button
- Background: semi-transparent code lines / grid texture (pure CSS), terminal atmosphere
- Personal brand: small "by 宇辰" + avatar near CTA, no separate banner

### Featured Tutorial (Large Card)

- Full-width card, dark background + left emerald vertical accent bar
- Content: title, chapter count, difficulty tag, one-line description, action button
- Default: 1 featured card (OpenClaw), expandable to 2 later

### All Tutorials (Compact List)

- Table-style row layout, one tutorial per row
- Each row: icon, name, description, chapter count, arrow link
- Hover: full row highlight (dark gray bg + left green border slide-in)
- "Coming soon" rows: grayed text, no link, gray badge instead of arrow
- OpenClaw not repeated here (already featured above)

### Open Source Projects

- Same row layout as tutorial list for visual consistency
- Click entire row to open GitHub, external link icon on right

### Footer

- Two-column: left brand info, right quick links (horizontal, not columnar)
- WeChat QR hover popup retained
- More compact than current footer

### Geeky Visual Language (Throughout)

- Dividers: monospace-style thin lines
- Section titles: terminal symbol prefix (e.g. `$ 全部教程`)
- Card borders: 1px solid thin border, hover turns emerald green
- Fonts: system sans-serif for body, monospace for decorative/code elements

## Content Page Tweaks

### Priority 1: Color and Visual Consistency

- Code blocks: deeper background (~#0d1117), left green accent bar, terminal window feel
- Admonitions (note/tip/caution): border and icon colors unified to new palette, darker backgrounds
- Link color: emerald green, underline on hover

### Priority 2: Typography and Reading Experience

- Line height: increase to 1.8 for Chinese long-form readability
- Paragraph spacing: increase gap between paragraphs
- Headings: h2 gets bottom border (GitHub README style), h3/h4 differentiated by size and weight
- Code block font size: slightly smaller at 0.875rem

### Priority 3: Navigation Experience

- Sidebar: active item gets left green vertical bar highlight (echoes homepage card style)
- Chapter navigation: keep Starlight native prev/next
- Right TOC: keep default, only adjust highlight color to emerald green

### Out of Scope

- No reading progress bar
- No custom TOC component
- No font family changes
- No JS animations

## Technical Approach

- Homepage: fully custom Astro page (`src/pages/index.astro`), free layout
- Content pages: CSS overrides via `src/styles/global.css` + minimal Starlight component overrides
- No new JS dependencies
- All decorative elements via pure CSS
