import * as Pos from './position';
import Collectable from './entities/Collectable';


/**
 * Represents a collection of items we can use.
 * The inventory has a sidebar we use to describe items, as well as a main
 * are with the set of items we have.
 */
class Inventory {
    private _mainStage = new PIXI.Container();
    private _free: Pos.Pos[] = [];

    constructor() {
        this._mainStage.x = 320;
        for (let y = 15; y >= 0; y--) {
            for (let x = 15; x >= 0; x--) {
                this._free.push({x, y});
            }
        }
    }

    /**
     * Add this inventory to another stage.
     */
    addTo(stage: PIXI.Container) {
        stage.addChild(this._mainStage);
    }

    set visible(isVisible: boolean) {
        this._mainStage.visible = isVisible;
    }

    /**
     * Return true if we can still add items to this inventory.
     */
    canAdd(): boolean {
        return this._free.length > 0;
    }

    /**
     * Add an item to this inventory, if possible.
     * @param item the item to add to this inventory
     */
    add(item: Collectable) {
        const pos = this._free.pop();
        if (pos) {
            item.addTo(this._mainStage);
            item.pos = pos;
        }
    }
}
export default Inventory;