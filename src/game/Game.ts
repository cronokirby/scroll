import * as PIXI from 'pixi.js';
import { Control, Controller } from '../controller';
import { SpriteSheet } from '../sprites';

/**
 * Represents an entire Game.
 * 
 * The game is responsible for reacting to user input,
 * advancing the state of the game, and setting up the
 * sprites in the stage for rendering.
 */
class Game {
    private _player: PIXI.Sprite;

    /**
     * Construct a new game given sprite and control information.
     * 
     * @param _sheet the sprite sheet for this game
     * @param _controller the controller for player input
     */
    constructor(private _sheet: SpriteSheet, private _controller: Controller) {
        this._player = this._sheet.indexSprite(0, 0);
        this._controller.onPress(Control.Left, () => {
            this._player.x -= 32;
        });
        this._controller.onPress(Control.Right, () => {
            this._player.x += 32;
        });
        this._controller.onPress(Control.Up, () => {
            this._player.y -= 32;
        });
        this._controller.onPress(Control.Down, () => {
            this._player.y += 32;
        });
    }

    /**
     * Set the stage for this game, ready for drawing.
     * 
     * This should be called after the game is instantiated in order
     * to set up rendering.
     * 
     * @param container the container to draw things inside
     */
    setStage(container: PIXI.Container) {
        container.addChild(this._player);
    }
}
export default Game;
