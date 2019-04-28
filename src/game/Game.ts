import * as PIXI from 'pixi.js';
import { Control, Controller } from '../controller';
import { SpriteSheet } from '../sprites';
import Log from './Log';
import Player from './entities/Player';
import * as Pos from './position';
import ShortStats from './ShortStats';
import GameOver from './GameOver';
import { Floor } from './floor';
import Describe from './Describe';
import Inventory from './Inventory';


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
    private _floor: Floor;
    private _log = new Log();
    private _inventory = new Inventory();
    private _description: Describe;
    private _statView = new ShortStats();
    private _inspecting: boolean;

    /**
     * Construct a new game given sprite and control information.
     * 
     * @param sheet the sprite sheet for this game
     * @param controller the controller for player input
     */
    constructor(sheet: SpriteSheet, controller: Controller) {
        this._player = new Player(sheet, this._log, this._statView, this._inventory);
        this._floor = new Floor(sheet, this._log, this._player);
        this._description = new Describe(sheet, this._floor);
        this._floor.addTo(this._gameStage);
        this._player.addTo(this._gameStage);
        this._gameStage.x = 320;
        this.setInspecting(false);
        this.addSidebar();

        controller.onPress(Control.Left, this.onMoveLeft.bind(this));
        controller.onPress(Control.Right, this.onMoveRight.bind(this));
        controller.onPress(Control.Down, this.onMoveDown.bind(this));
        controller.onPress(Control.Up, this.onMoveUp.bind(this));
        controller.onPress(Control.Inspect, this.onInspect.bind(this));
        controller.onPress(Control.Interact, this.onInteract.bind(this));
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
        this._inventory.addTo(container);
        this._description.addTo(container);
        this._statView.addTo(container, 10, 10);
    }

    private addSidebar() {
        const line = new PIXI.Graphics();
        line.lineStyle(2, 0xAAAAAA, 1);
        line.moveTo(0, -10);
        line.lineTo(0, 600);
        line.x = -2;
        this._gameStage.addChild(line)
    }

    private setInspecting(isInspecting: boolean) {
        if (isInspecting) {
            this._description.show(this._player.pos);
        } else {
            this._description.hide();
        }
        this._log.visible = !isInspecting;
        this._inspecting = isInspecting;
    }

    private onMoveLeft() {
        if (this._inspecting) {
            this._description.moveCursor(Pos.Direction.Left);
        } else {
            this._floor.movePlayer(Pos.Direction.Left);
        }
        this.checkGameOver();
    }

    private onMoveRight() {
        if (this._inspecting) {
            this._description.moveCursor(Pos.Direction.Right);
        } else {
            this._floor.movePlayer(Pos.Direction.Right);
        }
        this.checkGameOver();
    }

    private onMoveUp() {
        if (this._inspecting) {
            this._description.moveCursor(Pos.Direction.Up);
        } else {
            this._floor.movePlayer(Pos.Direction.Up);
        }
        this.checkGameOver();
    }

    private onMoveDown() {
        if (this._inspecting) {
            this._description.moveCursor(Pos.Direction.Down);
        } else {
            this._floor.movePlayer(Pos.Direction.Down);
        }
        this.checkGameOver();
    }

    private onInspect() {
        this.setInspecting(!this._inspecting);
    }

    private onInteract() {
        if (!this._inspecting) {
            this._floor.interact();
        }
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
