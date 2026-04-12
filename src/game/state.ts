import { GAME_CONFIG } from "./config";

export interface GameState {
  level: number;
  exp: number;
  gold: number;
  totalGoldMined: number;
}

const STORAGE_KEY = "pixel-goldiger-save";

export function createInitialState(): GameState {
  return {
    level: 1,
    exp: 0,
    gold: 0,
    totalGoldMined: 0,
  };
}

export function loadState(): GameState {
  if (typeof window === "undefined") return createInitialState();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...createInitialState(), ...parsed };
    }
  } catch {
    // corrupted save, start fresh
  }
  return createInitialState();
}

export function saveState(state: GameState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}

export function mine(state: GameState): { state: GameState; leveledUp: boolean } {
  const lvIdx = state.level - 1;
  const goldGain = GAME_CONFIG.GOLD_PER_MINE_TABLE[lvIdx] ?? 1;
  const expGain = GAME_CONFIG.EXP_PER_MINE_TABLE[lvIdx] ?? 10;

  const newState = {
    ...state,
    gold: state.gold + goldGain,
    totalGoldMined: state.totalGoldMined + goldGain,
    exp: state.exp + expGain,
  };

  // 레벨업 체크
  const expNeeded = GAME_CONFIG.EXP_TABLE[lvIdx] ?? 99999;
  let leveledUp = false;

  if (newState.exp >= expNeeded && newState.level < GAME_CONFIG.MAX_LEVEL) {
    newState.exp = newState.exp - expNeeded;
    newState.level += 1;
    leveledUp = true;
  }

  return { state: newState, leveledUp };
}

export function getMineInterval(level: number): number {
  return GAME_CONFIG.MINE_INTERVAL_TABLE[level - 1] ?? 2000;
}

export function getExpProgress(state: GameState): number {
  const expNeeded = GAME_CONFIG.EXP_TABLE[state.level - 1] ?? 99999;
  return Math.min(state.exp / expNeeded, 1);
}

export function getExpNeeded(level: number): number {
  return GAME_CONFIG.EXP_TABLE[level - 1] ?? 99999;
}
