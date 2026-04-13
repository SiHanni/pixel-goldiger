import { P } from "./palette";

type SpriteData = string[];
type ColorMap = Record<string, string>;

const W = 26;
function p(s: string): string { return s.padEnd(W, "."); }

// ── 심볼 ─────────────────────────────────────────────────────────
// .=투명  O=아웃라인(진한)  o=아웃라인(부드러운)
// H=머리카락HL  h=머리카락미드  k=머리카락딥
// S=피부HL  s=피부미드  d=피부딥
// E=눈(큰, 2칸 사용)  R=눈반사  p=볼블러시  m=입
// B=상의HL  b=상의미드  c=상의딥
// G=벨트  g=벨트딥
// L=하의HL  l=하의미드  j=하의딥
// F=발HL  f=발미드
// Q=곡괭이날HL  q=곡괭이날미드  u=곡괭이날딥
// a=자루HL  z=자루딥
// A=모자HL  V=모자미드  X=모자딥
// C=왕관금  D=왕관보석

// ══════════════════════════════════════════════════════════════════
// 얼굴 디자인 원칙:
//  - 머리 9칸 넓이 (몸 6칸보다 훨씬 넓음 → 치비)
//  - 눈 = EE (2칸 = 6px) 두 개, 사이 1칸 공백
//  - 볼 블러시 p
//  - 단순한 입 m 1칸
// ══════════════════════════════════════════════════════════════════

// Lv1-3: 맨머리 (갈색 단발) — 6행 (머리:몸 = 6:8)
const HEAD: SpriteData = [
  p("....OkhhhhkO......."),   // 정수리 (좁게 → 돔 느낌)
  p("...OkHHSSHHkO......"),   // 머리카락+앞머리
  p("...OhSERsERdO......"),   // 눈 (R=흰 반짝 → 눈 더 선명)
  p("...OhSpSSSpdO......"),   // 볼블러시
  p("...OhSSSmSSOO......"),   // 입
  p("....OdSSSdO........"),   // 턱
];

// Lv4-6: 광부 헬멧 (노란 헬멧) — 6행
const HEAD_HELMET: SpriteData = [
  p("...OXVVVVVXoO......"),   // 헬멧 (살짝 좁은 돔)
  p("..OXhHSSSShdXO....."),   // 이마
  p("...OhSERsERdO......"),   // 눈 (R=흰 반짝 → 눈 더 선명)
  p("...OhSpSSSpdO......"),   // 볼블러시
  p("...OhSSSmSSdO......"),   // 입
  p("....OdSSSdO........"),   // 턱
];

// Lv7-8: 황금 투구 — 6행
const HEAD_GOLDHELM: SpriteData = [
  p("...OXVVVVVVXoO....."),   // 투구 (살짝 좁은 돔)
  p("..OXhHSSSShdXO....."),   // 이마
  p("...OhSERsERdO......"),   // 눈 (R=흰 반짝 → 눈 더 선명)
  p("...OhSpSSSpdO......"),   // 볼
  p("...OhSSSmSSdO......"),   // 입
  p("....OdSSSdO........"),   // 턱
];

// Lv9-10: 왕관 (보석 박힌 금 왕관) — 7행 (왕관 날 보존)
const HEAD_CROWN: SpriteData = [
  p("..OCDC.CDC.CDCO...."),   // 왕관 날 (C=금, D=보석)
  p("..OCCCCCCCCCCO....."),   // 왕관 띠
  p("..OChHSSSShdCO....."),   // 이마
  p("...OhSERsERdO......"),   // 눈 (R=흰 반짝 → 눈 더 선명)
  p("...OhSpSSSpdO......"),   // 볼
  p("...OhSSSmSSdO......"),   // 입
  p("....OdSSSdO........"),   // 턱
];

// ══════════════════════════════════════════════════════════════════
// 곡괭이 — 레벨별 3단계 크기로 레벨 표현
// q=날어두운  Q=날밝은  u=날끝하이라이트
// a=자루밝은  z=자루어두운  s=손(피부색)
// ══════════════════════════════════════════════════════════════════

