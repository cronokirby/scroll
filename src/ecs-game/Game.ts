import { World } from 'micro-ecs';
import { Control, Controller } from '../controller';
import { indexSprite } from '../sprites';
import { baseQuery, Model, ViewType } from './model';
import * as Pos from './position';
import PosSprite from './components/PosSprite';
import Inventory from './model/Inventory';

/**
 * Represents an instance of the Game.
 */
class Game {
    private _world = new World<Model>();
    private _stage = new PIXI.Container();
    private _gameStage = new PIXI.Container();
    private _inventory = new Inventory();
    // Game states
    private _currentView: ViewType = ViewType.Playing;

    constructor(controller: Controller) {
        this._stage.x = 320;
        this._stage.addChild(this._gameStage);
        this._inventory.addTo(this._stage);

        const sprite = new PosSprite(indexSprite(0, 0));
        this._world.add({ controlMarker: null, viewType: ViewType.Playing, sprite });
        this._gameStage.addChild(sprite.sprite);
        controller.onPress(Control.Right, this.onRight.bind(this));
        controller.onPress(Control.Left, this.onLeft.bind(this));
        controller.onPress(Control.Up, this.onUp.bind(this));
        controller.onPress(Control.Down, this.onDown.bind(this));
        controller.onPress(Control.Inventory, this.onInventory.bind(this));
    }

    /**
     * Set the stage to display things in.
     * 
     * This function is necessary in order to make all the sprites
     * contained in the game visible outside, by adding the
     * game's visible stage to the given stage.
     * 
     * @param stage the stage to add 
     */
    setStage(stage: PIXI.Container) {
        stage.addChild(this._stage);
    }

    private moveToInventory() {
        this._currentView = ViewType.Inventory;
        this._gameStage.visible = false;
        this._inventory.visible = true;
    }

    private moveToPlaying() {
        this._currentView = ViewType.Playing;
        this._gameStage.visible = true;
        this._inventory.visible = false;
    }

    private onInventory() {
        if (this._currentView === ViewType.Inventory) {
            this.moveToPlaying();
        } else {
            this.moveToInventory();
        }
    }

    private moveSprites(direction: Pos.Direction) {
        const controllable = baseQuery
            .select('controlMarker', 'sprite', 'viewType')
            .filter(x => x.viewType === this._currentView);
        this._world.run(controllable.forEach(x => {
            const pos = x.sprite.pos;
            const newPos = Pos.moved(pos, direction);
            if (Pos.inGrid(newPos)) {
                x.sprite.pos = newPos;
            }
        }));
    }

    private onRight() {
        this.moveSprites(Pos.Direction.Right);
    }

    private onLeft() {
        this.moveSprites(Pos.Direction.Left);
    }

    private onUp() {
        this.moveSprites(Pos.Direction.Up);
    }

    private onDown() {
        this.moveSprites(Pos.Direction.Down);
    }
}
export default Game;