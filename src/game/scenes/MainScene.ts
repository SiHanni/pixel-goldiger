import Phaser from "phaser";
import { GAME_CONFIG, LEVEL_DATA } from "../config";
import {
  GameState, loadState, saveState, mine, getMineInterval,
} from "../state";
import { getCharacterSpriteSet, getOreForLevel } from "../sprites/characters";
import { PET_FRAMES, PET_COLOR_MAP } from "../sprites/pet";
import { getBackgroundTheme, BackgroundTheme } from "../sprites/backgrounds";
import { registerPixelTexture } from "../sprites/renderer";

const SC = 3;
const PET_SC = 2;       // 18×16 스프라이트에 맞게 조정
const ORE_SC = 3;
const CHAR_X = 110;
const GROUND_Y = 220;   // 캐릭터 키가 커져서 위로 조정
const GW = GAME_CONFIG.GAME_WIDTH;
const GH = GAME_CONFIG.GAME_HEIGHT;

type Phase = "running" | "mining";

export class MainScene extends Phaser.Scene {
  private gs!: GameState;
  private phase: Phase = "running";
  private spd = 1.8;
  private sx = 0;

  private skyG!: Phaser.GameObjects.Graphics;
  private mtnG!: Phaser.GameObjects.Graphics;  // 픽셀 산
  private gndG!: Phaser.GameObjects.Graphics;
  private lyG: Phaser.GameObjects.Graphics[] = [];
  private pxG!: Phaser.GameObjects.Graphics;
  private amG!: Phaser.GameObjects.Graphics;
  private bg!: BackgroundTheme;

  private chr!: Phaser.GameObjects.Image;
  private pet!: Phaser.GameObjects.Image;
  private ore!: Phaser.GameObjects.Image;

  private rf = 0; private rt = 0;
  private pf = 0; private pt = 0;
  private mp = 0; private mt = 0;
  private ox = 0; private oh = 0;

  private px: Array<{
    x: number; y: number; vx: number; vy: number;
    l: number; ml: number; c: number; s: number;
    gravity?: number;  // 개별 중력 (기본 0.08)
    spin?: number;     // 회전 오프셋
  }> = [];
  private shakeAmp = 0;  // 화면 흔들림

  private am: Array<{ x: number; y: number; sp: number; sz: number; a: number; ph: number }> = [];
  private uiCb?: (s: GameState) => void;

  // 인게임 골드 UI
  private goldInGameText!: Phaser.GameObjects.Text;
  private lvInGameText!: Phaser.GameObjects.Text;

  constructor() { super({ key: "MainScene" }); }
  setUICallback(cb: (s: GameState) => void) { this.uiCb = cb; }

  create(): void {
    this.gs = loadState();
    this.bg = getBackgroundTheme(this.gs.level);

    this.skyG = this.add.graphics().setDepth(0);
    this.mtnG = this.add.graphics().setDepth(0.5);
    this.gndG = this.add.graphics().setDepth(1);
    this.lyG = this.bg.layers.map((_, i) => this.add.graphics().setDepth(2 + i));
    this.amG = this.add.graphics().setDepth(15);
    this.pxG = this.add.graphics().setDepth(20);

    this.drawSky();
    this.drawPixelMountains();
    this.drawGnd();

    // ★ 모든 레벨 텍스처 미리 생성 (한 번만)
    this.pregenAllTextures();
    this.initAm();

    const lv = this.gs.level;
    this.chr = this.add.image(CHAR_X, GROUND_Y + 3, `c${lv}_r0`).setDepth(10).setOrigin(0.5, 1);
    this.pet = this.add.image(CHAR_X - 46, GROUND_Y + 10, "pet_idle1").setDepth(9).setOrigin(0.5, 1);
    this.ore = this.add.image(0, GROUND_Y, `ore_${this.oreKey()}`).setDepth(8).setOrigin(0.5, 1);
    this.spawnOre();

    // ★ 인게임 골드 UI (12시 방향, 상단 중앙)
    const panelG = this.add.graphics().setDepth(50);
    panelG.fillStyle(0x000000, 0.35);
    panelG.fillRoundedRect(GW / 2 - 65, 8, 130, 30, 10);

    // 골드 코인 아이콘
    const coinG = this.add.graphics().setDepth(51);
    coinG.fillStyle(0xFFD700);
    coinG.fillCircle(GW / 2 - 42, 23, 9);
    coinG.fillStyle(0xE0B840);
    coinG.fillCircle(GW / 2 - 42, 23, 6);
    coinG.fillStyle(0xFFD700);
    coinG.fillCircle(GW / 2 - 42, 23, 3);

    this.goldInGameText = this.add.text(GW / 2 + 5, 23, "0", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#FFD700",
      fontStyle: "bold",
      stroke: "#1a1020",
      strokeThickness: 2,
    }).setOrigin(0.5, 0.5).setDepth(51);

