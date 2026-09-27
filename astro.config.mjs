// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeBaseLinks from './src/plugins/rehype-base-links.mjs';

// SITE_URL / BASE_PATH are injected by the GitHub Pages workflow.
// For a custom domain, set SITE_URL=https://yourdomain.com and BASE_PATH=/
const site = process.env.SITE_URL || 'https://gaetan05.github.io';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  integrations: [mdx(), sitemap()],
  markdown: {
    rehypePlugins: [[rehypeBaseLinks, { base }]],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
