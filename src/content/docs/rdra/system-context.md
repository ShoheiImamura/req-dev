---
title: システムコンテキスト図
layer: rdra
artifact: system-context
status: review
updated: 2026-09-18
summary: システムの境界と、関わるアクター・外部システム
questions:
  - q: 社員マスタは人事システムから連携するか、CSV 取込で十分か
    asked: 2026-09-18
  - q: 通知先は社内チャット（Teams/Slack）とメールのどちらを想定しているか
---

```plantuml システムコンテキスト図
@startuml
left to right direction
skinparam defaultFontSize 13
actor 社員
actor 総務担当
rectangle "備品貸出システム" as sys #E3F2FD
database "人事システム\n（社員マスタ）" as hr
cloud "通知基盤\n（メール／チャット）" as notify
社員 --> sys : 貸出・返却する
総務担当 --> sys : 備品登録・未返却確認
sys --> hr : 社員情報を参照
sys --> notify : 期限通知を送る
@enduml
```

## 目的

「システムの中に入れるもの／入れないもの」を最初に合意する。外部システムとの接続方式はここでは決めない。
