---
title: ビジネスコンテキスト図
layer: rdra
artifact: business-context
status: draft
updated: 2026-09-18
summary: 対象業務とその周辺、関係する組織・外部
questions:
  - q: 「棚卸し」業務は今回の対象に含めるか（年 1 回の実地確認）
---

```plantuml ビジネスコンテキスト図
@startuml
left to right direction
skinparam defaultFontSize 12
actor 社員
actor 総務担当
actor "備品の購買担当" as buyer
rectangle "備品管理業務" #FFF3E0 {
  usecase "備品の貸出・返却" as b1
  usecase "備品の登録・廃棄" as b2
  usecase "未返却の催促" as b3
  usecase "棚卸し（対象外？）" as b4 #EEEEEE
}
rectangle "購買業務（対象外）" #EEEEEE {
  usecase "備品の購入" as p1
}
社員 --> b1
総務担当 --> b2
総務担当 --> b3
総務担当 --> b4
buyer --> p1
p1 ..> b2 : 納品後に登録
@enduml
```
