import * as PIXI from 'pixi.js';


const STYLE = new PIXI.TextStyle({
    fontFamily: 'Iosevka, Courier New, monospace',
    fill: 'white',
    fontSize: 12,
    padding: 2,
    lineHeight: 20
});


class Log {
    private _stage: PIXI.Container = new PIXI.Container();
    private _text: PIXI.Text;

    constructor() {
        let text = '';
        for (let i = 0; i < 20; ++i) {
            text += `Fearsome Mouse attacks!\n`
        }
        const sprite = new PIXI.Text(text, STYLE);
        sprite.x = 10
        this._stage.addChild(sprite);
        const line = new PIXI.Graphics();
        line.lineStyle(2, 0xAAAAAA, 1);
        line.moveTo(0, 0);
        line.lineTo(0, 600);
        line.x = 310;
        line.y = -10;
        this._stage.addChild(line);
    }

    addTo(stage: PIXI.Container, x?: number, y?: number) {
        stage.addChild(this._stage);
        if (x) this._stage.x = x;
        if (y) this._stage.y = y;
    }
}
export default Log;