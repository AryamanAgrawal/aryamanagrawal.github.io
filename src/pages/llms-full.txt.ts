import { getCollection } from "astro:content";
import type { APIContext } from "astro";

function cleanBody(body: string): string {
  return body
    .split("\n")
    .filter((line) => !/^\s*import\s.+from\s.+$/.test(line))
    .filter((line) => !/^\s*<[A-Z][\w]*\s*\/?>\s*$/.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function GET(context: APIContext) {
  const site = context.site!.toString().replace(/\/$/, "");
  const writings = (
    await getCollection("writings", ({ data }) => !data.draft)
  ).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const header = [
    "# Aryaman Agrawal — Writings (full text)",
    "",
    "> Long-form writing on minds, machines, and philosophy. Full text of every published essay, for language models and readers who want the complete corpus in one file.",
    "",
  ];

  const sections = writings.map((e) => {
    const date = e.data.date.toISOString().slice(0, 10);
    return [
      "---",
      "",
      `# ${e.data.title}`,
      "",
      `Published: ${date}`,
      `URL: ${site}/writings/${e.id}`,
      e.data.tags?.length ? `Tags: ${e.data.tags.join(", ")}` : "",
      "",
      e.data.summary,
      "",
      cleanBody(e.body ?? ""),
      "",
    ]
      .filter((line) => line !== null && line !== undefined)
      .join("\n");
  });

  const body = [...header, ...sections].join("\n");

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
