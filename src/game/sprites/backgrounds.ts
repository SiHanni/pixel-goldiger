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

// 나무 헬퍼 — 여러 원으로 자연스러운 나뭇잎
function tree(x: number, ty: number, sz: number, trunk: string, leaf1: string, leaf2: string, leaf3: string): LayerElement[] {
  const tw = Math.max(6, sz / 5);
  return [
    // 줄기 + 뿌리
    { type: "rect", x: x - tw/2, y: ty, w: tw, h: sz * 0.7, color: trunk },
    { type: "rect", x: x - tw/2 - 2, y: ty + sz * 0.6, w: tw + 4, h: 4, color: trunk, alpha: 0.5 },
    // 나뭇잎 겹겹이 (아래→위, 큰→작은)
    { type: "circle", x: x, y: ty - sz * 0.1, r: sz * 0.45, color: leaf1 },
    { type: "circle", x: x - sz * 0.2, y: ty - sz * 0.05, r: sz * 0.35, color: leaf2 },
    { type: "circle", x: x + sz * 0.2, y: ty - sz * 0.08, r: sz * 0.3, color: leaf2, alpha: 0.9 },
    { type: "circle", x: x, y: ty - sz * 0.25, r: sz * 0.38, color: leaf2 },
    { type: "circle", x: x - sz * 0.1, y: ty - sz * 0.35, r: sz * 0.28, color: leaf3 },
    { type: "circle", x: x + sz * 0.15, y: ty - sz * 0.3, r: sz * 0.2, color: leaf3, alpha: 0.8 },
  ];
}

function forestTheme(level: number): BackgroundTheme {
  const seasons = [
    { sky: ["#FFF2E8", "#D8EEFF"] as [string, string], l1: "#A8E098", l2: "#80CC68", l3: "#60B050", tk: "#9A7852", gnd: "#A0DD90", gndD: "#80C870", bush: "#78C868", f1: "#FFB8D0", f2: "#FFC8A0", f3: "#FFD8E8" },
    { sky: ["#D0F0FF", "#E8F8FF"] as [string, string], l1: "#70D060", l2: "#50B840", l3: "#40A030", tk: "#8A6848", gnd: "#80D868", gndD: "#60C048", bush: "#58B840", f1: "#90E878", f2: "#D0F050", f3: "#80D858" },
    { sky: ["#FFF0D0", "#FFE4B8"] as [string, string], l1: "#F0C850", l2: "#E0A830", l3: "#D09020", tk: "#8A6040", gnd: "#D8C878", gndD: "#C0B060", bush: "#C8A848", f1: "#F09838", f2: "#E87828", f3: "#F0B848" },
  ];
  const s = seasons[level - 1] ?? seasons[0];

  return {
    name: `forest_${level}`, skyColors: s.sky,
    groundColor: s.gnd, groundDetailColor: s.gndD,
    layers: [
      // 먼 산 + 구름
      { speed: 0.04, yStart: 60, height: 172, elements: [
        { type: "triangle", x: 0, y: 0, color: "#D0E0C8", alpha: 0.45, points: [50, 172, -30, 172, 120, 25] },
        { type: "triangle", x: 0, y: 0, color: "#C0D0B8", alpha: 0.4, points: [190, 172, 100, 172, 260, 40] },
        { type: "triangle", x: 0, y: 0, color: "#C8D8C0", alpha: 0.35, points: [330, 172, 260, 172, 400, 50] },
        // 산 위 눈
        { type: "triangle", x: 0, y: 0, color: "#FFFFFF", alpha: 0.25, points: [120, 40, 100, 60, 135, 55] },
        { type: "triangle", x: 0, y: 0, color: "#FFFFFF", alpha: 0.2, points: [260, 55, 240, 72, 275, 68] },
        // 구름
        { type: "circle", x: 65, y: 22, r: 20, color: "#FFFFFF", alpha: 0.55 },
        { type: "circle", x: 82, y: 18, r: 15, color: "#FFFFFF", alpha: 0.45 },
        { type: "circle", x: 55, y: 26, r: 12, color: "#FFFFFF", alpha: 0.35 },
        { type: "circle", x: 260, y: 32, r: 24, color: "#FFFFFF", alpha: 0.5 },
        { type: "circle", x: 280, y: 27, r: 18, color: "#FFFFFF", alpha: 0.4 },
        { type: "circle", x: 250, y: 36, r: 14, color: "#FFFFFF", alpha: 0.3 },
      ]},
      // 나무 레이어
      { speed: 0.18, yStart: 105, height: 127, elements: [
        ...tree(35, 85, 42, s.tk, s.l1, s.l2, s.l3),
        ...tree(130, 92, 34, s.tk, s.l1, s.l2, s.l3),
        ...tree(230, 88, 40, s.tk, s.l1, s.l2, s.l3),
        ...tree(340, 90, 36, s.tk, s.l1, s.l2, s.l3),
      ]},
      // 덤불 + 꽃 + 풀
      { speed: 0.42, yStart: 212, height: 20, elements: [
        // 덤불 (겹겹이 원)
        { type: "circle", x: 35, y: 10, r: 13, color: s.bush, alpha: 0.9 },
        { type: "circle", x: 40, y: 7, r: 9, color: s.gnd },
        { type: "circle", x: 46, y: 4, r: 5, color: s.l1, alpha: 0.7 },
        { type: "circle", x: 50, y: 3, r: 3, color: s.f1 },
        { type: "circle", x: 55, y: 5, r: 2, color: s.f2 },
        { type: "circle", x: 43, y: 2, r: 2, color: s.f3, alpha: 0.8 },

        { type: "circle", x: 150, y: 12, r: 11, color: s.bush, alpha: 0.85 },
        { type: "circle", x: 155, y: 8, r: 7, color: s.gnd },
        { type: "circle", x: 160, y: 4, r: 3, color: s.f2 },
        { type: "circle", x: 148, y: 5, r: 2, color: s.f1, alpha: 0.9 },

        { type: "circle", x: 260, y: 11, r: 14, color: s.bush, alpha: 0.9 },
        { type: "circle", x: 265, y: 7, r: 10, color: s.gnd },
        { type: "circle", x: 270, y: 3, r: 4, color: s.l1, alpha: 0.6 },
        { type: "circle", x: 275, y: 2, r: 3, color: s.f1 },
        { type: "circle", x: 258, y: 4, r: 2, color: s.f3 },

        { type: "circle", x: 370, y: 10, r: 10, color: s.bush, alpha: 0.85 },
        { type: "circle", x: 374, y: 7, r: 6, color: s.gnd },
        { type: "circle", x: 378, y: 3, r: 3, color: s.f2, alpha: 0.9 },
      ]},
    ],
  };
}

