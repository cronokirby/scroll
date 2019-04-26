import * as PIXI from 'pixi.js';
import { Control, Controller } from '../controller';
import { SpriteSheet } from '../sprites';
import Area from './Area';
import Log from './Log';
import Player from './entities/Player';
import Mouse from './entities/monsters/Mouse';
import * as Pos from './position';


/**
 * Represents an entire Game.
 * 
 * The game is responsible for reacting to user input,
 * advancing the state of the game, and setting up the
 * sprites in the stage for rendering.
 */
class Game {
    private _gameStage: PIXI.Container = new PIXI.Container();
    private _player: Player;
    private _area: Area;
    private _log: Log;

    /**
     * Construct a new game given sprite and control information.
     * 
     * @param sheet the sprite sheet for this game
     * @param controller the controller for player input
     */
    constructor(sheet: SpriteSheet, controller: Controller) {
        this._log = new Log();
        this._player = new Player(sheet, this._log);
        this._area = new Area(sheet);
        this._area.addEntity(new Mouse(sheet, this._log), { x: 10, y: 8 });
        this._area.player = this._player;
        this._area.addTo(this._gameStage);
        this._player.addTo(this._gameStage);
        this._gameStage.x = 320;

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
        this._area.movePlayer(Pos.left(this._player.pos));
    }

    private onMoveRight() {
        this._area.movePlayer(Pos.right(this._player.pos));
    }

    private onMoveUp() {
        this._area.movePlayer(Pos.up(this._player.pos));
    }

    private onMoveDown() {
        this._area.movePlayer(Pos.down(this._player.pos));
    }
}
export default Game;
