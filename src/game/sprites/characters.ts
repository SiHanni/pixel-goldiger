import { P } from "./palette";

type SpriteData = string[];
type ColorMap = Record<string, string>;

const W = 28;
function p(s: string): string { return s.padEnd(W, "."); }

// 고퀄 캐릭터 스프라이트 (18행 × 28열)
// O=외곽선 h=머리밝은 H=머리어두운 s=피부 S=피부밝은 d=피부그림자
// e=눈 p=볼블러시 n=코하이라이트 m=입
// B=상의 b=상의어두운 W=상의하이라이트
// L=하의 l=하의어두운 F=신발 f=신발하이라이트
// T=도구머리 t=도구자루 v=도구하이라이트
// A=모자/액세서리 C=왕관 c=왕관보석 G=헬멧

function run1(hasTool: boolean): SpriteData {
  const top = hasTool ? [
    p("..............tO............"),
    p(".............tvO............"),
    p("............tTTO............"),
  ] : [p(""), p(""), p("")];
  return [...top,
    p("........OhhhHO.............."),
    p(".......OhhhhhhHO............"),
    p("......OhhhhhhhHhO..........."),
    p("......OhOSspSOhHO..........."),
    p("......OdSennSdsO............"),
    p(".......OdsmssdO............."),
    p("........OssssO.............."),
    p("........OWBBO..............."),
    p(".......OWBBBBbO............."),
    p("......OBBBBBBBbO............"),
    p("......OBBBbBBBbO............"),
    p(".......OBBBBBO.............."),
    p("......OLLdOlLLO............."),
    p("......OlLO..OlLO............"),
    p(".......OfF....OfO.........."),
  ].map(p);
}

function run2(hasTool: boolean): SpriteData {
  const top = hasTool ? [
    p("..............tO............"),
    p(".............tvO............"),
    p("............tTTO............"),
  ] : [p(""), p(""), p("")];
  return [...top,
    p("........OhhhHO.............."),
    p(".......OhhhhhhHO............"),
    p("......OhhhhhhhHhO..........."),
    p("......OhOSspSOhHO..........."),
    p("......OdSennSdsO............"),
    p(".......OdsmssdO............."),
    p("........OssssO.............."),
    p("........OWBBO..............."),
    p(".......OWBBBBbO............."),
    p("......OBBBBBBBbO............"),
    p("......OBBBbBBBbO............"),
    p(".......OBBBBBO.............."),
    p(".......OLLdLlO.............."),
    p("......OlLO.OlLO............."),
    p("......OfF...OfFO............"),
  ].map(p);
}

function run3(hasTool: boolean): SpriteData {
  const top = hasTool ? [
    p("..............tO............"),
    p(".............tvO............"),
    p("............tTTO............"),
  ] : [p(""), p(""), p("")];
  return [...top,
    p("........OhhhHO.............."),
    p(".......OhhhhhhHO............"),
    p("......OhhhhhhhHhO..........."),
    p("......OhOSspSOhHO..........."),
    p("......OdSennSdsO............"),
    p(".......OdsmssdO............."),
    p("........OssssO.............."),
    p("........OWBBO..............."),
    p(".......OWBBBBbO............."),
    p("......OBBBBBBBbO............"),
    p("......OBBBbBBBbO............"),
    p(".......OBBBBBO.............."),
    p(".......OLLdLlO.............."),
    p("......OlLO..OlLO............"),
    p(".......OfF...OfO............"),
  ].map(p);
}

function mineUp(): SpriteData {
  return [
    p("...............OvTvO........"),
    p("..............OvTTTvO......."),
    p("........OhhhHOOtTTO........."),
    p(".......OhhhhhhHOtO..........."),
    p("......OhhhhhhhHhO............"),
    p("......OhOSspSOhHO............"),
    p("......OdSennSdsO............"),
    p(".......OdsmssdO............."),
    p("........OssssO.............."),
    p("........OWBBO..............."),
    p(".......OWBBBBddsO............"),
    p("......OBBBBBBBbO............"),
    p("......OBBBbBBBbO............"),
    p(".......OBBBBBO.............."),
    p(".......OLLdLlO.............."),
    p("......OlLO.OlLO............."),
    p("......OfF...OfFO............"),
    p("..........................."),
  ].map(p);
}

function mineDown(): SpriteData {
  return [
    p("..........................."),
    p("........OhhhHO.............."),
    p(".......OhhhhhhHO............"),
    p("......OhhhhhhhHhO..........."),
    p("......OhOSspSOhHO..........."),
    p("......OdSennSdsO............"),
    p(".......OdsmssdO............."),
    p("........OssssO.............."),
    p("........OWBBO..............."),
    p(".......OWBBBBddsO............"),
    p("......OBBBBBBBbO.OtO......."),
    p("......OBBBbBBBbO.OtO......."),
    p(".......OBBBBBO..OtvO......."),
    p(".......OLLdLlO.OtTTO......."),
    p("......OlLO.OlLOOvTTvO......"),
    p("......OfF...OfOOvTTvO......"),
    p("..........................."),
    p("..........................."),
  ].map(p);
}

