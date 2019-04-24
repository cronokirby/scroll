import * as PIXI from 'pixi.js';
import { sheet } from './loader.js';
import fixScaling from './fixScaling.js';

fixScaling();

const app = new PIXI.Application({
    width: 640,
    height: 640,
    resolution: devicePixelRatio
});

window.addEventListener('load', () => {
    document.getElementById('game').appendChild(app.view);
})


PIXI.loader.add(sheet).load(() => {
    const rect = new PIXI.Rectangle(0, 0, 16, 16);
    const texture = PIXI.loader.resources[sheet].texture;
    texture.frame = rect;
    const sprite = new PIXI.Sprite(texture);
    sprite.scale.set(2, 2);
    app.stage.addChild(sprite);
});
