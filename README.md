# 宇辰AI编程

基于 [Astro Starlight](https://starlight.astro.build/) 构建的 AI 编程教程站点。

**在线访问**：<https://learn.aiqqyc.com/>

## 教程内容

| 教程 | 说明 | 状态 |
|------|------|------|
| [OpenClaw](https://learn.aiqqyc.com/openclaw/) | 从零搭建你的 AI 助手 | ✅ 11 章节 |
| [OpenCode](https://learn.aiqqyc.com/opencode/) | 终端 AI 编程助手实战 | ✅ 8 章节 |
| [Skill 编写](https://learn.aiqqyc.com/skill/) | 自定义技能开发指南 | ✅ 9 章节 |
| Claude Code | AI 编程助手深度实战 | 🚧 即将上线 |
| MCP 配置 | 模型上下文协议实战 | 🚧 即将上线 |

## 开源项目

- [ArcReel](https://github.com/ArcReel/ArcReel) — AI 驱动的小说转短视频工作台

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
