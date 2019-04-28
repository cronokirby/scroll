import * as Pos from './position';
import Collectable from './entities/Collectable';
import { SpriteSheet } from '../sprites';
import { GRID_SIZE, SIDE_PANEL_SIZE } from '../dimensions';


const TEXT_STYLE = new PIXI.TextStyle({
    fontFamily: 'Iosevka, Courier New, monospace',
    fill: 'white',
    fontSize: 12,
    padding: 2,
    lineHeight: 20,
    wordWrap: true,
    wordWrapWidth: 300,
});   


/**
 * Represents a grid of items we can look up by position.
 * This mainly exists to be able to get the description of the item
 * under the cursor, by looking up the item at a certain position.
 */
class ItemGrid {
    private _items: Collectable[][];

    constructor() {
        this._items = Array(GRID_SIZE);
        for (let x = 0; x < GRID_SIZE; ++x) {
            this._items[x] = Array(GRID_SIZE);
        }
    }

    /**
     * Add an item to the grid.
     * @param item the item to add
     * @param param1 the position of that item in the inventory
     */
    addItem(item: Collectable, {x, y}: Pos.Pos) {
        this._items[x][y] = item;
    }

    /**
     * Get the description of the item at a certain position in the
     * inventory. Or an empty string if that position has no item.
     */
    getDescription({x, y}: Pos.Pos): string {
        const item = this._items[x][y];
        if (!item) return '';
        return item.description;
    }
}


/**
 * Represents a collection of items we can use.
 * The inventory has a sidebar we use to describe items, as well as a main
 * are with the set of items we have.
 */
class Inventory {
    private _mainStage = new PIXI.Container();
    // this is so that the cursor is above the main stage
    private _cursorStage = new PIXI.Container();
    private _text = new PIXI.Text('', TEXT_STYLE);
    private _items = new ItemGrid();
    private _free: Pos.Pos[] = [];
    private _cursor: PIXI.Sprite;
    private _cursorPos: Pos.Pos = {x: 0, y: 0};
    // this is used to move the cursor to the most recent item
    private _lastCursorPos: Pos.Pos = {x: 0, y: 0};

    constructor(sheet: SpriteSheet) {
        this._text.y = 40;
        this._text.x = 10;
        this._cursor = sheet.indexSprite(8, 6);
        this._cursorStage.addChild(this._cursor);
        this._cursorStage.x = SIDE_PANEL_SIZE;
        this._mainStage.x = SIDE_PANEL_SIZE;
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
        const description = this._items.getDescription(newPos);
        this._text.text = description;
    }

    /**
     * Add this inventory to another stage.
     */
    addTo(stage: PIXI.Container) {
        stage.addChild(this._text);
        stage.addChild(this._mainStage);
        stage.addChild(this._cursorStage);
    }

    set visible(isVisible: boolean) {
        this._mainStage.visible = isVisible;
        this._cursorStage.visible = isVisible;
        this._text.visible = isVisible;
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
            this._items.addItem(item, pos);
            this._lastCursorPos = pos;
        }
    }

    /**
     * Move the cursor in a certain direction, if possible.
     * @param direction the direction to move the cursor in
     */
    moveCursor(direction: Pos.Direction) {
        const pos = Pos.moved(this._cursorPos, direction);
        if (Pos.inGrid(pos)) {
            this.cursorPos = pos;
        }
    }
}
export default Inventory;