import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

export const stepKey = z.enum([
  'value',
  'context',
  'flow',
  'usecase',
  'information',
  'state',
  'screens',
  'processing',
  'data',
]);
export const docStatus = z.enum(['draft', 'review', 'agreed']);

const question = z.object({
  q: z.string(),
  status: z.enum(['open', 'resolved']).default('open'),
  note: z.string().optional(),
  asked: z.coerce.date().optional(),
});

const source = z.object({
  title: z.string(),
  url: z.url().optional(),
  note: z.string().optional(),
});

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    step: stepKey,                    // 一連の流れ上の位置
    status: docStatus.default('draft'),
    order: z.number().optional(),     // 同じステップ内の並び順
    updated: z.coerce.date().optional(),
    summary: z.string().optional(),
    questions: z.array(question).default([]),
    sources: z.array(source).default([]),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['customer', 'research']),
    date: z.coerce.date(),
    url: z.url().optional(),
    tags: z.array(z.string()).default([]),
    summary: z.string().optional(),
    related: z.array(z.string()).default([]), // 関連 docs の id（例: value）
  }),
});

export const collections = { docs, notes };
