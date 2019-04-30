import { World } from 'micro-ecs';
import { Control, Controller } from '../controller';
import { indexSprite } from '../sprites';
import { baseQuery, Model } from './model';

/**
 * Represents an instance of the Game.
 */
class Game {
    private _world = new World<Model>();
    private _stage = new PIXI.Container();

    constructor(controller: Controller) {
        const sprite = indexSprite(0, 0);
        this._world.add({ sprite });
        this._stage.addChild(sprite);
        this._stage.x = 320;
        controller.onPress(Control.Right, this.onRight.bind(this));
        controller.onPress(Control.Left, this.onLeft.bind(this));
        controller.onPress(Control.Up, this.onUp.bind(this));
        controller.onPress(Control.Down, this.onDown.bind(this));
    }

    /**
     * Set the stage to display things in.
     * 
     * This function is necessary in order to make all the sprites
     * contained in the game visible outside, by adding the
     * game's visible stage to the given stage.
     * 
     * @param stage the stage to add 
     */
    setStage(stage: PIXI.Container) {
        stage.addChild(this._stage);
    }

    private onRight() {
        this._world.run(baseQuery.select('sprite').forEach(x => {
            x.sprite.x += 32;
        }));
    }

    private onLeft() {
        this._world.run(baseQuery.select('sprite').forEach(x => {
            x.sprite.x -= 32;
        }));
    }

    private onUp() {
        this._world.run(baseQuery.select('sprite').forEach(x => {
            x.sprite.y -= 32;
        }));
    }

    private onDown() {
        this._world.run(baseQuery.select('sprite').forEach(x => {
            x.sprite.y += 32;
        }));
    }
}
export default Game;