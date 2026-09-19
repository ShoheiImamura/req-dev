---
title: 業務の全体像
step: flow
order: 0
status: draft
updated: 2026-09-18
summary: 大きな業務は 3 つ。誰が担い、どの順で回るか。中身は個別業務のページで
questions:
  - q: 備品の購入（購買）は対象外でよいか。納品後の「登録」からが対象という理解
---

業務（橙）をつなぐ矢印が回る順番。灰色は今回の対象外。各業務をクリックすると個別のページへ。

```plantuml 業務の全体像
@startuml
left to right direction
skinparam defaultFontSize 14
skinparam usecaseBorderColor #999
skinparam actorBorderColor #555
skinparam nodesep 30
skinparam ranksep 70

actor 購買担当 as buyer
actor 総務担当 as admin
actor 社員 as emp

usecase "備品の購入\n（対象外）" as p0 #EEEEEE
usecase "<b>1. 備品の管理</b>\n登録・廃棄・棚卸し" as b1 [[/docs/flow-manage]] #FFE0B2
usecase "<b>2. 貸出・返却</b>\n借りる・使う・返す" as b2 [[/docs/flow-lend]] #FFE0B2
usecase "<b>3. 未返却の催促</b>\n期限超過の確認・声かけ" as b3 [[/docs/flow-remind]] #FFE0B2

p0 --> b1 : 納品
b1 --> b2 : 貸出可能な備品
b2 --> b3 : 期限超過
b3 --> b2 : 返却

buyer --> p0
admin --> b1
admin --> b3
emp --> b2
@enduml
```

| 業務 | 担当 | 起きるタイミング | ページ |
|---|---|---|---|
| 1. 備品の管理 | 総務担当 | 納品時・廃棄時・年 1 回の棚卸し | [備品の管理](/docs/flow-manage) |
| 2. 貸出・返却 | 社員 | 日常。返却で備品は再び貸出可能に戻る | [貸出・返却](/docs/flow-lend) |
| 3. 未返却の催促 | 総務担当 | 返却予定日を過ぎたとき（週明けにまとめて） | [未返却の催促](/docs/flow-remind) |

価値のストーリー「月曜朝の未返却確認」は 3 に対応する。