// Lv2-3: 돌/구리 — 작은 곡괭이 (블레이드 3칸)
const PICK_SMALL_A: SpriteData = [
  p("...........OqquO..."),
  p("..........OQqsaO..."),   // s=손(피부)
  p("...........OsazO..."),
  p("............OzO...."),
];
const PICK_SMALL_B: SpriteData = [
  p("............OqquO.."),
  p("...........OQqsaO.."),
  p("............OsazO.."),
  p(".............OzO..."),
];

// Lv4-6: 철/강철/금 — 중형 곡괭이 (블레이드 4칸)
const PICK_MED_A: SpriteData = [
  p("..........OqquuO..."),
  p(".........OQQqsaO..."),   // s=손
  p("..........OQsazO..."),
  p("...........OsazO..."),
];
const PICK_MED_B: SpriteData = [
  p("...........OqquuO.."),
  p("..........OQQqsaO.."),
  p("...........OQsazO.."),
  p("............OsazO.."),
];

// Lv7-10: 미스릴~별빛 — 대형 곡괭이 (블레이드 6칸, 존재감 압도)
const PICK_LARGE_A: SpriteData = [
  p(".........OqqquuuO.."),   // 블레이드 6칸
  p(".........OQQQqsaO.."),   // s=손
  p("..........OQsazO..."),
  p("...........OsazO..."),
];
const PICK_LARGE_B: SpriteData = [
  p("..........OqqquuuO."),
  p("..........OQQQqsaO."),
  p("...........OQsazO.."),
  p("............OsazO.."),
];

// 채굴 올리기용 (양손 머리 위)
const PICK_UP: SpriteData = [
  p("....OuuqQQQQQO....."),   // 날 (수평)
  p("....OuqQQQQQQO....."),   // 날 하단
  p(".........sOazOs...."),   // 양손(s) 자루 잡기
  p(".........sOazOs...."),   // 자루
];
const PICK_UP_LARGE: SpriteData = [
  p("...OuuuqQQQQQQO...."),   // 대형 날
  p("...OuuqQQQQQQQO...."),   // 날 하단
  p(".........sOaazOs..."),   // 양손(s) 굵은 자루
  p("..........sOazOs..."),   // 자루
];

function getPick(level: number, frame: 0|1|2|3): SpriteData {
  if (level < 2) return [p(""), p(""), p(""), p("")];
  const isA = frame % 2 === 0;
  if (level <= 3) return isA ? PICK_SMALL_A : PICK_SMALL_B;
  if (level <= 6) return isA ? PICK_MED_A   : PICK_MED_B;
  return isA ? PICK_LARGE_A : PICK_LARGE_B;
}

// ══════════════════════════════════════════════════════════════════
// 달리기 4프레임
// ══════════════════════════════════════════════════════════════════
function makeRun(head: SpriteData, frame: 0|1|2|3, level: number): SpriteData {
  const pick = getPick(level, frame);
  // 레벨 2 이상이면 어깨에 팔(SO=피부+아웃라인) 표시
  // 어깨를 1px 넓게 (O at 4,11) → 어깨>가슴>허리 테이퍼 실루엣
  const sh = level >= 2
    ? p("....OcbBBbcOSO.....") // 어깨 (넓게) + 팔 보임
    : p("....OcbBBbcO.........");

  const bodies: SpriteData[] = [
    // frame 0: 오른발 앞
    [
      sh,
      p(".....ObBBBbO......."),  // 가슴
      p(".....ObBGgbO......."),  // 벨트
      p("......OcBBcO......."),  // 허리
      p("......OcLlcO......."),   // 힙 (좁게 → 허리 라인)
      p(".....OLLljO.OljO..."),  // 허벅지
      p("....OlLO....OjO...."),  // 정강이
      p(".....OfFO....OfO..."),  // 발
    ],
    // frame 1: 중간
    [
      sh,
      p(".....ObBBBbO......."),
      p(".....ObBGgbO......."),
      p("......OcBBcO......."),
      p("......OcLlcO......."),   // 힙 (좁게 → 허리 라인)
      p(".....OLLlljO......."),
      p("....OlLO.OljO......"),
      p(".....OfFO.OFfO....."),
    ],
    // frame 2: 왼발 앞
    [
      sh,
      p(".....ObBBBbO......."),
      p(".....ObBGgbO......."),
      p("......OcBBcO......."),
      p("......OcLlcO......."),   // 힙 (좁게 → 허리 라인)
      p(".....OLlO.OLlO....."),
      p("....OljO...OlO....."),
      p(".....OfO...OfFO...."),
    ],
    // frame 3: 중간 반대 (frame1 좌우 미러)
    [
      sh,
      p(".....ObBBBbO......."),
      p(".....ObBGgbO......."),
      p("......OcBBcO......."),
      p("......OcLlcO......."),
      p(".....OLlljO......."),   // 허벅지 모임
      p("....OljO.OlLO......"),  // 왼쪽 구부러짐, 오른쪽 펴짐
      p(".....OFfO.OfFO....."),  // 발
    ],
  ];

  return [...pick, ...head, ...bodies[frame]];
}

