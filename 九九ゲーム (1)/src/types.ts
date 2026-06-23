export interface KukuItem {
  multiplicand: number; // かけられる数 (e.g., 2)
  multiplier: number;   // かける数 (e.g., 3)
  answer: number;       // 答え (e.g., 6)
  chant: string;        // 唱え方 (e.g., "にさんがろく")
  chantDisplay: string; // フリガナ・漢字表示 (e.g., "二・三が・六")
}

export type PracticeType = 'order' | 'shuffle' | 'challenge';

export interface Choice {
  value: number;
  isCorrect: boolean;
}

export interface Progress {
  [key: number]: { // Key is 段 (1 to 9)
    unlocked: boolean;
    orderMastered: boolean; // じゅんばんクリア
    shuffleMastered: boolean; // バラバラクリア
    stars: number; // 0 to 3 stars
    highScore: number; // タイムや連続正解数
  }
}

export interface WeakQuestion {
  multiplicand: number;
  multiplier: number;
  wrongCount: number;
}
