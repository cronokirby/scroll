import * as PIXI from 'pixi.js';
import { Control, Controller } from '../controller';
import { SpriteSheet } from '../sprites';
import Area from './Area';
import Log from './Log';
import Player from './entities/Player';
import Mouse from './entities/monsters/Mouse';
import * as Pos from './position';
import ShortStats from './ShortStats';
import GameOver from './GameOver';


/**
 * Represents an entire Game.
 * 
 * The game is responsible for reacting to user input,
 * advancing the state of the game, and setting up the
 * sprites in the stage for rendering.
 */
class Game {
    private _gameStage: PIXI.Container = new PIXI.Container();
    private _gameOver: GameOver = new GameOver();
    private _player: Player;
    private _area: Area;
    private _log = new Log();
    private _statView = new ShortStats();

    /**
     * Construct a new game given sprite and control information.
     * 
     * @param sheet the sprite sheet for this game
     * @param controller the controller for player input
     */
    constructor(sheet: SpriteSheet, controller: Controller) {
        this._player = new Player(sheet, this._log, this._statView);
        this._area = new Area(sheet);
        this._area.addEntity(new Mouse(sheet, this._log), { x: 10, y: 8 });
        this._area.addEntity(new Mouse(sheet, this._log), { x: 10, y: 2 });
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
        this._gameOver.addTo(container, 320);
        this._gameOver.visible = false;
        this._log.addTo(container, 0, 40);
        this._statView.addTo(container, 10, 10);
    }

    private onMoveLeft() {
        this._area.movePlayer(Pos.left(this._player.pos));
        this.checkGameOver();
    }

    private onMoveRight() {
        this._area.movePlayer(Pos.right(this._player.pos));
        this.checkGameOver();
    }

    private onMoveUp() {
        this._area.movePlayer(Pos.up(this._player.pos));
        this.checkGameOver();
    }

    private onMoveDown() {
        this._area.movePlayer(Pos.down(this._player.pos));
        this.checkGameOver();
    }

    private checkGameOver() {
        if (this._player.isDead()) {
            this._player.die();
            this._gameStage.visible = false;
            this._gameOver.visible = true;
        }
    }
}
export default Game;
