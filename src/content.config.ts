import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const essays = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/essays' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const poems = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/poems' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const photos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/photos' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    cover: z.string().optional(),
    rollName: z.string().optional(),
    frameCount: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

const sketches = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/sketches' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    notebook: z.string(),
    page: z.number(),
    orientation: z.enum(['portrait', 'landscape']).default('portrait'),
    image: z.string(),
    marginalia: z.object({
      topRight: z.string().optional(),
      bottomCaption: z.string().optional(),
    }).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { essays, poems, photos, sketches };
