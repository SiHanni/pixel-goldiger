import Phaser from "phaser";
import { MainScene } from "./scenes/MainScene";
import { GAME_CONFIG } from "./config";

export function createGame(parent: HTMLElement): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.CANVAS,
    width: GAME_CONFIG.GAME_WIDTH,
    height: GAME_CONFIG.GAME_HEIGHT,
    parent,
    backgroundColor: "#E8E0D0",
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent,
    },
    scene: [MainScene],
  };

  // parent의 canvas 외 추가 요소 방지
  parent.style.overflow = "hidden";

  return new Phaser.Game(config);
}

export function getMainScene(game: Phaser.Game): MainScene | null {
  return game.scene.getScene("MainScene") as MainScene | null;
}
