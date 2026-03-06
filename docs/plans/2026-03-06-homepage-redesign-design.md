# Homepage Redesign: Personal IP Knowledge Hub

**Date**: 2026-03-06
**Status**: Approved

## Context

Current homepage at `learn.aiqqyc.com` is a minimal Starlight splash page with just a tagline and one CTA button. The site needs to be transformed into a personal IP knowledge-sharing hub that:

1. Clearly communicates what content is available
2. Showcases multiple tutorial series (live and upcoming)
3. Establishes personal brand identity
4. Provides contact info in footer

## Positioning

- Brand: 宇辰AI编程
- Domain: `https://learn.aiqqyc.com/`
- Identity: 个人IP知识分享自媒体
- Tagline: 专注AI前沿技术与实用技巧分享，用通俗易懂的方式解读人工智能，助你轻松掌握AI工具，提升工作效率

## Tech Stack

- Framework: Astro + Starlight (existing)
- Styling: Add Tailwind CSS v4 via `@tailwindcss/vite` + `@astrojs/starlight-tailwind`
- Theme colors: Emerald green accent, Slate gray, Teal highlight
- No additional frameworks

## Design

### Homepage Layout (5 sections)

#### 1. Hero Section
- Brand name: 宇辰AI编程
- Description: 专注AI前沿技术与实用技巧分享...
- Single CTA: 浏览教程 ↓
- Dark gradient background (slate-900 → emerald-950)
- Subtle grid/glow effect for tech feel

#### 2. Tutorial Category: 使用端工具教程
- Card grid (2 columns on desktop, 1 on mobile)
- Cards:
  - **OpenClaw** — "从零搭建你的 AI 助手" / 11 章节 / [开始学习 →]
  - **Claude Code** — "AI 编程利器深度指南" / [即将上线] badge

#### 3. Tutorial Category: 工具类教程
- Same card grid style
- Cards:
  - **MCP 配置** — "模型上下文协议实战" / [即将上线]
  - **Skill 编写** — "自定义技能开发指南" / [即将上线]

#### 4. Footer
- Brand: 宇辰AI编程 · learn.aiqqyc.com
- Contact info: 个人微信 / 交流群 / 邮箱 / GitHub
- Copyright

### Course Page Optimizations

#### Bottom Banner (per chapter)
- Injected via Starlight Footer component override
- CTA: 遇到问题？加入学习社群获取帮助
- WeChat QR code + follow instructions
- Only shown on course pages (not homepage)

#### Sidebar Community Entry (desktop)
- Injected via Starlight Sidebar component override
- Small QR code + "加入社群" at bottom of sidebar
- Only shown on course pages

### Visual System

| Token | Value | Usage |
|-------|-------|-------|
| accent | Emerald (#10b981) | Buttons, links, highlights |
| gray | Slate (#64748b) | Text, borders, backgrounds |
| highlight | Teal (#14b8a6) | CTA areas, badges |
| Hero bg | slate-900 → emerald-950 | Hero gradient |

- Cards: rounded-xl, light shadow, hover lift + border highlight
- Dark mode: Starlight built-in toggle, Tailwind `dark:` follows
- Typography: System font stack (Starlight default)

## File Changes

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/styles/global.css` | Tailwind entry + theme overrides |
| Create | `src/pages/index.astro` | Custom homepage |
| Create | `src/components/CourseCard.astro` | Tutorial card component |
| Create | `src/components/HeroSection.astro` | Hero section component |
| Create | `src/components/SectionTitle.astro` | Section heading component |
| Create | `src/components/SiteFooter.astro` | Homepage footer |
| Create | `src/components/CommunityBanner.astro` | Course page bottom banner |
| Create | `src/components/CustomFooter.astro` | Starlight Footer override |
| Create | `src/components/CustomSidebar.astro` | Starlight Sidebar override |
| Modify | `astro.config.mjs` | Add Tailwind, component overrides, update site URL |
| Delete | `src/content/docs/index.mdx` | Replace with src/pages/index.astro |
| Modify | `package.json` | Add tailwindcss dependencies |

## Out of Scope

- Instructor/author detailed bio page
- User accounts / progress tracking
- Newsletter subscription
- Course content changes
- English locale updates
