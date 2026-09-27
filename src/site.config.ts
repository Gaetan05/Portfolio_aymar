/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIG — your identity, in one file.
 *  Edit the values below; everything on the site updates.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  /** Your full name, shown in the header, hero and CV. */
  name: 'Gaëtan Aymar',
  /** Short handle / initials used for the logo mark. */
  initials: 'GA',
  /** One-line professional headline. */
  headline: 'Builder, explorer & lifelong learner',
  /** Big statement on the home page. Wrap words in *asterisks* to set them in italic serif, ==double equals== to highlight. */
  manifesto:
    'I make things, *collect* curiosities and write down what I learn — so that ==everything I touch== leaves a small map for whoever comes next.',
  /** Rotating words in the home hero: "I build…", "I explore…" */
  heroVerbs: ['build things', 'explore ideas', 'learn in public', 'collect discoveries'],
  /** Two or three sentences about you — used on the home page and in SEO. */
  intro:
    'This is my corner of the internet: the work I do, the things I make, the hobbies that keep me curious and the discoveries I pick up along the way. It grows as I do.',
  /** Where you are (optional — leave empty to hide). */
  location: 'Planet Earth',
  /** IANA time zone for the live clock in the header & footer. */
  timezone: 'Europe/Paris',
  /** Public contact email (optional — leave empty to hide). */
  email: 'gaetanaymar.me@gmail.com',
  /** Are you open to opportunities? Shows a small badge in the hero. */
  availability: {
    open: true,
    label: 'Open to new opportunities',
  },
  /** Social / contact links. Remove any you don't use. */
  socials: [
    { label: 'GitHub', url: 'https://github.com/Gaetan05' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
    { label: 'Email', url: 'mailto:gaetanaymar.me@gmail.com' },
  ],
  /** Skill groups shown on About and the CV. */
  skills: [
    { group: 'Core', items: ['Problem solving', 'Communication', 'Project management'] },
    { group: 'Technical', items: ['TypeScript', 'Python', 'SQL', 'Git'] },
    { group: 'Tools', items: ['Figma', 'Notion', 'VS Code'] },
  ],
  /** Spoken languages (shown on the CV). */
  languages: [
    { name: 'French', level: 'Native' },
    { name: 'English', level: 'Fluent' },
  ],
  /** Language code for the <html lang> attribute. */
  lang: 'en',
};

/** Top navigation. Order here = order in the header. */
export const nav = [
  { label: 'About', href: 'about' },
  { label: 'Projects', href: 'projects' },
  { label: 'Journal', href: 'journal' },
  { label: 'Hobbies', href: 'hobbies' },
  { label: 'Shelf', href: 'shelf' },
  { label: 'Now', href: 'now' },
];
