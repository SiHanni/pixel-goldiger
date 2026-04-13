import { P } from "./palette";

export interface ParallaxLayer {
  speed: number;
  yStart: number;
  height: number;
  elements: LayerElement[];
}

export interface LayerElement {
  type: "rect" | "circle" | "triangle";
  x: number; y: number;
  w?: number; h?: number; r?: number;
  color: string; alpha?: number;
  points?: number[];
}

export interface BackgroundTheme {
  name: string;
  skyColors: [string, string];
  layers: ParallaxLayer[];
  groundColor: string;
  groundDetailColor: string;
}

export function getBackgroundTheme(level: number): BackgroundTheme {
  if (level <= 3) return forestTheme(level);
  if (level <= 6) return caveTheme(level);
  if (level <= 9) return cliffTheme(level);
  return skyTheme();
}

// ── 나무 헬퍼 ───────────────────────────────────────────────────
function tree(x: number, ty: number, sz: number, trunk: string, l1: string, l2: string, l3: string, shadow: string): LayerElement[] {
  const tw = Math.max(5, sz / 6);
  return [
    // 나뭇잎 그림자 (아래 약간 어둡게)
    { type: "circle", x: x + 2, y: ty - sz * 0.05, r: sz * 0.42, color: shadow, alpha: 0.35 },
    // 나뭇잎 레이어 (뒤→앞)
    { type: "circle", x: x, y: ty - sz * 0.08, r: sz * 0.44, color: l1 },
    { type: "circle", x: x - sz * 0.22, y: ty - sz * 0.04, r: sz * 0.33, color: l2 },
    { type: "circle", x: x + sz * 0.22, y: ty - sz * 0.06, r: sz * 0.3, color: l2, alpha: 0.92 },
    { type: "circle", x: x, y: ty - sz * 0.26, r: sz * 0.36, color: l2 },
    { type: "circle", x: x - sz * 0.1, y: ty - sz * 0.38, r: sz * 0.26, color: l3 },
    { type: "circle", x: x + sz * 0.12, y: ty - sz * 0.32, r: sz * 0.19, color: l3, alpha: 0.85 },
    // 나뭇잎 하이라이트
    { type: "circle", x: x - sz * 0.05, y: ty - sz * 0.42, r: sz * 0.1, color: l3, alpha: 0.6 },
    // 줄기
    { type: "rect", x: x - tw / 2, y: ty, w: tw, h: sz * 0.72, color: trunk },
    { type: "rect", x: x - tw / 2 + 1, y: ty + 2, w: Math.max(2, tw / 3), h: sz * 0.65, color: shadow, alpha: 0.2 },
  ];
}

// ── 구름 헬퍼 ───────────────────────────────────────────────────
function cloud(x: number, y: number, sz: number): LayerElement[] {
  return [
    { type: "circle", x, y, r: sz, color: "#FFFFFF", alpha: 0.82 },
    { type: "circle", x: x + sz * 0.7, y: y + sz * 0.15, r: sz * 0.72, color: "#FFFFFF", alpha: 0.75 },
    { type: "circle", x: x - sz * 0.6, y: y + sz * 0.2, r: sz * 0.6, color: "#FFFFFF", alpha: 0.7 },
    { type: "circle", x: x + sz * 0.15, y: y + sz * 0.3, r: sz * 0.55, color: "#F0EEFF", alpha: 0.5 },
    // 구름 하단 그림자
    { type: "circle", x, y: y + sz * 0.5, r: sz * 0.7, color: "#C8C0D8", alpha: 0.15 },
  ];
}