function caveTheme(level: number): BackgroundTheme {
  const cSets = [
    { m: "#A0E8F0", g: "#D0F8FF", a: "#F0B0D8", ag: "#D890C0" },
    { m: "#B8D0F8", g: "#E0ECFF", a: "#B8F0C0", ag: "#90D8A0" },
    { m: "#D0B0F0", g: "#F0E0FF", a: "#F0D890", ag: "#D8C070" },
  ];
  const c = cSets[level - 4] ?? cSets[0];

  // 크리스탈 헬퍼
  function crystal(x: number, h: number, col: string, glow: string): LayerElement[] {
    return [
      { type: "triangle", x: 0, y: 0, color: col, alpha: 0.85, points: [x, 155, x - h * 0.3, 155 - h * 0.1, x + h * 0.3, 155] },
      { type: "triangle", x: 0, y: 0, color: col, alpha: 0.8, points: [x, 155 - h, x - h * 0.2, 155, x + h * 0.2, 155] },
      { type: "triangle", x: 0, y: 0, color: glow, alpha: 0.35, points: [x - 1, 155 - h + 5, x - h * 0.15, 155 - 2, x + 2, 155 - 2] },
      { type: "circle", x: x - 2, y: 155 - h + 6, r: 2, color: "#FFFFFF", alpha: 0.9 },
    ];
  }

  return {
    name: `cave_${level}`,
    skyColors: ["#786898", "#9080A8"],
    groundColor: "#8878A0", groundDetailColor: "#786890",
    layers: [
      // 동굴 벽
      { speed: 0.05, yStart: 0, height: 232, elements: [
        // 종유석
        { type: "triangle", x: 0, y: 0, color: "#8878A0", alpha: 0.8, points: [40, 0, 30, 60, 50, 0] },
        { type: "triangle", x: 0, y: 0, color: "#9088A8", alpha: 0.6, points: [38, 0, 34, 35, 46, 0] },
        { type: "triangle", x: 0, y: 0, color: "#8878A0", alpha: 0.7, points: [130, 0, 122, 42, 138, 0] },
        { type: "triangle", x: 0, y: 0, color: "#8878A0", alpha: 0.8, points: [240, 0, 228, 55, 252, 0] },
        { type: "triangle", x: 0, y: 0, color: "#9088A8", alpha: 0.5, points: [237, 0, 233, 30, 247, 0] },
        { type: "triangle", x: 0, y: 0, color: "#8878A0", alpha: 0.7, points: [340, 0, 332, 38, 348, 0] },
        // 석순
        { type: "triangle", x: 0, y: 0, color: "#8878A0", alpha: 0.6, points: [85, 232, 75, 195, 95, 232] },
        { type: "triangle", x: 0, y: 0, color: "#9088A8", alpha: 0.4, points: [87, 232, 82, 208, 92, 232] },
        { type: "triangle", x: 0, y: 0, color: "#8878A0", alpha: 0.55, points: [290, 232, 282, 200, 298, 232] },
      ]},
      // 크리스탈
      { speed: 0.18, yStart: 77, height: 155, elements: [
        ...crystal(50, 50, c.m, c.g),
        ...crystal(160, 38, c.a, c.ag),
        ...crystal(280, 55, c.m, c.g),
        ...crystal(370, 32, c.a, c.ag),
        // 떠다니는 빛
        { type: "circle", x: 100, y: 120, r: 1.5, color: c.g, alpha: 0.5 },
        { type: "circle", x: 210, y: 100, r: 1.5, color: "#FFFFFF", alpha: 0.4 },
        { type: "circle", x: 320, y: 130, r: 1.5, color: c.g, alpha: 0.45 },
        { type: "circle", x: 140, y: 90, r: 1, color: "#FFFFFF", alpha: 0.35 },
      ]},
      // 바닥 돌
      { speed: 0.38, yStart: 218, height: 14, elements: [
        { type: "circle", x: 55, y: 6, r: 6, color: "#706888", alpha: 0.6 },
        { type: "circle", x: 58, y: 4, r: 3, color: "#807898", alpha: 0.4 },
        { type: "circle", x: 160, y: 8, r: 7, color: "#706888", alpha: 0.5 },
        { type: "circle", x: 270, y: 5, r: 5, color: "#706888", alpha: 0.6 },
        { type: "circle", x: 360, y: 7, r: 6, color: "#706888", alpha: 0.5 },
        { type: "circle", x: 110, y: 4, r: 2, color: c.m, alpha: 0.35 },
        { type: "circle", x: 320, y: 3, r: 2, color: c.a, alpha: 0.3 },
      ]},
    ],
  };
}

