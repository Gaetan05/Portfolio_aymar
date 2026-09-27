#!/usr/bin/env node
/**
 * Scaffold a new content entry.
 *   npm run new journal "My first discovery" -- --kind discovery
 *   npm run new project "Cool thing"
 *   npm run new hobby "Climbing"
 *   npm run new now
 *   npm run new experience "Software Engineer at Acme"
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [type, ...rest] = process.argv.slice(2);
const kindIdx = rest.indexOf('--kind');
const kind = kindIdx >= 0 ? rest.splice(kindIdx, 2)[1] : 'note';
const title = rest.join(' ').trim();
const today = new Date().toISOString().slice(0, 10);
const slug = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const q = (s) => JSON.stringify(s);

const templates = {
  journal: () => [
    'journal',
    slug(title),
    `---\ntitle: ${q(title)}\ndescription: One sentence that makes people want to read this.\ndate: ${today}\nkind: ${kind} # essay | note | discovery | til | log\ntags: []\ndraft: true\n---\n\nStart writing…\n`,
  ],
  project: () => [
    'projects',
    slug(title),
    `---\ntitle: ${q(title)}\nsummary: What it is and why it matters, in one sentence.\ndate: ${today}\nstatus: in-progress # idea | in-progress | shipped | archived\nrole: \nstack: []\ntags: []\nlinks: []\n#  - label: Live site\n#    url: https://…\nfeatured: false\ndraft: true\n---\n\n## The problem\n\n## What I did\n\n## Results\n`,
  ],
  hobby: () => [
    'hobbies',
    slug(title),
    `---\ntitle: ${q(title)}\nsummary: Why you love it, in one line.\nicon: ✦\nsince: '${today.slice(0, 4)}'\norder: 100\ntags: []\n---\n\n`,
  ],
  experience: () => [
    'experience',
    slug(title),
    `---\nkind: work # work | education | volunteer | award | certification\nrole: ${q(title)}\norg: \nlocation: \nstart: ${today}\n# end: YYYY-MM-DD   (leave out for "Present")\nsummary: \nhighlights:\n  - \ntags: []\n---\n`,
  ],
  now: () => ['now', today, `---\ndate: ${today}\nlocation: \n---\n\n- 🎯 **Focusing on** …\n- 📖 **Reading** …\n- 🌱 **Learning** …\n`],
};

if (!templates[type] || (type !== 'now' && !title)) {
  console.log('Usage: npm run new <journal|project|hobby|experience|now> "Title" [-- --kind discovery]');
  process.exit(1);
}

const [dir, name, body] = templates[type]();
const folder = join('src', 'content', dir);
const file = join(folder, `${name}.md`);
if (existsSync(file)) {
  console.error(`✗ ${file} already exists`);
  process.exit(1);
}
mkdirSync(folder, { recursive: true });
writeFileSync(file, body);
console.log(`✓ Created ${file}${body.includes('draft: true') ? '  (draft: set draft: false to publish)' : ''}`);
