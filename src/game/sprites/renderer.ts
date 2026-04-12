import Phaser from "phaser";

export function registerPixelTexture(
  scene: Phaser.Scene,
  key: string,
  data: string[],
  colorMap: Record<string, string>,
  scale: number
): void {
  if (scene.textures.exists(key)) return; // 이미 있으면 스킵

  const maxW = Math.max(...data.map(r => r.length), 1);
  const rows = data.map(r => r.padEnd(maxW, "."));
  const w = maxW * scale + scale; // 그림자 여유
  const h = rows.length * scale + scale;
  if (w <= 0 || h <= 0) return;

  const ct = scene.textures.createCanvas(key, w, h);
  if (!ct) return;
  const ctx = ct.getContext();

  // 그림자
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      const ch = rows[y][x];
      const color = colorMap[ch];
      if (!color || color === "transparent") continue;
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect((x + 1) * scale, (y + 1) * scale, scale, scale);
    }
  }

  // 본체
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      const ch = rows[y][x];
      const color = colorMap[ch];
      if (!color || color === "transparent") continue;
      ctx.fillStyle = color;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }

  ct.refresh();
}
