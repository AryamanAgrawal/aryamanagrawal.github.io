// @ts-check
import { defineConfig } from "astro/config";
import fs from "node:fs";
import path from "node:path";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import d2 from "astro-d2";
import rehypeKatex from "rehype-katex";
import rehypeCitation from "rehype-citation";
import remarkMath from "remark-math";
import remarkBreaks from "remark-breaks";

// Dev-only local annotation store. Serves /__annotate (GET/POST/PATCH/DELETE)
// from the running dev server and persists to annotations.json (gitignored).
// `apply: 'serve'` means it never runs in the production build.
function annotationsDevPlugin() {
  const file = path.resolve("annotations.json");
  const read = () => {
    try {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      return { open: [], resolved: [] };
    }
  };
  const write = (data) =>
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  const readBody = (req) =>
    new Promise((resolve) => {
      let b = "";
      req.on("data", (c) => (b += c));
      req.on("end", () => {
        try {
          resolve(b ? JSON.parse(b) : {});
        } catch {
          resolve({});
        }
      });
    });
  return {
    name: "local-annotations",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__annotate", async (req, res) => {
        res.setHeader("content-type", "application/json");
        const data = read();
        if (req.method === "GET") {
          res.end(JSON.stringify(data));
          return;
        }
        if (req.method === "POST") {
          const a = await readBody(req);
          const ann = {
            id:
              "a" +
              Date.now().toString(36) +
              Math.random().toString(36).slice(2, 6),
            status: "open",
            createdAt: new Date().toISOString(),
            ...a,
          };
          data.open.push(ann);
          write(data);
          res.end(JSON.stringify(ann));
          return;
        }
        if (req.method === "PATCH") {
          const { id, action, ...rest } = await readBody(req);
          const i = data.open.findIndex((x) => x.id === id);
          if (i >= 0) {
            if (action === "resolve") {
              const [a] = data.open.splice(i, 1);
              data.resolved.push({
                ...a,
                ...rest,
                status: "resolved",
                resolvedAt: new Date().toISOString(),
              });
            } else {
              data.open[i] = { ...data.open[i], ...rest };
            }
            write(data);
          }
          res.end(JSON.stringify({ ok: true }));
          return;
        }
        if (req.method === "DELETE") {
          const id = new URL(req.url, "http://localhost").searchParams.get(
            "id",
          );
          data.open = data.open.filter((x) => x.id !== id);
          data.resolved = data.resolved.filter((x) => x.id !== id);
          write(data);
          res.end(JSON.stringify({ ok: true }));
          return;
        }
        res.statusCode = 405;
        res.end("{}");
      });
    },
  };
}

const citationPlugin = [
  rehypeCitation,
  {
    bibliography: "./src/content/references.bib",
    csl: "apa",
    linkCitations: true,
    inlineClass: ["citation"],
    showTooltips: true,
  },
];
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
  site: "https://aryamanagrawal.github.io",
  trailingSlash: "never",

  // Prefetch on hover by default — instant nav on the editorial column.
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },

  integrations: [
    mdx({
      remarkPlugins: [remarkMath, remarkBreaks],
      rehypePlugins: [rehypeKatex, citationPlugin],
    }),
    d2({ layout: "elk" }),
    sitemap(),
  ],

  markdown: {
    remarkPlugins: [remarkMath, remarkBreaks],
    rehypePlugins: [rehypeKatex, citationPlugin],
    // Dual-theme Shiki — emits CSS vars; we toggle via [data-theme] on <html>.
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },

  vite: {
    resolve: { alias: { "@": "/src" } },
    plugins: [annotationsDevPlugin()],
  },
});
