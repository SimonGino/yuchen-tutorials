# Homepage Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the minimal Starlight splash page into a personal IP knowledge hub with tutorial showcase, brand identity, and community entry points.

**Architecture:** Custom homepage via `src/pages/index.astro` using `StarlightPage` wrapper for Starlight chrome (header, theme toggle, social icons). Tailwind CSS v4 for styling. Course pages enhanced via Starlight component overrides (Footer). Site URL updated to `learn.aiqqyc.com`.

**Tech Stack:** Astro 5, Starlight 0.37, Tailwind CSS v4 (`@tailwindcss/vite` + `@astrojs/starlight-tailwind`), Cloudflare Workers

**Design doc:** `docs/plans/2026-03-06-homepage-redesign-design.md`

---

### Task 1: Install Tailwind CSS dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install packages**

Run: `pnpm add tailwindcss @tailwindcss/vite @astrojs/starlight-tailwind`

Expected: 3 packages added to dependencies in package.json

**Step 2: Verify installation**

Run: `pnpm list tailwindcss @tailwindcss/vite @astrojs/starlight-tailwind`

Expected: All 3 packages listed

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add Tailwind CSS v4 dependencies"
```

---

### Task 2: Configure Tailwind + Emerald theme

**Files:**
- Create: `src/styles/global.css`
- Modify: `astro.config.mjs`

**Step 1: Create global CSS with Tailwind + Starlight integration**

Create `src/styles/global.css`:

```css
@layer base, starlight, theme, components, utilities;

@import '@astrojs/starlight-tailwind';
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities);

@theme {
  --color-accent-50: var(--color-emerald-50);
  --color-accent-100: var(--color-emerald-100);
  --color-accent-200: var(--color-emerald-200);
  --color-accent-300: var(--color-emerald-300);
  --color-accent-400: var(--color-emerald-400);
  --color-accent-500: var(--color-emerald-500);
  --color-accent-600: var(--color-emerald-600);
  --color-accent-700: var(--color-emerald-700);
  --color-accent-800: var(--color-emerald-800);
  --color-accent-900: var(--color-emerald-900);
  --color-accent-950: var(--color-emerald-950);
  --color-gray-50: var(--color-slate-50);
  --color-gray-100: var(--color-slate-100);
  --color-gray-200: var(--color-slate-200);
  --color-gray-300: var(--color-slate-300);
  --color-gray-400: var(--color-slate-400);
  --color-gray-500: var(--color-slate-500);
  --color-gray-600: var(--color-slate-600);
  --color-gray-700: var(--color-slate-700);
  --color-gray-800: var(--color-slate-800);
  --color-gray-900: var(--color-slate-900);
  --color-gray-950: var(--color-slate-950);
}
```

**Step 2: Update astro.config.mjs**

Add Tailwind vite plugin and customCss. The full updated config:

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightImageZoom from 'starlight-image-zoom';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://learn.aiqqyc.com',

  integrations: [
    starlight({
      title: {
        'zh-CN': '宇辰AI编程',
        en: 'YuChen AI',
      },
      defaultLocale: 'root',
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
        en: {
          label: 'English',
        },
      },
      sidebar: [
        {
          label: 'OpenClaw 从零到生产',
          translations: { en: 'OpenClaw Zero to Production' },
          autogenerate: { directory: 'openclaw' },
        },
      ],
      components: {
        SocialIcons: './src/components/CustomSocialIcons.astro',
      },
      plugins: [starlightImageZoom()],
      customCss: ['./src/styles/global.css'],
    }),
  ],

  vite: { plugins: [tailwindcss()] },

  adapter: cloudflare(),
});
```

Key changes from original:
- `site` → `https://learn.aiqqyc.com`
- Added `import tailwindcss from '@tailwindcss/vite'`
- Added `vite: { plugins: [tailwindcss()] }`
- Added `customCss: ['./src/styles/global.css']`

**Step 3: Verify dev server starts**

Run: `pnpm dev`

Expected: Dev server starts without errors. Visit homepage — should look similar to before but with emerald green accent color instead of default blue.

**Step 4: Commit**

```bash
git add src/styles/global.css astro.config.mjs
git commit -m "feat: configure Tailwind CSS v4 with emerald theme"
```

---

