import * as PIXI from "pixi.js";
import { Controller } from "./controller";
import { GRID_SIZE, SPRITE_SIZE } from "./dimensions";
import { SpriteSheet } from "./sprites";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new PIXI.Application({
  width: SPRITE_SIZE * GRID_SIZE,
  height: SPRITE_SIZE * GRID_SIZE,
  resolution: devicePixelRatio,
});

window.addEventListener("load", () => {
  const gameEl = document.getElementById("game");
  if (gameEl) {
    gameEl.appendChild(app.view);
  }
});

const controller = new Controller();

PIXI.loader.add(SpriteSheet.deps).load(() => {
  const sheet = new SpriteSheet();
  const sprite = sheet.indexSprite(0, 0);
  app.stage.addChild(sprite);
});
