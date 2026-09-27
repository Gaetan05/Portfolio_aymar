import { site } from '../site.config';
import { getExperience, getHobbies, getJournal, getProjects, getShelf, kindLabel, url } from '../lib/content';

const strip = (s = '') =>
  s
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`~\-\[\]()!]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 2000);

export async function GET() {
  const [projects, journal, hobbies, shelf, experience] = await Promise.all([
    getProjects(),
    getJournal(),
    getHobbies(),
    getShelf(),
    getExperience(),
  ]);

  const pages = [
    { title: 'About', href: url('about'), kind: 'Page', text: site.intro, tags: [] as string[] },
    { title: 'CV / Résumé', href: url('cv'), kind: 'Page', text: 'curriculum vitae resume', tags: [] },
    { title: 'Now', href: url('now'), kind: 'Page', text: 'what I am doing now', tags: [] },
    { title: 'Shelf', href: url('shelf'), kind: 'Page', text: 'books films podcasts tools', tags: [] },
    { title: 'Tags', href: url('tags'), kind: 'Page', text: 'topics index', tags: [] },
  ];

  const docs = [
    ...journal.map((e) => ({
      title: e.data.title,
      href: url(`journal/${e.id}`),
      kind: kindLabel[e.data.kind],
      text: `${e.data.description} ${strip(e.body)}`,
      tags: e.data.tags,
    })),
    ...projects.map((p) => ({
      title: p.data.title,
      href: url(`projects/${p.id}`),
      kind: 'Project',
      text: `${p.data.summary} ${strip(p.body)}`,
      tags: [...p.data.tags, ...p.data.stack],
    })),
    ...hobbies.map((h) => ({
      title: h.data.title,
      href: url(`hobbies/${h.id}`),
      kind: 'Hobby',
      text: `${h.data.summary} ${strip(h.body)}`,
      tags: h.data.tags,
    })),
    ...experience.map((x) => ({
      title: `${x.data.role} — ${x.data.org}`,
      href: url('about'),
      kind: x.data.kind === 'education' ? 'Education' : 'Experience',
      text: [x.data.summary, ...x.data.highlights].join(' '),
      tags: x.data.tags,
    })),
    ...shelf.map((s) => ({
      title: s.data.title,
      href: url(`shelf#${s.id}`),
      kind: s.data.kind,
      text: [s.data.creator, s.data.note].filter(Boolean).join(' '),
      tags: s.data.tags,
    })),
    ...pages,
  ];

  return new Response(JSON.stringify(docs), { headers: { 'Content-Type': 'application/json' } });
}
