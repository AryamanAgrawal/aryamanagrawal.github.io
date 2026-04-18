import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const site = context.site!.toString().replace(/\/$/, '');
  const writings = (await getCollection('writings', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const poems = (await getCollection('poems', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const lines = [
    '# Aryaman Agrawal',
    '',
    '> Writing on minds, machines, and philosophy. Making the art that emerges in-between. Engineer at Falconer in San Francisco. Currently working on cortical memory architectures and the philosophy of artificial recall.',
    '',
    '## Writings',
    '',
    ...writings.map(e => `- [${e.data.title}](${site}/writings/${e.id}): ${e.data.summary}`),
    '',
    '## Poems',
    '',
    ...poems.map(p => `- [${p.data.title}](${site}/poems/${p.id})`),
    '',
    '## About',
    '',
    `- [Home](${site}/)`,
    `- [All writings](${site}/writings)`,
    `- [All poems](${site}/poems)`,
    `- [RSS](${site}/rss.xml)`,
    `- [JSON Feed](${site}/feed.json)`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
