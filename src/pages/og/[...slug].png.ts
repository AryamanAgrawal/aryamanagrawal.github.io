import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

type AnyEntry =
  | CollectionEntry<'essays'>
  | CollectionEntry<'poems'>
  | CollectionEntry<'photos'>
  | CollectionEntry<'sketches'>;

interface PageMeta {
  type: 'home' | 'essay' | 'poem' | 'photo' | 'sketch';
  entry?: AnyEntry;
}

const essays = await getCollection('essays', ({ data }) => !data.draft);
const poems = await getCollection('poems', ({ data }) => !data.draft);
const photos = await getCollection('photos', ({ data }) => !data.draft);
const sketches = await getCollection('sketches', ({ data }) => !data.draft);

const tag = (e: AnyEntry, type: PageMeta['type']): PageMeta => ({ type, entry: e });

const pages: Record<string, PageMeta> = {
  home: { type: 'home' },
  ...Object.fromEntries(essays.map(e => [`essays/${e.id}`, tag(e, 'essay')])),
  ...Object.fromEntries(poems.map(e => [`poems/${e.id}`, tag(e, 'poem')])),
  ...Object.fromEntries(photos.map(e => [`photos/${e.id}`, tag(e, 'photo')])),
  ...Object.fromEntries(sketches.map(e => [`sketches/${e.id}`, tag(e, 'sketch')])),
};

const FONTS = [
  './public/fonts/inter-tight-700.ttf',
  './public/fonts/jetbrains-mono-500.ttf',
  './public/fonts/newsreader-italic-400.ttf',
];

const route = await OGImageRoute({
  param: 'slug',
  pages,
  // Filename already provides .png — don't double-extend
  getSlug: (path) => path,

  getImageOptions: (_path, page: PageMeta) => {
    if (page.type === 'home') {
      return {
        title: 'Writing on minds, machines, and philosophy. Making the art that emerges in-between.',
        description: 'ARYAMAN AGRAWAL · SAN FRANCISCO',
        bgGradient: [[12, 13, 16]],
        border: { width: 0, color: [12, 13, 16] },
        padding: 80,
        font: {
          title: { families: ['Inter Tight'], weight: 'Bold', size: 72, color: [236, 230, 214], lineHeight: 1.08, letterSpacing: -2 },
          description: { families: ['JetBrains Mono'], weight: 'Medium', size: 20, color: [138, 146, 163], lineHeight: 1.4, letterSpacing: 2 },
        },
        fonts: FONTS,
      };
    }

    const data = page.entry!.data;
    const dateLabel = data.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const kicker = `${page.type.toUpperCase()} · ${dateLabel.toUpperCase()} · ARYAMAN AGRAWAL`;
    const titleIsItalic = page.type === 'poem' || page.type === 'sketch';

    return {
      title: data.title,
      description: kicker,
      bgGradient: [[12, 13, 16]],
      border: { width: 0, color: [12, 13, 16] },
      padding: 80,
      font: {
        title: {
          families: titleIsItalic ? ['Newsreader'] : ['Inter Tight'],
          weight: titleIsItalic ? 'Normal' : 'Bold',
          size: 80, color: [236, 230, 214], lineHeight: 1.1,
          letterSpacing: titleIsItalic ? 0 : -2,
        },
        description: { families: ['JetBrains Mono'], weight: 'Medium', size: 20, color: [111, 179, 196], lineHeight: 1.4, letterSpacing: 2 },
      },
      fonts: FONTS,
    };
  },
});

export const getStaticPaths = route.getStaticPaths;
export const GET = route.GET;