function cliffTheme(level: number): BackgroundTheme {
  const eve = level >= 9;
  return {
    name: `cliff_${level}`,
    skyColors: eve ? ["#FFD8B0", "#D0A0D8"] : ["#B8E0FF", "#E0F0FF"],
    groundColor: "#C8B8A8", groundDetailColor: "#B8A898",
    layers: [
      // 구름 (디테일)
      { speed: 0.06, yStart: 15, height: 85, elements: [
        { type: "circle", x: 55, y: 30, r: 22, color: "#FFFFFF", alpha: 0.55 },
        { type: "circle", x: 75, y: 25, r: 17, color: "#FFFFFF", alpha: 0.48 },
        { type: "circle", x: 65, y: 35, r: 13, color: "#FFFFFF", alpha: 0.38 },
        { type: "circle", x: 48, y: 33, r: 10, color: "#FFFFFF", alpha: 0.3 },
        { type: "circle", x: 235, y: 45, r: 26, color: "#FFFFFF", alpha: 0.5 },
        { type: "circle", x: 258, y: 40, r: 20, color: "#FFFFFF", alpha: 0.43 },
        { type: "circle", x: 248, y: 50, r: 15, color: "#FFFFFF", alpha: 0.33 },
        { type: "circle", x: 230, y: 48, r: 11, color: "#FFFFFF", alpha: 0.28 },
      ]},
      // 바다 + 등대
      { speed: 0.03, yStart: 120, height: 112, elements: [
        { type: "rect", x: 0, y: 0, w: 400, h: 112, color: eve ? "#80A8C8" : "#90D0E8" },
        { type: "rect", x: 0, y: 35, w: 400, h: 77, color: eve ? "#6890B0" : "#78C0D8" },
        { type: "rect", x: 0, y: 70, w: 400, h: 42, color: eve ? "#5878A0" : "#68B0C8", alpha: 0.5 },
        // 파도
        { type: "rect", x: 12, y: 10, w: 42, h: 2, color: "#FFFFFF", alpha: 0.3 },
        { type: "rect", x: 85, y: 18, w: 35, h: 2, color: "#FFFFFF", alpha: 0.25 },
        { type: "rect", x: 160, y: 13, w: 48, h: 2, color: "#FFFFFF", alpha: 0.3 },
        { type: "rect", x: 250, y: 22, w: 38, h: 2, color: "#FFFFFF", alpha: 0.25 },
        { type: "rect", x: 330, y: 16, w: 44, h: 2, color: "#FFFFFF", alpha: 0.28 },
        // 등대
        { type: "rect", x: 348, y: 38, w: 8, h: 35, color: "#E8E0D8", alpha: 0.55 },
        { type: "rect", x: 346, y: 35, w: 12, h: 5, color: "#D8D0C8", alpha: 0.5 },
        { type: "circle", x: 352, y: 33, r: 5, color: eve ? "#FFE080" : "#FFE880", alpha: 0.7 },
        { type: "circle", x: 352, y: 33, r: 8, color: eve ? "#FFE080" : "#FFE880", alpha: 0.2 },
      ]},
      // 절벽 돌/풀
      { speed: 0.4, yStart: 216, height: 16, elements: [
        { type: "circle", x: 65, y: 8, r: 8, color: "#B0A090" },
        { type: "circle", x: 70, y: 5, r: 4, color: "#C0B0A0", alpha: 0.7 },
        { type: "circle", x: 75, y: 3, r: 3, color: "#90B080", alpha: 0.5 },
        { type: "circle", x: 195, y: 10, r: 9, color: "#A89888" },
        { type: "circle", x: 200, y: 6, r: 5, color: "#B8A898", alpha: 0.6 },
        { type: "circle", x: 205, y: 3, r: 3, color: "#88A878", alpha: 0.5 },
        { type: "circle", x: 325, y: 7, r: 7, color: "#B0A090" },
        { type: "circle", x: 330, y: 4, r: 3, color: "#90B080", alpha: 0.5 },
      ]},
    ],
  };
}

