function parseNumberArray(envVar: string | undefined, fallback: number[]): number[] {
  if (!envVar) return fallback;
  return envVar.split(",").map(Number);
}

export const GAME_CONFIG = {
  MAX_LEVEL: 10,

  EXP_TABLE: parseNumberArray(
    process.env.NEXT_PUBLIC_EXP_TABLE,
    [100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000, 99999]
  ),

  MINE_INTERVAL_TABLE: parseNumberArray(
    process.env.NEXT_PUBLIC_MINE_INTERVAL_TABLE,
    [2000, 1800, 1600, 1400, 1200, 1050, 900, 780, 660, 500]
  ),

  GOLD_PER_MINE_TABLE: parseNumberArray(
    process.env.NEXT_PUBLIC_GOLD_PER_MINE_TABLE,
    [1, 2, 3, 5, 8, 12, 18, 25, 35, 50]
  ),

  EXP_PER_MINE_TABLE: parseNumberArray(
    process.env.NEXT_PUBLIC_EXP_PER_MINE_TABLE,
    [10, 12, 15, 18, 22, 27, 33, 40, 50, 65]
  ),

  // 게임 씬 (상��� 애니메이션 영역만)
  GAME_WIDTH: 390,
  GAME_HEIGHT: 280,  // 전체 화면의 약 2/5
} as const;

export interface LevelInfo {
  level: number;
  costume: string;
  tool: string;
  toolName: string;
  costumeName: string;
  background: string;
}

export const LEVEL_DATA: LevelInfo[] = [
  { level: 1, costume: "rags", tool: "stone", costumeName: "누더기옷", toolName: "돌", background: "forest" },
  { level: 2, costume: "rags", tool: "wood_pickaxe", costumeName: "누더기옷", toolName: "나무 곡괭이", background: "forest" },
  { level: 3, costume: "rags", tool: "stone_pickaxe", costumeName: "누더기옷", toolName: "돌 곡괭이", background: "forest" },
  { level: 4, costume: "white_shirt", tool: "iron_pickaxe", costumeName: "흰 티셔츠", toolName: "철 곡괭이", background: "cave" },
  { level: 5, costume: "white_shirt_hat", tool: "gold_pickaxe", costumeName: "흰 티셔츠+모자", toolName: "금 곡괭이", background: "cave" },
  { level: 6, costume: "denim", tool: "diamond_pickaxe", costumeName: "청자켓", toolName: "다이아 곡괭이", background: "cave" },
  { level: 7, costume: "leather", tool: "mithril_pickaxe", costumeName: "가죽 조끼", toolName: "미스릴 곡괭이", background: "cliff" },
  { level: 8, costume: "miner_uniform", tool: "orihalcon_pickaxe", costumeName: "광부 작업복", toolName: "오리하르콘 곡괭이", background: "cliff" },
  { level: 9, costume: "golden_armor", tool: "dragonbone_pickaxe", costumeName: "황금 갑옷", toolName: "드래곤본 곡괭이", background: "cliff" },
  { level: 10, costume: "royal", tool: "starlight_pickaxe", costumeName: "왕관+로브", toolName: "별빛 곡괭이", background: "sky" },
];
