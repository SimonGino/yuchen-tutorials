# Monochrome UI Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Shift the site from emerald-green/slate to pure monochrome zinc-gray, matching the NotebookLM Web Importer docs aesthetic.

**Architecture:** CSS-only approach — swap Starlight CSS variables for the color palette, add targeted overrides for sidebar active state / links / admonitions in `global.css`, and update homepage scoped styles in `index.astro`. No new components.

**Tech Stack:** Astro Starlight, Tailwind CSS v4, CSS custom properties

**Design doc:** `docs/plans/2026-03-08-monochrome-ui-design.md`

---

### Task 1: Swap color palette to zinc

**Files:**
- Modify: `src/styles/global.css:11-34` (the `@theme` block)

**Step 1: Replace the @theme block**

Replace the entire `@theme { ... }` block with zinc values for both accent and gray:

```css
@theme {
  --color-accent-50: #fafafa;
  --color-accent-100: #f4f4f5;
  --color-accent-200: #e4e4e7;
  --color-accent-300: #d4d4d8;
  --color-accent-400: #a1a1aa;
  --color-accent-500: #71717a;
  --color-accent-600: #52525b;
  --color-accent-700: #3f3f46;
  --color-accent-800: #27272a;
  --color-accent-900: #18181b;
  --color-accent-950: #09090b;
  --color-gray-50: #fafafa;
  --color-gray-100: #f4f4f5;
  --color-gray-200: #e4e4e7;
  --color-gray-300: #d4d4d8;
  --color-gray-400: #a1a1aa;
  --color-gray-500: #71717a;
  --color-gray-600: #52525b;
  --color-gray-700: #3f3f46;
  --color-gray-800: #27272a;
  --color-gray-900: #18181b;
  --color-gray-950: #09090b;
}
```

**Step 2: Verify**

Run: `pnpm dev` and check both light/dark modes. All green accents should now be gray. Sidebar, TOC indicator, links, focus rings — all gray.

---

### Task 2: Sidebar active state rounded highlight

**Files:**
- Modify: `src/styles/global.css` (add after the `@theme` block)

**Step 1: Add sidebar active state override**

Starlight's default active sidebar style (in `SidebarSublist.astro`) uses:
```css
[aria-current='page'] {
  font-weight: 600;
  color: var(--sl-color-text-invert);
  background-color: var(--sl-color-text-accent);
}
```

After the zinc palette swap, `--sl-color-text-accent` already maps to a dark gray. We just need to add `border-radius`. Add this CSS after the `@theme` block:

```css
/* Sidebar active state: rounded pill highlight */
[aria-current='page'] {
  border-radius: 0.5rem;
}
```

**Step 2: Verify**

Check sidebar in both light and dark modes. Active item should have a rounded dark background (light mode) or lighter gray background (dark mode) with white text.

---

### Task 3: Article link styles

**Files:**
- Modify: `src/styles/global.css` (append)

**Step 1: Override content link color**

Starlight's default is:
```css
.sl-markdown-content a { color: var(--sl-color-text-accent); }
```

After zinc swap, links become gray which is hard to distinguish from body text. Add underline and use body text color:

```css
/* Links: body color + underline, hover dims to gray */
.sl-markdown-content a:not(:where(.not-content *)) {
  color: var(--sl-color-text);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

.sl-markdown-content a:hover:not(:where(.not-content *)) {
  color: #71717a;
}
```

**Step 2: Verify**

Open an article page with links. Links should be same color as body text with underline. Hover should dim to zinc-500 gray.

---

### Task 4: Admonitions grayscale

**Files:**
- Modify: `src/styles/global.css` (append)

**Step 1: Override admonition colors**

Starlight uses `.starlight-aside--note`, `.starlight-aside--tip`, `.starlight-aside--caution`, `.starlight-aside--danger` with semantic colors (blue, purple, orange, red). Override all to gray:

```css
/* Admonitions: unified gray */
.starlight-aside--note,
.starlight-aside--tip,
.starlight-aside--caution,
.starlight-aside--danger {
  --sl-color-asides-text-accent: var(--sl-color-gray-2);
  --sl-color-asides-border: var(--sl-color-gray-4);
  background-color: var(--sl-color-gray-6);
}
```

This uses Starlight's own gray scale variables (`--sl-color-gray-2` through `--sl-color-gray-6`) which automatically adapt to light/dark mode.

**Step 2: Verify**

Find a page with admonitions (tip/note/caution blocks). All should show gray border, gray title/icon, light gray background — no blue/purple/orange/red.

---

### Task 5: Homepage — profile banner

**Files:**
- Modify: `src/pages/index.astro:113-142` (scoped CSS for `.profile-banner`)

**Step 1: Simplify banner styles**

Replace the `.profile-banner` CSS block. Remove background, border, shadow, rounded corners:

```css
.profile-banner {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem 0;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid var(--sl-color-gray-5);
}
```

**Step 2: Verify**

Open homepage. Banner should be a simple flex row with a bottom divider line, no box.

---

### Task 6: Homepage — flat cards

**Files:**
- Modify: `src/pages/index.astro:162-186` (scoped CSS for `.tutorial-card` and hover)

**Step 1: Replace card and hover styles**

```css
.tutorial-card {
  position: relative;
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  background-color: var(--sl-color-gray-6);
  border: 1px solid var(--sl-color-gray-5);
}

.tutorial-card--clickable {
  display: block;
  text-decoration: none;
  transition: border-color 0.2s;
}

.tutorial-card--clickable:hover {
  border-color: var(--sl-color-gray-3);
}

.tutorial-card--disabled {
  opacity: 0.75;
}
```

Key changes: removed `box-shadow`, removed `transform: translateY()`, removed `!important` border-color override, hover only darkens border.

**Step 2: Verify**

Open homepage. Cards should be flat with subtle gray background and thin border. Hover should only darken the border — no lift, no shadow.

---

### Task 7: Build verification and commit

**Step 1: Full build check**

Run: `pnpm build`
Expected: Build succeeds with no errors.

**Step 2: Visual spot check**

Run: `pnpm dev` and verify:
- [ ] Homepage: banner is clean, cards are flat, footer looks right
- [ ] Article page: links are black+underline, admonitions are gray
- [ ] Sidebar: active item has rounded dark bg
- [ ] Dark mode: all elements invert correctly
- [ ] Light mode: clean white bg, black text

**Step 3: Commit**

```bash
git add src/styles/global.css src/pages/index.astro
git commit -m "style: monochrome UI redesign — zinc palette, flat cards, gray admonitions"
```
