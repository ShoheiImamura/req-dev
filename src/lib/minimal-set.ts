// お客様の価値からユースケース／処理までを一本で辿る。
// 手法名は成果物の軸にしない。参考として STEPS[].ref に残すだけ。
export type StepKey =
  | 'value'
  | 'context'
  | 'flow'
  | 'usecase'
  | 'information'
  | 'state'
  | 'screens'
  | 'processing'
  | 'data';

export interface Step {
  key: StepKey;
  name: string;
  hint: string;
  /** 参考にした手法・図。お客様向けの見出しには使わない。 */
  ref?: string;
}

export const STEPS: Step[] = [
  { key: 'value', name: '価値と要求', hint: 'なぜ作り、何を実現するか', ref: '匠 価値デザイン／要求分析ツリー、RDRA 要求モデル' },
  { key: 'context', name: 'コンテキスト', hint: '誰が・どの業務で', ref: 'RDRA システム／ビジネスコンテキスト' },
  { key: 'flow', name: '業務の流れ', hint: 'どう進むか', ref: 'RDRA 業務フロー／利用シーン' },
  { key: 'usecase', name: 'ユースケース', hint: 'システムとの接点', ref: 'RDRA UC複合図 / ICONIX ユースケース記述' },
  { key: 'information', name: '情報', hint: '扱う名詞（正本）', ref: 'RDRA 情報モデル' },
  { key: 'state', name: '状態', hint: '名詞が取りうる変化', ref: 'RDRA 状態モデル' },
  { key: 'screens', name: '画面', hint: '何を見せ、何をさせるか', ref: 'OOUI' },
  { key: 'processing', name: '処理', hint: '画面と情報がどう動くか', ref: 'ICONIX ロバストネス／シーケンス' },
  { key: 'data', name: 'データ', hint: 'どう残すか', ref: 'TM（T字ER）' },
];

/** パイプラインの並び。価値〜UC が本線、情報をハブに画面／処理／データへ。 */
export const SPINE = {
  main: ['value', 'context', 'flow', 'usecase'] as StepKey[],
  hub: ['information', 'state'] as StepKey[],
  out: ['screens', 'processing', 'data'] as StepKey[],
};

export interface Handoff {
  from: StepKey;
  to: StepKey;
  what: string;
}

export const HANDOFFS: Handoff[] = [
  { from: 'value', to: 'context', what: '要求を誰が・どの業務で実現するか' },
  { from: 'context', to: 'flow', what: '対象業務の流れ' },
  { from: 'flow', to: 'usecase', what: 'システムとの接点' },
  { from: 'flow', to: 'information', what: '業務で扱う名詞' },
  { from: 'usecase', to: 'information', what: '操作する情報' },
  { from: 'information', to: 'state', what: '状態を持つ情報' },
  { from: 'information', to: 'screens', what: '名詞 → 画面のオブジェクト' },
  { from: 'usecase', to: 'screens', what: 'ユースケース → 画面のアクション' },
  { from: 'information', to: 'processing', what: '操作対象' },
  { from: 'usecase', to: 'processing', what: 'このユースケースの動き' },
  { from: 'screens', to: 'processing', what: 'ビュー名を処理の接点に使う' },
  { from: 'state', to: 'processing', what: '遷移させる操作' },
  { from: 'information', to: 'data', what: '名詞 → 残す単位（画面から切らない）' },
  { from: 'state', to: 'data', what: '状態変化 → 残す出来事' },
];

export const STATUS_LABEL: Record<string, string> = {
  todo: '未作成',
  draft: '下書き',
  review: 'お客様確認中',
  agreed: '合意済み',
};

export const stepOf = (key: string) => STEPS.find((s) => s.key === key);
export const stepName = (key: string) => stepOf(key)?.name ?? key;
export const stepIndex = (key: string) => STEPS.findIndex((s) => s.key === key);

export const incoming = (step: string) => HANDOFFS.filter((h) => h.to === step);
export const outgoing = (step: string) => HANDOFFS.filter((h) => h.from === step);
