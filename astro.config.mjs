// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeKatex from 'rehype-katex';
import rehypeCitation from 'rehype-citation';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';

const citationPlugin = [rehypeCitation, {
  bibliography: './src/content/references.bib',
  csl: 'apa',
  linkCitations: true,
  inlineClass: ['citation'],
  showTooltips: true,
}];
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
      rehypePlugins: [rehypeKatex, citationPlugin],
    }),
    sitemap(),
  ],

  markdown: {
    remarkPlugins: [remarkMath, remarkBreaks],
    rehypePlugins: [rehypeKatex, citationPlugin],
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
