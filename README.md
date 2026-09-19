# reqdev — 要件定義 最小セット サイト

お客様と図を見ながら認識の相違点を詰めるための Astro サイト。
層は独立したフォルダではなく、**匠 → RDRA → ICONIX** が本線、RDRA の情報モデルから **TM（DB）** と **OOUI（画面）** が分岐する。
Markdown 内の ```` ```plantuml ```` ブロックが PlantUML の図として描画される（```` ```mermaid ```` も可）。

## 使い方

```bash
npm install
npm run dev          # http://localhost:4321 （md を保存すると図も即時更新）
npm run build        # dist/ に静的出力。お客様に共有するときはこれを配布
```

## 構成

```
src/content/docs/<層>/<成果物>.md   図と説明。frontmatter に確認事項(questions)を書く
src/content/notes/*.md              お客様から受領した情報 / こちらで調査した情報
src/lib/minimal-set.ts              「必ず残すもの」の定義。トップと左メニューはここから生成
plugins/remark-diagrams.mjs         plantuml / mermaid ブロックの変換
```

| ページ | 内容 |
|---|---|
| `/` | 本線と分岐のパイプライン + 成果物の状態 |
| `/docs/<層>/<成果物>` | 受け取る／渡す + 図 + 確認事項 + 根拠 + 関連メモ |
| `/questions` | 全ドキュメントの確認事項を横断で一覧（打合せのアジェンダ用） |
| `/notes` | 受領情報・調査メモ |

## ドキュメントの書き方

````markdown
---
title: システムコンテキスト図
layer: rdra                 # takumi | rdra | iconix | tm | ooui
artifact: system-context    # src/lib/minimal-set.ts のキー
status: review              # draft | review | agreed
updated: 2026-09-18
questions:
  - q: 社員マスタは人事システムから連携するか
    asked: 2026-09-18
  - q: 通知はメールかチャットか
    status: resolved
    note: チャット（9/18 打合せで決定）
sources:
  - title: RDRA 公式
    url: https://www.rdra.jp/
---

```plantuml 図のタイトル（figcaption になる）
actor 社員
rectangle システム
社員 --> システム
```
````

- `@startuml` / `@enduml` は省略可（自動で補う）。`@startmindmap` や `@startsalt` を書けばそのまま通る。
- 図の下の「PlantUML ソース」を開くとその場でお客様と一緒に直せる。
- 同じ成果物に複数ドキュメントを置いてよい（例: ユースケース記述を UC ごとに分ける）。`artifact` を揃えれば一覧にまとまる。

## PlantUML の描画先

既定では https://www.plantuml.com/plantuml に図のソースを URL で送る。
**顧客情報を含む図はローカルサーバを使う**:

```bash
docker compose up -d                              # plantuml/plantuml-server を :8080 で起動
echo PLANTUML_SERVER=http://localhost:8080 > .env
npm run dev
```

## 最小セット

| 層 | 必ず残すもの |
|---|---|
| 匠 | 価値デザイン、要求分析ツリー |
| RDRA | システムコンテキスト、要求モデル、ビジネスコンテキスト、業務フローまたは利用シーン、UC複合図、情報モデル、状態モデル |
| ICONIX | ドメインモデル、ユースケース記述、ロバストネス、シーケンス、クラス |
| TM | T字ER（資源／事象）、対応する表 |
| OOUI | オブジェクトの抽出、ビュー（コレクション／シングル）、アクション |

RDRA のビジネスユースケース図とバリエーションは規模が出てから。

サンプルは「社内備品の貸出管理」を例題にしている。実案件では中身を差し替える。
