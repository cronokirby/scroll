import * as PIXI from 'pixi.js';
import { Control, Controller } from '../controller';
import { SpriteSheet } from '../sprites';


class Game {
    private _player: PIXI.Sprite;

    constructor(private _sheet: SpriteSheet, private _controller: Controller) {
        this._player = this._sheet.indexSprite(0, 0);
        this._controller.onPress(Control.Left, () => {
            this._player.x -= 32;
        });
        this._controller.onPress(Control.Right, () => {
            this._player.x += 32;
        });
        this._controller.onPress(Control.Up, () => {
            this._player.y -= 32;
        });
        this._controller.onPress(Control.Down, () => {
            this._player.y += 32;
        });
    }

    setStage(container: PIXI.Container) {
        container.addChild(this._player);
    }
}
export default Game;
