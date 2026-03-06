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
      logo: {
        src: './src/assets/avatar.png',
      },
      favicon: '/favicon.png',
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
          collapsed: true,
          autogenerate: { directory: 'openclaw' },
        },
        {
          label: 'OpenCode 从零到生产级',
          translations: { en: 'OpenCode Zero to Production' },
          collapsed: true,
          autogenerate: { directory: 'opencode' },
        },
      ],
      components: {
        SocialIcons: './src/components/CustomSocialIcons.astro',
        Footer: './src/components/CustomFooter.astro',
        Sidebar: './src/components/CustomSidebar.astro',
      },
      plugins: [starlightImageZoom()],
      customCss: ['./src/styles/global.css'],
    }),
  ],

  vite: { plugins: [tailwindcss()] },

  adapter: cloudflare(),
});
