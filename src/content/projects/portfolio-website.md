---
title: This portfolio
summary: A content-driven personal site that grows over time — projects, journal, hobbies, a shelf of discoveries and a CV generated from the same data.
date: 2026-09-27
status: shipped
role: Designer & developer
stack: [Astro, TypeScript, CSS, GitHub Actions]
tags: [web, design, open-source]
links:
  - label: Source code
    url: https://github.com/Gaetan05/Portfolio_aymar
accent: '#e5482b'
featured: true
---

I wanted a single home for everything I do — not just a CV, but the hobbies, the notes and the small discoveries that make up the rest of my life.

## Goals

1. **Easy to update.** Every piece of content is a Markdown or YAML file. Add a file, push, and the site rebuilds itself.
2. **Fast and accessible.** Static HTML, almost no JavaScript, works without it, respects reduced-motion and dark mode.
3. **Personal.** Warm typography, a bit of playfulness, and room to grow.

## How it works

Content lives in `src/content/`, one folder per section. A schema validates every file at build time, so a typo in a date never silently breaks the site. The CV page is generated from the same experience entries shown on the About page — one source of truth.

## What I learned

Designing for *future me* — the one who has five minutes to add a note — changed a lot of decisions. Fewer fields, sensible defaults, and a `npm run new` command to scaffold entries.
