/**
 * Content schema. Every folder in src/content is a "collection".
 * The fields below are what you can put in each file's front-matter.
 * If a required field is missing, the build tells you exactly which file.
 */
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const md = (dir: string) => glob({ pattern: '**/[^_]*.{md,mdx}', base: `./src/content/${dir}` });

const link = z.object({ label: z.string(), url: z.string() });

const projects = defineCollection({
  loader: md('projects'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      status: z.enum(['idea', 'in-progress', 'shipped', 'archived']).default('shipped'),
      role: z.string().optional(),
      stack: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      links: z.array(link).default([]),
      cover: image().optional(),
      /** Any CSS colour — tints the project card. */
      accent: z.string().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

const journal = defineCollection({
  loader: md('journal'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      /** essay = long-form · note = short thought · discovery = something you found · til = today I learned · log = progress update */
      kind: z.enum(['essay', 'note', 'discovery', 'til', 'log']).default('note'),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

const hobbies = defineCollection({
  loader: md('hobbies'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      /** An emoji or short symbol used as the hobby's icon. */
      icon: z.string().default('✦'),
      since: z.string().optional(),
      /** Lower numbers show first. */
      order: z.number().default(100),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      draft: z.boolean().default(false),
    }),
});

const experience = defineCollection({
  loader: md('experience'),
  schema: z.object({
    kind: z.enum(['work', 'education', 'volunteer', 'award', 'certification']).default('work'),
    role: z.string(),
    org: z.string(),
    orgUrl: z.string().optional(),
    location: z.string().optional(),
    start: z.coerce.date(),
    /** Leave empty for "Present". */
    end: z.coerce.date().optional(),
    summary: z.string().optional(),
    highlights: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const now = defineCollection({
  loader: md('now'),
  schema: z.object({
    date: z.coerce.date(),
    location: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: md('pages'),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

const shelf = defineCollection({
  loader: file('src/content/shelf.yaml'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    kind: z.enum(['book', 'film', 'series', 'podcast', 'music', 'game', 'tool', 'article', 'place', 'course', 'other']),
    creator: z.string().optional(),
    status: z.enum(['wishlist', 'in-progress', 'done']).default('done'),
    /** 1 – 5 */
    rating: z.number().min(0).max(5).optional(),
    date: z.coerce.date().optional(),
    note: z.string().optional(),
    url: z.string().optional(),
    tags: z.array(z.string()).default([]),
    favorite: z.boolean().default(false),
  }),
});

export const collections = { projects, journal, hobbies, experience, now, pages, shelf };
