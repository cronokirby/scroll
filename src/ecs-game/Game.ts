import { Control, Controller } from '../controller';
import { indexSprite, Color } from '../sprites';
import { baseQuery, ViewType } from './model';
import * as Pos from './position';
import PosSprite from './components/PosSprite';
import GameWorld from './model/GameWorld';
import * as systems from './systems';

/**
 * Represents an instance of the Game.
 */
class Game {
    private _world = new GameWorld();

    constructor(controller: Controller) {
        controller.onPress(Control.Right, this.onRight.bind(this));
        controller.onPress(Control.Left, this.onLeft.bind(this));
        controller.onPress(Control.Up, this.onUp.bind(this));
        controller.onPress(Control.Down, this.onDown.bind(this));
        controller.onPress(Control.Inventory, this.onInventory.bind(this));
        controller.onPress(Control.Interact, this.onInteract.bind(this));
        controller.onPress(Control.Inspect, this.onInspect.bind(this));

        this.createLeaf({ x: 1, y: 1 });
        this.createLeaf({ x: 2, y: 1 });
        this.createLeaf({ x: 3, y: 1 });
        this.createPlayer();
        //this.createInventoryCursor();
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
        this._world.addTo(stage);
    }

    private createPlayer() {
        const sprite = new PosSprite(indexSprite(0, 0));
        this._world.addGameSprite(sprite.sprite);
        this._world.world.add({
            controlMarker: null,
            isPlayer: null,
            viewType: ViewType.Playing,
            sprite
        });
    }

    private createInventoryCursor() {
        const sprite = new PosSprite(indexSprite(8, 6));
        this._world.inventory.addChild(sprite.sprite);
        this._world.world.add({
            controlMarker: null,
            isCursor: null,
            viewType: ViewType.Inventory,
            sprite
        });
    }

    private createLeaf(pos: Pos.Pos) {
        const sprite = new PosSprite(indexSprite(11, 15, Color.Green));
        sprite.pos = pos;
        this._world.addGameSprite(sprite.sprite);
        this._world.world.add({
            collectable: null,
            viewType: ViewType.Playing | ViewType.Describing,
            name: 'a Green Leaf',
            description: 'A refreshing Green Leaf. Chew on it to restore health.',
            sprite
        });
    }

    private onInventory() {
        if (this._world.currentView === ViewType.Inventory) {
            this._world.currentView = ViewType.Playing;
        } else {
            this._world.currentView = ViewType.Inventory;
            systems.setDescription(this._world, ViewType.Inventory);
        }
    }

    private onInspect() {
        if (this._world.currentView === ViewType.Describing) {
            this._world.currentView = ViewType.Playing;
        } else {
            this._world.currentView = ViewType.Describing;
            const playerPos = systems.playerPos(this._world);
            systems.moveCursor(this._world, ViewType.Describing, playerPos);
            systems.setDescription(this._world, ViewType.Describing);
        }
    }

    private onInteract() {
        if (this._world.currentView === ViewType.Playing) {
            systems.pickUpCollectables(this._world);
        }
    }

    private moveSprites(direction: Pos.Direction) {
        const moveSprites = systems.moveSprites(direction, this._world.currentView);
        this._world.world.run(moveSprites);
        if (this._world.currentView !== ViewType.Playing) {
            systems.setDescription(this._world, this._world.currentView);
        }
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