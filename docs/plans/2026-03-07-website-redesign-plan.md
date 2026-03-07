# Website Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the homepage with hardcore geeky aesthetics (terminal-style) and tweak content pages for better typography, color consistency, and navigation.

**Architecture:** Homepage is a fully custom Astro page (`src/pages/index.astro`) using Starlight's `StarlightPage` wrapper. Content page tweaks are pure CSS overrides in `src/styles/global.css`. No new dependencies, no JS animations.

**Tech Stack:** Astro Starlight, Tailwind CSS v4, scoped CSS, Starlight CSS variables (`--sl-color-*`)

---

### Task 1: Homepage Hero Section

**Files:**
- Modify: `src/pages/index.astro` (HTML structure, lines 1-22 of the template)

**Step 1: Replace the profile banner with the new Hero section**

Replace everything inside `<div class="not-content homepage">` from the profile banner through the end of the file with the new structure. Start with just the Hero:

```astro
<div class="not-content homepage">
  <!-- Hero -->
  <section class="hero">
    <div class="hero-bg"></div>
    <h1 class="hero-title">从零开始，系统掌握 AI 编程工具</h1>
    <p class="hero-subtitle">实战教程 · 开源项目 · 持续更新</p>
    <div class="hero-actions">
      <a href="/openclaw/" class="hero-cta">开始学习 →</a>
      <span class="hero-author">
        <img src="/images/avatar-cropped.png" alt="宇辰" width="24" height="24" class="hero-avatar" />
        by 宇辰
      </span>
    </div>
  </section>
</div>
```

**Step 2: Add Hero styles**

Replace all existing `<style>` content with the Hero styles (we'll add more styles in subsequent tasks):

```css
.homepage {
  max-width: 52rem;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
}

/* Hero */
.hero {
  position: relative;
  padding: 3.5rem 0 3rem;
  margin-bottom: 2.5rem;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
  pointer-events: none;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--sl-color-text);
  margin: 0 0 0.75rem;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--sl-color-gray-3);
  margin: 0 0 2rem;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.hero-cta {
  display: inline-block;
  padding: 0.75rem 2rem;
  background-color: var(--sl-color-accent);
  color: var(--sl-color-black);
  font-weight: 700;
  font-size: 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: opacity 0.2s;
}

.hero-cta:hover {
  opacity: 0.9;
}

.hero-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--sl-color-gray-3);
}

.hero-avatar {
  border-radius: 50%;
}
```

**Step 3: Verify**

Run: `pnpm dev`
Open http://localhost:4321 — confirm Hero renders with green grid background, large title, CTA button, and "by 宇辰".

**Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(homepage): replace profile banner with Hero section"
```

---

### Task 2: Featured Tutorial Card

**Files:**
- Modify: `src/pages/index.astro` (add HTML after Hero, add styles)

**Step 1: Add the featured tutorial section after the Hero closing tag**

Insert after `</section><!-- Hero -->`:

```astro
<!-- Featured Tutorial -->
<section class="section">
  <h2 class="section-title"><span class="section-prefix">$</span> 推荐教程</h2>
  <a href="/openclaw/" class="featured-card">
    <div class="featured-accent"></div>
    <div class="featured-body">
      <div class="featured-header">
        <h3 class="featured-name">🦞 OpenClaw · 从零搭建你的 AI 助手</h3>
        <span class="featured-tag">入门</span>
      </div>
      <p class="featured-desc">从安装部署到 Skills 扩展，完整搭建你的私人 AI 助手系统</p>
      <div class="featured-meta">
        <span>11 章节</span>
        <span class="featured-link">开始阅读 →</span>
      </div>
    </div>
  </a>
</section>
```

**Step 2: Add featured card styles**

Append to the `<style>` block:

```css
/* Sections */
.section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--sl-color-gray-3);
  margin: 0 0 1rem;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.section-prefix {
  color: var(--sl-color-accent);
  margin-right: 0.5rem;
}

/* Featured Card */
.featured-card {
  display: flex;
  text-decoration: none;
  background-color: var(--sl-color-bg-nav);
  border: 1px solid var(--sl-color-gray-5);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: border-color 0.2s;
}

.featured-card:hover {
  border-color: var(--sl-color-accent);
}

