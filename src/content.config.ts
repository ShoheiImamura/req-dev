import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

export const layerKey = z.enum(['takumi', 'rdra', 'iconix', 'tm', 'ooui']);
export const docStatus = z.enum(['draft', 'review', 'agreed']);

const question = z.object({
  q: z.string(),                      // お客様に確認したいこと / 認識の相違点
  status: z.enum(['open', 'resolved']).default('open'),
  note: z.string().optional(),        // 回答・決定内容
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
    layer: layerKey,                  // 匠 / RDRA / ICONIX / TM / OOUI
    artifact: z.string(),             // src/lib/minimal-set.ts のキー
    status: docStatus.default('draft'),
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
    kind: z.enum(['customer', 'research']), // お客様から受領 / こちらで調査
    date: z.coerce.date(),
    url: z.url().optional(),
    tags: z.array(z.string()).default([]),
    summary: z.string().optional(),
    related: z.array(z.string()).default([]), // 関連 docs の id（例: rdra/system-context）
  }),
});

export const collections = { docs, notes };
