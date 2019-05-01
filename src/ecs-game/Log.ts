import * as PIXI from 'pixi.js';


export const TEXT_STYLE = new PIXI.TextStyle({
    fontFamily: 'Iosevka, Courier New, monospace',
    fill: 'white',
    fontSize: 12,
    padding: 2,
    lineHeight: 20,
    wordWrap: true,
    wordWrapWidth: 310,
});

const MAX_MSGS = 18;

/**
 * The Log represents a view of messages generated by the game.
 * The game uses the log to append messages describing events in the game,
 * e.g. "You ate the mouse".
 */
class Log {
    private _stage: PIXI.Container = new PIXI.Container();
    private _count: number = 0;
    private _text: PIXI.Text;

    constructor() {
        this._text = new PIXI.Text('', TEXT_STYLE);
        this._text.x = 10
        this._text.y = 10;
        this._stage.addChild(this._text);
    }

    /**
     * In order to be able to see the log messages, the log needs to be placed
     * somewhere in the stage. This function does that.
     * 
     * @param stage the stage to add the log to
     * @param x the x position to place it
     * @param y the y position to place it
     */
    addTo(stage: PIXI.Container, x?: number, y?: number) {
        stage.addChild(this._stage);
        if (x) this._stage.x = x;
        if (y) this._stage.y = y;
    }

    set visible(isVisible: boolean) {
        this._stage.visible = isVisible;
    }

    /**
     * Add a new message to the log.
     * 
     * @param msg the message to append to the log
     */
    addMsg(msg: string) {
        msg += '\n';
        if (this._count < MAX_MSGS) {
            this._count++;
            this._text.text = this._text.text + msg;
        } else {
            const text = this._text.text;
            this._text.text = text.substring(text.indexOf('\n') + 1) + msg;
        }
    }
}
export default Log;