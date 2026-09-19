// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import { loadEnv } from 'vite';
import remarkDiagrams from './plugins/remark-diagrams.mjs';

// .env の PLANTUML_SERVER でレンダリング先を切替（未設定なら公開サーバ）
// 顧客情報を含む図は docker compose up でローカルサーバを使うこと
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const PLANTUML_SERVER = env.PLANTUML_SERVER || 'https://www.plantuml.com/plantuml';

export default defineConfig({
  markdown: {
    processor: unified({
      remarkPlugins: [[remarkDiagrams, { server: PLANTUML_SERVER, format: 'svg' }]],
    }),
  },
});
