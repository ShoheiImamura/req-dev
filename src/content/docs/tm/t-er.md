---
title: T字ER（資源／事象）
layer: tm
artifact: t-er
status: draft
updated: 2026-09-18
summary: 認知番号（識別子）を持つものをエンティティとし、資源（R）と事象（E）に分ける
questions:
  - q: 「備品」に社内で採番された管理番号（認知番号）は存在するか。ない場合は資源として立てられない
    asked: 2026-09-18
  - q: 「返却」は貸出の属性（返却日）か、独立した事象（返却番号を採番）か
---

```plantuml T字ER
@startuml
skinparam defaultFontSize 12
skinparam classBorderColor #333
hide circle
class "社員 (R)" as emp #E8F5E9 {
  社員番号
  --
  氏名
  部署コード (R)
}
class "備品 (R)" as item #E8F5E9 {
  備品管理番号
  --
  名称
  保管場所コード (R)
}
class "保管場所 (R)" as loc #E8F5E9 {
  保管場所コード
  --
  名称
}
class "貸出 (E)" as loan #FFF3E0 {
  貸出番号
  --
  貸出日
  返却予定日
  社員番号 (R)
  備品管理番号 (R)
}
class "返却 (E)" as ret #FFF3E0 {
  返却番号
  --
  返却日
  貸出番号 (E)
}
emp "1" -- "*" loan
item "1" -- "*" loan
loc "1" -- "*" item
loan "1" -- "0..1" ret
@enduml
```

## 記法メモ

- 上段が認知番号（識別子）、下段が属性。資源の識別子が事象に置かれる（再帰的な関係）。
- 資源同士の関係は対照表、事象同士は先行事象の識別子を後続へ置く。
- 情報モデルの「備品種類」は、種類コードという認知番号が確認できるまで備品の属性に留める。
- 情報モデルの「通知」は催促の再送であり、通知番号を採番しなければ事象にしない。状態変化の記録は「貸出」「返却」で足りる。
