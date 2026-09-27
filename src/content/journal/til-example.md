---
title: 'TIL: you can print any web page to a clean PDF'
description: Adding a print stylesheet turns a web page into a nicely formatted PDF — that's how the CV on this site works.
date: 2026-09-20
kind: til
tags: [web, css]
---

The CSS `@media print` rule lets you hide navigation, remove backgrounds and tweak typography only when printing.

```css
@media print {
  header, footer { display: none; }
  body { background: #fff; color: #000; }
}
```

Combine that with a “Download as PDF” button that calls `window.print()`, and you get an always-up-to-date CV for free.