// ══════════════════════════════════════════════════════════════════
// 채굴 올리기 — 곡괭이 머리 위로
// ══════════════════════════════════════════════════════════════════
function makeMineUp(head: SpriteData, level: number): SpriteData {
  const pu = level >= 7 ? PICK_UP_LARGE : PICK_UP;
  return [
    ...pu,
    ...head,
    p(".....OcbBBbcO......"),   // 어깨
    p(".....ObBBBbO......"),    // 가슴
    p(".....ObBGgbO......"),    // 벨트
    p("......OcBBcO......"),    // 허리
    p("......OcLlcO......"),    // 힙 (좁게)
    p(".....OLLlljO......."),   // 허벅지
    p("....OlLO.OljO......"),   // 정강이
    p(".....OfFO.OFfO....."),   // 발
  ];
}

// ══════════════════════════════════════════════════════════════════
// 채굴 내리기 — 곡괭이를 앞으로 내리침
// ══════════════════════════════════════════════════════════════════
function makeMineDown(head: SpriteData, level: number): SpriteData {
  // 대형 곡괭이(lv7+)는 날이 더 길고 위에 위치
  const blade = level >= 7
    ? [
        p(".................."),
        ...head,
        p(".....OcbBBbcO......"),
        p(".....ObBBBbO......"),
        p(".....ObBGgbO.OazO.."),
        p("......OcBBcO.OQaazO"),
        p("......OcLlcO.OqquuO"),   // 힙 (좁게) + 대형 날
        p(".....OLLlljO.uqqqO."),
        p("....OlLO.OljO......"),
        p(".....OfFO.OFfO....."),
      ]
    : [
        p(".................."),
        ...head,
        p(".....OcbBBbcO......"),
        p(".....ObBBBbO......"),
        p(".....ObBGgbO.OazO.."),
        p("......OcBBcO.OQazO."),
        p("......OcLlcO.OqquO."),   // 힙 (좁게) + 날
        p(".....OLLlljO.uqqO.."),
        p("....OlLO.OljO......"),
        p(".....OfFO.OFfO....."),
      ];
  return blade;
}

// ══════════════════════════════════════════════════════════════════
// 아이들
// ══════════════════════════════════════════════════════════════════
function makeIdle(head: SpriteData): SpriteData {
  return [
    p(".................."),
    ...head,
    p(".....OcbBbcO......."),
    p(".....ObBBBbO......."),
    p(".....ObBGgbO......."),
    p("......OcBBcO......."),
    p("......OcLlcO......."),   // 힙 (좁게)
    p(".....OLLlljO......."),
    p("....OlLO.OlO......."),
    p(".....OfFO.OfFO....."),
  ];
}

