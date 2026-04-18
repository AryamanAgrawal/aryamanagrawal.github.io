# aryamanagrawal.github.io

Personal site — writing about memory, agents, and the things in between.

Built in [Astro](https://astro.build) with MDX. Dark-default with a light counterpart, single cyan accent, ledger grid (8rem gutter / 44rem body) on every page. Design rationale lives in [`design-sheet.html`](./design-sheet.html).

## Stack

- **Astro 6** + MDX
- **Inter Tight** (display) · **Newsreader** (prose) · **JetBrains Mono** (labels)
- KaTeX (math) · Shiki (syntax) · GSAP-ready (motion deferred)
- Per-page Open Graph images via `astro-og-canvas`
- RSS, JSON Feed, llms.txt for human + agent discoverability
- View Transitions, prefetch on hover

## Content

Four collections, all type-safe via Zod:

```
src/content/
  ├── essays/    .mdx — long-form, summary required
  ├── poems/     .md  — italic serif rendering
  ├── photos/    .mdx — photo essays with roll metadata
  └── sketches/  .md  — notebook pages, lit-page detail view
```

To publish: drop a file into the right collection, `git push`. GitHub Actions builds + deploys to Pages.

## Local dev

```sh
pnpm install
pnpm dev          # localhost:4321
pnpm build        # production build → dist/
pnpm preview
```

## Deploy

Push to `master`. GitHub Action (`.github/workflows/deploy.yml`) runs `astro build` and publishes to GitHub Pages. Live at [aryamanagrawal.github.io](https://aryamanagrawal.github.io).