// ══════════════════════════════════════════════════════════════════
// FOREST (Lv 1-3)
// ══════════════════════════════════════════════════════════════════
function forestTheme(level: number): BackgroundTheme {
  const seasons = [
    // 봄: 벚꽃
    {
      sky: ["#FFE8F0", "#C8E8FF"] as [string, string],
      l1: "#F0C8D8", l2: "#E8B0C4", l3: "#FFD8E8",
      tk: "#9A7852", sh: "#7A5832",
      gnd: "#98D878", gndD: "#70C050",
      bush: "#A0D870", bf1: "#FFB8D0", bf2: "#FFC8E0", bf3: "#FFE0F0",
    },
    // 여름: 진초록
    {
      sky: ["#88D0FF", "#C8EEFF"] as [string, string],
      l1: "#48C038", l2: "#30A020", l3: "#68D850",
      tk: "#8A6848", sh: "#604828",
      gnd: "#68D048", gndD: "#48B830",
      bush: "#50C038", bf1: "#FFFFFF", bf2: "#F0F8A0", bf3: "#D0F880",
    },
    // 가을: 단풍
    {
      sky: ["#FFD890", "#FFB860"] as [string, string],
      l1: "#E89030", l2: "#C87020", l3: "#F0B040",
      tk: "#8A6040", sh: "#604020",
      gnd: "#C8A850", gndD: "#A88030",
      bush: "#C09040", bf1: "#F08030", bf2: "#E06020", bf3: "#F0A040",
    },
  ];
  const s = seasons[(level - 1) % 3];

  return {
    name: `forest_${level}`,
    skyColors: s.sky,
    groundColor: s.gnd,
    groundDetailColor: s.gndD,
    layers: [
      // 원경 산
      { speed: 0.03, yStart: 40, height: 192, elements: [
        { type: "triangle", x: 0, y: 0, color: "#B8D0A8", alpha: 0.4, points: [20,  192, -50, 192, 110, 18] },
        { type: "triangle", x: 0, y: 0, color: "#A8C098", alpha: 0.35, points: [180, 192, 90,  192, 260, 30] },
        { type: "triangle", x: 0, y: 0, color: "#B0C8A0", alpha: 0.3,  points: [320, 192, 250, 192, 390, 48] },
        // 산 하이라이트
        { type: "triangle", x: 0, y: 0, color: "#D8E8D0", alpha: 0.25, points: [110, 22, 90, 50, 128, 45] },
        { type: "triangle", x: 0, y: 0, color: "#D0E0C8", alpha: 0.2,  points: [260, 34, 245, 58, 272, 55] },
        ...cloud(70,  16, 18),
        ...cloud(255, 26, 22),
        ...cloud(370, 10, 15),
      ]},
      // 나무 레이어
      { speed: 0.16, yStart: 90, height: 142, elements: [
        ...tree(30,  90, 44, s.tk, s.l1, s.l2, s.l3, s.sh),
        ...tree(130, 96, 38, s.tk, s.l1, s.l2, s.l3, s.sh),
        ...tree(235, 92, 46, s.tk, s.l1, s.l2, s.l3, s.sh),
        ...tree(345, 94, 40, s.tk, s.l1, s.l2, s.l3, s.sh),
      ]},
      // 지면 안개 (ground fog)
      { speed: 0.08, yStart: 185, height: 35, elements: [
        { type: "circle", x: 50,  y: 25, r: 60, color: "#FFFFFF", alpha: 0.12 },
        { type: "circle", x: 160, y: 28, r: 70, color: "#FFFFFF", alpha: 0.10 },
        { type: "circle", x: 280, y: 24, r: 65, color: "#FFFFFF", alpha: 0.11 },
        { type: "circle", x: 380, y: 26, r: 55, color: "#FFFFFF", alpha: 0.09 },
        { type: "circle", x: 100, y: 30, r: 50, color: s.sky[0], alpha: 0.08 },
        { type: "circle", x: 330, y: 30, r: 58, color: s.sky[0], alpha: 0.07 },
      ]},
      // 덤불 + 꽃
      { speed: 0.40, yStart: 198, height: 22, elements: [
        { type: "circle", x: 40,  y: 14, r: 14, color: s.bush, alpha: 0.9 },
        { type: "circle", x: 46,  y: 8,  r: 9,  color: s.l2 },
        { type: "circle", x: 52,  y: 4,  r: 5,  color: s.l3, alpha: 0.75 },
        { type: "circle", x: 56,  y: 2,  r: 3,  color: s.bf1 },
        { type: "circle", x: 42,  y: 3,  r: 2,  color: s.bf2 },
        { type: "circle", x: 62,  y: 5,  r: 2,  color: s.bf3, alpha: 0.85 },

        { type: "circle", x: 155, y: 13, r: 12, color: s.bush, alpha: 0.88 },
        { type: "circle", x: 161, y: 7,  r: 7,  color: s.l2 },
        { type: "circle", x: 166, y: 3,  r: 3,  color: s.bf1 },
        { type: "circle", x: 151, y: 4,  r: 2,  color: s.bf2, alpha: 0.9 },

        { type: "circle", x: 268, y: 15, r: 15, color: s.bush, alpha: 0.92 },
        { type: "circle", x: 274, y: 8,  r: 10, color: s.l2 },
        { type: "circle", x: 280, y: 3,  r: 4,  color: s.l3, alpha: 0.65 },
        { type: "circle", x: 285, y: 2,  r: 3,  color: s.bf1 },
        { type: "circle", x: 263, y: 4,  r: 2,  color: s.bf3 },

        { type: "circle", x: 375, y: 12, r: 11, color: s.bush, alpha: 0.88 },
        { type: "circle", x: 380, y: 6,  r: 6,  color: s.l2 },
        { type: "circle", x: 384, y: 3,  r: 3,  color: s.bf2, alpha: 0.9 },
      ]},
    ],
  };
}

