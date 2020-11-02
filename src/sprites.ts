import * as PIXI from "pixi.js";
import { sheet } from "./assets/loader.js";

/**
 * Represents the Color we can tint the sprites we load.
 */
export enum Color {
  White = 0xffffff,
  Gray = 0x81858e,
  Green = 0x3ce847,
}

function hexColor(color: Color): number {
  return color as number;
}

/**
 * Represents a Sprite, at least logically.
 *
 * The idea is that we represent a sprite as just a position in the global sprite sheet.
 *
 * Another approach would be an enumeration of names, but this overlaps a bit with
 * other definitions of monsters, and items, and things like that. Many items
 * in the sheet don't have an obvious name either, so using a position
 * is a lot clearer.
 */
export interface Sprite {
  x: number;
  y: number;
  color?: Color;
}

/**
 * Represents a sprite sheet containing different sprites
 * we can load.
 */
export class SpriteSheet {
  private readonly _baseTexture: PIXI.BaseTexture;

  static readonly deps = [sheet];

  /**
   * Construct a new sprite sheet.
   *
   * This has to be called after the assets have been loaded,
   * since the sprite sheet needs access to the loaded texture.
   */
  constructor() {
    this._baseTexture = PIXI.loader.resources[sheet].texture.baseTexture;
  }

  /**
   * Get a sprite in the sheet based on its index.
   *
   * @param x the x index of the sprite
   * @param y the y index of the sprite
   */
  indexSprite(sprite: Sprite): PIXI.Sprite {
    const rect = new PIXI.Rectangle(16 * sprite.x, 16 * sprite.y, 16, 16);
    const texture = new PIXI.Texture(this._baseTexture, rect);
    const img = new PIXI.Sprite(texture);
    img.scale.set(2, 2);
    img.tint = hexColor(sprite.color ?? Color.White);
    return img;
  }
}
