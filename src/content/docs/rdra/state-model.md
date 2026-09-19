---
title: 状態モデル：貸出
layer: rdra
artifact: state-model
status: draft
updated: 2026-09-18
summary: 「貸出」情報の状態遷移
questions:
  - q: 貸出期間の「延長」は認めるか。認める場合、回数や上限は？
  - q: 紛失時の扱い（貸出を「紛失」で終了させるか）
---

```plantuml 貸出の状態遷移
@startuml
skinparam defaultFontSize 13
[*] --> 貸出中 : 借りる
貸出中 --> 貸出中 : 延長する（要確認）
貸出中 --> 期限超過 : 返却予定日を過ぎる
貸出中 --> 返却済 : 返す
期限超過 --> 返却済 : 返す
期限超過 --> 紛失 : 紛失と判断（要確認）
返却済 --> [*]
紛失 --> [*]
@enduml
```