// ══════════════════════════════════════════════════════════════════
// CAVE (Lv 4-6)
// ══════════════════════════════════════════════════════════════════
function caveTheme(level: number): BackgroundTheme {
  const cSets = [
    { m: "#80D8F0", g: "#B0F0FF", a: "#F080C8", ag: "#D060A8", wall: "#5A4870", wallL: "#7A6890" },
    { m: "#80A0F8", g: "#B0C8FF", a: "#80F0A0", ag: "#50D070", wall: "#484068", wallL: "#686090" },
    { m: "#C080F0", g: "#E0C0FF", a: "#F0D860", ag: "#D0B840", wall: "#503870", wallL: "#706090" },
  ];
  const c = cSets[(level - 4) % 3];

  function crystal(x: number, h: number, col: string, glow: string): LayerElement[] {
    return [
      { type: "triangle", x: 0, y: 0, color: col,  alpha: 0.8,  points: [x, 155, x - h*0.32, 155-h*0.12, x+h*0.32, 155] },
      { type: "triangle", x: 0, y: 0, color: col,  alpha: 0.75, points: [x, 155-h, x-h*0.22, 155, x+h*0.22, 155] },
      { type: "triangle", x: 0, y: 0, color: glow, alpha: 0.4,  points: [x-1, 155-h+6, x-h*0.16, 155-2, x+3, 155-2] },
      { type: "circle", x: x-2, y: 155-h+7, r: 2.5, color: "#FFFFFF", alpha: 0.95 },
      // 크리스탈 글로우
      { type: "circle", x: x, y: 155-h/2, r: h*0.4, color: glow, alpha: 0.06 },
    ];
  }

  return {
    name: `cave_${level}`,
    skyColors: ["#2A2040", "#483860"],
    groundColor: "#6A5888", groundDetailColor: "#5A4878",
    layers: [
      // 동굴 벽 (종유석)
      { speed: 0.04, yStart: 0, height: 232, elements: [
        { type: "triangle", x:0,y:0, color: c.wall,  alpha: 0.85, points: [42,0,  30,  68, 54,  0] },
        { type: "triangle", x:0,y:0, color: c.wallL, alpha: 0.5,  points: [40,0,  35,  38, 48,  0] },
        { type: "triangle", x:0,y:0, color: c.wall,  alpha: 0.75, points: [135,0, 124, 48, 146, 0] },
        { type: "triangle", x:0,y:0, color: c.wallL, alpha: 0.4,  points: [133,0, 129, 28, 141, 0] },
        { type: "triangle", x:0,y:0, color: c.wall,  alpha: 0.82, points: [245,0, 231, 60, 259, 0] },
        { type: "triangle", x:0,y:0, color: c.wallL, alpha: 0.48, points: [243,0, 237, 34, 253, 0] },
        { type: "triangle", x:0,y:0, color: c.wall,  alpha: 0.72, points: [345,0, 334, 42, 356, 0] },
        // 석순
        { type: "triangle", x:0,y:0, color: c.wall,  alpha: 0.65, points: [88,  232, 77,  200, 99,  232] },
        { type: "triangle", x:0,y:0, color: c.wallL, alpha: 0.45, points: [90,  232, 84,  212, 96,  232] },
        { type: "triangle", x:0,y:0, color: c.wall,  alpha: 0.6,  points: [293, 232, 284, 204, 302, 232] },
        { type: "triangle", x:0,y:0, color: c.wallL, alpha: 0.38, points: [295, 232, 290, 214, 300, 232] },
      ]},
      // 크리스탈
      { speed: 0.17, yStart: 77, height: 155, elements: [
        ...crystal(55,  54, c.m, c.g),
        ...crystal(165, 40, c.a, c.ag),
        ...crystal(285, 60, c.m, c.g),
        ...crystal(375, 35, c.a, c.ag),
        // 떠다니는 빛 입자
        { type: "circle", x: 105, y: 115, r: 2, color: c.g,      alpha: 0.55 },
        { type: "circle", x: 215, y: 95,  r: 2, color: "#FFFFFF", alpha: 0.45 },
        { type: "circle", x: 325, y: 125, r: 2, color: c.g,      alpha: 0.5 },
        { type: "circle", x: 145, y: 85,  r: 1.5, color: "#FFFFFF", alpha: 0.38 },
        { type: "circle", x: 250, y: 140, r: 1.5, color: c.ag,   alpha: 0.42 },
        { type: "circle", x: 70,  y: 100, r: 1.5, color: c.a,    alpha: 0.35 },
      ]},
      // 빛 샤프트 (천장에서 내려오는 빛줄기)
      { speed: 0.02, yStart: 0, height: 232, elements: [
        { type: "triangle", x:0,y:0, color: c.g, alpha: 0.07, points: [80, 0, 60, 232, 100, 0] },
        { type: "triangle", x:0,y:0, color: c.g, alpha: 0.05, points: [200,0, 175, 232, 225, 0] },
        { type: "triangle", x:0,y:0, color: c.ag,alpha: 0.06, points: [330,0, 308, 232, 352, 0] },
        // 공기 중 먼지 입자 (더 많이)
        { type: "circle", x: 60,  y: 60,  r: 1.5, color: c.g,      alpha: 0.5 },
        { type: "circle", x: 120, y: 90,  r: 1,   color: "#FFFFFF", alpha: 0.4 },
        { type: "circle", x: 180, y: 50,  r: 1.5, color: c.ag,     alpha: 0.45 },
        { type: "circle", x: 240, y: 110, r: 1,   color: "#FFFFFF", alpha: 0.38 },
        { type: "circle", x: 300, y: 75,  r: 1.5, color: c.g,      alpha: 0.42 },
        { type: "circle", x: 360, y: 100, r: 1,   color: c.ag,     alpha: 0.35 },
        { type: "circle", x: 90,  y: 140, r: 1,   color: "#FFFFFF", alpha: 0.3 },
        { type: "circle", x: 260, y: 160, r: 1.5, color: c.g,      alpha: 0.32 },
      ]},
      // 바닥 돌
      { speed: 0.37, yStart: 210, height: 22, elements: [
        { type: "circle", x: 55,  y: 8,  r: 7,  color: "#604870", alpha: 0.65 },
        { type: "circle", x: 58,  y: 4,  r: 4,  color: "#806888", alpha: 0.45 },
        { type: "circle", x: 60,  y: 2,  r: 2,  color: c.m,       alpha: 0.3 },
        { type: "circle", x: 165, y: 9,  r: 8,  color: "#604870", alpha: 0.55 },
        { type: "circle", x: 168, y: 5,  r: 3,  color: c.a,       alpha: 0.28 },
        { type: "circle", x: 275, y: 7,  r: 6,  color: "#604870", alpha: 0.62 },
        { type: "circle", x: 365, y: 8,  r: 7,  color: "#604870", alpha: 0.58 },
      ]},
    ],
  };
}

