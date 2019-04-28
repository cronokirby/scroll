import * as Pos from './position';
import Collectable from './entities/Collectable';
import { SpriteSheet } from '../sprites';


/**
 * Represents a collection of items we can use.
 * The inventory has a sidebar we use to describe items, as well as a main
 * are with the set of items we have.
 */
class Inventory {
    private _mainStage = new PIXI.Container();
    // this is so that the cursor is above the main stage
    private _cursorStage = new PIXI.Container();
    private _free: Pos.Pos[] = [];
    private _cursor: PIXI.Sprite;
    private _cursorPos: Pos.Pos = {x: 0, y: 0};
    // this is used to move the cursor to the most recent item
    private _lastCursorPos: Pos.Pos = {x: 0, y: 0};

    constructor(sheet: SpriteSheet) {
        this._cursor = sheet.indexSprite(8, 6);
        this._cursorStage.addChild(this._cursor);
        this._cursorStage.x = 320;
        this._mainStage.x = 320;
        for (let y = 15; y >= 0; y--) {
            for (let x = 15; x >= 0; x--) {
                this._free.push({x, y});
            }
        }
    }

    private set cursorPos(newPos: Pos.Pos) {
        this._cursorPos = newPos;
        this._cursor.x = 32 * newPos.x;
        this._cursor.y = 32 * newPos.y;
    }

    /**
     * Add this inventory to another stage.
     */
    addTo(stage: PIXI.Container) {
        stage.addChild(this._mainStage);
        stage.addChild(this._cursorStage);
    }

    set visible(isVisible: boolean) {
        this._mainStage.visible = isVisible;
        this._cursorStage.visible = isVisible;
        if (isVisible) {
            this.cursorPos = this._lastCursorPos;
        }
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
            this._lastCursorPos = pos;
        }
    }

    /**
     * Move the cursor in a certain direction, if possible.
     * @param direction the direction to move the cursor in
     */
    moveCursor(direction: Pos.Direction) {
        const {x, y} = Pos.moved(this._cursorPos, direction);
        if (x >= 0 && x < 16 && y >= 0 && y < 16) {
            this.cursorPos = {x, y};
        }
    }
}
export default Inventory;