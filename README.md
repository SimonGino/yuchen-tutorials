# 宇辰AI编程

基于 [Astro Starlight](https://starlight.astro.build/) 构建的教程站点。

**在线访问**：<https://learn.yuchen.dev>

## 本地开发

```bash
pnpm install
pnpm dev
```

## 部署（Cloudflare Pages）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages → Create → Pages → Connect to Git
2. 选择 GitHub 仓库
3. 构建配置：
   - **Framework preset**: Astro
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
   - **环境变量**: `NODE_VERSION` = `22`
4. Save and Deploy
5. （可选）在 Custom domains 中绑定自定义域名
