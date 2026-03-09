# Monochrome UI Redesign

Date: 2026-03-08
Reference: NotebookLM Web Importer docs site (pure black-white-gray aesthetic)

## Goal

Shift the entire site (homepage + article pages) from emerald-green accent / slate-gray to a pure monochrome zinc-gray palette. Both light and dark modes.

## Approach

**CSS-only override (Approach A)** — change Starlight CSS variables + targeted style overrides. No new components. 2 files changed.

## Design

### 1. Color System (`src/styles/global.css`)

- `--color-accent-*`: emerald -> zinc (50-950)
- `--color-gray-*`: slate -> zinc (50-950)

Zinc scale:
- 50: #fafafa, 100: #f4f4f5, 200: #e4e4e7, 300: #d4d4d8, 400: #a1a1aa
- 500: #71717a, 600: #52525b, 700: #3f3f46, 800: #27272a, 900: #18181b, 950: #09090b

### 2. Sidebar Active State (`src/styles/global.css`)

Override Starlight sidebar `[aria-current="page"]`:
- Light: bg zinc-900 (#18181b), white text, border-radius 0.5rem
- Dark: bg zinc-700 (#3f3f46), white text, border-radius 0.5rem
- Remove default left-border/accent indicator, use filled background highlight

### 3. Homepage (`src/pages/index.astro`)

**Profile Banner:**
- Remove background box, border, shadow
- Simple flex layout: avatar + text, lightweight feel

**Tutorial Cards:**
- Remove box-shadow and hover lift animation
- Background: zinc-50 (#fafafa) light / zinc-800 (#27272a) dark
- Border: 1px zinc-200 (#e4e4e7) light / zinc-700 (#3f3f46) dark
- Hover: border darkens one step only (e.g. zinc-200 -> zinc-400), no transform/shadow
- Disabled cards: keep opacity reduction

**Footer:**
- Colors follow new palette via existing CSS variables
- No structural changes needed

### 4. Article Content Styles (`src/styles/global.css`)

**Links:**
- Same color as body text + underline
- Hover: color shifts to zinc-500

**Admonitions (note/tip/warning/caution):**
- Border and icon colors unified to gray
- Remove semantic blue/green/yellow/red
- Background: very light gray

**Code blocks & TOC:**
- Automatically follow accent -> zinc change

## Files Changed

| File | Changes |
|------|---------|
| `src/styles/global.css` | Accent/gray palette to zinc, sidebar active override, link styles, admonition gray |
| `src/pages/index.astro` | Banner de-boxed, cards flat/no-shadow, color updates |