    // 레벨 뱃지 (좌측 상단)
    const lvPanel = this.add.graphics().setDepth(50);
    lvPanel.fillStyle(0x000000, 0.3);
    lvPanel.fillRoundedRect(8, 8, 50, 22, 8);

    this.lvInGameText = this.add.text(33, 19, `Lv.${this.gs.level}`, {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#FFFFFF",
      fontStyle: "bold",
      stroke: "#1a1020",
      strokeThickness: 2,
    }).setOrigin(0.5, 0.5).setDepth(51);

    this.updateInGameUI();

    this.input.on("pointerdown", () => {
      if (this.phase === "mining") this.hit();
      else { this.spd = 5; this.time.delayedCall(350, () => { this.spd = 1.8; }); }
    });

    this.time.addEvent({ delay: 5000, callback: () => saveState(this.gs), loop: true });
    this.phase = "running";
    this.uiCb?.({ ...this.gs }); this.updateInGameUI();
  }

  private updateInGameUI(): void {
    if (this.goldInGameText) {
      const g = this.gs.gold;
      this.goldInGameText.setText(
        g >= 1_000_000 ? `${(g / 1_000_000).toFixed(1)}M`
        : g >= 1_000 ? `${(g / 1_000).toFixed(1)}K`
        : g.toString()
      );
    }
    if (this.lvInGameText) {
      this.lvInGameText.setText(`Lv.${this.gs.level}`);
    }
  }

  private oreKey(): string {
    return "gold"; // 항상 금광석
  }

  // ★ 핵심: 모든 텍스처를 create() 시점에 한번만 생성
  private pregenAllTextures(): void {
    for (let lv = 1; lv <= GAME_CONFIG.MAX_LEVEL; lv++) {
      const cs = getCharacterSpriteSet(lv);
      registerPixelTexture(this, `c${lv}_idle`, cs.idle, cs.colorMap, SC);
      cs.run.forEach((f, i) => registerPixelTexture(this, `c${lv}_r${i}`, f, cs.colorMap, SC));
      registerPixelTexture(this, `c${lv}_mu`, cs.mineUp, cs.colorMap, SC);
      registerPixelTexture(this, `c${lv}_md`, cs.mineDown, cs.colorMap, SC);
    }
    for (const [k, f] of Object.entries(PET_FRAMES)) {
      registerPixelTexture(this, `pet_${k}`, f, PET_COLOR_MAP, PET_SC);
    }
    for (const [name, ore] of Object.entries({
      rock:    getOreForLevel(1),
      gold:    getOreForLevel(4),
      diamond: getOreForLevel(7),
      star:    getOreForLevel(10),
    })) {
      registerPixelTexture(this, `ore_${name}`, ore.data, ore.colors, ORE_SC);
    }
  }

  private drawSky(): void {
    const g = this.skyG; g.clear();
    const c1 = Phaser.Display.Color.HexStringToColor(this.bg.skyColors[0]);
    const c2 = Phaser.Display.Color.HexStringToColor(this.bg.skyColors[1]);
    for (let y = 0; y < GROUND_Y; y++) {
      const t = y / GROUND_Y;
      g.fillStyle(Phaser.Display.Color.GetColor(
        Phaser.Math.Linear(c1.red, c2.red, t),
        Phaser.Math.Linear(c1.green, c2.green, t),
        Phaser.Math.Linear(c1.blue, c2.blue, t),
      ));
      g.fillRect(0, y, GW, 1);
    }
  }

  // 픽셀 아트 산: 4px 컬럼으로 계단식 실루엣 그리기
  private drawPixelMountains(): void {
    const g = this.mtnG; g.clear();
    const lv = this.gs?.level ?? 1;
    const COL = 4; // 픽셀 블록 크기

    // 산 프로필: [x위치, 높이(px)] 포인트 배열
    // 포인트 사이는 선형 보간 → 계단식 처리
    type MtnProfile = { points: [number,number][]; color: string; alpha: number };

    const profiles: MtnProfile[] = [];

    if (lv <= 3) {
      // 숲: 원경 산 3개 (그린 계열)
      profiles.push({
        color: "#8AAA78", alpha: 0.55,
        points: [
          [0,40],[20,55],[40,80],[60,100],[80,120],[100,140],[120,150],[140,140],
          [160,120],[180,100],[200,80],[220,60],[240,40],[260,20],[280,40],[300,60],
          [320,80],[340,100],[360,80],[380,50],[400,30],
        ],
      });
      profiles.push({
        color: "#A8C890", alpha: 0.45,
        points: [
          [0,20],[40,30],[80,60],[120,90],[160,110],[200,90],[240,60],[280,30],[320,50],[360,30],[400,10],
        ],
      });
      profiles.push({
        color: "#C8DDB8", alpha: 0.3,
        points: [
          [0,10],[60,20],[120,40],[160,55],[200,40],[240,20],[280,35],[340,20],[400,5],
        ],
      });
    } else if (lv <= 6) {
      // 동굴: 들쑥날쑥한 날카로운 산 (보라/어두운)
      profiles.push({
        color: "#4A3860", alpha: 0.75,
        points: [
          [0,60],[15,100],[20,130],[25,100],[45,60],[50,90],[55,140],[60,160],[65,140],
          [70,90],[85,60],[90,110],[95,150],[100,170],[105,150],[110,110],[125,70],
          [130,100],[135,140],[140,110],[155,70],[160,120],[165,160],[170,180],
          [175,160],[180,120],[195,70],[200,110],[205,150],[210,110],[225,70],
          [230,100],[235,130],[240,100],[255,70],[260,110],[265,145],[270,170],
          [275,145],[280,110],[295,70],[300,100],[305,140],[310,100],[325,70],
          [330,110],[335,150],[340,180],[345,150],[350,110],[365,70],[370,100],
          [375,130],[380,100],[395,60],[400,40],
        ],
      });
      profiles.push({
        color: "#6A5880", alpha: 0.4,
        points: [
          [0,40],[40,70],[60,100],[80,70],[120,40],[140,70],[160,100],[180,70],
          [220,40],[240,70],[260,100],[280,70],[320,40],[340,70],[360,100],[400,40],
        ],
      });
    } else if (lv <= 9) {
      // 절벽: 수직 절벽 + 바위
      profiles.push({
        color: "#706050", alpha: 0.65,
        points: [
          [0,80],[10,85],[20,110],[30,130],[40,160],[45,165],[55,160],[65,130],
          [75,110],[80,85],[90,80],[100,90],[110,120],[120,150],[130,180],[135,185],
          [145,180],[155,150],[165,120],[175,90],[185,80],[195,95],[205,130],
          [215,160],[225,180],[230,185],[240,180],[250,160],[260,130],[270,95],
          [280,80],[290,90],[300,120],[310,150],[320,180],[325,185],[335,180],
          [345,150],[355,120],[365,90],[375,80],[385,70],[400,60],
        ],
      });
      profiles.push({
        color: "#908878", alpha: 0.35,
        points: [
          [0,40],[50,60],[100,80],[150,60],[200,40],[250,60],[300,80],[350,60],[400,40],
        ],
      });
    } else {
      // 하늘: 구름 봉우리 (부드럽고 하얀)
      profiles.push({
        color: "#E0D8F8", alpha: 0.5,
        points: [
          [0,30],[20,50],[40,70],[60,90],[80,110],[100,90],[120,70],[140,50],
          [160,30],[180,50],[200,80],[220,100],[240,120],[260,100],[280,80],
          [300,50],[320,30],[340,50],[360,80],[380,60],[400,30],
        ],
      });
      profiles.push({
        color: "#F0E8FF", alpha: 0.35,
        points: [
          [0,15],[60,30],[120,50],[180,30],[240,15],[300,30],[360,50],[400,20],
        ],
      });
    }

    // 각 프로필 렌더링 (계단식 픽셀 블록)
    for (const prof of profiles) {
      const pts = prof.points;
      const col = Phaser.Display.Color.HexStringToColor(prof.color);
      g.fillStyle(col.color, prof.alpha);

      for (let x = 0; x <= GW; x += COL) {
        // 이 x에서의 높이 보간
        let h = 0;
        for (let i = 0; i < pts.length - 1; i++) {
          const [x0, h0] = pts[i];
          const [x1, h1] = pts[i + 1];
          if (x >= x0 && x <= x1) {
            const t = (x - x0) / (x1 - x0);
            h = h0 + (h1 - h0) * t;
            break;
          }
        }
        if (h > 2) {
          // 계단 효과: COL 단위로 반올림
          const stepH = Math.round(h / COL) * COL;
          g.fillRect(x, GROUND_Y - stepH, COL, stepH);
        }
      }

      // 산 상단 하이라이트 (윗면 1px 밝게)
      const hcol = Phaser.Display.Color.HexStringToColor(prof.color);
      g.fillStyle(Phaser.Display.Color.GetColor(
        Math.min(255, hcol.red + 40),
        Math.min(255, hcol.green + 40),
        Math.min(255, hcol.blue + 40),
      ), prof.alpha * 0.6);
      for (let x = 0; x <= GW; x += COL) {
        let h = 0;
        for (let i = 0; i < pts.length - 1; i++) {
          const [x0, h0] = pts[i];
          const [x1, h1] = pts[i + 1];
          if (x >= x0 && x <= x1) {
            h = h0 + (h1 - h0) * (x - x0) / (x1 - x0);
            break;
          }
        }
        if (h > 2) {
          const stepH = Math.round(h / COL) * COL;
          g.fillRect(x, GROUND_Y - stepH, COL, COL); // 상단 1블록 밝게
        }
      }
    }
  }

  private drawGnd(): void {
    const g = this.gndG; g.clear();
    const gc = Phaser.Display.Color.HexStringToColor(this.bg.groundColor);
    const dc = Phaser.Display.Color.HexStringToColor(this.bg.groundDetailColor);
    const groundH = GH - GROUND_Y;
    const lv = this.gs?.level ?? 1;

    // ── 땅 메인 ──
    g.fillStyle(gc.color);
    g.fillRect(0, GROUND_Y, GW, groundH);

    // ── 원근 그라디언트 ──
    for (let y = 0; y < groundH; y++) {
      const darkness = (y / groundH) * 0.15;
      g.fillStyle(0x000000, darkness);
      g.fillRect(0, GROUND_Y + y, GW, 1);
    }

    // ── 경계선 하이라이트 ──
    g.fillStyle(0xFFFFFF, 0.18);
    g.fillRect(0, GROUND_Y, GW, 1);
    g.fillStyle(dc.color, 0.75);
    g.fillRect(0, GROUND_Y + 1, GW, 2);

    if (lv <= 3) {
      // 숲: 풀잎 삐죽삐죽 (3색)
      const gc2 = Phaser.Display.Color.HexStringToColor(this.bg.groundDetailColor);
      const lightGrass = Phaser.Display.Color.GetColor(
        Math.min(255, gc2.red   + 30),
        Math.min(255, gc2.green + 40),
        gc2.blue,
      );
      for (let x = 0; x < GW; x += 5) {
        const h = 3 + (x * 13 % 5);
        const col = (x % 15 < 5) ? lightGrass : gc.color;
        g.fillStyle(col, 0.9);
        g.fillRect(x,     GROUND_Y - h,     2, h);
        g.fillRect(x + 3, GROUND_Y - h + 2, 2, h - 2);
      }
      // 꽃 점
      g.fillStyle(0xFFB8D0, 0.7);
      for (let x = 18; x < GW; x += 55) g.fillRect(x, GROUND_Y - 4, 2, 2);
      g.fillStyle(0xFFFF80, 0.65);
      for (let x = 36; x < GW; x += 70) g.fillRect(x, GROUND_Y - 5, 2, 2);

    } else if (lv <= 6) {
      // 동굴: 바위 질감
      g.fillStyle(dc.color, 0.35);
      for (let x = 0; x < GW; x += 18) {
        g.fillRect(x,      GROUND_Y + 5,  8, 2);
        g.fillRect(x + 9,  GROUND_Y + 12, 6, 2);
        g.fillRect(x + 4,  GROUND_Y + 20, 7, 2);
      }
      // 크리스탈 빛 점
      g.fillStyle(0x80D8F0, 0.2);
      for (let x = 12; x < GW; x += 48) g.fillRect(x, GROUND_Y + 3, 3, 3);

    } else if (lv <= 9) {
      // 절벽: 모래/흙 텍스처
      g.fillStyle(dc.color, 0.28);
      for (let x = 0; x < GW; x += 12) {
        g.fillRect(x,     GROUND_Y + 4,  5, 1);
        g.fillRect(x + 6, GROUND_Y + 10, 4, 1);
        g.fillRect(x + 2, GROUND_Y + 18, 6, 1);
      }
      // 조약돌
      g.fillStyle(0xA89880, 0.5);
      for (let x = 8; x < GW; x += 62) {
        g.fillRect(x,   GROUND_Y + 7, 5, 3);
        g.fillRect(x+2, GROUND_Y + 6, 3, 5);
      }

    } else {
      // 하늘: 구름 바닥 (반짝이는 하얀 선)
      g.fillStyle(0xFFFFFF, 0.12);
      g.fillRect(0, GROUND_Y, GW, groundH);
      g.fillStyle(0xE8D8FF, 0.4);
      for (let x = 0; x < GW; x += 20) {
        const h = 2 + (x * 7 % 4);
        g.fillRect(x,      GROUND_Y - h,     3, h);
        g.fillRect(x + 12, GROUND_Y - h + 1, 2, h - 1);
      }
      // 별가루
      g.fillStyle(0xFFE880, 0.55);
      for (let x = 5; x < GW; x += 38) g.fillRect(x, GROUND_Y + 4, 2, 2);
    }
  }

  private drawPx(): void {
    for (let li = 0; li < this.bg.layers.length; li++) {
      const layer = this.bg.layers[li];
      const g = this.lyG[li]; if (!g) continue; g.clear();
      const off = -(this.sx * layer.speed) % GW;
      for (const el of layer.elements) {
        const ex = ((el.x + off) % GW + GW) % GW;
        const ey = layer.yStart + el.y;
        const a = el.alpha ?? 1;
        const col = Phaser.Display.Color.HexStringToColor(el.color);
        for (const dx of [0, -GW]) {
          const px = ex + dx;
          const elW = el.type === "circle" ? (el.r ?? 15) * 2 : (el.w ?? 20);
          if (px > GW + elW || px < -elW) continue;
          switch (el.type) {
            case "rect": g.fillStyle(col.color, a); g.fillRect(px, ey, el.w ?? 10, el.h ?? 10); break;
            case "circle": g.fillStyle(col.color, a); g.fillCircle(px, ey, el.r ?? 10); break;
            case "triangle":
              if (el.points?.length === 6) {
                g.fillStyle(col.color, a);
                g.fillTriangle(
                  el.points[0] + off + dx, layer.yStart + el.points[1],
                  el.points[2] + off + dx, layer.yStart + el.points[3],
                  el.points[4] + off + dx, layer.yStart + el.points[5],
                );
              }
              break;
          }
        }
      }
    }
  }

  private initAm(): void {
    this.am = Array.from({ length: 10 }, () => ({
      x: Math.random() * GW, y: Math.random() * (GROUND_Y - 20) + 10,
      sp: Math.random() * 0.2 + 0.05, sz: Math.random() * 1.5 + 0.8,
      a: Math.random() * 0.2 + 0.05, ph: Math.random() * Math.PI * 2,
    }));
  }

  private drawAm(t: number): void {
    const g = this.amG; g.clear();
    for (const p of this.am) {
      const x = ((p.x - this.sx * p.sp * 0.1) % GW + GW) % GW;
      const y = p.y + Math.sin(t / 1000 + p.ph) * 2;
      g.fillStyle(0xFFFFFF, Math.max(0.02, p.a * (0.6 + Math.sin(t / 900 + p.ph) * 0.4)));
      g.fillRect(x, y, p.sz, p.sz);
    }
  }

  private spawnOre(): void {
    this.oh = 3;
    // 화면 오른쪽 밖에서 시작 → 달리면서 자연스럽게 화면에 들어옴
    this.ox = GW + Phaser.Math.Between(60, 150);
    this.ore.setTexture(`ore_${this.oreKey()}`);
    this.ore.setPosition(this.ox, GROUND_Y).setVisible(true).setAlpha(1);
  }

  // 광석 타입별 파티클 색상
  private oreColors(): number[] {
    const k = this.oreKey();
    if (k === "rock")    return [0xC8C0B0, 0x989080, 0xFFD700, 0xFFFFFF];
    if (k === "gold")    return [0xFFE840, 0xFFD700, 0xFFA000, 0xFFF8C0];
    if (k === "diamond") return [0x80F0FF, 0x40D0F0, 0xFFFFFF, 0xA0E8FF];
    return              [0xE0C0FF, 0xC080F0, 0xFFFFFF, 0xF0D8FF];
  }

  private hit(): void {
    this.oh--;
    const ox = this.ore.x;
    const oy = GROUND_Y - 18;
    const cols = this.oreColors();

    // ── 타격 스파크 (위쪽 부채꼴) ──
    for (let i = 0; i < 10; i++) {
      const angle = Phaser.Math.FloatBetween(-Math.PI * 0.9, -Math.PI * 0.1);
      const spd   = Phaser.Math.FloatBetween(1.8, 4.5);
      this.px.push({
        x: ox + Phaser.Math.Between(-6, 6),
        y: oy + Phaser.Math.Between(-4, 4),
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        l: Phaser.Math.Between(220, 380), ml: 380,
        c: cols[Phaser.Math.Between(0, cols.length - 1)],
        s: Phaser.Math.FloatBetween(1.5, 3.5),
        gravity: 0.12,
      });
    }
    // ── 작은 돌/광물 파편 ──
    for (let i = 0; i < 5; i++) {
      this.px.push({
        x: ox + Phaser.Math.Between(-8, 8),
        y: oy + Phaser.Math.Between(-2, 2),
        vx: Phaser.Math.FloatBetween(-3, 3),
        vy: Phaser.Math.FloatBetween(-4, -1),
        l: Phaser.Math.Between(300, 500), ml: 500,
        c: cols[0],
        s: Phaser.Math.Between(3, 5),
        gravity: 0.18,
      });
    }
    // ── 임팩트 플래시 링 ──
    const flash = this.add.graphics().setDepth(22);
    flash.lineStyle(2, cols[0], 0.9);
    flash.strokeCircle(ox, oy, 4);
    this.tweens.add({
      targets: flash, scaleX: 3.5, scaleY: 3.5, alpha: 0,
      duration: 180, ease: "Power2",
      onComplete: () => flash.destroy(),
    });

    // ── 화면 미세 진동 ──
    this.shakeAmp = 2.5;

    const prevLv = this.gs.level;
    const result = mine(this.gs);
    this.gs = result.state;
    this.uiCb?.({ ...this.gs }); this.updateInGameUI();

    // ── +골드 팝업 (더 크고 화려하게) ──
    const gain = GAME_CONFIG.GOLD_PER_MINE_TABLE[prevLv - 1] ?? 1;
    const gainStr = gain >= 1000 ? `+${(gain/1000).toFixed(1)}K` : `+${gain}`;
    const txt = this.add.text(ox, GROUND_Y - 44, `💰${gainStr}`, {
      fontFamily: "monospace", fontSize: "14px", color: "#FFE840",
      stroke: "#18100C", strokeThickness: 4, fontStyle: "bold",
    }).setOrigin(0.5).setDepth(26);
    this.tweens.add({
      targets: txt, y: GROUND_Y - 75, alpha: 0, scaleX: 1.3, scaleY: 1.3,
      duration: 650, ease: "Power2", onComplete: () => txt.destroy(),
    });

    if (result.leveledUp) this.onLvUp(prevLv);

    if (this.oh <= 0) {
      // ── 광석 파괴 폭발 ──
      for (let i = 0; i < 28; i++) {
        const a   = (i / 28) * Math.PI * 2;
        const spd = Phaser.Math.FloatBetween(2, 5.5);
        this.px.push({
          x: ox, y: oy,
          vx: Math.cos(a) * spd + Phaser.Math.FloatBetween(-0.5, 0.5),
          vy: Math.sin(a) * spd - 1,
          l: Phaser.Math.Between(400, 700), ml: 700,
          c: cols[i % cols.length],
          s: Phaser.Math.FloatBetween(2, 5),
          gravity: 0.1,
        });
      }
      // 폭발 링
      const ring = this.add.graphics().setDepth(22);
      ring.lineStyle(3, cols[0], 1);
      ring.strokeCircle(ox, oy, 6);
      this.tweens.add({
        targets: ring, scaleX: 6, scaleY: 6, alpha: 0,
        duration: 350, ease: "Power3",
        onComplete: () => ring.destroy(),
      });

      this.shakeAmp = 5;
      this.ore.setVisible(false);
      this.spawnOre();
      this.phase = "running";
    }
  }

  private onLvUp(prevLv: number): void {
    // ── 배경 전환 ──
    const newBg = getBackgroundTheme(this.gs.level);
    if (newBg.name !== this.bg.name) {
      this.bg = newBg;
      this.lyG.forEach(g => g.destroy());
      this.lyG = this.bg.layers.map((_, i) => this.add.graphics().setDepth(2 + i));
      this.drawSky();
      this.drawPixelMountains();
      this.drawGnd();
      this.initAm();
    }

    // ── 황금 플래시 ──
    const f = this.add.graphics().setDepth(29);
    f.fillStyle(0xFFE840, 0.45);
    f.fillRect(0, 0, GW, GH);
    this.tweens.add({ targets: f, alpha: 0, duration: 400, ease: "Power2", onComplete: () => f.destroy() });

    // ── 레벨업 텍스트 (두 줄: 배경 패널 + 텍스트) ──
    const panel = this.add.graphics().setDepth(30);
    panel.fillStyle(0x000000, 0.55);
    panel.fillRoundedRect(GW / 2 - 80, GH / 2 - 36, 160, 44, 12);
    panel.lineStyle(2, 0xFFE840, 0.9);
    panel.strokeRoundedRect(GW / 2 - 80, GH / 2 - 36, 160, 44, 12);

    const t = this.add.text(GW / 2, GH / 2 - 14, `✨ LEVEL ${this.gs.level} ✨`, {
      fontFamily: "monospace", fontSize: "18px", color: "#FFE840",
      stroke: "#18100C", strokeThickness: 4, fontStyle: "bold",
    }).setOrigin(0.5).setDepth(31);

    this.tweens.add({
      targets: [t, panel],
      alpha: 0, y: `-=28`,
      duration: 1000, delay: 800, ease: "Power2",
      onComplete: () => { t.destroy(); panel.destroy(); },
    });

    // ── 파티클 1차: 캐릭터 주변 폭발 ──
    const colors = [0xFFE840, 0xFF9020, 0xFFFFFF, 0x80D0FF, 0xFF80C0];
    for (let i = 0; i < 40; i++) {
      const a   = (i / 40) * Math.PI * 2;
      const spd = Phaser.Math.FloatBetween(2.5, 6);
      this.px.push({
        x: CHAR_X, y: GROUND_Y - 40,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd - 1.5,
        l: Phaser.Math.Between(600, 1000), ml: 1000,
        c: colors[i % colors.length],
        s: Phaser.Math.FloatBetween(3, 6),
        gravity: 0.06,
      });
    }

    // ── 파티클 2차: 지연 분수 (위로 솟구치는 불꽃) ──
    this.time.delayedCall(200, () => {
      for (let i = 0; i < 20; i++) {
        this.px.push({
          x: CHAR_X + Phaser.Math.Between(-20, 20),
          y: GROUND_Y - 20,
          vx: Phaser.Math.FloatBetween(-2.5, 2.5),
          vy: Phaser.Math.FloatBetween(-8, -4),
          l: Phaser.Math.Between(500, 800), ml: 800,
          c: colors[Phaser.Math.Between(0, colors.length - 1)],
          s: Phaser.Math.FloatBetween(2, 4),
          gravity: 0.15,
        });
      }
    });

    // ── 진동 ──
    this.shakeAmp = 7;

    void prevLv;
  }

  update(time: number, delta: number): void {
    const lv = this.gs.level;

    if (this.phase === "running") this.sx += this.spd * (delta / 16);
    this.drawPx();
    this.drawAm(time);

    // 캐릭터
    if (this.phase === "running") {
      this.rt += delta;
      if (this.rt > 110) { this.rt = 0; this.rf = (this.rf + 1) % 4; }
      this.chr.setTexture(`c${lv}_r${this.rf}`);
      this.chr.setY(GROUND_Y + 3 - Math.abs(Math.sin(this.rf * Math.PI / 3)) * 3);

      this.ox -= this.spd * (delta / 16);
      this.ore.setX(this.ox);
      if (this.ox <= CHAR_X + 40) {
        this.phase = "mining"; this.mp = 0; this.mt = 0;
      }
    } else {
      const interval = getMineInterval(lv);
      this.mt += delta;
      if (this.mt < interval * 0.45) {
        this.chr.setTexture(`c${lv}_mu`); this.chr.setY(GROUND_Y + 3);
      } else if (this.mt < interval * 0.7) {
        this.chr.setTexture(`c${lv}_md`); this.chr.setY(GROUND_Y + 4);
        if (this.mp === 0) { this.mp = 1; this.hit(); }
      } else { this.mt = 0; this.mp = 0; }

      if (this.ore.visible && this.mp === 1) {
        this.ore.setX(CHAR_X + 40 + Phaser.Math.Between(-2, 2));
      }
    }

    // 펫
    this.pt += delta;
    if (this.pt > 300) { this.pt = 0; this.pf = (this.pf + 1) % 2; }
    const pk = this.phase === "running" ? `pet_walk${this.pf + 1}` : `pet_sit${this.pf + 1}`;
    this.pet.setTexture(pk);
    this.pet.setY(GROUND_Y + 10 - (this.phase === "running"
      ? Math.abs(Math.sin(this.pf * Math.PI / 2)) * 2
      : Math.sin(time / 700)));

    // ── 화면 흔들림 ──
    if (this.shakeAmp > 0) {
      const sx = Phaser.Math.FloatBetween(-this.shakeAmp, this.shakeAmp);
      const sy = Phaser.Math.FloatBetween(-this.shakeAmp * 0.5, this.shakeAmp * 0.5);
      this.cameras.main.setScroll(sx, sy);
      this.shakeAmp *= 0.72;
      if (this.shakeAmp < 0.3) { this.shakeAmp = 0; this.cameras.main.setScroll(0, 0); }
    }

    // ── 파티클 ──
    this.pxG.clear();
    this.px = this.px.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += (p.gravity ?? 0.08);
      p.vx *= 0.98;  // 공기저항
      p.l -= delta;
      if (p.l <= 0) return false;
      const fade = Math.min(1, p.l / (p.ml * 0.35));
      this.pxG.fillStyle(p.c, fade);
      this.pxG.fillRect(Math.round(p.x - p.s / 2), Math.round(p.y - p.s / 2), p.s, p.s);
      return true;
    });
  }
}
