import { World } from 'micro-ecs';
import { Control, Controller } from '../controller';
import { indexSprite } from '../sprites';
import { baseQuery, Model } from './model';
import * as Pos from './position';
import PosSprite from './components/PosSprite';

/**
 * Represents an instance of the Game.
 */
class Game {
    private _world = new World<Model>();
    private _stage = new PIXI.Container();

    constructor(controller: Controller) {
        const sprite = new PosSprite(indexSprite(0, 0));
        this._world.add({ sprite });
        this._stage.addChild(sprite.sprite);
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

    private moveSprites(direction: Pos.Direction) {
        this._world.run(baseQuery.select('sprite').forEach(x => {
            const pos = x.sprite.pos;
            const newPos = Pos.moved(pos, direction);
            if (Pos.inGrid(newPos)) {
                x.sprite.pos = newPos;
            }
        }));
    }

    private onRight() {
        this.moveSprites(Pos.Direction.Right);
    }

    private onLeft() {
        this.moveSprites(Pos.Direction.Left);
    }

    private onUp() {
        this.moveSprites(Pos.Direction.Up);
    }

    private onDown() {
        this.moveSprites(Pos.Direction.Down);
    }
}
export default Game;