## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

## This project

お客様の価値からユースケース／処理までを一本で辿る。手法名は軸にしない。

- 成果物は `src/content/docs/<step>.md`（または `<step>-<name>.md`）。`step` は `src/lib/minimal-set.ts` の `STEPS` のキー。
- 前後のつながりは `HANDOFFS`。各ページの「前から／次へ」はここから生成する。手でページ間リンクを増やさない。
- 名詞の正本は `information`。画面・処理・データはここで立てた名前を使う。
- 図は Markdown 内の ```` ```plantuml ```` ブロック（`plugins/remark-diagrams.mjs`）。
- お客様との認識相違は frontmatter の `questions`。解決したら `status: resolved` と `note`。
- 受領情報・調査は `src/content/notes/`。`related` で doc id を指す。
- スキーマは `src/content.config.ts`。`z` は `astro/zod` から import する。
- Markdown 処理は `@astrojs/markdown-remark` の `unified()` を `markdown.processor` に渡している（Astro 7 の既定 Sätteri では remark プラグインが動かない）。
- 検証: `npx astro check && npm run build`
- 図は `plugins/remark-diagrams.mjs` がビルド時に SVG を取得してインライン展開する（`.cache/plantuml/` にキャッシュ）。ソースは表示しない。
- プラグインを変更しても md が変わらないと再レンダリングされない。`rm -rf .astro node_modules/.astro` してからビルドする。
