import { getCollection, type CollectionEntry } from 'astro:content';

/** Prefix an internal path with the site's base path (needed on GitHub Pages project sites). */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return `${base}/${clean}`;
}

const isVisible = (e: { data: { draft?: boolean } }) => import.meta.env.DEV || !e.data.draft;

export async function getProjects() {
  const all = await getCollection('projects', isVisible);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getJournal() {
  const all = await getCollection('journal', isVisible);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getHobbies() {
  const all = await getCollection('hobbies', isVisible);
  return all.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

export async function getExperience() {
  const all = await getCollection('experience', isVisible);
  // Current roles first, then most recent end/start date.
  const key = (e: CollectionEntry<'experience'>) => (e.data.end ?? new Date(8.64e15)).valueOf();
  return all.sort((a, b) => key(b) - key(a) || b.data.start.valueOf() - a.data.start.valueOf());
}

export async function getNow() {
  const all = await getCollection('now', isVisible);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getShelf() {
  const all = await getCollection('shelf');
  const t = (e: CollectionEntry<'shelf'>) => e.data.date?.valueOf() ?? 0;
  return all.sort((a, b) => t(b) - t(a));
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/** Every tagged item across the site, grouped by tag. */
export async function getTagIndex() {
  const [projects, journal, hobbies, shelf] = await Promise.all([getProjects(), getJournal(), getHobbies(), getShelf()]);
  type Item = { title: string; href: string; kind: string; date?: Date; description?: string };
  const map = new Map<string, { label: string; items: Item[] }>();
  const add = (tags: string[], item: Item) => {
    for (const tag of tags) {
      const slug = slugify(tag);
      if (!slug) continue;
      if (!map.has(slug)) map.set(slug, { label: tag, items: [] });
      map.get(slug)!.items.push(item);
    }
  };
  projects.forEach((p) =>
    add([...p.data.tags, ...p.data.stack], { title: p.data.title, href: url(`projects/${p.id}`), kind: 'Project', date: p.data.date, description: p.data.summary }),
  );
  journal.forEach((j) =>
    add(j.data.tags, { title: j.data.title, href: url(`journal/${j.id}`), kind: kindLabel[j.data.kind], date: j.data.date, description: j.data.description }),
  );
  hobbies.forEach((h) => add(h.data.tags, { title: h.data.title, href: url(`hobbies/${h.id}`), kind: 'Hobby', description: h.data.summary }));
  shelf.forEach((s) => add(s.data.tags, { title: s.data.title, href: url(`shelf#${s.id}`), kind: 'Shelf', date: s.data.date, description: s.data.note }));
  return map;
}

export const kindLabel: Record<CollectionEntry<'journal'>['data']['kind'], string> = {
  essay: 'Essay',
  note: 'Note',
  discovery: 'Discovery',
  til: 'TIL',
  log: 'Log',
};

export const statusLabel: Record<CollectionEntry<'projects'>['data']['status'], string> = {
  idea: 'Idea',
  'in-progress': 'In progress',
  shipped: 'Shipped',
  archived: 'Archived',
};

export function formatDate(d: Date, opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }) {
  return d.toLocaleDateString('en-GB', { ...opts, timeZone: 'UTC' });
}

export function formatRange(start: Date, end?: Date) {
  const f = (d: Date) => formatDate(d, { year: 'numeric', month: 'short' });
  return `${f(start)} — ${end ? f(end) : 'Present'}`;
}

export function readingTime(body = '') {
  const words = body.replace(/```[\s\S]*?```/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Deterministic 32-bit hash — used to give every entry its own generative art. */
export function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Like `rich`, but wraps every word in <span class="w"> so it can be animated word by word. */
export function richWords(text: string) {
  const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const out: string[] = [];
  const re = /==(.+?)==|\*(.+?)\*|([^*=]+|[*=])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const [, mark, italic, plain] = m;
    const cls = mark ? 'w mark' : italic ? 'w serif' : 'w';
    const chunk = mark ?? italic ?? plain ?? '';
    chunk.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      out.push(/^\s+$/.test(part) ? ' ' : `<span class="${cls}">${esc(part)}</span>`);
    });
  }
  return out.join('');
}
