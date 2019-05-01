import { Control, Controller } from '../controller';
import { indexSprite, Color } from '../sprites';
import { baseQuery, ViewType } from './model';
import * as Pos from './position';
import PosSprite from './components/PosSprite';
import GameWorld from './model/GameWorld';

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

        this.createLeaf({x: 1, y: 1});
        this.createPlayer();
        this.createInventoryCursor();
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
            viewType: ViewType.Playing,
            sprite
        });
    }

    private createInventoryCursor() {
        const sprite = new PosSprite(indexSprite(8, 6));
        this._world.inventory.addChild(sprite.sprite);
        this._world.world.add({
            controlMarker: null,
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
            viewType: ViewType.Playing,
            sprite
        });
    }

    private controlQuery() {
        return baseQuery
            .select('controlMarker', 'sprite', 'viewType')
            .first()
            .filter(x => x.viewType === this._world.currentView);
    }

    private onInventory() {
        if (this._world.currentView === ViewType.Inventory) {
            this._world.currentView = ViewType.Playing;
        } else {
            this._world.currentView = ViewType.Inventory;
        }
    }

    private onInteract() {
        if (this._world.currentView === ViewType.Playing) {
            this._world.world.run(this.controlQuery().forEach(x => {
                const playerPos = x.sprite.pos;
                const collectables = baseQuery
                    .select('collectable', 'sprite', 'viewType')
                    .filter(x => {
                        const rightView = x.viewType === ViewType.Playing
                        const rightPos = Pos.same(x.sprite.pos, playerPos);
                        return rightView && rightPos;
                    });
                this._world.world.run(collectables.map(x => {
                    if (this._world.inventory.add(x.sprite)) {
                        this._world.removeGameSprite(x.sprite.sprite);
                        return {viewType: ViewType.Inventory};
                    }
                    return {};
                }));
            }))
        }
    }

    private moveSprites(direction: Pos.Direction) {
        this._world.world.run(this.controlQuery().forEach(x => {
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