"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GameState, getExpProgress, getExpNeeded } from "@/game/state";
import { GAME_CONFIG, LEVEL_DATA } from "@/game/config";

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef      = useRef<Phaser.Game | null>(null);
  const [gs, setGs]  = useState<GameState>({ level: 1, exp: 0, gold: 0, totalGoldMined: 0 });

  const onUIUpdate = useCallback((s: GameState) => setGs({ ...s }), []);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;
    localStorage.removeItem("pixel-goldiger-save"); // 레벨 초기화
    import("@/game/PhaserGame").then(({ createGame, getMainScene }) => {
      if (!containerRef.current || gameRef.current) return;
      const game = createGame(containerRef.current);
      gameRef.current = game;
      const tryConnect = () => { getMainScene(game)?.setUICallback(onUIUpdate); };
      game.events.on("ready", tryConnect);
      setTimeout(tryConnect, 600);
    });
    return () => { gameRef.current?.destroy(true); gameRef.current = null; };
  }, [onUIUpdate]);

  const progress  = getExpProgress(gs);
  const expNeeded = getExpNeeded(gs.level);
  const ld        = LEVEL_DATA[gs.level - 1];
  const interval  = GAME_CONFIG.MINE_INTERVAL_TABLE[gs.level - 1] ?? 2000;
  const goldPer   = GAME_CONFIG.GOLD_PER_MINE_TABLE[gs.level - 1] ?? 1;
  const speed     = (1000 / interval).toFixed(1);
  const region    = ld?.background === "forest" ? "숲"
                  : ld?.background === "cave"   ? "동굴"
                  : ld?.background === "cliff"  ? "절벽" : "하늘";

  return (
    <div style={S.wrap}>
      {/* ── 게임 씬 ── */}
      <div ref={containerRef} style={S.game} />

      {/* ── 골드 + 레벨 오버레이 (게임 씬 아래 경계) ── */}
      <div style={S.statusBar}>
        <div style={S.goldRow}>
          <span style={S.coinEmoji}>🪙</span>
          <span style={S.goldAmt}>{fmtGold(gs.gold)}</span>
        </div>
        <div style={S.lvPill}>Lv.{gs.level}</div>
      </div>

      {/* ── EXP 바 ── */}
      <div style={S.expWrap}>
        <div style={S.expTrack}>
          <div style={{ ...S.expFill, width: `${progress * 100}%` }} />
          <div style={{ ...S.expGlow, width: `${progress * 100}%` }} />
        </div>
        <div style={S.expLabel}>
          <span style={S.expText}>EXP {gs.exp.toLocaleString()} / {expNeeded.toLocaleString()}</span>
          <span style={S.expPct}>{Math.floor(progress * 100)}%</span>
        </div>
      </div>

      {/* ── 정보 패널 ── */}
      <div style={S.panel}>

        {/* 캐릭터 스탯 카드 */}
        <div style={S.card}>
          <div style={S.cardHead}>
            <span style={S.cardIcon}>⚔️</span>
            <span style={S.cardTitle}>채굴사</span>
            <span style={S.cardSub}>{ld?.costumeName ?? ""}</span>
          </div>
          <div style={S.statGrid}>
            <StatBox icon="⛏️" label="도구"   value={ld?.toolName ?? ""} />
            <StatBox icon="⚡" label="속도"   value={`${speed}/초`} />
            <StatBox icon="💰" label="회당 골드" value={`+${fmtGold(goldPer)}`} gold />
            <StatBox icon="🗺️" label="지역"   value={region} />
          </div>
        </div>

        {/* 누적 통계 카드 */}
        <div style={S.card}>
          <div style={S.cardHead}>
            <span style={S.cardIcon}>📊</span>
            <span style={S.cardTitle}>통계</span>
          </div>
          <div style={S.bigStatRow}>
            <BigStat label="총 채굴량" value={fmtGold(gs.totalGoldMined)} unit="G" />
            <div style={S.vDivider} />
            <BigStat label="레벨" value={`${gs.level}`} unit={`/ ${GAME_CONFIG.MAX_LEVEL}`} />
            <div style={S.vDivider} />
            <BigStat label="경험치" value={`${Math.floor(progress * 100)}`} unit="%" />
          </div>
        </div>

      </div>

      {/* ── 탭바 ── */}
      <div style={S.tabBar}>
        <Tab icon="⛏️" label="채굴"  active />
        <Tab icon="🛡️" label="장비"  />
        <Tab icon="🏪" label="상점"  />
        <Tab icon="🐾" label="펫"    />
      </div>
    </div>
  );
}

// ── 서브 컴포넌트 ────────────────────────────────────────────────

function StatBox({ icon, label, value, gold }: { icon: string; label: string; value: string; gold?: boolean }) {
  return (
    <div style={S.statBox}>
      <span style={S.statIcon}>{icon}</span>
      <div style={S.statTexts}>
        <span style={S.statLabel}>{label}</span>
        <span style={{ ...S.statValue, color: gold ? C.gold : C.text }}>{value}</span>
      </div>
    </div>
  );
}

function BigStat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div style={S.bigStat}>
      <span style={S.bigVal}>{value}</span>
      <span style={S.bigUnit}>{unit}</span>
      <span style={S.bigLabel}>{label}</span>
    </div>
  );
}

function Tab({ icon, label, active }: { icon: string; label: string; active?: boolean }) {
  return (
    <div style={{ ...S.tab, ...(active ? S.tabActive : {}) }}>
      <span style={S.tabIcon}>{icon}</span>
      <span style={S.tabLabel}>{label}</span>
    </div>
  );
}