### Task 3: Create custom homepage with Hero section

**Files:**
- Create: `src/pages/index.astro`
- Delete: `src/content/docs/index.mdx`

**Step 1: Delete old homepage**

Remove `src/content/docs/index.mdx` (the minimal splash page).

**Step 2: Create custom homepage**

Create `src/pages/index.astro`:

```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
---

<StarlightPage
  frontmatter={{
    title: '宇辰AI编程 · 教程',
    description: 'AI 前沿技术与实用技巧分享',
    template: 'splash',
    pagefind: false,
  }}
>
  <!-- Hero Section -->
  <section class="mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
    <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
      宇辰AI编程
    </h1>
    <p class="mt-6 text-lg leading-relaxed text-[var(--sl-color-gray-3)] sm:text-xl">
      专注 AI 前沿技术与实用技巧分享<br />
      用通俗易懂的方式解读人工智能<br />
      助你轻松掌握 AI 工具，提升工作效率
    </p>
    <div class="mt-8">
      <a
        href="#tutorials"
        class="inline-flex items-center gap-2 rounded-lg bg-[var(--sl-color-accent)] px-6 py-3 font-medium text-white transition hover:opacity-90"
      >
        浏览教程 ↓
      </a>
    </div>
  </section>

  <!-- Tutorial Sections -->
  <div id="tutorials" class="mx-auto max-w-4xl px-4 pb-16">

    <!-- 使用端工具教程 -->
    <section class="mb-12">
      <h2 class="mb-6 text-2xl font-bold">使用端工具教程</h2>
      <div class="grid gap-6 sm:grid-cols-2">

        <!-- OpenClaw Card -->
        <a href="/openclaw/" class="group block rounded-xl border border-[var(--sl-color-gray-5)] bg-[var(--sl-color-bg-nav)] p-6 transition hover:-translate-y-1 hover:border-[var(--sl-color-accent)] hover:shadow-lg">
          <div class="mb-3 text-3xl">🐾</div>
          <h3 class="text-lg font-semibold group-hover:text-[var(--sl-color-accent)]">OpenClaw</h3>
          <p class="mt-2 text-sm text-[var(--sl-color-gray-3)]">从零搭建你的 AI 助手</p>
          <div class="mt-4 flex items-center justify-between">
            <span class="text-xs text-[var(--sl-color-gray-3)]">11 章节</span>
            <span class="text-sm font-medium text-[var(--sl-color-accent)]">开始学习 →</span>
          </div>
        </a>

        <!-- Claude Code Card -->
        <div class="relative rounded-xl border border-[var(--sl-color-gray-5)] bg-[var(--sl-color-bg-nav)] p-6 opacity-75">
          <span class="absolute top-4 right-4 rounded-full bg-[var(--sl-color-gray-5)] px-3 py-1 text-xs text-[var(--sl-color-gray-3)]">即将上线</span>
          <div class="mb-3 text-3xl">🤖</div>
          <h3 class="text-lg font-semibold">Claude Code</h3>
          <p class="mt-2 text-sm text-[var(--sl-color-gray-3)]">AI 编程利器深度指南</p>
        </div>

      </div>
    </section>

    <!-- 工具类教程 -->
    <section class="mb-12">
      <h2 class="mb-6 text-2xl font-bold">工具类教程</h2>
      <div class="grid gap-6 sm:grid-cols-2">

        <!-- MCP Card -->
        <div class="relative rounded-xl border border-[var(--sl-color-gray-5)] bg-[var(--sl-color-bg-nav)] p-6 opacity-75">
          <span class="absolute top-4 right-4 rounded-full bg-[var(--sl-color-gray-5)] px-3 py-1 text-xs text-[var(--sl-color-gray-3)]">即将上线</span>
          <div class="mb-3 text-3xl">⚡</div>
          <h3 class="text-lg font-semibold">MCP 配置</h3>
          <p class="mt-2 text-sm text-[var(--sl-color-gray-3)]">模型上下文协议实战</p>
        </div>

        <!-- Skill Card -->
        <div class="relative rounded-xl border border-[var(--sl-color-gray-5)] bg-[var(--sl-color-bg-nav)] p-6 opacity-75">
          <span class="absolute top-4 right-4 rounded-full bg-[var(--sl-color-gray-5)] px-3 py-1 text-xs text-[var(--sl-color-gray-3)]">即将上线</span>
          <div class="mb-3 text-3xl">🧩</div>
          <h3 class="text-lg font-semibold">Skill 编写</h3>
          <p class="mt-2 text-sm text-[var(--sl-color-gray-3)]">自定义技能开发指南</p>
        </div>

      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-[var(--sl-color-gray-5)] pt-8 text-center text-sm text-[var(--sl-color-gray-3)]">
      <p class="font-medium text-[var(--sl-color-text)]">宇辰AI编程</p>
      <div class="mt-3 flex flex-wrap justify-center gap-4">
        <span>💬 个人微信: <strong>待补充</strong></span>
        <span>📱 交流群: 右上角扫码</span>
      </div>
      <p class="mt-4">&copy; 2026 宇辰AI编程 · learn.aiqqyc.com</p>
    </footer>

  </div>
</StarlightPage>
```

