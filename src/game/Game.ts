import { Control, Controller } from '../controller';
import { indexSprite, Color } from '../sprites';
import { ViewType } from './model';
import * as Pos from './position';
import PosSprite from './components/PosSprite';
import GameWorld from './model/GameWorld';
import * as monsters from './monsters';
import * as systems from './systems';
import { createPlayer } from './player';


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

        createPlayer(this._world);
        this.createLeaf({ x: 1, y: 1 });
        this.createLeaf({ x: 2, y: 1 });
        this.createLeaf({ x: 3, y: 1 });
        monsters.mouse(this._world);

        this.updatePlayerStats();
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

    private createLeaf(pos: Pos.Pos) {
        const sprite = new PosSprite(indexSprite(11, 15, Color.Green));
        sprite.pos = pos;
        this._world.addGameSprite(sprite.sprite);
        this._world.world.add({
            collectable: null,
            viewType: ViewType.Playing | ViewType.Describing,
            area: this._world.dungeon.currentArea,
            name: 'a Green Leaf',
            description: 'A refreshing Green Leaf. Chew on it to restore health.',
            consume: { restoreHealth: 5 },
            sprite
        });
    }

    private updatePlayerStats() {
        systems.updatePlayerStats(this._world);
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
        } else if (this._world.currentView === ViewType.Inventory) {
            systems.consume(this._world);
            systems.updatePlayerStats(this._world);
        }
    }

    private moveSprites(direction: Pos.Direction) {
        if (this._world.currentView === ViewType.Playing) {
            systems.movePlayer(this._world, direction);
        } else {
            const moveSprites = systems.moveSprites(direction, this._world.currentView);
            this._world.world.run(moveSprites);
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