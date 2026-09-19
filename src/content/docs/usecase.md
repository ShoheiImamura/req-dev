---
title: ユースケース全体
step: usecase
order: 0
status: draft
updated: 2026-09-18
summary: 誰が（アクター）、何をして（ユースケース）、何を扱うか（情報）
questions:
  - q: 「備品の予約」（貸出中の備品を次に借りる）は今回のスコープに入るか
---

```plantuml ユースケース全体
@startuml
left to right direction
skinparam defaultFontSize 12
actor 社員
actor 総務担当
rectangle "業務: 備品の貸出・返却" #FFF3E0 {
  usecase "備品を借りる" as uc1
  usecase "備品を返す" as uc2
  usecase "貸出中一覧を見る" as uc3
}
rectangle "業務: 未返却の催促" #FFF3E0 {
  usecase "期限超過一覧を見る" as uc4
}
rectangle "情報" #E8F5E9 {
  card "備品" as i1
  card "貸出" as i2
  card "社員" as i3
}
社員 --> uc1
社員 --> uc2
社員 --> uc3
総務担当 --> uc4
uc1 --> i1
uc1 --> i2
uc1 --> i3
uc2 --> i2
uc3 --> i2
uc4 --> i2
@enduml
```

アクター → ユースケース → 扱う情報。情報の名前は「情報」ページと揃える。画面はここでは扱わず、個別のやりとりはユースケースごとに書く。
