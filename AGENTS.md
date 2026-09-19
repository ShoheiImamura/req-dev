## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## This project

要件定義の成果物（図 + 確認事項）を Markdown で管理し、お客様と見ながら詰めるサイト。

- 成果物は `src/content/docs/<layer>/<artifact>.md`。`layer` / `artifact` は `src/lib/minimal-set.ts` のキーと一致させる。
- 層間の受け渡しは `HANDOFFS`（同ファイル）。トップのパイプラインと各ドキュメントの「受け取る／渡す」はここから生成する。手でページ間リンクを増やさない。
- 名詞の正本は RDRA の情報モデル。ICONIX ドメインモデル・TM・OOUI はここで立てた名前を使う。
- 図は Markdown 内の ```` ```plantuml ```` ブロックで書く（`plugins/remark-diagrams.mjs` が変換）。Mermaid より PlantUML を優先。
- お客様との認識相違・未確認事項は frontmatter の `questions` に残す。解決したら `status: resolved` と `note` を書く。
- 受領情報・調査結果は `src/content/notes/` に置き、`related` で反映先の doc id を指す。
- スキーマは `src/content.config.ts`。`z` は `astro/zod` から import する（`astro:content` の `z` は非推奨）。
- Markdown 処理は `@astrojs/markdown-remark` の `unified()` を `markdown.processor` に渡している（Astro 7 の既定 Sätteri では remark プラグインが動かない）。
- 検証: `npx astro check && npm run build`
