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
const PET_SC = 2.5;
const ORE_SC = 3;
const CHAR_X = 110;
const GROUND_Y = 232;  // 스프라이트 트리밍으로 정확히 발 위치
const GW = GAME_CONFIG.GAME_WIDTH;
const GH = GAME_CONFIG.GAME_HEIGHT;

type Phase = "running" | "mining";

export class MainScene extends Phaser.Scene {
  private gs!: GameState;
  private phase: Phase = "running";
  private spd = 1.8;
  private sx = 0;

  private skyG!: Phaser.GameObjects.Graphics;
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
  }> = [];

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
    this.gndG = this.add.graphics().setDepth(1);
    this.lyG = this.bg.layers.map((_, i) => this.add.graphics().setDepth(2 + i));
    this.amG = this.add.graphics().setDepth(15);
    this.pxG = this.add.graphics().setDepth(20);

    this.drawSky();
    this.drawGnd();

    // ★ 모든 레벨 텍스처 미리 생성 (한 번만)
    this.pregenAllTextures();
    this.initAm();

    const lv = this.gs.level;
    this.chr = this.add.image(CHAR_X, GROUND_Y, `c${lv}_r0`).setDepth(10).setOrigin(0.5, 1);
    this.pet = this.add.image(CHAR_X - 46, GROUND_Y + 2, "pet_idle1").setDepth(9).setOrigin(0.5, 1);
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
    const lv = this.gs.level;
    if (lv <= 3) return "rock";
    if (lv <= 6) return "gold";
    if (lv <= 9) return "diamond";
    return "star";
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

    // 펫 (레벨 무관)
    for (const [k, f] of Object.entries(PET_FRAMES)) {
      registerPixelTexture(this, `pet_${k}`, f, PET_COLOR_MAP, PET_SC);
    }

    // 광석 종류별
    for (const [name, ore] of Object.entries({
      rock: getOreForLevel(1),
      gold: getOreForLevel(4),
      diamond: getOreForLevel(7),
      star: getOreForLevel(10),
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

  private drawGnd(): void {
    const g = this.gndG; g.clear();
    const gc = Phaser.Display.Color.HexStringToColor(this.bg.groundColor);
    const dc = Phaser.Display.Color.HexStringToColor(this.bg.groundDetailColor);
    const groundH = GH - GROUND_Y; // ~48px 의 넉넉한 땅

    // 땅 메인
    g.fillStyle(gc.color); g.fillRect(0, GROUND_Y, GW, groundH);

    // 상단 하이라이트 (풀 경계선)
    g.fillStyle(0xFFFFFF, 0.15); g.fillRect(0, GROUND_Y, GW, 1);
    g.fillStyle(dc.color, 0.7); g.fillRect(0, GROUND_Y + 1, GW, 2);

    // 원근감 — 아래로 갈수록 약간 어두워지는 그라디언트
    for (let y = 0; y < groundH; y++) {
      const darkness = (y / groundH) * 0.12;
      g.fillStyle(0x000000, darkness);
      g.fillRect(0, GROUND_Y + y, GW, 1);
    }

    // 흙 텍스처 패턴
    g.fillStyle(dc.color, 0.3);
    for (let x = 0; x < GW; x += 14) {
      g.fillRect(x, GROUND_Y + 6, 5, 1);
      g.fillRect(x + 7, GROUND_Y + 14, 4, 1);
      g.fillRect(x + 3, GROUND_Y + 22, 5, 1);
    }

    // 풀 경계 디테일 (삐죽삐죽한 풀)
    g.fillStyle(gc.color);
    for (let x = 0; x < GW; x += 8) {
      const h = 2 + (x * 7 % 3);
      g.fillRect(x, GROUND_Y - h, 2, h);
      g.fillRect(x + 4, GROUND_Y - h + 1, 2, h - 1);
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
          if (px > GW + 80 || px < -80) continue;
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

  private hit(): void {
    this.oh--;

    // 파티클
    for (let i = 0; i < 5; i++) {
      this.px.push({
        x: this.ore.x + Phaser.Math.Between(-5, 5),
        y: GROUND_Y - 16 + Phaser.Math.Between(-3, 3),
        vx: Phaser.Math.FloatBetween(-2, 2), vy: Phaser.Math.FloatBetween(-3, -0.5),
        l: 280, ml: 280,
        c: [0xFFD700, 0xFFF0C0, 0xFFFFFF, 0xE0B840][Phaser.Math.Between(0, 3)],
        s: Phaser.Math.Between(2, 3),
      });
    }

    const prevLv = this.gs.level;
    const result = mine(this.gs);
    this.gs = result.state;
    this.uiCb?.({ ...this.gs }); this.updateInGameUI();

    // +골드 팝업
    const gain = GAME_CONFIG.GOLD_PER_MINE_TABLE[prevLv - 1] ?? 1;
    const txt = this.add.text(this.ore.x + 4, GROUND_Y - 36, `+${gain}`, {
      fontFamily: "monospace", fontSize: "12px", color: "#FFD700",
      stroke: "#1a1020", strokeThickness: 3, fontStyle: "bold",
    }).setOrigin(0.5).setDepth(25);
    this.tweens.add({
      targets: txt, y: GROUND_Y - 60, alpha: 0,
      duration: 550, ease: "Power2", onComplete: () => txt.destroy(),
    });

    if (result.leveledUp) this.onLvUp(prevLv);

    if (this.oh <= 0) {
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        this.px.push({
          x: this.ore.x, y: GROUND_Y - 10,
          vx: Math.cos(a) * Phaser.Math.FloatBetween(1.5, 3), vy: Math.sin(a) * Phaser.Math.FloatBetween(1.5, 3) - 1,
          l: 380, ml: 380,
          c: [0xFFD700, 0xE0B840, 0xA09890, 0xFFFFFF][Phaser.Math.Between(0, 3)],
          s: Phaser.Math.Between(2, 4),
        });
      }
      // 광석 파괴 → 즉시 숨기고, 오른쪽 밖에 새 광석 배치
      this.ore.setVisible(false);
      this.spawnOre();
      this.phase = "running";
    }
  }

  private onLvUp(prevLv: number): void {
    // 배경 전환 체크
    const newBg = getBackgroundTheme(this.gs.level);
    if (newBg.name !== this.bg.name) {
      this.bg = newBg;
      this.lyG.forEach(g => g.destroy());
      this.lyG = this.bg.layers.map((_, i) => this.add.graphics().setDepth(2 + i));
      this.drawSky();
      this.drawGnd();
      this.initAm();
    }

    // 텍스트
    const t = this.add.text(GW / 2, GH / 2 - 18, `LEVEL ${this.gs.level}!`, {
      fontFamily: "monospace", fontSize: "20px", color: "#FFD700",
      stroke: "#1a1020", strokeThickness: 4, fontStyle: "bold",
    }).setOrigin(0.5).setDepth(30);
    this.tweens.add({
      targets: t, y: GH / 2 - 40, alpha: 0,
      duration: 1400, delay: 500, ease: "Power2", onComplete: () => t.destroy(),
    });

    // 파티클 폭발
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      this.px.push({
        x: CHAR_X, y: GROUND_Y - 28,
        vx: Math.cos(a) * Phaser.Math.FloatBetween(1.5, 4),
        vy: Math.sin(a) * Phaser.Math.FloatBetween(1.5, 4),
        l: 800, ml: 800,
        c: [0xFFD700, 0x5C9AE8, 0xFFFFFF, 0xFFE880][i % 4],
        s: Phaser.Math.Between(2, 5),
      });
    }

    // 플래시
    const f = this.add.graphics().setDepth(29);
    f.fillStyle(0xFFFFFF, 0.25);
    f.fillRect(0, 0, GW, GH);
    this.tweens.add({ targets: f, alpha: 0, duration: 300, onComplete: () => f.destroy() });
  }

  update(time: number, delta: number): void {
    const lv = this.gs.level;

    if (this.phase === "running") this.sx += this.spd * (delta / 16);
    this.drawPx();
    this.drawAm(time);

    // 캐릭터
    if (this.phase === "running") {
      this.rt += delta;
      if (this.rt > 130) { this.rt = 0; this.rf = (this.rf + 1) % 3; }
      this.chr.setTexture(`c${lv}_r${this.rf}`);
      this.chr.setY(GROUND_Y - Math.abs(Math.sin(this.rf * Math.PI / 3)) * 3);

      this.ox -= this.spd * (delta / 16);
      this.ore.setX(this.ox);
      if (this.ox <= CHAR_X + 40) {
        this.phase = "mining"; this.mp = 0; this.mt = 0;
      }
    } else {
      const interval = getMineInterval(lv);
      this.mt += delta;
      if (this.mt < interval * 0.45) {
        this.chr.setTexture(`c${lv}_mu`); this.chr.setY(GROUND_Y);
      } else if (this.mt < interval * 0.7) {
        this.chr.setTexture(`c${lv}_md`); this.chr.setY(GROUND_Y + 1);
        if (this.mp === 0) { this.mp = 1; this.hit(); }
      } else { this.mt = 0; this.mp = 0; }

      if (this.ore.visible && this.mp === 1) {
        this.ore.setX(CHAR_X + 40 + Phaser.Math.Between(-2, 2));
      }
    }

    // 펫
    this.pt += delta;
    if (this.pt > 300) { this.pt = 0; this.pf = (this.pf + 1) % 2; }
    const pk = this.phase === "running" ? `pet_walk${this.pf + 1}` : `pet_idle${this.pf + 1}`;
    this.pet.setTexture(pk);
    this.pet.setY(GROUND_Y + 2 - (this.phase === "running"
      ? Math.abs(Math.sin(this.pf * Math.PI / 2)) * 2
      : Math.sin(time / 700)));

    // 파티클
    this.pxG.clear();
    this.px = this.px.filter(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.07; p.l -= delta;
      if (p.l <= 0) return false;
      this.pxG.fillStyle(p.c, Math.min(1, p.l / (p.ml * 0.3)));
      this.pxG.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
      return true;
    });
  }
}
