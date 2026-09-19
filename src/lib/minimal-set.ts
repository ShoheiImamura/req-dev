// 要件定義で「必ず残す」最小セット。index と sidebar はここから生成する。
// 層は横並びではなく、匠 → RDRA → ICONIX が本線、情報モデルから TM / OOUI が分岐する。
export type LayerKey = 'takumi' | 'rdra' | 'iconix' | 'tm' | 'ooui';

export interface Artifact { key: string; name: string; hint?: string }
export interface Layer {
  key: LayerKey;
  name: string;
  artifacts: Artifact[];
  later?: string[];
}

export const LAYERS: Layer[] = [
  {
    key: 'takumi', name: '匠',
    artifacts: [
      { key: 'value-design', name: '価値デザイン', hint: '理念・ビジョン・コンセプト・ストーリー' },
      { key: 'requirement-tree', name: '要求分析ツリー', hint: '要求 → 要件 の分解' },
    ],
  },
  {
    key: 'rdra', name: 'RDRA',
    artifacts: [
      { key: 'system-context', name: 'システムコンテキスト図' },
      { key: 'requirement-model', name: '要求モデル' },
      { key: 'business-context', name: 'ビジネスコンテキスト図' },
      { key: 'business-flow', name: '業務フロー／利用シーン' },
      { key: 'uc-composite', name: 'UC複合図' },
      { key: 'information-model', name: '情報モデル' },
      { key: 'state-model', name: '状態モデル' },
    ],
    later: ['ビジネスユースケース図', 'バリエーション（規模が出てから）'],
  },
  {
    key: 'iconix', name: 'ICONIX',
    artifacts: [
      { key: 'domain-model', name: 'ドメインモデル' },
      { key: 'use-case-description', name: 'ユースケース記述' },
      { key: 'robustness', name: 'ロバストネス図' },
      { key: 'sequence', name: 'シーケンス図' },
      { key: 'class', name: 'クラス図' },
    ],
  },
  {
    key: 'tm', name: 'TM',
    artifacts: [
      { key: 't-er', name: 'T字ER（資源／事象）' },
      { key: 'tables', name: '対応する表' },
    ],
  },
  {
    key: 'ooui', name: 'OOUI',
    artifacts: [
      { key: 'objects', name: 'オブジェクトの抽出' },
      { key: 'views', name: 'ビュー（コレクション／シングル）' },
      { key: 'actions', name: 'アクション' },
    ],
  },
];

/** サイドバーとパイプラインの区画。TM / OOUI は本線ではなく情報モデルからの分岐。 */
export const LAYER_SECTIONS: { key: string; name: string; hint?: string; layers: LayerKey[] }[] = [
  { key: 'main', name: '本線', hint: '匠 → RDRA → ICONIX', layers: ['takumi', 'rdra', 'iconix'] },
  { key: 'branch', name: '情報モデルから分岐', hint: '名詞を DB と画面へ', layers: ['tm', 'ooui'] },
];

export interface Handoff {
  from: [LayerKey, string];
  to: [LayerKey, string];
  /** 何を渡すか（契約）。図の形ではなく、引き継ぐ中身。 */
  what: string;
}

export const HANDOFFS: Handoff[] = [
  { from: ['takumi', 'value-design'], to: ['takumi', 'requirement-tree'], what: '理念・ビジョン（ツリーの根）' },
  { from: ['takumi', 'requirement-tree'], to: ['rdra', 'system-context'], what: '目的と関係者の種' },
  { from: ['takumi', 'requirement-tree'], to: ['rdra', 'requirement-model'], what: '3 段目の要件' },

  { from: ['rdra', 'system-context'], to: ['rdra', 'requirement-model'], what: 'アクター' },
  { from: ['rdra', 'requirement-model'], to: ['rdra', 'business-context'], what: '要件を満たす業務があるか' },
  { from: ['rdra', 'business-context'], to: ['rdra', 'business-flow'], what: '業務の単位' },
  { from: ['rdra', 'business-flow'], to: ['rdra', 'uc-composite'], what: '抽出したユースケース' },
  { from: ['rdra', 'business-flow'], to: ['rdra', 'information-model'], what: '業務で扱う名詞' },
  { from: ['rdra', 'uc-composite'], to: ['rdra', 'information-model'], what: 'ユースケースが操作する情報' },
  { from: ['rdra', 'information-model'], to: ['rdra', 'state-model'], what: '状態を持つ情報' },

  { from: ['rdra', 'information-model'], to: ['iconix', 'domain-model'], what: '用語と関係（精錬する。増やさない）' },
  { from: ['rdra', 'uc-composite'], to: ['iconix', 'use-case-description'], what: 'ユースケース' },
  { from: ['iconix', 'domain-model'], to: ['iconix', 'use-case-description'], what: 'ユビキタス言語' },
  { from: ['iconix', 'domain-model'], to: ['iconix', 'robustness'], what: 'エンティティ' },
  { from: ['iconix', 'use-case-description'], to: ['iconix', 'robustness'], what: '基本／代替コース' },
  { from: ['ooui', 'views'], to: ['iconix', 'robustness'], what: 'ビュー名を Boundary に使う（画面骨格は OOUI）' },
  { from: ['iconix', 'robustness'], to: ['iconix', 'sequence'], what: 'オブジェクトとメッセージの骨格' },
  { from: ['iconix', 'sequence'], to: ['iconix', 'class'], what: '操作・属性' },
  { from: ['iconix', 'domain-model'], to: ['iconix', 'class'], what: 'クラスの種' },
  { from: ['rdra', 'state-model'], to: ['iconix', 'class'], what: '状態と遷移操作' },

  { from: ['rdra', 'information-model'], to: ['tm', 't-er'], what: '名詞 → 資源／事象（画面から切らない）' },
  { from: ['rdra', 'state-model'], to: ['tm', 't-er'], what: '状態変化 → 事象' },
  { from: ['tm', 't-er'], to: ['tm', 'tables'], what: 'エンティティ → 表' },

  { from: ['rdra', 'information-model'], to: ['ooui', 'objects'], what: '名詞 → UI オブジェクト' },
  { from: ['ooui', 'objects'], to: ['ooui', 'views'], what: 'コレクション／シングル' },
  { from: ['rdra', 'uc-composite'], to: ['ooui', 'views'], what: '画面アイコン → ビュー' },
  { from: ['rdra', 'uc-composite'], to: ['ooui', 'actions'], what: 'ユースケース → オブジェクトのアクション' },
  { from: ['ooui', 'views'], to: ['ooui', 'actions'], what: 'どのビューで実行するか' },
  { from: ['iconix', 'use-case-description'], to: ['ooui', 'actions'], what: '操作手順の検証' },
];

export const STATUS_LABEL: Record<string, string> = {
  todo: '未作成',
  draft: '下書き',
  review: 'お客様確認中',
  agreed: '合意済み',
};

export const layerName = (key: string) => LAYERS.find((l) => l.key === key)?.name ?? key;
export const artifactName = (layer: string, key: string) =>
  LAYERS.find((l) => l.key === layer)?.artifacts.find((a) => a.key === key)?.name ?? key;

export const incoming = (layer: string, artifact: string) =>
  HANDOFFS.filter((h) => h.to[0] === layer && h.to[1] === artifact);
export const outgoing = (layer: string, artifact: string) =>
  HANDOFFS.filter((h) => h.from[0] === layer && h.from[1] === artifact);
