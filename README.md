# 🌱 Skill Island

> My Open Agent Skills Collection —— 我的智能体技能小岛

一个公开的 **Agent Skills 图鉴网站**：把仓库里的标准 `SKILL.md` 变成可浏览、可搜索、可理解、可复制使用的 Skill 博物馆。视觉上是「轻量动森 + 知识库 + GitHub Docs」，部署在 GitHub Pages。

---

## 技术栈

| 层 | 方案 |
| --- | --- |
| 框架 | React 19 + TypeScript 6 |
| 构建 | Vite 8 |
| 样式 | Tailwind CSS v4（`@theme static` token） |
| 动效 | framer-motion |
| 路由 | react-router-dom 7 |
| Markdown | react-markdown + remark-gfm + rehype-highlight |
| 数据 | gray-matter + fast-glob（构建期解析 `SKILL.md`） |
| 部署 | GitHub Actions → GitHub Pages |

---

## 数据是怎么来的

网站不维护数据库。唯一数据源是 `public/skill-hub/**/SKILL.md`：

```
public/skill-hub/
└── <分类>/
    └── <skill-name>/
        └── SKILL.md      # YAML frontmatter + Markdown 正文
```

`scripts/generate-skills.mjs` 在构建前扫描所有 `SKILL.md`，用 gray-matter 解析，产出两份文件：

| 产物 | 内容 |
| --- | --- |
| `src/data/skillsIndex.ts` | 112 个 skill 的元数据（不含正文，约 81 kB） |
| `src/data/skill-bodies/<id>.md` | 每个 skill 的正文单独成文件 |

正文按需加载：主 chunk 不含任何 skill 正文，详情页通过 `import.meta.glob(..., { query: '?raw' })` 只加载当前 skill 的那一份。

**目录 → 分类映射**：`engineering` → `coding`，`academic` / `study` / `thoughts` / `meta-wisdom` → `research`，`design`/`fintech`/`writing` → `creative`，`productivity`/`business` → `life`。

---

## 开发

```bash
pnpm install
pnpm generate   # 解析 SKILL.md -> skillsIndex.ts + skill-bodies/*.md
pnpm dev        # http://localhost:5173
pnpm build      # 自动先跑 generate，再 tsc -b && vite build
pnpm lint
pnpm preview
```

新增或修改 skill：把 `SKILL.md` 放进 `public/skill-hub/<分类>/<skill-name>/`，然后 `pnpm generate`。

---

## 配置

所有链接和站点信息集中在 `.env`（模板见 `.env.example`），**不要在组件里硬编码仓库地址**。应用侧统一从 `@/config/site` 读取：

```ts
import { site } from '@/lib/skills'

site.repoUrl       // https://github.com/Hanguangwu/great-skill-collection
site.repoSlug      // Hanguangwu/great-skill-collection
site.owner         // Qingyang
site.siteUrl       // https://hanguangwu.github.io/great-skill-collection
site.repoFile(p)   // → <repo>/blob/main/<p>
site.repoTree(p)   // → <repo>/tree/main/<p>
```

| 变量 | 作用 | 默认 |
| --- | --- | --- |
| `VITE_REPO_URL` | 仓库根地址，owner / siteUrl / 所有页面链接由它推导 | `https://github.com/Hanguangwu/great-skill-collection` |
| `VITE_SITE_URL` | 线上站点地址 | 由 `VITE_REPO_URL` 推导 |
| `VITE_BASE_PATH` | 部署子路径，同时驱动 Vite `base` 与路由 `basename` | `/great-skill-collection/` |
| `VITE_OWNER` | 展示用的作者名 | 取 `VITE_REPO_URL` 里的 owner |

本地覆盖用 `.env.local`（不入库）。

`VITE_BASE_PATH` 会被三处消费，天然保持一致：`vite.config.ts` 的 `base`、`src/main.tsx` 的 `basename`（读 `import.meta.env.BASE_URL`）、以及 `public/404.html`（从自身 URL 反推 base，不硬编码）。换仓库名或迁到自定义域名，只改 `.env` 一行。

---

## GitHub Pages 部署

`push` 到 `main` 会触发 `.github/workflows/deploy.yml`：install → generate → build → deploy。

仓库首次使用需要手动开启一次：**Settings → Pages → Build and deployment → Source 选 `GitHub Actions`**。

---

## 添加自己的 Skill

```markdown
---
name: React UI Builder
description: Generate modern React interfaces.
author: Qingyang
version: 1.0.0
tags:
  - React
  - TypeScript
category: coding
---

# React UI Builder

正文用 Markdown 写，会被完整渲染在详情页。
```

放到 `public/skill-hub/coding/react-ui-builder/SKILL.md`，然后 `pnpm generate`。
