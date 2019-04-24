import * as PIXI from 'pixi.js';
import fixScaling from './fixScaling.js';
import { Control, Controller } from './controller';
import { SpriteSheet } from './sprites';


fixScaling();

const app = new PIXI.Application({
    width: 32 * 16,
    height: 32 * 16,
    resolution: devicePixelRatio
});

window.addEventListener('load', () => {
    const gameEl = document.getElementById('game');
    if (gameEl) {
        gameEl.appendChild(app.view);
    }
})


const controller = new Controller();
controller.onPress(Control.Left, () => console.log('Left'));
controller.onPress(Control.Right, () => console.log('Right'));
controller.onPress(Control.Up, () => console.log('Up'));
controller.onPress(Control.Down, () => console.log('Down'));

PIXI.loader.add(SpriteSheet.deps).load(() => {
    const spriteSheet = new SpriteSheet();
    const spriteA = spriteSheet.indexSprite(0, 0);
    spriteA.x = 64;
    app.stage.addChild(spriteA);
    const spriteB = spriteSheet.indexSprite(2, 0);
    app.stage.addChild(spriteB);
});
