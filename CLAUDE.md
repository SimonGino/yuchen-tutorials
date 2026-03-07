# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chinese-language AI programming tutorial site ("宇辰AI编程") built with **Astro Starlight** and deployed to **Cloudflare Pages**. The site hosts multi-chapter tutorial series on AI tools (OpenClaw, OpenCode, Skill writing, etc.).

Live site: https://learn.aiqqyc.com/

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (Astro)
pnpm build            # Build for production
pnpm preview          # Build + local Wrangler preview
pnpm deploy           # Build + deploy to Cloudflare
```

## Architecture

- **Framework**: Astro Starlight (docs theme) + Tailwind CSS v4 + Cloudflare adapter
- **Package manager**: pnpm (workspace config in `pnpm-workspace.yaml`)
- **Hosting**: Cloudflare Pages via Wrangler (`wrangler.jsonc`)

### Content Structure

Tutorial content lives in `src/content/docs/` as Markdown files with Starlight frontmatter:

```
src/content/docs/
├── openclaw/       # OpenClaw tutorial (11 chapters, zh-CN)
├── opencode/       # OpenCode tutorial (8 chapters, zh-CN)
├── skill/          # Skill writing guide (9 chapters, zh-CN)
└── en/openclaw/    # English translations (partial)
```

Each tutorial directory uses numbered filenames (`01-install.md`, `02-model.md`, etc.) plus an `index.md` landing page. Sidebar sections are auto-generated from these directories (configured in `astro.config.mjs`).

### Key Configuration

- `astro.config.mjs` — Sidebar structure, locales (zh-CN default, partial English), custom component overrides, plugins (image zoom)
- `src/content.config.ts` — Astro content collection using Starlight's `docsLoader`/`docsSchema`
- `src/styles/global.css` — Tailwind theme with emerald accent / slate gray color scheme

### Custom Components (`src/components/`)

Starlight component overrides registered in `astro.config.mjs` under `components`:

- `CustomSocialIcons.astro` — Adds WeChat QR code popover to header social icons
- `CustomFooter.astro` — Injects `CommunityBanner` on OpenClaw pages
- `CustomSidebar.astro` — Appends WeChat QR code section below sidebar nav
- `CommunityBanner.astro` — Standalone community join banner (used by footer)

### Custom Homepage

`src/pages/index.astro` — Full custom splash page using `StarlightPage` wrapper. Contains tutorial card grid, open-source project cards, and site footer. Styled with scoped CSS using Starlight CSS variables (`--sl-color-*`).

### Static Assets

- `public/images/` — Tutorial diagrams, avatars, WeChat QR code
- `src/assets/` — Astro-processed assets (logo)

### Design Plans

`docs/plans/` — Historical design/implementation plans for reference (not published content).

## Conventions

- Default locale is `zh-CN` (root). English translations go under `en/` subdirectory.
- Tutorial chapters use zero-padded numbering: `01-`, `02-`, etc.
- All styling uses Starlight's CSS custom properties (`--sl-color-*`) for theme consistency.
