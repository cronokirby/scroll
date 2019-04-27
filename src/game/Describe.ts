import { SpriteSheet } from "../sprites";
import * as Pos from "./position";
import { Floor } from "./floor";


export const TEXT_STYLE = new PIXI.TextStyle({
    fontFamily: 'Iosevka, Courier New, monospace',
    fill: 'white',
    fontSize: 12,
    padding: 2,
    lineHeight: 20,
    wordWrap: true,
    wordWrapWidth: 320,
});


/**
 * Represents a utility allowing us to describe different elements
 * in the game view.
 */
class Describe {
    private _stage: PIXI.Container = new PIXI.Container();
    private _text = new PIXI.Text('Hello', TEXT_STYLE);
    private _cursor: PIXI.Sprite;
    private _cursorPos: Pos.Pos = {x: 0, y: 0};

    constructor(sheet: SpriteSheet, private _floor: Floor) {
        this._cursor = sheet.indexSprite(8, 6);
        this._text.y = 40;
        this._text.x = 10;
        this._stage.addChild(this._cursor);
        this._stage.addChild(this._text);
        this.cursorPos = {x: 0, y: 0};
    }

    private set cursorPos(newPos: Pos.Pos) {
        this._cursorPos = newPos;
        this._cursor.x = 320 + 32 * newPos.x;
        this._cursor.y = 32 * newPos.y;
        const description = this._floor.getDescription(newPos);
        this._text.text = description;
    }

    moveCursor(direction: Pos.Direction) {
        const {x, y} = Pos.moved(this._cursorPos, direction);
        if (x >= 0 && x < 16 && y >= 0 && y < 16) {
            this.cursorPos = {x, y};
        }
    }

    addTo(stage: PIXI.Container) {
        stage.addChild(this._stage);
    }

    hide() {
        this._stage.visible = false;
    }

    show(newPos: Pos.Pos) {
        this._stage.visible = true;
        this.cursorPos = newPos;
    }
}
export default Describe;