// ══════════════════════════════════════════════════════════════════
// 색상 맵
// ══════════════════════════════════════════════════════════════════
function getColorMap(level: number): ColorMap {
  const base: ColorMap = {
    ".": "transparent", "": "transparent",
    O: "#180C08",   // 진한 아웃라인
    o: "#3A2820",   // 부드러운 아웃라인
    // 피부
    S: "#FFE0C0", s: "#F0C098", d: "#C87850",
    // 얼굴 디테일
    E: "#201010",   // 눈 (큰 어두운 사각형)
    R: "#FFFFFF",   // 눈 반사
    p: "#FFAAAA",   // 볼블러시
    m: "#C05050",   // 입 (빨간 입술 느낌)
    // 자루
    a: "#C8A060", z: "#7A5020",
  };

  // 머리카락 색상 (레벨별)
  const hairs: Record<number, { H: string; h: string; k: string }> = {
    1:  { H: "#FFD060", h: "#C09030", k: "#805010" },
    2:  { H: "#FFD060", h: "#C09030", k: "#805010" },
    3:  { H: "#D0C0B0", h: "#A09080", k: "#606060" },
    4:  { H: "#C09030", h: "#906010", k: "#503808" },
    5:  { H: "#C09030", h: "#906010", k: "#503808" },
    6:  { H: "#80E8FF", h: "#30A8E0", k: "#105880" },
    7:  { H: "#FFE840", h: "#D0A000", k: "#805000" },
    8:  { H: "#FF9060", h: "#D04020", k: "#701010" },
    9:  { H: "#E0C0FF", h: "#9850E0", k: "#501898" },
    10: { H: "#FFFFFF", h: "#D0C0FF", k: "#9070E0" },
  };

  type Equip = {
    Q: string; q: string; u: string;   // 곡괭이 날
    B: string; b: string; c: string;   // 상의
    G: string; g: string;              // 벨트
    L: string; l: string; j: string;   // 하의
    F: string; f: string;              // 발
    A: string; V: string; X: string;   // 모자
    C: string; D: string;              // 왕관
  };

  const equips: Record<number, Equip> = {
    1: { // 돌 곡괭이 + 누더기
      Q:"#D0C8C0", q:"#A0A098", u:"#606060",
      B:"#C8B898", b:"#A09070", c:"#706050",
      G:"#888060", g:"#504030",
      L:"#A09070", l:"#706040", j:"#403020",
      F:"#604030", f:"#806050",
      A:"#C8B898", V:"#A09070", X:"#706050", C:"#C8B898", D:"#C8B898",
    },
    2: { // 구리 곡괭이 + 낡은 옷
      Q:"#F0C080", q:"#C07030", u:"#804010",
      B:"#D0C0A0", b:"#B0A070", c:"#807050",
      G:"#988050", g:"#604030",
      L:"#A89060", l:"#806040", j:"#503820",
      F:"#604028", f:"#805048",
      A:"#D0C0A0", V:"#B0A070", X:"#807050", C:"#D0C0A0", D:"#D0C0A0",
    },
    3: { // 철 곡괭이 + 흰 셔츠+청바지
      Q:"#E8EEF8", q:"#A0B0C8", u:"#507090",
      B:"#F8F4EC", b:"#D0C8B8", c:"#A8A090",
      G:"#A09080", g:"#706860",
      L:"#7EB8E0", l:"#4890C8", j:"#286898",
      F:"#304858", f:"#508078",
      A:"#E8E0D0", V:"#C0B8A8", X:"#907868", C:"#E8E0D0", D:"#E8E0D0",
    },
    4: { // 강철 곡괭이 + 광부복(파랑)
      Q:"#D8E8F8", q:"#90B8D8", u:"#406890",
      B:"#70B8F0", b:"#4090D0", c:"#186898",
      G:"#F0C840", g:"#C09010",
      L:"#3878B8", l:"#186898", j:"#0C4878",
      F:"#284058", f:"#406878",
      A:"#FFE040", V:"#D0A810", X:"#A07808", C:"#FFE040", D:"#FFE040",
    },
    5: { // 금 곡괭이 + 강화 광부복
      Q:"#FFFF80", q:"#FFD700", u:"#A07800",
      B:"#58A8E8", b:"#3080C8", c:"#086898",
      G:"#FFD700", g:"#C09000",
      L:"#205888", l:"#0C4878", j:"#083060",
      F:"#203848", f:"#405868",
      A:"#FFD700", V:"#D0A000", X:"#907000", C:"#FFD700", D:"#FFD700",
    },
    6: { // 다이아 곡괭이 + 하늘색 갑옷
      Q:"#D8F8FF", q:"#60D0F0", u:"#1890B0",
      B:"#40C8FF", b:"#1898D8", c:"#086090",
      G:"#80F0FF", g:"#30C0E0",
      L:"#1068A0", l:"#085888", j:"#043868",
      F:"#183848", f:"#306878",
      A:"#90F0FF", V:"#50D0F0", X:"#1898C0", C:"#90F0FF", D:"#90F0FF",
    },
    7: { // 미스릴 + 황금 갑옷
      Q:"#C8E0FF", q:"#80B0F0", u:"#2860A8",
      B:"#FFE050", b:"#D0A010", c:"#907000",
      G:"#FFFFFF", g:"#E0D070",
      L:"#C8A010", l:"#A07800", j:"#705000",
      F:"#705800", f:"#A08010",
      A:"#FFE878", V:"#D0B030", X:"#A08000", C:"#FFE878", D:"#FF6030",
    },
    8: { // 오리하르콘 + 드래곤 갑옷 (빨강)
      Q:"#B0FFD0", q:"#40D080", u:"#009050",
      B:"#FF4010", b:"#C02000", c:"#800808",
      G:"#FF8030", g:"#D04000",
      L:"#C01808", l:"#880408", j:"#500008",
      F:"#400008", f:"#700010",
      A:"#FF5020", V:"#D02808", X:"#900808", C:"#FF5020", D:"#FF5020",
    },
    9: { // 드래곤본 + 왕가 로브
      Q:"#FFD8A0", q:"#F07030", u:"#A02800",
      B:"#C890FF", b:"#8050D8", c:"#5020A8",
      G:"#FFD700", g:"#C09000",
      L:"#8050C8", l:"#5020A0", j:"#301870",
      F:"#481080", f:"#702898",
      A:"#FFD700", V:"#D0A000", X:"#907000", C:"#FFD700", D:"#FF2050",
    },
    10: { // 별빛 + 별빛 로브
      Q:"#FFFFFF", q:"#E0C8FF", u:"#8050D0",
      B:"#F0E8FF", b:"#C098F8", c:"#8858D8",
      G:"#FFE870", g:"#D0B800",
      L:"#C098F0", l:"#8858C8", j:"#5838A0",
      F:"#6838A8", f:"#8858C8",
      A:"#FFE870", V:"#D0B000", X:"#907000", C:"#FFE870", D:"#90E8FF",
    },
  };

  const hair  = hairs[level]  ?? hairs[1];
  const equip = equips[level] ?? equips[1];
  return { ...base, ...hair, ...equip } as ColorMap;
}

