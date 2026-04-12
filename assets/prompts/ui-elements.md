# UI Element Prompts

공통 prefix:
```
Pixel art UI element, clean edges, pastel color palette,
cute mobile game style, no anti-aliasing, transparent background.
```

---

## 골드 아이콘

```
[공통 prefix]
Small gold coin icon, 16x16 pixels.
Shiny golden color with a "G" or pickaxe symbol engraved.
Subtle shine/sparkle on top-right corner (1 white pixel).
Colors: #FFD700 (main), #E0B840 (shadow), #FFF0A0 (highlight).
```

## 골드 카운터 배경

```
[공통 prefix]
Rounded rectangle UI panel for displaying gold count, 96x24 pixels.
Semi-transparent dark background with soft rounded corners.
Gold coin icon on the left side, space for numbers on the right.
Subtle inner shadow for depth. Clean and readable.
Colors: background rgba(0,0,0,0.5), border (#FFD700, 1px).
```

## EXP 프로그래스바

```
[공통 prefix]
Horizontal progress bar, 200x16 pixels.
Outer frame: dark rounded rectangle with subtle border.
Inner fill: gradient pastel blue (#5C9AE8 to #88B8F0), smooth left-to-right.
Tiny sparkle particles on the fill edge (current progress point).
Empty portion: darker shade (#2A2A3A).
Small "Lv.X" text area on the left side of the bar.
```

## 레벨업 이펙트

```
[공통 prefix]
Level up celebration effect sprite sheet, 64x64, 6 frames.
Frame 1: small golden ring appears around character
Frame 2: ring expands, tiny stars appear
Frame 3: bright flash (pastel yellow-white), "LEVEL UP" text pixels
Frame 4: stars burst outward, golden particles
Frame 5: particles scatter, text shines
Frame 6: particles fade, subtle golden glow remains

Colors: gold (#FFD700), white (#FFFFFF), pastel yellow (#FFF8D0).
```

## 광석/자원 아이콘 (레벨별)

```
[공통 prefix]
Small ore/mineral icons, 16x16 each, arranged in a row.
10 different ores matching each level:

1. Raw rock chunk - gray (#A0A0A0)
2. Copper ore - brown-orange (#C08040)
3. Tin ore - silver-gray (#B0B0B8)
4. Iron ore - dark silver (#8890A0)
5. Gold nugget - shiny gold (#FFD700)
6. Diamond - cyan crystal (#88D8E8)
7. Mithril ore - blue-silver glow (#A8C8E0)
8. Orihalcon ore - green crystal (#88D8A8)
9. Dragonbone crystal - red-orange (#F0A878)
10. Starlight fragment - purple-white glow (#D8C0F0)

Each ore should have a tiny sparkle pixel and look distinct from others.
```

## 숫자 폰트 (골드/EXP 표시용)

```
[공통 prefix]
Pixel art number font set, 0-9 plus comma and period.
Each character: 8x10 pixels, white with subtle shadow.
Clean, bold, easy to read on any background.
Style: rounded and friendly, not harsh or angular.
Include: 0 1 2 3 4 5 6 7 8 9 , .
```
