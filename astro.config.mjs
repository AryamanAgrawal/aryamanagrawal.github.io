// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
// rehype-mermaid intentionally deferred — it requires Playwright as a peer dep (~150MB).
// Add it back once we're ready to ship the first diagram-using essay:
//   pnpm add playwright && npx playwright install --with-deps chromium

export default defineConfig({
  site: 'https://aryamanagrawal.github.io',
  trailingSlash: 'never',

  // Prefetch on hover by default — instant nav on the editorial column.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },

  integrations: [
    mdx({
      remarkPlugins: [remarkMath, remarkBreaks],
      rehypePlugins: [rehypeKatex],
    }),
    sitemap(),
  ],

  markdown: {
    remarkPlugins: [remarkMath, remarkBreaks],
    rehypePlugins: [rehypeKatex],
    // Dual-theme Shiki — emits CSS vars; we toggle via [data-theme] on <html>.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },

  vite: {
    resolve: { alias: { '@': '/src' } },
  },
});