function getHead(level: number): SpriteData {
  if (level >= 9) return HEAD_CROWN;
  if (level >= 7) return HEAD_GOLDHELM;
  if (level >= 4) return HEAD_HELMET;
  return HEAD;
}

export interface CharacterSpriteSet {
  idle: SpriteData;
  run: SpriteData[];
  mineUp: SpriteData;
  mineDown: SpriteData;
  colorMap: ColorMap;
}

export function getCharacterSpriteSet(level: number): CharacterSpriteSet {
  const head = getHead(level);
  return {
    idle:     makeIdle(head),
    run:      ([0, 1, 2, 3] as const).map(f => makeRun(head, f, level)),
    mineUp:   makeMineUp(head, level),
    mineDown: makeMineDown(head, level),
    colorMap: getColorMap(level),
  };
}

// ══════════════════════════════════════════════════════════════════
// 광석 스프라이트 — 각진 돌 형태 (타원 → 바위)
// 핵심: 평평한 윗면, 수직에 가까운 측면, 비대칭 아랫면
// ══════════════════════════════════════════════════════════════════

// 금광석: 각진 바위 + 사선 금맥
const goldOre = {
  data: [
    "......OOOOOO.......",   // 평평한 윗면 (6칸)
    ".....OrrRRRrO......",   // 윗 모서리
    "....OqrRwRRRrO.....",   // 하이라이트, 우측 확장
    "....OqrRRRRRrqO....",  // 넓은 몸통 시작 (양쪽 수직)
    "....OqrRGGRRrqO....",  // 금맥 1 (수직 측면 유지)
    "....OqrGGwGGRrqO...",  // 금맥 중심 + 하이라이트
    "....OqrRGGRRrqO....",  // 금맥 2 (수직 측면 유지)
    "...OOqrRRRRrqO.....",  // 좌측 돌출! (바위 느낌)
    "....OqrRRRrOO......",  // 우측 돌출! (비대칭 바위)
    ".....OOrRrO........",  // 불규칙 하단
    "......OOOOO........",  // 평평한 밑면
  ],
  colors: {
    ".": "transparent",
    O: "#302010",
    w: "#FFFF80",  // 금 하이라이트
    R: "#B0A898",  // 돌 밝은
    r: "#808070",  // 돌 중간
    q: "#484038",  // 돌 어두운
    G: "#FFD700",  // 금맥
  },
};

