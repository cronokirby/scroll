import { World } from 'micro-ecs';
import * as PIXI from 'pixi.js';
import { Model, ViewType } from '../model';
import Inventory from './Inventory';
import { SIDE_PANEL_SIZE } from '../../dimensions';
import Log from '../Log';


/**
 * This class contains both the ECS world, as well as all the other
 * things entities might need to interact with.
 * 
 * Entities might need to add things to the inventory, or to the log,
 * or add sprites to the different stages.
 */
class GameWorld {
    public readonly world = new World<Model>();
    public readonly inventory = new Inventory();
    public readonly log = new Log();
    private _currentView = ViewType.Playing;
    private _stage = new PIXI.Container();
    private _gameStage = new PIXI.Container();

    constructor() {
        this._gameStage.x = SIDE_PANEL_SIZE;
        this._stage.addChild(this._gameStage);
        this.inventory.addTo(this._stage);
        this.log.addTo(this._stage);
        this.currentView = ViewType.Playing;
    }

    get currentView(): ViewType {
        return this._currentView;
    }

    set currentView(newType: ViewType) {
        this._currentView = newType;
        this._gameStage.visible = newType !== ViewType.Inventory;
        this.inventory.visible = newType === ViewType.Inventory;
    }

    /**
     * Add this world's stages to a given stage.
     * 
     * @param stage the stage to add these stages to
     */
    addTo(stage: PIXI.Container) {
        stage.addChild(this._stage);
    }

    /**
     * Add a new game sprite to the game stage of this world.
     * 
     * @param sprite the sprite to add
     */
    addGameSprite(sprite: PIXI.Sprite) {
        this._gameStage.addChild(sprite);
    }

    /**
     * Remove a sprite from the game stage of this world.
     * 
     * @param sprite the sprite to remove from the stage
     */
    removeGameSprite(sprite: PIXI.Sprite) {
        this._gameStage.removeChild(sprite);
    }
}
export default GameWorld;