import * as PIXI from 'pixi.js';
import * as Pos from '../position';
import { SPRITE_SIZE } from '../../dimensions';


/**
 * A pos sprite represents a sprite that comes with a position.
 * 
 * The logical grid position of the sprite is kept in sync
 * with the visual position.
 */
class PosSprite {
    private _pos: Pos.Pos;

    constructor(public sprite: PIXI.Sprite, pos?: Pos.Pos) {
        this._pos = pos || { x: 0, y: 0 };
    }

    get pos(): Pos.Pos {
        return this._pos;
    }

    set pos({x, y}: Pos.Pos) {
        this._pos = {x, y};
        this.sprite.x = SPRITE_SIZE * x;
        this.sprite.y = SPRITE_SIZE * y;
    }
}
export default PosSprite;