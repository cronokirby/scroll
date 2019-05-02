import * as PIXI from 'pixi.js';
import { GRID_SIZE } from '../../dimensions';
import { indexSprite, Color } from '../../sprites';
import PosSprite from '../components/PosSprite';



/**
 * Represents an Area of a dungeon, where entities reside, and we can move.
 * 
 * This contains tile elements, and allows us to query to know whether
 * or not we can move to certain tiles.
 */
class Area {
    private _stage = new PIXI.Container();

    constructor() {
        for (let x = 0; x < GRID_SIZE; ++x) {
            const sprite1 = new PosSprite(indexSprite(0, 8, Color.Gray));
            const sprite2 = new PosSprite(indexSprite(0, 8, Color.Gray));
            sprite1.pos = { x, y: 0 };
            sprite2.pos = { x, y: 15 };
            this._stage.addChild(sprite1.sprite);
            this._stage.addChild(sprite2.sprite);
        }
    }

    /**
     * Add the visual elements of this area to a stage.
     * 
     * @param stage the stage to add this area to
     */
    addTo(stage: PIXI.Container) {
        stage.addChild(this._stage);
    }
}
export default Area;