function skyTheme(): BackgroundTheme {
  return {
    name: "sky",
    skyColors: ["#D8C0F8", "#F0E0FF"],
    groundColor: "#E8D8F0", groundDetailColor: "#D8C8E0",
    layers: [
      // 별
      { speed: 0.015, yStart: 0, height: 110, elements: [
        { type: "circle", x: 35, y: 12, r: 2, color: "#FFFFFF", alpha: 0.85 },
        { type: "circle", x: 38, y: 12, r: 1, color: "#FFFFFF", alpha: 0.4 },
        { type: "circle", x: 95, y: 38, r: 3, color: "#FFE880", alpha: 0.75 },
        { type: "circle", x: 98, y: 36, r: 1, color: "#FFFFFF", alpha: 0.3 },
        { type: "circle", x: 165, y: 10, r: 2, color: "#E8D8FF", alpha: 0.9 },
        { type: "circle", x: 225, y: 28, r: 2, color: "#FFFFFF", alpha: 0.7 },
        { type: "circle", x: 295, y: 18, r: 3, color: "#FFE880", alpha: 0.8 },
        { type: "circle", x: 355, y: 42, r: 2, color: "#E8D8FF", alpha: 0.65 },
        { type: "circle", x: 65, y: 58, r: 2, color: "#FFFFFF", alpha: 0.6 },
        { type: "circle", x: 195, y: 68, r: 2, color: "#FFE880", alpha: 0.55 },
        { type: "circle", x: 325, y: 52, r: 2, color: "#FFFFFF", alpha: 0.7 },
      ]},
      // 구름 바다
      { speed: 0.05, yStart: 150, height: 82, elements: [
        { type: "circle", x: 25, y: 45, r: 38, color: "#F0E8FF", alpha: 0.6 },
        { type: "circle", x: 65, y: 52, r: 42, color: "#E8E0F8", alpha: 0.5 },
        { type: "circle", x: 45, y: 55, r: 30, color: "#F8F0FF", alpha: 0.35 },
        { type: "circle", x: 135, y: 48, r: 45, color: "#F0E8FF", alpha: 0.58 },
        { type: "circle", x: 175, y: 55, r: 35, color: "#E8E0F8", alpha: 0.45 },
        { type: "circle", x: 235, y: 46, r: 40, color: "#F0E8FF", alpha: 0.55 },
        { type: "circle", x: 310, y: 50, r: 44, color: "#E8E0F8", alpha: 0.5 },
        { type: "circle", x: 370, y: 48, r: 36, color: "#F0E8FF", alpha: 0.52 },
      ]},
      // 크리스탈 + 빛줄기
      { speed: 0.12, yStart: 120, height: 112, elements: [
        { type: "triangle", x: 0, y: 0, color: "#D8C0F0", alpha: 0.55, points: [75, 112, 63, 68, 87, 112] },
        { type: "triangle", x: 0, y: 0, color: "#E8D8FF", alpha: 0.25, points: [75, 112, 68, 80, 78, 112] },
        { type: "circle", x: 71, y: 74, r: 2, color: "#FFFFFF", alpha: 0.9 },
        { type: "triangle", x: 0, y: 0, color: "#C8D0F8", alpha: 0.5, points: [235, 112, 225, 78, 245, 112] },
        { type: "triangle", x: 0, y: 0, color: "#E0E8FF", alpha: 0.22, points: [235, 112, 229, 88, 238, 112] },
        { type: "circle", x: 231, y: 84, r: 2, color: "#FFFFFF", alpha: 0.85 },
        { type: "triangle", x: 0, y: 0, color: "#F0D0E8", alpha: 0.45, points: [355, 112, 347, 85, 363, 112] },
        { type: "circle", x: 352, y: 90, r: 2, color: "#FFFFFF", alpha: 0.8 },
      ]},
    ],
  };
}