.featured-accent {
  width: 4px;
  flex-shrink: 0;
  background-color: var(--sl-color-accent);
}

.featured-body {
  padding: 1.25rem 1.5rem;
  flex: 1;
}

.featured-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.featured-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--sl-color-text);
  margin: 0;
}

.featured-tag {
  font-size: 0.7rem;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  background-color: rgba(16, 185, 129, 0.15);
  color: var(--sl-color-accent);
  font-weight: 600;
  white-space: nowrap;
}

.featured-desc {
  font-size: 0.875rem;
  color: var(--sl-color-gray-3);
  margin: 0 0 0.75rem;
  line-height: 1.6;
}

.featured-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--sl-color-gray-3);
}

.featured-link {
  color: var(--sl-color-accent);
  font-weight: 600;
}
```

**Step 3: Verify**

Run: `pnpm dev`
Confirm the featured card renders below Hero with left green accent bar, title, tag, description, meta row.

**Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(homepage): add featured tutorial card section"
```

---

### Task 3: All Tutorials Compact List

**Files:**
- Modify: `src/pages/index.astro` (add HTML after featured section, add styles)

**Step 1: Add the all tutorials list section**

Insert after the featured tutorial `</section>`:

```astro
<!-- All Tutorials -->
<section class="section">
  <h2 class="section-title"><span class="section-prefix">$</span> 全部教程</h2>
  <div class="list">
    <a href="/opencode/" class="list-row">
      <span class="list-icon">⌨️</span>
      <span class="list-name">OpenCode</span>
      <span class="list-desc">终端 AI 编程助手实战</span>
      <span class="list-meta">8 章节</span>
      <span class="list-arrow">→</span>
    </a>
    <a href="/skill/" class="list-row">
      <span class="list-icon">🧩</span>
      <span class="list-name">Skill 编写</span>
      <span class="list-desc">自定义技能开发指南</span>
      <span class="list-meta">9 章节</span>
      <span class="list-arrow">→</span>
    </a>
    <div class="list-row list-row--disabled">
      <span class="list-icon">🤖</span>
      <span class="list-name">Claude Code</span>
      <span class="list-desc">AI 编程助手深度实战</span>
      <span class="list-badge">即将上线</span>
    </div>
    <div class="list-row list-row--disabled">
      <span class="list-icon">⚡</span>
      <span class="list-name">MCP 配置</span>
      <span class="list-desc">模型上下文协议实战</span>
      <span class="list-badge">即将上线</span>
    </div>
  </div>
</section>
```

**Step 2: Add list styles**

Append to the `<style>` block:

```css
/* Compact List */
.list {
  border: 1px solid var(--sl-color-gray-5);
  border-radius: 0.75rem;
  overflow: hidden;
}

.list-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: background-color 0.15s, border-color 0.15s;
}

.list-row + .list-row {
  border-top: 1px solid var(--sl-color-gray-6);
}

a.list-row:hover {
  background-color: var(--sl-color-bg-nav);
  border-left-color: var(--sl-color-accent);
}

.list-row--disabled {
  opacity: 0.5;
}

.list-icon {
  flex-shrink: 0;
  width: 1.5rem;
  text-align: center;
}

.list-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--sl-color-text);
  white-space: nowrap;
  min-width: 6rem;
}

.list-desc {
  font-size: 0.8rem;
  color: var(--sl-color-gray-3);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-meta {
  font-size: 0.75rem;
  color: var(--sl-color-gray-3);
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
}

.list-arrow {
  color: var(--sl-color-gray-3);
  font-size: 0.875rem;
  flex-shrink: 0;
}

a.list-row:hover .list-arrow {
  color: var(--sl-color-accent);
}

.list-badge {
  font-size: 0.7rem;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  background-color: var(--sl-color-gray-5);
  color: var(--sl-color-gray-3);
  white-space: nowrap;
}
```

**Step 3: Verify**

Run: `pnpm dev`
Confirm compact list renders with row hover effects, green left border on hover, disabled rows grayed out.

**Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(homepage): add compact all-tutorials list"
```

---

### Task 4: Open Source Projects List + Footer

**Files:**
- Modify: `src/pages/index.astro` (add HTML after tutorials list, add styles)

**Step 1: Add open source projects section and footer**

Insert after the all tutorials `</section>`:

```astro
<!-- Open Source Projects -->
<section class="section">
  <h2 class="section-title"><span class="section-prefix">$</span> 开源项目</h2>
  <div class="list">
    <a href="https://github.com/ArcReel/ArcReel" target="_blank" rel="noopener" class="list-row">
      <span class="list-icon">🎬</span>
      <span class="list-name">ArcReel</span>
      <span class="list-desc">AI 驱动的小说转短视频工作台</span>
      <span class="list-meta">GitHub</span>
      <span class="list-arrow">↗</span>
    </a>
  </div>
</section>

<!-- Footer -->
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <span class="footer-logo">
        <img src="/images/avatar-cropped.png" alt="宇辰" width="20" height="20" class="footer-avatar" />
        宇辰AI编程
      </span>
      <span class="footer-sep">·</span>
      <span class="footer-desc">AI 前沿技术与实用技巧分享</span>
    </div>
    <div class="footer-right">
      <a href="/openclaw/" class="footer-link">OpenClaw</a>
      <a href="/opencode/" class="footer-link">OpenCode</a>
      <a href="/skill/" class="footer-link">Skill 编写</a>
      <span class="footer-qr-trigger">
        公众号
        <img src="/images/wechat-qrcode.png" alt="微信公众号二维码" class="footer-qr-img" width="160" height="160" />
      </span>
    </div>
  </div>
  <div class="footer-bottom">
    <span>&copy; 2026 宇辰AI编程</span>
    <span>learn.aiqqyc.com</span>
  </div>
</footer>
```

**Step 2: Add footer styles**

Append to the `<style>` block:

```css
/* Footer */
.site-footer {
  margin-top: 1rem;
  border-top: 1px solid var(--sl-color-gray-5);
  padding-top: 1.5rem;
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--sl-color-gray-3);
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 700;
  color: var(--sl-color-text);
}

.footer-avatar {
  border-radius: 50%;
}

.footer-sep {
  color: var(--sl-color-gray-5);
}

.footer-desc {
  color: var(--sl-color-gray-3);
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.footer-link {
  font-size: 0.8rem;
  color: var(--sl-color-gray-3);
  text-decoration: none;
  transition: color 0.15s;
}

.footer-link:hover {
  color: var(--sl-color-accent);
}

.footer-qr-trigger {
  position: relative;
  font-size: 0.8rem;
  color: var(--sl-color-gray-3);
  cursor: pointer;
  transition: color 0.15s;
}

.footer-qr-trigger:hover {
  color: var(--sl-color-accent);
}

.footer-qr-img {
  display: none;
  position: absolute;
  bottom: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  border-radius: 0.5rem;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.25);
  background: white;
  padding: 0.5rem;
  z-index: 10;
}

.footer-qr-trigger:hover .footer-qr-img {
  display: block;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid var(--sl-color-gray-6);
  font-size: 0.75rem;
  color: var(--sl-color-gray-4);
}
```

**Step 3: Verify**

Run: `pnpm dev`
Confirm open source row uses same list style. Footer is compact, single-line brand + horizontal links.

**Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(homepage): add open source section and compact footer"
```

---

### Task 5: Homepage Mobile Responsive

**Files:**
- Modify: `src/pages/index.astro` (add media queries to style block)

**Step 1: Add mobile responsive styles**

Append to the `<style>` block:

```css
/* Mobile */
@media (max-width: 640px) {
  .hero-title {
    font-size: 1.75rem;
  }

  .hero-subtitle {
    font-size: 0.95rem;
  }

  .featured-header {
    flex-wrap: wrap;
  }

  .list-desc {
    display: none;
  }

  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-right {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 0.25rem;
    text-align: center;
  }
}
```

**Step 2: Verify**

Run: `pnpm dev`
Resize browser to mobile width (~375px). Confirm: Hero title scales down, list descriptions hide, footer stacks vertically.

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(homepage): add mobile responsive styles"
```

---

### Task 6: Remove global style for hidden content panel

**Files:**
- Modify: `src/pages/index.astro` (keep the `<style is:global>` block)

**Step 1: Verify the global style is still present**

The existing `<style is:global>` block that hides the content panel title should remain:

```css
<style is:global>
  .content-panel:has(h1#_top) {
    display: none;
  }