function idle(): SpriteData {
  return [
    p("..........................."),
    p("........OhhhHO.............."),
    p(".......OhhhhhhHO............"),
    p("......OhhhhhhhHhO..........."),
    p("......OhOSspSOhHO..........."),
    p("......OdSennSdsO............"),
    p(".......OdsmssdO............."),
    p("........OssssO.............."),
    p("........OWBBO..............."),
    p(".......OWBBBBbO............."),
    p("......OBBBBBBBbO............"),
    p("......OBBBbBBBbO............"),
    p(".......OBBBBBO.............."),
    p(".......OLLdLlO.............."),
    p("......OlLO.OlLO............."),
    p("......OfF...OfFO............"),
    p("..........................."),
    p("..........................."),
  ].map(p);
}

function getColorMap(level: number): ColorMap {
  const base: ColorMap = {
    ".": "transparent",
    "": "transparent",
    " ": "transparent",
    O: "#1a1020",       // 외곽선
    s: P.SKIN_MID,      // 피부
    S: "#FFE0C8",       // 피부 하이라이트
    d: P.SKIN_DARK,     // 피부 그림자
    e: "#1a1020",       // 눈
    p: "#FF9898",       // 볼 블러시
    n: "#FFE8D0",       // 코 하이라이트
    m: "#D8A080",       // 입/턱
    t: "#7A5838",       // 도구 자루
    v: "#9A7858",       // 도구 자루 하이라이트
  };

  const tools: Record<number, Partial<ColorMap>> = {
    1:  { T: P.STONE_LIGHT },
    2:  { T: P.WOOD_LIGHT },
    3:  { T: P.STONE_DARK },
    4:  { T: P.IRON_LIGHT },
    5:  { T: "#FFE040" },     // 금 곡괭이 (밝게)
    6:  { T: "#98E8F8" },     // 다이아 (밝게)
    7:  { T: "#B8D8F0" },     // 미스릴
    8:  { T: "#98E0B8" },     // 오리하르콘
    9:  { T: "#F8B888" },     // 드래곤본
    10: { T: "#E8D0FF" },     // 별빛
  };

  const bodies: Record<number, Partial<ColorMap>> = {
    1:  { h: "#9A7850", H: "#7A5838", B: "#B89870", b: "#987848", W: "#C8A880", L: "#987848", l: "#806838", F: "#A08060", f: "#B89878" },
    2:  { h: "#9A7850", H: "#7A5838", B: "#B89870", b: "#987848", W: "#C8A880", L: "#987848", l: "#806838", F: "#A08060", f: "#B89878" },
    3:  { h: "#9A7850", H: "#7A5838", B: "#C8A882", b: "#A08860", W: "#D8B898", L: "#A08860", l: "#887048", F: "#8B6543", f: "#A07858" },
    4:  { h: "#8A6840", H: "#6A4828", B: "#F0ECE4", b: "#D8D0C4", W: "#FFFFFF", L: "#8A7A6A", l: "#6A5A4A", F: "#8B6543", f: "#A07858" },
    5:  { h: "#8A6840", H: "#6A4828", B: "#F0ECE4", b: "#D8D0C4", W: "#FFFFFF", L: "#8A7A6A", l: "#6A5A4A", F: "#8B6543", f: "#A07858" },
    6:  { h: "#8A6840", H: "#6A4828", B: "#88C0E0", b: "#5898C0", W: "#A0D0F0", L: "#6AA0C8", l: "#4880A8", F: "#506878", f: "#688898" },
    7:  { h: "#483828", H: "#302018", B: "#C09068", b: "#987048", W: "#D0A078", L: "#786050", l: "#604838", F: "#604838", f: "#786050" },
    8:  { h: "#483828", H: "#302018", B: "#F0C878", b: "#D0A858", W: "#FFD888", L: "#D0A858", l: "#B89040", F: "#605040", f: "#786858" },
    9:  { h: "#483828", H: "#302018", B: "#F0C860", b: "#D0A840", W: "#FFE080", L: "#C89830", l: "#A87820", F: "#B89030", f: "#D0A848" },
    10: { h: "#281830", H: "#180820", B: "#C8A8E8", b: "#A888C8", W: "#D8C0F0", L: "#A888C8", l: "#8868A8", F: "#8868A8", f: "#A888C8" },
  };

  const bc = bodies[level] ?? bodies[1];
  const tc = tools[level] ?? tools[1];
  return { ...base, ...bc, ...tc } as ColorMap;
}

