import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightImageZoom from 'starlight-image-zoom';

export default defineConfig({
  site: 'https://learn.yuchen.dev',
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
    }),
  ],
});
