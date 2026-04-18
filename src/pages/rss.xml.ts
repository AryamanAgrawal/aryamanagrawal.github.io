import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const essays = await getCollection('essays', ({ data }) => !data.draft);
  const poems = await getCollection('poems', ({ data }) => !data.draft);

  const items = [
    ...essays.map(e => ({
      title: e.data.title,
      pubDate: e.data.date,
      description: e.data.summary,
      link: `/essays/${e.id}`,
      categories: ['essay', ...(e.data.tags ?? [])],
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
    description: 'Writing about memory, agents, and the things in between.',
    site: context.site!,
    items,
  });
}
