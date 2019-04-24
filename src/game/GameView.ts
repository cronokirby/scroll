import * as PIXI from 'pixi.js';
import { SpriteSheet } from '../sprites';


/**
 * Holds the sprites that display the game.
 * 
 * This exist mainly to allow the TurnState
 * to modify it, thus changing how the sprites
 * are displayed.
 */
class GameView {
    private _stage: PIXI.Container = new PIXI.Container();
    player: PIXI.Sprite;

    constructor(sheet: SpriteSheet) {
        this.player = sheet.indexSprite(0, 0);
        this._stage.addChild(this.player);
    }

    /**
     * Add all the sprites in the view to the stage.
     * 
     * @param stage the stage to fill with sprites
     * @param x the x position for this component
     * @param y the y position for this component
     */
    addTo(stage: PIXI.Container, x?: number, y?: number) {
        stage.addChild(this._stage);
        if (x) this._stage.x = x;
        if (y) this._stage.y = y;
    }
}
export default GameView;