import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const writings = await getCollection('writings', ({ data }) => !data.draft);
  const poems = await getCollection('poems', ({ data }) => !data.draft);

  const items = [
    ...writings.map(e => ({
      title: e.data.title,
      pubDate: e.data.date,
      description: e.data.summary,
      link: `/writings/${e.id}`,
      categories: ['writing', ...(e.data.tags ?? [])],
    })),
    ...poems.map(p => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: '',
      link: `/poems/${p.id}`,
      categories: ['poem'],
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'Aryaman Agrawal',
    description: 'Writing on minds, machines, and philosophy. Making the art that emerges in-between.',
    site: context.site!,
    items,
  });
}
