# Design Skill Arena

[English](./README.md) | 简体中文

<p align="center">
  <strong>同一个产品 brief，不同模型与设计技能链，会做出怎样不同的前端？</strong>
</p>

<p align="center">
  <a href="https://arena.xflux.cn"><strong>在线浏览 Arena</strong></a>
</p>

Design Skill Arena 是一个用于观察和比较 AI 前端实现差异的静态展示项目。

项目让不同 AI 模型在同一份 **Muse AI Campaign Studio** 产品 brief 下，分别使用不同的前端设计技能链完成独立页面。每个结果都是真实可打开、可交互的页面，而不是只展示截图或设计稿。

它是一个 **showcase，不是 benchmark**：

- 不做总分；
- 不给模型排名；
- 不把审美差异压缩成单一数字；
- 让访问者直接查看真实页面并形成自己的判断。

## 如何浏览

- 首页按确定顺序交错展示模型与技能组合；可以搜索，或固定模型、技能组合缩小范围。
- 打开详情可查看截图、设计目标、技能来源和当前组合上下文；交互作品仍通过独立页面打开。
- 筛选、分页、当前作品与界面语言保存在 URL 中，支持分享和浏览器返回。
- `/skills/` 提供公开技能来源与关联组合；`/methodology/` 说明共同需求、样本边界，并提供单独的 18 件作品贡献模板。
- 缺乏证据的生成日期、生成时技能版本显示“未记录”。喜欢是可选反馈，不参与排序。

## 为什么做这个项目

AI 生成前端的最终质量，不只取决于模型本身，还受到设计上下文、技能组合、组件约束和实施流程影响。

Design Skill Arena 尝试把这些变量放到同一个可观察环境中：

- 相同产品 brief；
- 相同页面目标；
- 独立的模型实现；
- 不同设计技能链；
- 统一的展示与浏览方式。

重点不是回答“哪个模型最好”，而是观察：

- 哪些技能链能建立更清晰的视觉层级；
- 哪些实现更接近真实产品，而不是生成式模板；
- 组件系统、响应式布局和细节打磨如何影响最终质量；
- 模型能力与设计方法之间如何相互作用。

## 可以比较什么

每个页面可以从这些维度直接观察：

- 信息架构与页面节奏；
- 视觉层级和排版；
- 组件系统与一致性；
- 产品感与品牌表达；
- 桌面端和移动端适配；
- 动效、交互和细节完成度；
- 对同一 brief 的理解与取舍。

## Arena 如何组织

每个模型都需要提供同一组展示方向，每个方向对应一个独立路由：

```text
/model-showcase/{modelSlug}/{showcaseId}
```

当前使用 18 组技能链：

```text
standard-builder
visual-frontend
design-logic
impeccable-full-flow
artifact-builder
ux-pro-reference
component-system
motion-bits
standard-taste
standard-impeccable
visual-taste
visual-impeccable
design-ux-pro
design-impeccable
balanced-chain
visual-premium-chain
product-polish-chain
max-quality-chain
```

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/base UI primitives
- Cloudflare Pages 静态部署
- 可选 Cloudflare R2 资源托管
- 可选 Cloudflare D1 点赞数据

## 本地开发

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:3000`。

## 静态构建

```bash
pnpm build:static
pnpm preview:static
```

静态产物输出到 `out/`。默认使用 `public/` 中的本地截图；只有同时设置 `NEXT_PUBLIC_USE_R2_ASSETS=1` 和 `NEXT_PUBLIC_ASSET_BASE_URL` 时才切换到 R2。

## Cloudflare Pages

项目通过 `wrangler.jsonc` 支持 Cloudflare Pages direct upload：

```bash
pnpm deploy:cloudflare
```

生产环境推荐配置：

```text
Build command: pnpm build:cloudflare
Output directory: out
Environment variable: NEXT_PUBLIC_USE_R2_ASSETS=1
Environment variable: NEXT_PUBLIC_ASSET_BASE_URL=https://arena-assets.xflux.cn
```

当前域名：

- 站点：`https://arena.xflux.cn`
- 资源：`https://arena-assets.xflux.cn`

## 点赞能力

点赞是可选的 Cloudflare Pages Functions 增强能力。首页不会主动请求全部点赞数，只有卡片获得焦点、悬停、打开或点赞时才加载。

生产环境使用 D1：

```bash
pnpm db:migrate:remote
pnpm dlx wrangler@latest pages secret put VOTE_HASH_SALT --project-name design-skill-arena
```

表中只保存 `target_id`、匿名盐化访客哈希和时间戳。即使 API 或 D1 不可用，静态展示仍可正常工作。

## 截图资源

默认截图路径：

```text
model-screenshots/{modelSlug}/{showcaseId}/desktop.webp
```

开源分支可以继续把资源放在 `public/`，也可以保持同一路径结构迁移到 R2。

## 添加模型

提交前先阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)。

每个模型应作为独立实现放在：

```text
src/components/model-showcases/{modelSlug}/
```

不要在未被要求时提交新模型生成的批量截图。维护者会负责真实页面截图、WebP 压缩和 R2 上传。

## 检查

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build:static
```

---

由 [青野](https://github.com/liyanqing90) 创建并维护。