// 돌: 각진 회색 바위
const rockOre = {
  data: [
    "......OOOOOO.......",   // 평평한 윗면
    ".....OrrRRRrO......",
    "....OqrRwRRRrO.....",   // 하이라이트
    "....OqrRRwRRrqO....",  // 깊은 곳 하이라이트
    "....OqrRRRRRrqO....",  // 수직 측면
    "....OqrwRRRwRrqO...",  // 크랙 느낌 하이라이트
    "....OqrRRwRRrqO....",  // 수직 측면
    "...OOqrRRRRrqO.....",  // 좌측 돌출!
    "....OqrRRwrOO......",  // 우측 돌출!
    ".....OOrRrO........",
    "......OOOOO........",
  ],
  colors: {
    ".": "transparent",
    O: "#282018",
    w: "#D8D4CC",  // 하이라이트
    R: "#B0A898",
    r: "#808070",
    q: "#484038",
  },
};

// 다이아몬드 광석: 각진 바위 + 결정체
const diamondOre = {
  data: [
    "......OOOOOO.......",
    ".....OrrRRRrO......",
    "....OqrRwRDDrO.....",   // 다이아 결정 등장
    "....OqrRDDdRrqO....",  // 결정 확장
    "....OqrwDDDdrqO....",  // 결정 중심
    "....OqrDDwDDRrqO...",  // 결정 하이라이트
    "....OqrRDDdRrqO....",  // 결정 하단
    "...OOqrRRDRrqO.....",  // 좌측 돌출!
    "....OqrRRRrOO......",  // 우측 돌출!
    ".....OOrRrO........",
    "......OOOOO........",
  ],
  colors: {
    ".": "transparent",
    O: "#001828",
    w: "#E0FAFF",  // 다이아 하이라이트
    R: "#B0A898", r: "#808070", q: "#484038",
    D: "#50D8F8",  // 다이아
    d: "#0898C0",  // 다이아 그림자
  },
};

// 별 광석: 각진 바위 + 별빛 결정
const starOre = {
  data: [
    "......OOOOOO.......",
    ".....OrrRRRrO......",
    "....OqrRwRSSrO.....",   // 별 결정 등장
    "....OqrRSsssRrqO...",  // = 4+12+3=19 ✓
    "....OqrwSSsSrqO....",  // 결정 중심
    "....OqrSSWSsRrqO...",  // W=별빛 하이라이트
    "....OqrRSSsRrqO....",  // 결정 하단
    "...OOqrRRSSrqO.....",  // 좌측 돌출!
    "....OqrRRRrOO......",  // 우측 돌출!
    ".....OOrRrO........",
    "......OOOOO........",
  ],
  colors: {
    ".": "transparent",
    O: "#180028",
    w: "#FFFFFF",  // 별 하이라이트
    W: "#FFFFC0",  // 강한 별빛
    R: "#B0A898", r: "#808070", q: "#484038",
    S: "#D0A8FF",  // 별 밝은
    s: "#8030D0",  // 별 어두운
  },
};

export const ORE_SPRITES: Record<string, { data: string[]; colors: Record<string, string> }> = {
  gold: goldOre, rock: rockOre, diamond: diamondOre, star: starOre,
};

export function getOreForLevel(level: number): { data: string[]; colors: Record<string, string> } {
  if (level <= 3) return ORE_SPRITES.rock;
  if (level <= 6) return ORE_SPRITES.gold;
  if (level <= 9) return ORE_SPRITES.diamond;
  return ORE_SPRITES.star;
}
