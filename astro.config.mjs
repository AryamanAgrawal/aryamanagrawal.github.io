// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import d2 from 'astro-d2';
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
// astro-d2: primary diagram extension. Lightweight (no Playwright), SVG output,
// good fit for engineering / system / flow diagrams in long-form essays.
// Code fences with ```d2 are rendered to SVG at build time.
// Requires the D2 binary on PATH: `brew install d2`.
//
// rehype-mermaid intentionally deferred — Playwright peer dep (~150MB).
// For one-off conceptual figures (quadrant charts, scatter), hand-coded
// inline SVG is preferred over either library — keeps editorial polish
// and inherits site typography via CSS custom properties.

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
    d2({ layout: 'elk' }),
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
