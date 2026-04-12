"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GameState, getExpProgress, getExpNeeded } from "@/game/state";
import { GAME_CONFIG, LEVEL_DATA } from "@/game/config";

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [state, setState] = useState<GameState>({
    level: 1, exp: 0, gold: 0, totalGoldMined: 0,
  });

  const onUIUpdate = useCallback((s: GameState) => setState({ ...s }), []);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    // 레벨 1로 리셋
    localStorage.removeItem("pixel-goldiger-save");

    import("@/game/PhaserGame").then(({ createGame, getMainScene }) => {
      if (!containerRef.current || gameRef.current) return;
      const game = createGame(containerRef.current);
      gameRef.current = game;

      const tryConnect = () => {
        const scene = getMainScene(game);
        if (scene) scene.setUICallback(onUIUpdate);
      };
      game.events.on("ready", tryConnect);
      setTimeout(tryConnect, 600);
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [onUIUpdate]);

  const progress = getExpProgress(state);
  const expNeeded = getExpNeeded(state.level);
  const ld = LEVEL_DATA[state.level - 1];
  const interval = GAME_CONFIG.MINE_INTERVAL_TABLE[state.level - 1] ?? 2000;
  const goldPer = GAME_CONFIG.GOLD_PER_MINE_TABLE[state.level - 1] ?? 1;
  const speed = (1000 / interval).toFixed(1);
  const region = ld?.background === "forest" ? "숲" : ld?.background === "cave" ? "동굴" : ld?.background === "cliff" ? "절벽" : "하늘";

  return (
    <div style={S.wrap}>
      {/* 게임 씬 — aspect-ratio로 정확한 비율 유지, 빈 공간 없음 */}
      <div ref={containerRef} style={S.game} />

      {/* UI 패널 */}
      <div style={S.panel}>
        <div style={S.topRow}>
          <div style={S.goldBox}>
            <div style={S.coinIcon}>G</div>
            <span style={S.goldNum}>{fmtGold(state.gold)}</span>
          </div>
          <div style={S.lvBadge}>Lv.{state.level}</div>
        </div>

        <div style={S.expWrap}>
          <div style={S.expOuter}>
            <div style={{ ...S.expFill, width: `${progress * 100}%` }} />
            <span style={S.expTxt}>{state.exp} / {expNeeded}</span>
          </div>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>캐릭터 정보</div>
          <div style={S.grid}>
            <Info label="의상" value={ld?.costumeName ?? ""} />
            <Info label="도구" value={ld?.toolName ?? ""} />
            <Info label="채굴 속도" value={`${speed}/초`} />
            <Info label="회당 골드" value={`+${goldPer}`} gold />
          </div>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>통계</div>
          <div style={S.statsRow}>
            <Stat value={fmtGold(state.totalGoldMined)} label="총 채굴량" />
            <div style={S.divider} />
            <Stat value={`Lv.${state.level}`} label="현재 레벨" />
            <div style={S.divider} />
            <Stat value={region} label="지역" />
          </div>
        </div>

        <div style={S.tabs}>
          <div style={{ ...S.tab, ...S.tabOn }}>채굴</div>
          <div style={S.tab}>장비</div>
          <div style={S.tab}>상점</div>
          <div style={S.tab}>펫</div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div style={S.infoItem}>
      <span style={S.infoLabel}>{label}</span>
      <span style={{ ...S.infoVal, color: gold ? "#D4A017" : "#333" }}>{value}</span>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={S.statItem}>
      <span style={S.statVal}>{value}</span>
      <span style={S.statLabel}>{label}</span>
    </div>
  );
}

function fmtGold(g: number): string {
  if (g >= 1_000_000) return `${(g / 1_000_000).toFixed(1)}M`;
  if (g >= 1_000) return `${(g / 1_000).toFixed(1)}K`;
  return g.toLocaleString();
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    width: "100%",
    maxWidth: 430,
    margin: "0 auto",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#FAFAF8",
    overflow: "hidden",
  },
  game: {
    width: "100%",
    height: "38vh",
    maxHeight: 300,
    overflow: "hidden",
    borderBottom: "3px solid #E8D9A0",
    flexShrink: 0,
  },
  panel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: "12px 16px",
    overflowY: "auto",
  },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  goldBox: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#FFF", borderRadius: 14, padding: "8px 18px",
    border: "1.5px solid #E8D9A0",
    boxShadow: "0 1px 4px rgba(200,170,60,0.12)",
  },
  coinIcon: {
    width: 26, height: 26, borderRadius: "50%",
    background: "linear-gradient(135deg, #FFD700, #E8B830)",
    color: "#FFF", fontWeight: "bold", fontSize: 14,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "monospace",
    boxShadow: "0 1px 3px rgba(200,160,0,0.3)",
  },
  goldNum: {
    fontSize: 20, fontWeight: "bold", color: "#C49A17",
    fontFamily: "monospace", letterSpacing: -0.5,
  },
  lvBadge: {
    background: "linear-gradient(135deg, #FFD700, #E8B830)",
    color: "#FFF", fontWeight: "bold", fontSize: 13,
    padding: "6px 16px", borderRadius: 20, fontFamily: "monospace",
    boxShadow: "0 2px 6px rgba(200,160,0,0.25)",
  },
  expWrap: { marginTop: 2 },
  expOuter: {
    position: "relative" as const, width: "100%", height: 22,
    background: "#F0EDE0", borderRadius: 11, overflow: "hidden",
    border: "1.5px solid #E8D9A0",
  },
  expFill: {
    position: "absolute" as const, top: 0, left: 0, height: "100%",
    background: "linear-gradient(90deg, #E8C840, #FFD700, #FFE870)",
    borderRadius: 11, transition: "width 0.3s ease",
  },
  expTxt: {
    position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 10, color: "#8A7A40", fontFamily: "monospace", fontWeight: "bold",
  },
  card: {
    background: "#FFF", borderRadius: 14, padding: "12px 14px",
    border: "1.5px solid #EDE5CC",
    boxShadow: "0 1px 4px rgba(200,170,60,0.08)",
  },
  cardTitle: {
    fontSize: 11, color: "#B09840", fontWeight: "bold",
    marginBottom: 8, fontFamily: "monospace", letterSpacing: 0.5,
  },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  infoItem: { display: "flex", flexDirection: "column" as const, gap: 2 },
  infoLabel: { fontSize: 10, color: "#B0A880", fontFamily: "monospace" },
  infoVal: { fontSize: 13, color: "#333", fontWeight: "bold", fontFamily: "monospace" },
  statsRow: { display: "flex", justifyContent: "space-around", alignItems: "center" },
  statItem: { display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 3 },
  statVal: { fontSize: 15, color: "#C49A17", fontWeight: "bold", fontFamily: "monospace" },
  statLabel: { fontSize: 10, color: "#B0A880", fontFamily: "monospace" },
  divider: { width: 1, height: 28, background: "#EDE5CC" },
  tabs: {
    display: "flex", marginTop: "auto",
    background: "#FFF", borderRadius: 14, overflow: "hidden",
    border: "1.5px solid #EDE5CC",
  },
  tab: {
    flex: 1, textAlign: "center" as const, padding: "12px 0",
    fontSize: 12, color: "#C0B890", fontFamily: "monospace",
    fontWeight: "bold", cursor: "pointer",
  },
  tabOn: {
    color: "#C49A17", background: "#FFF8E0",
    borderBottom: "2px solid #FFD700",
  },
};
