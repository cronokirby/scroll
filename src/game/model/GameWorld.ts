import { World } from 'micro-ecs';
import * as PIXI from 'pixi.js';
import { Model, ViewType } from '../model';
import Inventory from './Inventory';
import { SIDE_PANEL_SIZE } from '../../dimensions';
import Log from '../Log';
import Description from '../Description';
import PosSprite from '../components/PosSprite';
import { indexSprite } from '../../sprites';
import ShortStats from './ShortStats';
import GameOver from './GameOver';
import Dungeon from '../dungeon/Dungeon';


/**
 * This class contains both the ECS world, as well as all the other
 * things entities might need to interact with.
 * 
 * Entities might need to add things to the inventory, or to the log,
 * or add sprites to the different stages.
 */
class GameWorld {
    public readonly world = new World<Model>();
    public readonly dungeon = new Dungeon();
    public readonly inventory = new Inventory();
    public readonly description = new Description();
    public readonly log = new Log();
    public readonly shortStats = new ShortStats();
    private _gameOver = new GameOver();
    private _currentView = ViewType.Playing;
    private _stage = new PIXI.Container();
    private _gameStage = new PIXI.Container();
    private _gameStageHigh = new PIXI.Container();
    private _descriptionStage = new PIXI.Container();

    constructor() {
        this._gameStage.x = SIDE_PANEL_SIZE;
        this._gameStageHigh.x = SIDE_PANEL_SIZE;
        this._descriptionStage.x = SIDE_PANEL_SIZE;
        this.dungeon.addTo(this._gameStage);
        this._stage.addChild(this._gameStage);
        this._stage.addChild(this._gameStageHigh);
        this._stage.addChild(this._descriptionStage);
        this.inventory.addTo(this._stage);
        this.description.addTo(this._stage);
        this.log.addTo(this._stage);
        this.shortStats.addTo(this._stage, 20, 10);
        this._gameOver.addTo(this._stage, SIDE_PANEL_SIZE);
        this._gameOver.visible = false;
        this.currentView = ViewType.Playing;

        this.addInventoryCursor();
        this.addDescriptionCursor();
        this.createSideBarLine();
    }

    private addInventoryCursor() {
        const sprite = new PosSprite(indexSprite(8, 6));
        this.inventory.addChild(sprite.sprite);
        this.world.add({
            controlMarker: null,
            isCursor: null,
            viewType: ViewType.Inventory,
            sprite
        });
    }

    private addDescriptionCursor() {
        const sprite = new PosSprite(indexSprite(8, 6));
        this._descriptionStage.addChild(sprite.sprite);
        this.world.add({
            controlMarker: null,
            isCursor: null,
            viewType: ViewType.Describing,
            sprite
        });
    }

    private createSideBarLine() {
        const line = new PIXI.Graphics();
        line.lineStyle(2, 0xAAAAAA, 1);
        line.moveTo(0, -10);
        line.lineTo(0, 600);
        line.x = SIDE_PANEL_SIZE - 2;
        this._stage.addChild(line);
    }

    get currentView(): ViewType {
        return this._currentView;
    }

    set currentView(newType: ViewType) {
        this._currentView = newType;
        this._gameStage.visible = newType !== ViewType.Inventory;
        this._gameStageHigh.visible = this._gameStage.visible;
        this.inventory.visible = newType === ViewType.Inventory;
        this.description.visible = newType !== ViewType.Playing;
        this.log.visible = newType === ViewType.Playing;
        this._descriptionStage.visible = newType === ViewType.Describing;
    }

    setGameOver() {
        this._gameStage.visible = false;
        this.inventory.visible = false;
        this.description.visible = false;
        this.log.visible = true;
        this._descriptionStage.visible = false;
        this._gameOver.visible = true;
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
    addGameSprite(sprite: PIXI.Sprite, priority = false) {
        const stage = priority ? this._gameStageHigh : this._gameStage;
        stage.addChild(sprite);
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