// ══════════════════════════════════════════════════════════════════
// CLIFF (Lv 7-9)
// ══════════════════════════════════════════════════════════════════
function cliffTheme(level: number): BackgroundTheme {
  const eve = level >= 9;
  const sky1 = eve ? "#FF9060" : "#90C8F0";
  const sky2 = eve ? "#C060A0" : "#D8EFFF";
  const seaTop = eve ? "#7090B8" : "#80C8E8";
  const seaMid = eve ? "#5878A0" : "#60B0D0";
  const seaBot = eve ? "#406080" : "#50A0C0";

  return {
    name: `cliff_${level}`,
    skyColors: [sky1, sky2],
    groundColor: "#BEA898", groundDetailColor: "#A89888",
    layers: [
      // 하늘 빛 그라디언트 밴드
      { speed: 0.01, yStart: 0, height: 120, elements: [
        { type: "rect", x: 0, y: 0,  w: 400, h: 40, color: eve ? "#FF6020" : "#FFE8C0", alpha: 0.18 },
        { type: "rect", x: 0, y: 40, w: 400, h: 40, color: eve ? "#D04080" : "#C0E8FF", alpha: 0.12 },
        { type: "rect", x: 0, y: 80, w: 400, h: 40, color: eve ? "#8020C0" : "#90C8FF", alpha: 0.08 },
        // 빛줄기
        { type: "triangle", x:0,y:0, color: eve?"#FF8040":"#FFFFC0", alpha:0.06, points:[150,0,100,120,200,0] },
        { type: "triangle", x:0,y:0, color: eve?"#FF8040":"#FFFFC0", alpha:0.04, points:[280,0,240,120,320,0] },
      ]},
      // 원경 절벽 실루엣
      { speed: 0.02, yStart: 80, height: 152, elements: [
        { type: "rect", x: 0,   y: 0, w: 80, h: 152, color: eve ? "#5A3828" : "#8090A0", alpha: 0.4 },
        { type: "rect", x: 310, y: 0, w: 90, h: 152, color: eve ? "#5A3828" : "#8090A0", alpha: 0.35 },
        { type: "rect", x: 80,  y: 20, w: 40, h: 132, color: eve ? "#4A2818" : "#6878A0", alpha: 0.3 },
        { type: "rect", x: 300, y: 30, w: 30, h: 122, color: eve ? "#4A2818" : "#6878A0", alpha: 0.28 },
      ]},
      // 구름
      { speed: 0.05, yStart: 10, height: 90, elements: [
        ...cloud(62,  28, 20),
        ...cloud(242, 42, 26),
        ...cloud(370, 16, 16),
      ]},
      // 바다 + 등대
      { speed: 0.025, yStart: 118, height: 114, elements: [
        { type: "rect", x: 0, y: 0,  w: 400, h: 114, color: seaTop },
        { type: "rect", x: 0, y: 38, w: 400, h: 76,  color: seaMid },
        { type: "rect", x: 0, y: 76, w: 400, h: 38,  color: seaBot, alpha: 0.6 },
        // 파도 줄기 (여러 겹)
        { type: "rect", x: 8,   y: 12, w: 48, h: 3, color: "#FFFFFF", alpha: 0.35 },
        { type: "rect", x: 10,  y: 14, w: 44, h: 1, color: "#FFFFFF", alpha: 0.2 },
        { type: "rect", x: 90,  y: 20, w: 40, h: 3, color: "#FFFFFF", alpha: 0.3 },
        { type: "rect", x: 170, y: 15, w: 52, h: 3, color: "#FFFFFF", alpha: 0.32 },
        { type: "rect", x: 255, y: 24, w: 42, h: 3, color: "#FFFFFF", alpha: 0.28 },
        { type: "rect", x: 335, y: 18, w: 48, h: 3, color: "#FFFFFF", alpha: 0.3 },
        { type: "rect", x: 50,  y: 46, w: 35, h: 2, color: "#FFFFFF", alpha: 0.2 },
        { type: "rect", x: 200, y: 50, w: 38, h: 2, color: "#FFFFFF", alpha: 0.18 },
        // 등대
        { type: "rect", x: 350, y: 38, w: 10, h: 40, color: "#EEE8E0", alpha: 0.7 },
        { type: "rect", x: 348, y: 35, w: 14, h: 6,  color: "#DDD8D0", alpha: 0.65 },
        { type: "rect", x: 352, y: 30, w: 6,  h: 7,  color: "#C8C0B8", alpha: 0.6 },
        { type: "circle", x: 355, y: 28, r: 6, color: eve ? "#FFB040" : "#FFEE80", alpha: 0.9 },
        { type: "circle", x: 355, y: 28, r: 12, color: eve ? "#FFB040" : "#FFEE80", alpha: 0.18 },
        { type: "circle", x: 355, y: 28, r: 20, color: eve ? "#FFB040" : "#FFEE80", alpha: 0.06 },
      ]},
      // 절벽 바닥 돌/풀
      { speed: 0.38, yStart: 204, height: 28, elements: [
        { type: "circle", x: 60,  y: 10, r: 10, color: "#B0A090" },
        { type: "circle", x: 65,  y: 5,  r: 5,  color: "#C8B8A8", alpha: 0.7 },
        { type: "circle", x: 70,  y: 2,  r: 3,  color: "#88A870", alpha: 0.55 },
        { type: "circle", x: 198, y: 12, r: 11, color: "#A89888" },
        { type: "circle", x: 204, y: 6,  r: 6,  color: "#C0B0A0", alpha: 0.65 },
        { type: "circle", x: 209, y: 2,  r: 3,  color: "#80A868", alpha: 0.5 },
        { type: "circle", x: 328, y: 9,  r: 9,  color: "#B0A090" },
        { type: "circle", x: 334, y: 4,  r: 4,  color: "#88A870", alpha: 0.5 },
      ]},
    ],
  };
}

