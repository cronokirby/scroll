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
    player: PIXI.Sprite;

    constructor(sheet: SpriteSheet) {
        this.player = sheet.indexSprite(0, 0);
    }

    /**
     * Add all the sprites in the view to the stage.
     * 
     * @param stage the stage to fill with sprites
     */
    setStage(stage: PIXI.Container) {
        stage.addChild(this.player);
    }
}
export default GameView;