</style>
```

Make sure this is still at the bottom of the file after the main `<style>` block.

**Step 2: Verify**

Run: `pnpm dev`
Confirm no duplicate "宇辰AI编程 · 教程" heading appears above the Hero.

**Step 3: Commit (if any changes needed)**

If no changes, skip this commit. The global style should already be present from the original file.

---

### Task 7: Content Pages — Code Blocks & Admonitions

**Files:**
- Modify: `src/styles/global.css` (append new rules)

**Step 1: Add code block and admonition overrides**

Append after the existing `@theme` block in `global.css`:

```css
/* Code blocks — terminal feel */
:root {
  --sl-color-bg-inline-code: rgba(16, 185, 129, 0.08);
}

.sl-markdown-content pre {
  background-color: #0d1117 !important;
  border: 1px solid var(--sl-color-gray-5);
  border-left: 3px solid var(--sl-color-accent);
  border-radius: 0.5rem;
}

.sl-markdown-content pre code {
  font-size: 0.875rem;
}

/* Admonitions — darker, unified palette */
.starlight-aside {
  border-color: var(--sl-color-gray-5);
  background-color: rgba(0, 0, 0, 0.2);
}

/* Links — emerald green */
.sl-markdown-content a {
  color: var(--sl-color-accent);
  text-decoration: none;
}

.sl-markdown-content a:hover {
  text-decoration: underline;
}
```

**Step 2: Verify**

Run: `pnpm dev`
Navigate to any tutorial page (e.g. /openclaw/01-install/). Confirm: code blocks have dark bg with green left bar, links are green, admonitions have darker bg.

**Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "style: code blocks, admonitions, and links for geeky theme"
```

---

### Task 8: Content Pages — Typography

**Files:**
- Modify: `src/styles/global.css` (append new rules)

**Step 1: Add typography overrides**

Append to `global.css`:

```css
/* Typography — Chinese long-form readability */
.sl-markdown-content {
  line-height: 1.8;
}

.sl-markdown-content p + p {
  margin-top: 1.25em;
}

/* Headings — GitHub README style */
.sl-markdown-content h2 {
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--sl-color-gray-5);
}
```

**Step 2: Verify**

Run: `pnpm dev`
Navigate to a long tutorial page. Confirm: line height is more spacious, h2 has bottom border, paragraph spacing increased.

**Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "style: improve typography for Chinese readability"
```

---

### Task 9: Content Pages — Sidebar & TOC Navigation

**Files:**
- Modify: `src/styles/global.css` (append new rules)

**Step 1: Add sidebar and TOC highlight overrides**

Append to `global.css`:

```css
/* Sidebar — active item green left bar */
nav.sidebar-content a[aria-current="page"] {
  border-left: 3px solid var(--sl-color-accent);
  padding-left: calc(0.5rem - 3px);
  background-color: rgba(16, 185, 129, 0.08);
}

/* TOC — highlight color */
starlight-toc a[aria-current="true"] {
  color: var(--sl-color-accent);
}
```

**Step 2: Verify**

Run: `pnpm dev`
Navigate to any tutorial page. Confirm: active sidebar item has green left bar, TOC current heading is green.

**Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "style: sidebar active state and TOC highlight color"
```

---

### Task 10: Final Build Verification

**Files:** None (verification only)

**Step 1: Run production build**

Run: `pnpm build`
Expected: Build succeeds with no errors.

**Step 2: Preview locally**

Run: `pnpm preview`
Check homepage and 2-3 tutorial pages in both desktop and mobile viewport.

**Step 3: Final commit if any fixes needed**

Fix any issues found during verification and commit.

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Hero section | `src/pages/index.astro` |
| 2 | Featured tutorial card | `src/pages/index.astro` |
| 3 | All tutorials list | `src/pages/index.astro` |
| 4 | Open source + footer | `src/pages/index.astro` |
| 5 | Mobile responsive | `src/pages/index.astro` |
| 6 | Global style check | `src/pages/index.astro` |
| 7 | Code blocks & admonitions | `src/styles/global.css` |
| 8 | Typography | `src/styles/global.css` |
| 9 | Sidebar & TOC | `src/styles/global.css` |
| 10 | Build verification | — |
