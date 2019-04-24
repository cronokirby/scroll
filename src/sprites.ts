import * as PIXI from 'pixi.js';
import { sheet } from './assets/loader.js';


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
    indexSprite(x: number, y: number): PIXI.Sprite {
        const rect = new PIXI.Rectangle(16 * x, 16 * y, 16, 16);
        const texture = new PIXI.Texture(this._baseTexture, rect);
        const sprite = new PIXI.Sprite(texture);
        sprite.scale.set(2, 2);
        return sprite;
    }
}