function fmtGold(g: number): string {
  if (g >= 1_000_000) return `${(g / 1_000_000).toFixed(1)}M`;
  if (g >= 1_000)     return `${(g / 1_000).toFixed(1)}K`;
  return g.toLocaleString();
}

// ── 스타일 ──────────────────────────────────────────────────────

const C = {
  bg:      "#FAFAF8",   // 웜 화이트 베이스
  surface: "#FFFFFF",   // 순백
  card:    "#FFFFFF",   // 카드 배경
  border:  "#EDE8DF",   // 웜 베이지 구분선
  gold:    "#C8960A",   // 화이트 배경 위 가독성 있는 골드
  goldD:   "#A07208",   // 딥 골드
  goldL:   "#F5C842",   // 밝은 골드 (그라디언트 끝)
  text:    "#1C1A16",   // 거의 검정
  textDim: "#9A9080",   // 웜 그레이
  accent:  "#C8960A",   // 골드 액센트
};

const S: Record<string, React.CSSProperties> = {
  wrap: {
    width: "100%", maxWidth: 430, margin: "0 auto",
    height: "100svh", display: "flex", flexDirection: "column",
    background: C.bg, overflow: "hidden", fontFamily: "'Segoe UI', sans-serif",
  },
  game: {
    width: "100%", height: "38vh", maxHeight: 300,
    overflow: "hidden", flexShrink: 0,
    borderBottom: `1px solid ${C.border}`,
  },

  // ── 상태바 ──
  statusBar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 16px 6px",
    background: C.surface,
    borderBottom: `1px solid ${C.border}`,
  },
  goldRow: { display: "flex", alignItems: "center", gap: 6 },
  coinEmoji: { fontSize: 20, lineHeight: 1 },
  goldAmt: {
    fontSize: 22, fontWeight: 800, color: C.gold,
    fontVariantNumeric: "tabular-nums", letterSpacing: -0.5,
  },
  lvPill: {
    background: `linear-gradient(135deg, ${C.goldL}, ${C.gold})`,
    color: "#FFF", fontWeight: 700, fontSize: 13,
    padding: "5px 14px", borderRadius: 20,
    boxShadow: "0 2px 8px rgba(200,150,10,0.3)",
  },

  // ── EXP 바 ──
  expWrap: { padding: "4px 16px 8px", background: C.surface },
  expTrack: {
    position: "relative", height: 10, borderRadius: 5,
    background: C.border, overflow: "hidden",
  },
  expFill: {
    position: "absolute", top: 0, left: 0, height: "100%",
    background: `linear-gradient(90deg, ${C.goldD}, ${C.gold}, ${C.goldL})`,
    borderRadius: 5, transition: "width 0.4s ease",
  },
  expGlow: {
    position: "absolute", top: 0, left: 0, height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(245,200,66,0.4))",
    borderRadius: 5, transition: "width 0.4s ease",
  },
  expLabel: {
    display: "flex", justifyContent: "space-between", marginTop: 4,
  },
  expText: { fontSize: 10, color: C.textDim, fontVariantNumeric: "tabular-nums" },
  expPct:  { fontSize: 10, color: C.gold, fontWeight: 700 },

  // ── 패널 ──
  panel: {
    flex: 1, display: "flex", flexDirection: "column",
    gap: 8, padding: "8px 12px", overflowY: "auto",
    background: C.bg,
  },
  card: {
    background: C.card, borderRadius: 14, padding: "12px 14px",
    border: `1px solid ${C.border}`,
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
  },
  cardHead: {
    display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
  },
  cardIcon: { fontSize: 16 },
  cardTitle: {
    fontSize: 13, fontWeight: 700, color: C.text,
    flex: 1,
  },
  cardSub: { fontSize: 11, color: C.textDim },

  // ── 스탯 그리드 ──
  statGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  statBox: {
    display: "flex", alignItems: "center", gap: 8,
    background: C.bg, borderRadius: 10, padding: "8px 10px",
    border: `1px solid ${C.border}`,
  },
  statIcon:   { fontSize: 18, lineHeight: 1 },
  statTexts:  { display: "flex", flexDirection: "column", gap: 2 },
  statLabel:  { fontSize: 10, color: C.textDim },
  statValue:  { fontSize: 13, fontWeight: 700, color: C.text },

  // ── 빅스탯 (통계 카드) ──
  bigStatRow: { display: "flex", justifyContent: "space-around", alignItems: "center" },
  bigStat:    { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  bigVal:     { fontSize: 20, fontWeight: 800, color: C.gold },
  bigUnit:    { fontSize: 10, color: C.textDim, marginTop: -2 },
  bigLabel:   { fontSize: 10, color: C.textDim },
  vDivider:   { width: 1, height: 36, background: C.border },

  // ── 탭바 ──
  tabBar: {
    display: "flex", borderTop: `1px solid ${C.border}`,
    background: C.surface, flexShrink: 0,
  },
  tab: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
    padding: "10px 0", gap: 4, cursor: "pointer", opacity: 0.35,
    transition: "opacity 0.2s",
  },
  tabActive: {
    opacity: 1,
    borderTop: `2px solid ${C.gold}`,
    marginTop: -1,
  },
  tabIcon:  { fontSize: 20 },
  tabLabel: { fontSize: 10, fontWeight: 600, color: C.text },
};
