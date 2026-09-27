# Gaëtan Aymar — Portfolio

A personal site for **everything**: work, projects, hobbies, discoveries, a /now page and a CV. Built so it can keep growing over time. **Every piece of content is a plain Markdown or YAML file.**

Built with [Astro](https://astro.build). Static, fast, accessible, dark-mode ready, and deployed automatically to GitHub Pages.

## ✨ Features

| | |
|---|---|
| 🏠 **Home** | Hero with rotating tagline, a "right now" card, live stats, featured projects, latest journal entries, hobbies and shelf picks |
| 👤 **About** | Your story (Markdown), skills, and a timeline of experience, education and awards |
| 🛠 **Projects** | Filterable by status and tech stack. Detail pages with links, table of contents, and prev/next navigation |
| ✍️ **Journal** | Essays, notes, **discoveries**, **TILs** and logs, grouped by year and filterable by type. Includes reading time and an RSS feed |
| 🎨 **Hobbies** | One page per hobby, with images and whatever else you want to write |
| 📚 **Shelf** | Books, films, podcasts, tools, places and more, with ratings, notes, favourites and a wishlist |
| 📍 **Now** | What you're focused on right now. Older snapshots are archived automatically, so it doubles as a diary |
| 📄 **CV** | Generated from the same data as the rest of the site. The **Download as PDF** button gives you a clean print layout |
| 🔎 **Search** | Press `⌘K`, `Ctrl K` or `/` to search everything on the site |
| 🏷 **Tags** | One tag index across all sections |
| 🌗 **Themes** | Light and dark, following the visitor's system setting, with a toggle |
| ⚙️ **Also** | SEO and Open Graph tags, sitemap, RSS, reduced-motion support, mobile menu, 404 page |

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
