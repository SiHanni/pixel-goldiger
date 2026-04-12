// 하얀 강아지 펫 — 고퀄 (14x12)
// O=외곽선 w=흰털 c=크림그림자 k=크림어두운 E=눈 n=코 t=혀
// p=귀안쪽(핑크) q=배(밝은크림) i=볼(핑크)

export const PET_FRAMES: Record<string, string[]> = {
  idle1: [
    "..............",
    "..Owp...pwO...",
    ".OwwwwwwwwwO..",
    ".OwwEwiwEwwO..",
    ".OwwwwnwwwwO..",
    "..OwwwwwwwO...",
    "..OcwqqqwcO...",
    "..OckqqqkcO...",
    "...OkcccO.....",
    "..Okc...ckO...",
    "..OO.....OO...",
    "..............",
  ],
  idle2: [
    "..............",
    "..Owp...pwO...",
    ".OwwwwwwwwwO..",
    ".Oww_wiw_wwO..",
    ".OwwwwnwwwwO..",
    "..OwwwtewwO...",
    "..OcwqqqwcO...",
    "..OckqqqkcO.w.",
    "...OkcccO.....",
    "..Okc...ckO...",
    "..OO.....OO...",
    "..............",
  ],
  walk1: [
    "..............",
    "..Owp...pwO...",
    ".OwwwwwwwwwO..",
    ".OwwEwiwEwwO..",
    ".OwwwwnwwwwO..",
    "..OwwwwwwwO...",
    "..OcwqqqwcO...",
    "..OckqqqkcO...",
    "...OkcccO.....",
    "..kc..Okc.ckO.",
    "..OO..OO..OO..",
    "..............",
  ],
  walk2: [
    "..............",
    "..Owp...pwO...",
    ".OwwwwwwwwwO..",
    ".OwwEwiwEwwO..",
    ".OwwwwnwwwwO..",
    "..OwwwwwwwO...",
    "..OcwqqqwcO...",
    "..OckqqqkcO...",
    "...OkcccO.....",
    "...Okc..ckO...",
    "...OO....OO...",
    "..............",
  ],
  happy1: [
    "..............",
    "..Owp...pwO...",
    ".OwwwwwwwwwO..",
    ".OwwEwiwEwwO..",
    ".OwwwwnwwwwO..",
    "..OwwwtewwO...",
    "..OcwqqqwcO...",
    "..OckqqqkcO...",
    "...OkcccO.....",
    "..Okc...ckO...",
    "..OO.....OO...",
    "..............",
  ],
  happy2: [
    "..............",
    ".Owwp...pwwO..",
    ".OwwwwwwwwwO..",
    ".OwwEwiwEwwO..",
    ".OwwwwnwwwwO..",
    "..OwwwtewwO...",
    "...OwqqqwO....",
    "...OkcccO.....",
    "..............",
    "..............",
    "..............",
    "..............",
  ],
};

export const PET_COLOR_MAP: Record<string, string> = {
  ".": "transparent",
  O: "#1a1020",      // 외곽선
  w: "#FFFFFF",      // 흰 털
  c: "#F0E8E0",      // 크림 그림자
  k: "#E0D8D0",      // 크림 어두운
  q: "#FFF8F0",      // 배 (밝은 크림)
  E: "#1a1020",      // 눈
  _: "#E8E0D8",      // 감은 눈
  n: "#383030",      // 코
  t: "#F0A0A0",      // 혀
  e: "#F0A0A0",      // 혀/볼
  p: "#FFD0D0",      // 귀 안쪽 (핑크)
  i: "#FFB8B8",      // 볼 블러시
};
