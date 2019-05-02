import * as PIXI from 'pixi.js';


export const TEXT_STYLE = new PIXI.TextStyle({
    fontFamily: 'Iosevka, Courier New, monospace',
    fill: 'white',
    fontSize: 16,
    padding: 2,
    lineHeight: 20
});

/**
 * Represents the overview of player stats such as health and mp.
 */
class ShortStats {
    private _text = new PIXI.Text('', TEXT_STYLE);

    setStats(health: number, maxHealth: number) {
        this._text.text = `${health} / ${maxHealth} HP`;
    }

    addTo(stage: PIXI.Container, x?: number, y?: number) {
        stage.addChild(this._text);
        if (x) this._text.x = x;
        if (y) this._text.y = y;
    }
}
export default ShortStats;