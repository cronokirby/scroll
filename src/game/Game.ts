import * as PIXI from 'pixi.js';
import { Control, Controller } from '../controller';
import { SpriteSheet } from '../sprites';
import Log from './Log';


/**
 * Represents an entire Game.
 * 
 * The game is responsible for reacting to user input,
 * advancing the state of the game, and setting up the
 * sprites in the stage for rendering.
 */
class Game {
    private _gameStage: PIXI.Container = new PIXI.Container();
    private _player: PIXI.Sprite;
    private _log: Log;

    /**
     * Construct a new game given sprite and control information.
     * 
     * @param sheet the sprite sheet for this game
     * @param controller the controller for player input
     */
    constructor(sheet: SpriteSheet, controller: Controller) {
        this._player = sheet.indexSprite(0, 0);
        this._gameStage.addChild(this._player);
        this._gameStage.x = 320;
        this._log = new Log();

        controller.onPress(Control.Left, this.onMoveLeft.bind(this));
        controller.onPress(Control.Right, this.onMoveRight.bind(this));
        controller.onPress(Control.Down, this.onMoveDown.bind(this));
        controller.onPress(Control.Up, this.onMoveUp.bind(this));
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
        container.addChild(this._gameStage);
        this._log.addTo(container, 0, 10);
    }


    private onMoveLeft() {
        this._log.addMsg('You moved left');
        this._player.x -= 32;
    }

    private onMoveRight() {
        this._log.addMsg('You moved right');
        this._player.x += 32;
    }

    private onMoveUp() {
        this._log.addMsg('You moved up');
        this._player.y -= 32;
    }

    private onMoveDown() {
        this._log.addMsg('You moved down');
        this._player.y += 32
    }
}
export default Game;
