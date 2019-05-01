import * as PIXI from 'pixi.js';
import * as Pos from '../position';
import PosSprite from '../components/PosSprite';
import { SIDE_PANEL_SIZE } from '../../dimensions';


class Inventory {
    private _stage = new PIXI.Container();
    private _free: Pos.Pos[] = [];

    constructor() {
        for (let y = 15; y >= 0; --y) {
            for (let x = 15; x >= 0; --x) {
                this._free.push({ x, y });
            }
        }
        this._stage.x = SIDE_PANEL_SIZE;
    }

    /**
     * Set the visibility of this inventory's stage.
     */
    set visible(isVisible: boolean) {
        this._stage.visible = isVisible;
    }

    /**
     * Add the elements of this inventory to a given stage.
     * 
     * @param stage the stage to add this to
     */
    addTo(stage: PIXI.Container) {
        stage.addChild(this._stage);
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