export interface CharacterSpriteSet {
  idle: SpriteData;
  run: SpriteData[];
  mineUp: SpriteData;
  mineDown: SpriteData;
  colorMap: ColorMap;
}

export function getCharacterSpriteSet(level: number): CharacterSpriteSet {
  const hasTool = level >= 2;
  return {
    idle: idle(),
    run: [run1(hasTool), run2(hasTool), run3(hasTool)],
    mineUp: mineUp(),
    mineDown: mineDown(),
    colorMap: getColorMap(level),
  };
}

// 광석 — 회색 돌에 금맥/보석, 질감 디테일 강화 (16x13)
// R=돌밝은 r=돌중간 q=돌어두운 w=돌하이라이트 G=금/보석밝은 g=금/보석어두운
export const ORE_SPRITES: Record<string, { data: SpriteData; colors: ColorMap }> = {
  rock: {
    data: [
      ".....OOOOO......",
      "...OOqrRRrOO....",
      "..OqrRRwRRRrO...",
      ".OqrRRrRRGRRqO..",
      ".ORRrqRRGgRRRO..",
      "OqRRwRRRRRrqRRO.",
      "OrRRGRRwRRRRRqO.",
      "ORRGgRRrqRRGRRO.",
      "OqRRRRwRRRGgRqO.",
      ".ORRrqRRRwRRRO..",
      ".OqRRRRRrRRRqO..",
      "..OqqRRRRRqqO...",
      "...OOOOOOOO.....",
    ],
    colors: { ".": "transparent", O: "#2a2028", q: "#686058", r: "#888078", R: "#A8A098", w: "#C8C0B8", G: "#F0D050", g: "#C8A830" },
  },
  gold_ore: {
    data: [
      ".....OOOOO......",
      "...OOqrRRrOO....",
      "..OqrGGwRRRrO...",
      ".OqrGgRRRGGRqO..",
      ".ORRrRRRGgGRRO..",
      "OqRGGRwRRRRqRRO.",
      "OrGgGRRwRGGRRqO.",
      "ORRrRRRqGgGRRRO.",
      "OqRRGGwRRRRGRqO.",
      ".ORRGgrRRRGgRO..",
      ".OqRRRRRrRRRqO..",
      "..OqqRRRRRqqO...",
      "...OOOOOOOO.....",
    ],
    colors: { ".": "transparent", O: "#2a2028", q: "#686058", r: "#888078", R: "#A8A098", w: "#D0C8C0", G: "#FFD700", g: "#D8B020" },
  },
  diamond_ore: {
    data: [
      ".....OOOOO......",
      "...OOqrRRrOO....",
      "..OqrRRwRDDrO...",
      ".OqrRDDRRdDRqO..",
      ".ORRrdDRRwRRRO..",
      "OqRRwRRRDDRqRRO.",
      "OrRDDRRwdDRRRqO.",
      "ORRdDRRrqRRDDRO.",
      "OqRRRRwRRRRdDqO.",
      ".ORRrqRDDRRRRO..",
      ".OqRRRRdDRRRqO..",
      "..OqqRRRRRqqO...",
      "...OOOOOOOO.....",
    ],
    colors: { ".": "transparent", O: "#2a2028", q: "#686058", r: "#888078", R: "#A8A098", w: "#C8C0B8", D: "#A8F0FF", d: "#78D0E0" },
  },
  star_ore: {
    data: [
      ".....OOOOO......",
      "...OOqrRRrOO....",
      "..OqrSSRwRRrO...",
      ".OqrsSsRRSSRqO..",
      ".ORRrRRRsSRRRO..",
      "OqRSSRwRRRRqRRO.",
      "OrRsSRRwRSSRRqO.",
      "ORRrRRRqsSRSRRO.",
      "OqRRSSRwRRRsRqO.",
      ".ORRsSrRSSRRRO..",
      ".OqRRRRRsSRRqO..",
      "..OqqRRRRRqqO...",
      "...OOOOOOOO.....",
    ],
    colors: { ".": "transparent", O: "#2a2028", q: "#686058", r: "#888078", R: "#A8A098", w: "#C8C0B8", S: "#E8D8FF", s: "#C0A8E0" },
  },
};

export function getOreForLevel(level: number): { data: SpriteData; colors: ColorMap } {
  if (level <= 3) return ORE_SPRITES.rock;
  if (level <= 6) return ORE_SPRITES.gold_ore;
  if (level <= 9) return ORE_SPRITES.diamond_ore;
  return ORE_SPRITES.star_ore;
}
