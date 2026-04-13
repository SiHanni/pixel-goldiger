// 통일 색상 팔레트 — 슬레이어키우기급 5톤 셰이딩 기준
export const P = {
  // ── 피부 (5톤) ──────────────────────────────────────────
  SKIN_HL:    "#FFF0E0",   // 하이라이트
  SKIN_LIGHT: "#FDDCB5",
  SKIN_MID:   "#F5C49A",
  SKIN_DARK:  "#D4956A",   // 그림자
  SKIN_DEEP:  "#B87040",   // 깊은 그림자 (턱선, 목)

  // ── 머리카락 (5톤) ──────────────────────────────────────
  HAIR_HL:    "#D4A870",   // 하이라이트
  HAIR_LIGHT: "#B8864A",
  HAIR_MID:   "#8B6030",
  HAIR_DARK:  "#5C3C18",
  HAIR_DEEP:  "#3A2010",

  // ── 눈/아웃라인 ─────────────────────────────────────────
  EYE_WHITE:  "#F0EEE8",
  EYE_IRIS:   "#2860C0",   // 파란 눈
  EYE_PUPIL:  "#0A1830",
  EYE_HL:     "#FFFFFF",
  OUTLINE:    "#18100C",   // 메인 아웃라인

  // ── 누더기 (Lv1-2) ──────────────────────────────────────
  RAG_HL:     "#D8C4A8",
  RAG_LIGHT:  "#C4A882",
  RAG_MID:    "#A8896A",
  RAG_DARK:   "#8B6F52",
  RAG_DEEP:   "#6A5038",

  // ── 견습 제복 흰셔츠 (Lv3-4) ───────────────────────────
  SHIRT_HL:   "#FFFFFF",
  SHIRT_LIGHT:"#F5F0E8",
  SHIRT_MID:  "#E0D8CC",
  SHIRT_DARK: "#C4B8A8",
  SHIRT_DEEP: "#A89880",

  // ── 광부 유니폼 파랑 (Lv5-6) ───────────────────────────
  MINER_HL:   "#A0D8F8",
  MINER_LIGHT:"#6EB8E8",
  MINER_MID:  "#4090C8",
  MINER_DARK: "#286898",
  MINER_DEEP: "#184878",

  // ── 황금 갑옷 (Lv7-8) ──────────────────────────────────
  GARM_HL:    "#FFF8C0",
  GARM_LIGHT: "#FFD700",
  GARM_MID:   "#E0A820",
  GARM_DARK:  "#B07810",
  GARM_DEEP:  "#7A5000",

  // ── 왕가 로브 보라 (Lv9-10) ────────────────────────────
  ROYAL_HL:   "#F0E0FF",
  ROYAL_LIGHT:"#D0A8F8",
  ROYAL_MID:  "#A870E0",
  ROYAL_DARK: "#7840B0",
  ROYAL_DEEP: "#501888",

  // ── 도구 자루 ────────────────────────────────────────────
  HAFT_HL:    "#C8A870",
  HAFT_LIGHT: "#A87E50",
  HAFT_MID:   "#7A5838",
  HAFT_DARK:  "#503820",

  // ── 도구 머리 (레벨별) ──────────────────────────────────
  TOOL_STONE_HL:    "#D0C8C0",
  TOOL_STONE_MID:   "#909090",
  TOOL_STONE_DARK:  "#585858",

  TOOL_COPPER_HL:   "#F0C090",
  TOOL_COPPER_MID:  "#C87840",
  TOOL_COPPER_DARK: "#804820",

  TOOL_IRON_HL:     "#E8EEF8",
  TOOL_IRON_MID:    "#A0B0C8",
  TOOL_IRON_DARK:   "#607090",

  TOOL_GOLD_HL:     "#FFFF90",
  TOOL_GOLD_MID:    "#FFD700",
  TOOL_GOLD_DARK:   "#A07800",

  TOOL_DIAMOND_HL:  "#E0FAFF",
  TOOL_DIAMOND_MID: "#70D8F0",
  TOOL_DIAMOND_DARK:"#2890B0",

  TOOL_MITHRIL_HL:  "#D0E8FF",
  TOOL_MITHRIL_MID: "#80B8F0",
  TOOL_MITHRIL_DARK:"#3060A0",

  TOOL_ORIHAL_HL:   "#C0FFD8",
  TOOL_ORIHAL_MID:  "#50D890",
  TOOL_ORIHAL_DARK: "#109850",

  TOOL_DRAGON_HL:   "#FFE0C0",
  TOOL_DRAGON_MID:  "#F08040",
  TOOL_DRAGON_DARK: "#A03000",

  TOOL_STAR_HL:     "#FFFFFF",
  TOOL_STAR_MID:    "#E0C8FF",
  TOOL_STAR_DARK:   "#9060D0",

  // ── 광석 — 돌 ───────────────────────────────────────────
  ORE_STONE_HL:   "#D8D4CC",
  ORE_STONE_L:    "#B0A898",
  ORE_STONE_M:    "#888078",
  ORE_STONE_D:    "#605850",
  ORE_STONE_DEEP: "#383028",

  // ── 광석 — 금 ───────────────────────────────────────────
  ORE_GOLD_HL:    "#FFFF80",
  ORE_GOLD_L:     "#FFD700",
  ORE_GOLD_M:     "#C89000",
  ORE_GOLD_D:     "#806000",

  // ── 광석 — 다이아몬드 ───────────────────────────────────
  ORE_DIA_HL:     "#FFFFFF",
  ORE_DIA_L:      "#A0F0FF",
  ORE_DIA_M:      "#40C0E0",
  ORE_DIA_D:      "#0870A0",

  // ── 광석 — 별 ───────────────────────────────────────────
  ORE_STAR_HL:    "#FFFFFF",
  ORE_STAR_L:     "#F0D8FF",
  ORE_STAR_M:     "#C080F0",
  ORE_STAR_D:     "#7030C0",

  // ── 펫 (흰 강아지) ──────────────────────────────────────
  PET_HL:       "#FFFFFF",
  PET_LIGHT:    "#F8F4F0",
  PET_MID:      "#E8E0D8",
  PET_DARK:     "#C8C0B8",
  PET_DEEP:     "#A89890",
  PET_EYE:      "#1A1820",
  PET_EYE_HL:   "#FFFFFF",
  PET_NOSE:     "#302830",
  PET_TONGUE:   "#F08090",
  PET_TONGUE_D: "#C05060",
  PET_EAR:      "#FFB0C0",   // 귀 안쪽 핑크
  PET_BLUSH:    "#FFD0D8",   // 볼 블러시

  // ── UI / 이펙트 ──────────────────────────────────────────
  EXP_BAR:        "#5C9AE8",
  EXP_BAR_LIGHT:  "#88B8F0",
  GOLD_UI:        "#FFD700",
  SPARKLE:        "#FFFFFF",
  PARTICLE_GOLD:  "#FFE880",
  PARTICLE_STAR:  "#E8D8FF",

  // ── 범용 ────────────────────────────────────────────────
  BLACK:       "#000000",
  WHITE:       "#FFFFFF",
  TRANSPARENT: "transparent",

  // ── 배경 톤 ──────────────────────────────────────────────
  BG_FOREST_SKY1:  "#C8EEFF",
  BG_FOREST_SKY2:  "#EEFFEE",
  BG_CAVE_SKY1:    "#2A2240",
  BG_CAVE_SKY2:    "#483860",
  BG_CLIFF_SKY1:   "#A8D8F8",
  BG_CLIFF_SKY2:   "#E0F4FF",
  BG_SKY_SKY1:     "#C8B0F0",
  BG_SKY_SKY2:     "#F0E8FF",
} as const;
