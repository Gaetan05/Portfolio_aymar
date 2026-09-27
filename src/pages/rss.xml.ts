import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../site.config';
import { getJournal, getProjects, url } from '../lib/content';

export async function GET(context: APIContext) {
  const [journal, projects] = await Promise.all([getJournal(), getProjects()]);
  const items = [
    ...journal.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      pubDate: e.data.date,
      link: url(`journal/${e.id}`),
      categories: [e.data.kind, ...e.data.tags],
    })),
    ...projects.map((p) => ({
      title: `Project: ${p.data.title}`,
      description: p.data.summary,
      pubDate: p.data.date,
      link: url(`projects/${p.id}`),
      categories: ['project', ...p.data.tags],
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: `${site.name} — Journal & Projects`,
    description: site.intro,
    site: context.site!,
    items,
  });
}