**Step 3: Verify homepage renders**

Run: `pnpm dev`

Expected: Homepage shows:
- Starlight header with site title, theme toggle, social icons (including WeChat)
- Hero section with brand name, tagline, CTA button
- 2 tutorial category sections with card grids
- OpenClaw card is clickable, others show "即将上线"
- Footer with contact info
- No sidebar (splash template)
- Responsive: cards stack on mobile, 2-col on desktop

**Step 4: Commit**

```bash
git rm src/content/docs/index.mdx
git add src/pages/index.astro
git commit -m "feat: custom homepage with tutorial showcase and brand identity"
```

---

### Task 4: Course page community banner (Footer override)

**Files:**
- Create: `src/components/CommunityBanner.astro`
- Create: `src/components/CustomFooter.astro`
- Modify: `astro.config.mjs` (add Footer to components)

**Step 1: Create CommunityBanner component**

Create `src/components/CommunityBanner.astro`:

```astro
<div class="community-banner">
  <div class="community-banner-inner">
    <div class="community-banner-text">
      <p class="community-banner-title">💬 遇到问题？加入学习社群获取帮助</p>
      <p class="community-banner-desc">微信扫码关注「宇辰AI编程」公众号，回复「入群」加入答疑交流群</p>
    </div>
    <div class="community-banner-qr">
      <img src="/images/wechat-qrcode.png" alt="微信公众号二维码" width="100" height="100" />
    </div>
  </div>
</div>

<style>
  .community-banner {
    margin-top: 2rem;
    padding: 1.5rem;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 12px;
    background: var(--sl-color-bg-nav);
  }

  .community-banner-inner {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .community-banner-text {
    flex: 1;
  }

  .community-banner-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
  }

  .community-banner-desc {
    font-size: 0.875rem;
    color: var(--sl-color-gray-3);
    margin: 0;
  }

  .community-banner-qr img {
    border-radius: 8px;
  }

  @media (max-width: 640px) {
    .community-banner-inner {
      flex-direction: column;
      text-align: center;
    }
  }
</style>
```

**Step 2: Create CustomFooter that wraps Starlight default + banner**

Create `src/components/CustomFooter.astro`:

```astro
---
import Default from '@astrojs/starlight/components/Footer.astro';

// Show community banner on course pages only (not the homepage)
const isCourseePage = Astro.url.pathname.includes('/openclaw/');
---

{isCourseePage && (
  <div class="community-banner-wrapper">
    <Fragment>
      {await import('./CommunityBanner.astro').then(m => {
        const CommunityBanner = m.default;
        return Astro.slots.render ? undefined : undefined;
      })}
    </Fragment>
  </div>
)}

<Default><slot /></Default>
```

Wait — Astro component dynamic imports in this pattern are tricky. Simpler approach:

```astro
---
import Default from '@astrojs/starlight/components/Footer.astro';
import CommunityBanner from './CommunityBanner.astro';

const isCourseePage = Astro.url.pathname.includes('/openclaw/');
---

{isCourseePage && <CommunityBanner />}

<Default><slot /></Default>
```

**Step 3: Register Footer override in astro.config.mjs**

In the `components` object inside `starlight()`, add:

```js
components: {
  SocialIcons: './src/components/CustomSocialIcons.astro',
  Footer: './src/components/CustomFooter.astro',
},
```

