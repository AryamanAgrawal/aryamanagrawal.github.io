import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const site = context.site!.toString().replace(/\/$/, '');
  const essays = (await getCollection('essays', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const poems = (await getCollection('poems', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const lines = [
    '# Aryaman Agrawal',
    '',
    '> Writing on minds, machines, and philosophy. Making the art that emerges between. Engineer at Falconer in San Francisco. Currently working on cortical memory architectures and the philosophy of artificial recall.',
    '',
    '## Essays',
    '',
    ...essays.map(e => `- [${e.data.title}](${site}/essays/${e.id}): ${e.data.summary}`),
    '',
    '## Poems',
    '',
    ...poems.map(p => `- [${p.data.title}](${site}/poems/${p.id})`),
    '',
    '## About',
    '',
    `- [Home](${site}/)`,
    `- [All essays](${site}/essays)`,
    `- [All poems](${site}/poems)`,
    `- [RSS](${site}/rss.xml)`,
    `- [JSON Feed](${site}/feed.json)`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
