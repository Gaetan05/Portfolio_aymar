# Gaëtan Aymar — Portfolio

A personal site for **everything**: work, projects, hobbies, discoveries, a /now page and a CV. Built so it can keep growing over time. **Every piece of content is a plain Markdown or YAML file.**

Built with [Astro](https://astro.build). Static, fast, accessible, dark-mode ready, and deployed automatically to GitHub Pages.

## ✨ Design — "Field Atlas"

The site presents itself as an atlas of a curious life: every section is a numbered plate, and the home page opens on a living topographic map.

| | |
|---|---|
| 🗺 **Live contour map** | A WebGL2 shader draws topographic lines from domain-warped noise. Your cursor raises a hill and lights it up in lime. It pauses when off-screen and shows a still frame for reduced-motion users |
| 🔤 **Editorial type** | Condensed *Bricolage Grotesque* at poster sizes, *Instrument Serif* italics as interjections, and *Geist Mono* labels. All fonts are self-hosted |
| 🎨 **Generative covers** | Every project and essay gets unique duotone artwork (contours, halftone, stripes, Truchet arcs, skyline, glyph) seeded from its title. Set `accent:` to choose the colour, or add a real `cover:` image |
| 🧲 **Motion & interaction** | Lenis smooth scroll, GSAP line reveals, a scroll-scrubbed manifesto, a horizontal pinned work gallery, velocity-reactive marquees, magnetic buttons, a blend-mode cursor with labels, and a full-screen menu |
| 🎞 **Transitions** | Curtain page transitions (cross-document View Transitions), a circular reveal when switching theme, and a first-visit preloader |
| 🖐 **Playful sections** | Hobbies are draggable stickers on a desk, the Shelf is literal book spines, About has a tilting "explorer's card", and projects show a cursor-following preview with a list/grid toggle |
| ♿ **Robust** | Works without JS, respects `prefers-reduced-motion`, keyboard focus-trap in the menu, AA-contrast labels, light and dark themes |
| 🥚 **Easter eggs** | Press `G` to overlay the 12-column grid, and `/` or `⌘K` to search |

## ✨ Sections

| | |
|---|---|
| 🏠 **Home** | Hero map, manifesto, counters, selected work, journal, hobby desk, shelf, and the latest /now |
| 👤 **About** | Your story, an ID card, giant skill lines, and an accordion career ledger |
| 🛠 **Projects** | List with cursor previews, or a grid. Filter by status and stack |
| ✍️ **Journal** | Essays, notes, **discoveries**, **TILs** and logs, grouped by year, with RSS |
| 🎨 **Hobbies** / 📚 **Shelf** / 📍 **Now** | What you love, what you recommend, and what you're doing right now (snapshots are archived automatically) |
| 📄 **CV** | Generated from the same data, with a **Download PDF** option that has a clean print layout |

### Customising the look

- **Colours:** `src/styles/global.css` → `--paper`, `--ink`, `--signal` (the lime). Every component, including the WebGL map, reads these values.
- **Big statement on the home page:** `manifesto` in `src/site.config.ts`. Wrap words in `*asterisks*` for serif italics and `==equals==` for the highlighter.
- **Clock:** `timezone` in `src/site.config.ts`.
- **Social card:** `public/og.png` (1200×630).

## ✏️ Updating content

You can edit **directly on github.com** (open a file, click the ✏️ pencil, then "Commit changes"). The site rebuilds and redeploys in about a minute.

| What | Where |
|---|---|
| Name, headline, intro, email, socials, skills, languages, navigation | `src/site.config.ts` |
| About page text | `src/content/pages/about.md` |
| Projects | `src/content/projects/*.md` |
| Journal (essays, notes, discoveries, TILs) | `src/content/journal/*.md` |
| Hobbies | `src/content/hobbies/*.md` |
| Jobs, education, awards (feeds About **and** CV) | `src/content/experience/*.md` |
| Now page | `src/content/now/YYYY-MM-DD.md` (newest one is shown) |
| Shelf (books, films, tools…) | `src/content/shelf.yaml` |
| Favicon / social image | `public/favicon.svg`, `public/og.svg` |

### Scaffolding new entries from the terminal

```bash
npm run new journal "What I learned about X" -- --kind til   # essay | note | discovery | til | log
npm run new project "My new app"
npm run new hobby "Climbing"
npm run new experience "Product Designer at Acme"
npm run new now
```

New journal entries and projects start as `draft: true`. Drafts show up in `npm run dev` but not on the live site. Change the value to `false` to publish.

### Front-matter cheat-sheet

```yaml
# Project
title: My app
summary: One sentence.
date: 2026-01-15
status: shipped        # idea | in-progress | shipped | archived
role: Lead developer
stack: [React, Node]
tags: [web]
links: [{ label: Live, url: https://… }]
cover: ./cover.jpg     # optional image next to the file
accent: '#2f6fed'      # tints the card
featured: true         # shows on the home page and CV

# Journal
title: …
description: …
date: 2026-01-15
kind: discovery        # essay | note | discovery | til | log
tags: [ideas]
```

**Images:** put them next to the Markdown file and write `![alt](./photo.jpg)`. They are optimised automatically.
**Links:** write site links as `/shelf` or `/journal/my-post`. They are rewritten automatically to work on GitHub Pages.
**Mistakes:** if a field is missing or has the wrong type, the build fails and names the file and field. Nothing broken ever goes live.

## 🚀 Deploying (one-time setup)

1. On GitHub, go to **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
2. Merge this branch into `main`. The `Deploy to GitHub Pages` workflow builds and publishes the site to `https://gaetan05.github.io/Portfolio_aymar/`.

**Custom domain:** add it under Settings → Pages. The workflow picks up the new URL automatically.

## 💻 Local development

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # type-check + production build into dist/
npm run preview   # serve the built site
```

## Structure

```
src/
  site.config.ts        ← your identity & navigation
  content.config.ts     ← schema for every content type
  content/              ← ALL your content (Markdown / YAML)
  components/           ← Header, Footer, Search, cards, timeline, filters
  layouts/              ← Base page + shared entry layout
  pages/                ← routes (home, about, projects, journal, hobbies, shelf, now, cv, tags, rss, search index)
  styles/global.css     ← design tokens (colours, fonts) — tweak --accent to rebrand
```
