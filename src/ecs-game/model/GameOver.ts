import * as PIXI from 'pixi.js';


export const TEXT_STYLE = new PIXI.TextStyle({
    fontFamily: 'Iosevka, Courier New, monospace',
    fill: 'white',
    fontSize: 64,
    padding: 10,
    lineHeight: 20,
});


/**
 * Represents the component that gets shown when the player has died,
 * and the game is over.
 */
class GameOver {
    private _stage = new PIXI.Container();
    private _text = new PIXI.Text('Game Over', TEXT_STYLE);

    constructor() {
        this._stage.addChild(this._text);
        this._text.x = 112;
        this._text.y = 208;
    }

    /**
     * Add this component to a specific stage
     */
    addTo(stage: PIXI.Container, x?: number, y?: number) {
        stage.addChild(this._stage);
        if (x) this._stage.x = x;
        if (y) this._stage.y = y;
    }

    set visible(isVisible: boolean) {
        this._stage.visible = isVisible;
    }
}
export default GameOver;