// ══════════════════════════════════════════════════════════════════
// SKY (Lv 10)
// ══════════════════════════════════════════════════════════════════
function skyTheme(): BackgroundTheme {
  return {
    name: "sky",
    skyColors: ["#B8A0F0", "#EEE0FF"],
    groundColor: "#E0D0F8", groundDetailColor: "#C8B8E8",
    layers: [
      // 오로라 커튼
      { speed: 0.008, yStart: 0, height: 160, elements: [
        { type: "rect", x: 0,   y: 0, w: 60,  h: 160, color: "#40FF90", alpha: 0.06 },
        { type: "rect", x: 40,  y: 0, w: 50,  h: 140, color: "#40FFFF", alpha: 0.05 },
        { type: "rect", x: 100, y: 0, w: 70,  h: 160, color: "#8040FF", alpha: 0.07 },
        { type: "rect", x: 150, y: 0, w: 50,  h: 130, color: "#FF40C0", alpha: 0.05 },
        { type: "rect", x: 210, y: 0, w: 80,  h: 160, color: "#40C0FF", alpha: 0.06 },
        { type: "rect", x: 270, y: 0, w: 55,  h: 150, color: "#80FF40", alpha: 0.05 },
        { type: "rect", x: 320, y: 0, w: 80,  h: 160, color: "#FF8040", alpha: 0.04 },
        { type: "rect", x: 370, y: 0, w: 60,  h: 140, color: "#C040FF", alpha: 0.05 },
        // 오로라 빛 확산 (부드러운 glow)
        { type: "circle", x: 80,  y: 80, r: 90, color: "#40FF90", alpha: 0.04 },
        { type: "circle", x: 230, y: 70, r: 100, color: "#8040FF", alpha: 0.04 },
        { type: "circle", x: 360, y: 90, r: 80, color: "#40C0FF", alpha: 0.04 },
      ]},
      // 별 + 반짝임
      { speed: 0.012, yStart: 0, height: 120, elements: [
        { type: "circle", x: 32,  y: 10, r: 2,   color: "#FFFFFF", alpha: 0.9 },
        { type: "circle", x: 32,  y: 10, r: 4,   color: "#FFFFFF", alpha: 0.2 },
        { type: "circle", x: 88,  y: 36, r: 3,   color: "#FFE880", alpha: 0.8 },
        { type: "circle", x: 88,  y: 36, r: 6,   color: "#FFE880", alpha: 0.15 },
        { type: "circle", x: 155, y: 8,  r: 2,   color: "#E8D0FF", alpha: 0.95 },
        { type: "circle", x: 218, y: 26, r: 2.5, color: "#FFFFFF", alpha: 0.75 },
        { type: "circle", x: 218, y: 26, r: 5,   color: "#FFFFFF", alpha: 0.12 },
        { type: "circle", x: 288, y: 16, r: 3,   color: "#FFE880", alpha: 0.85 },
        { type: "circle", x: 288, y: 16, r: 6,   color: "#FFE880", alpha: 0.18 },
        { type: "circle", x: 350, y: 40, r: 2,   color: "#E8D0FF", alpha: 0.7 },
        { type: "circle", x: 62,  y: 55, r: 2,   color: "#FFFFFF", alpha: 0.65 },
        { type: "circle", x: 192, y: 64, r: 2.5, color: "#FFE880", alpha: 0.6 },
        { type: "circle", x: 318, y: 50, r: 2,   color: "#FFFFFF", alpha: 0.72 },
        { type: "circle", x: 128, y: 80, r: 2,   color: "#E8D0FF", alpha: 0.55 },
        { type: "circle", x: 268, y: 88, r: 2,   color: "#FFFFFF", alpha: 0.5 },
      ]},
      // 구름 바다
      { speed: 0.045, yStart: 142, height: 90, elements: [
        { type: "circle", x: 25,  y: 55, r: 42, color: "#F0E8FF", alpha: 0.65 },
        { type: "circle", x: 62,  y: 62, r: 48, color: "#E8E0FF", alpha: 0.55 },
        { type: "circle", x: 44,  y: 65, r: 32, color: "#F8F0FF", alpha: 0.4 },
        { type: "circle", x: 130, y: 58, r: 50, color: "#EEE8FF", alpha: 0.62 },
        { type: "circle", x: 172, y: 65, r: 38, color: "#E8E0FF", alpha: 0.5 },
        { type: "circle", x: 228, y: 56, r: 44, color: "#F0E8FF", alpha: 0.58 },
        { type: "circle", x: 305, y: 60, r: 48, color: "#E8E0FF", alpha: 0.55 },
        { type: "circle", x: 365, y: 58, r: 40, color: "#F0E8FF", alpha: 0.56 },
        // 구름 사이 빛
        { type: "circle", x: 95,  y: 70, r: 15, color: "#FFFFFF", alpha: 0.12 },
        { type: "circle", x: 200, y: 68, r: 18, color: "#FFFFFF", alpha: 0.1 },
        { type: "circle", x: 340, y: 72, r: 14, color: "#FFFFFF", alpha: 0.1 },
      ]},
      // 하늘 크리스탈 + 빛줄기
      { speed: 0.10, yStart: 110, height: 122, elements: [
        { type: "triangle", x:0,y:0, color: "#C8A8F0", alpha: 0.6,  points: [72,  122, 60,  72, 84,  122] },
        { type: "triangle", x:0,y:0, color: "#E0D0FF", alpha: 0.28, points: [72,  122, 66,  86, 76,  122] },
        { type: "circle", x: 68, y: 78, r: 3, color: "#FFFFFF", alpha: 0.95 },
        { type: "circle", x: 68, y: 78, r: 6, color: "#E8D8FF", alpha: 0.3 },

        { type: "triangle", x:0,y:0, color: "#A8C0F8", alpha: 0.55, points: [232, 122, 222, 80, 242, 122] },
        { type: "triangle", x:0,y:0, color: "#D8E4FF", alpha: 0.24, points: [232, 122, 226, 92, 236, 122] },
        { type: "circle", x: 228, y: 86, r: 3, color: "#FFFFFF", alpha: 0.9 },
        { type: "circle", x: 228, y: 86, r: 6, color: "#D8E8FF", alpha: 0.25 },

        { type: "triangle", x:0,y:0, color: "#F0C0E8", alpha: 0.5,  points: [352, 122, 344, 88, 360, 122] },
        { type: "circle", x: 348, y: 94, r: 2.5, color: "#FFFFFF", alpha: 0.88 },
        { type: "circle", x: 348, y: 94, r: 5,   color: "#F8E0FF", alpha: 0.22 },
      ]},
    ],
  };
}
