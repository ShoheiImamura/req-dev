# reqdev — 要件定義

お客様のビジネス価値から、ユースケース／処理までを一本で辿るサイト。
手法の名前は軸にしない（参考として各ページ末に小さく残す）。

Markdown 内の ```` ```plantuml ```` ブロックが図になる。

## 使い方

```bash
npm install
npm run dev          # http://localhost:4321
npm run build
```

## 一連の流れ

```
価値と要求 → コンテキスト → 業務の流れ → ユースケース
                                            ↓
                                          情報 ⇄ 状態
                                         ↙  ↓  ↘
                                      画面  処理  データ
```

| 流れ | 決めること |
|---|---|
| 価値と要求 | なぜ作り、何を実現するか |
| コンテキスト | 誰が・どの業務で |
| 業務の流れ | どう進むか |
| ユースケース | システムとの接点 |
| 情報 | 扱う名詞（正本） |
| 状態 | 名詞の変化 |
| 画面 | 何を見せ、何をさせるか |
| 処理 | 画面と情報がどう動くか |
| データ | どう残すか |

名詞を増やしたくなったら、画面や表から足さず「情報」に戻る。

後回し: 業務の細分割、バリエーション。クラス図は処理とデータで足りる間は書かない。

## 構成

```
src/content/docs/<step>.md          図と説明。frontmatter に確認事項(questions)
src/content/notes/*.md              お客様から受領 / 調査。related で doc id
src/lib/minimal-set.ts              流れ（STEPS）と受け渡し（HANDOFFS）
plugins/remark-diagrams.mjs         plantuml / mermaid の変換
```

`step` は `value | requirements | context | flow | usecase | information | state | screens | processing | data`。
同じ step に複数ドキュメントを置いてよい（ユースケース・処理は UC ごと）。

## ドキュメントの書き方

````markdown
---
title: 情報
step: information
status: review              # draft | review | agreed
updated: 2026-09-18
questions:
  - q: 個体管理か数量管理か
    asked: 2026-09-18
sources:
  - title: キックオフ打合せメモ
    note: notes/2026-09-10-kickoff
---

```plantuml 情報
class 備品
class 貸出
備品 "1" -- "0..*" 貸出
```
````

## PlantUML の描画

ビルド／dev 時に PlantUML サーバから SVG を取得し、ページにインライン展開する。
ページに残るのは SVG だけで、図のソースや外部 URL は出力しない（dist/ を配布しても外部に依存しない）。
取得した SVG は `.cache/plantuml/` にソースのハッシュで保存され、2 回目以降はオフラインでもビルドできる。

既定のサーバは https://www.plantuml.com/plantuml で、図のソースを URL で送る。
顧客情報を含む図はローカルサーバを使う:

```bash
docker compose up -d
echo PLANTUML_SERVER=http://localhost:8080 > .env
npm run dev
```

サンプルは「社内備品の貸出管理」。実案件では中身を差し替える。
