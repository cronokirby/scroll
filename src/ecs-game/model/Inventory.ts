import * as PIXI from 'pixi.js';
import * as Pos from '../position';
import PosSprite from '../components/PosSprite';


class Inventory {
    private _stage = new PIXI.Container();
    private _free: Pos.Pos[] = [];

    constructor() {
        for (let y = 0; y < 16; ++y) {
            for (let x = 0; x < 16; ++x) {
                this._free.push({ x, y });
            }
        }
    }

    /**
     * Add a simple sprite to the stage.
     * 
     * This sprite won't be considered an item occupying a slot in
     * the inventory.
     * 
     * @param sprite the sprite to add to this inventory's stage
     */
    addChild(sprite: PIXI.Sprite) {
        this._stage.addChild(sprite);
    }

    /**
     * 
     * @param sprite the sprite with a position to add
     * @returns true if the sprite was added, else false
     */
    add(sprite: PosSprite): boolean {
        const pos = this._free.pop();
        if (!pos) return false;
        this._stage.addChild(sprite.sprite);
        sprite.pos = pos;
        return true;
    }
}
export default Inventory;