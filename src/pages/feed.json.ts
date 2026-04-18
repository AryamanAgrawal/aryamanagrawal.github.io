import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const site = context.site!.toString().replace(/\/$/, '');
  const essays = await getCollection('essays', ({ data }) => !data.draft);
  const poems = await getCollection('poems', ({ data }) => !data.draft);

  const items = [
    ...essays.map(e => ({
      id: `${site}/essays/${e.id}`,
      url: `${site}/essays/${e.id}`,
      title: e.data.title,
      summary: e.data.summary,
      content_text: e.data.summary,
      date_published: e.data.date.toISOString(),
      tags: ['essay', ...(e.data.tags ?? [])],
      authors: [{ name: 'Aryaman Agrawal', url: site }],
    })),
    ...poems.map(p => ({
      id: `${site}/poems/${p.id}`,
      url: `${site}/poems/${p.id}`,
      title: p.data.title,
      date_published: p.data.date.toISOString(),
      tags: ['poem'],
      authors: [{ name: 'Aryaman Agrawal', url: site }],
    })),
  ].sort((a, b) => b.date_published.localeCompare(a.date_published));

  return new Response(
    JSON.stringify(
      {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'Aryaman Agrawal',
        home_page_url: site,
        feed_url: `${site}/feed.json`,
        description: 'Writing on minds, machines, and philosophy. Making the art that emerges between.',
        authors: [{ name: 'Aryaman Agrawal', url: site }],
        language: 'en',
        items,
      },
      null,
      2,
    ),
    { headers: { 'content-type': 'application/feed+json; charset=utf-8' } },
  );
}