**Step 4: Verify banner appears on course pages**

Run: `pnpm dev`

Expected:
- Visit `/openclaw/01-install/` → community banner appears between content and page footer
- Visit homepage → no community banner
- Banner shows QR code + text, responsive on mobile

**Step 5: Commit**

```bash
git add src/components/CommunityBanner.astro src/components/CustomFooter.astro astro.config.mjs
git commit -m "feat: add community banner to course page footers"
```

---

### Task 5: Course page sidebar community entry

**Files:**
- Create: `src/components/CustomSidebar.astro`
- Modify: `astro.config.mjs` (add Sidebar to components)

**Step 1: Create CustomSidebar with community entry at bottom**

Create `src/components/CustomSidebar.astro`:

```astro
---
import Default from '@astrojs/starlight/components/Sidebar.astro';
---

<Default><slot /></Default>

<div class="sidebar-community">
  <div class="sidebar-community-divider"></div>
  <p class="sidebar-community-title">💬 加入社群</p>
  <p class="sidebar-community-desc">扫码关注公众号</p>
  <img src="/images/wechat-qrcode.png" alt="微信公众号二维码" width="120" height="120" class="sidebar-community-qr" />
</div>

<style>
  .sidebar-community {
    padding: 1rem 1rem 1.5rem;
    text-align: center;
  }

  .sidebar-community-divider {
    border-top: 1px solid var(--sl-color-gray-5);
    margin-bottom: 1rem;
  }

  .sidebar-community-title {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0 0 0.25rem;
  }

  .sidebar-community-desc {
    font-size: 0.75rem;
    color: var(--sl-color-gray-3);
    margin: 0 0 0.75rem;
  }

  .sidebar-community-qr {
    border-radius: 8px;
    margin: 0 auto;
    display: block;
  }
</style>
```

**Step 2: Register Sidebar override in astro.config.mjs**

In the `components` object:

```js
components: {
  SocialIcons: './src/components/CustomSocialIcons.astro',
  Footer: './src/components/CustomFooter.astro',
  Sidebar: './src/components/CustomSidebar.astro',
},
```

**Step 3: Verify sidebar shows community entry**

Run: `pnpm dev`

Expected:
- Visit `/openclaw/01-install/` on desktop → sidebar shows course navigation + divider + community QR at bottom
- Mobile → sidebar hidden behind toggle (community QR visible when sidebar is open)
- No visual breakage of sidebar navigation

**Step 4: Commit**

```bash
git add src/components/CustomSidebar.astro astro.config.mjs
git commit -m "feat: add community entry to course page sidebar"
```

---

### Task 6: Visual polish and build verification

**Files:**
- Possibly adjust: `src/pages/index.astro` (minor tweaks)

**Step 1: Run production build**

Run: `pnpm build`

Expected: Build completes without errors. Check for any Tailwind purge issues (missing classes).

**Step 2: Visual review checklist**

Run dev server and verify each page:

- [ ] Homepage: Hero renders with correct text, CTA button works (scrolls to #tutorials)
- [ ] Homepage: OpenClaw card links to `/openclaw/`
- [ ] Homepage: "即将上线" cards are not clickable, slightly dimmed
- [ ] Homepage: Footer shows contact info
- [ ] Homepage: Dark mode toggle works, all sections readable
- [ ] Homepage: Mobile responsive (cards stack, text sizes adjust)
- [ ] Course page: `/openclaw/` renders normally with sidebar
- [ ] Course page: Community banner appears before page footer
- [ ] Course page: Sidebar has community QR at bottom
- [ ] Course page: Emerald accent color visible in links and highlights
- [ ] Course page: Dark mode works correctly

**Step 3: Fix any issues found in visual review**

Address any layout, color, or responsive issues.

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: visual polish and responsive adjustments"
```

(Skip this commit if no fixes were needed.)

---

### Task 7: Final build + verify deploy readiness

**Step 1: Clean build**

Run: `pnpm build`

Expected: Build succeeds, no warnings about missing pages or broken links.

**Step 2: Preview with Wrangler**

Run: `pnpm preview`

Expected: Site loads correctly at localhost, all pages and navigation work.

**Step 3: Commit any remaining changes**

If there are any uncommitted changes:

```bash
git add -A
git commit -m "chore: final build verification"
```
