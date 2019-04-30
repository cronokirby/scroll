import * as PIXI from 'pixi.js';
import { Controller } from './controller';
import { SpriteSheet } from './sprites';
import { GRID_SIZE, SIDE_PANEL_SIZE, SPRITE_SIZE } from './dimensions';
import Game from './ecs-game/Game';


PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new PIXI.Application({
    width: SIDE_PANEL_SIZE + SPRITE_SIZE * GRID_SIZE,
    height: SPRITE_SIZE * GRID_SIZE,
    resolution: devicePixelRatio
});

window.addEventListener('load', () => {
    const gameEl = document.getElementById('game');
    if (gameEl) {
        gameEl.appendChild(app.view);
    }
})


const controller = new Controller();
PIXI.loader
    .add(SpriteSheet.deps)
    .load(() => {
        const game = new Game(controller);
        game.setStage(app.stage);
    });
