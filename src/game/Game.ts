import * as PIXI from 'pixi.js';
import { Control, Controller } from '../controller';
import { SpriteSheet } from '../sprites';
import GameView from './GameView';
import { Action, TurnState } from './turnState';

/**
 * Represents an entire Game.
 * 
 * The game is responsible for reacting to user input,
 * advancing the state of the game, and setting up the
 * sprites in the stage for rendering.
 */
class Game {
    private _view: GameView;
    private _turnState: TurnState;

    /**
     * Construct a new game given sprite and control information.
     * 
     * @param sheet the sprite sheet for this game
     * @param controller the controller for player input
     */
    constructor(sheet: SpriteSheet, controller: Controller) {
        this._view = new GameView(sheet);
        this._turnState = new TurnState();
        controller.onPress(Control.Left, () => {
            this.advance(Action.MoveLeft)
        });
        controller.onPress(Control.Right, () => {
            this.advance(Action.MoveRight)
        });
        controller.onPress(Control.Up, () => {
            this.advance(Action.MoveUp)
        });
        controller.onPress(Control.Down, () => {
            this.advance(Action.MoveDown)
        });
    }

    private advance(action: Action) {
        this._turnState.advance(action);
        this._turnState.update(this._view);
    }

    /**
     * Set the stage for this game, ready for drawing.
     * 
     * This should be called after the game is instantiated in order
     * to set up rendering.
     * 
     * @param container the container to draw things inside
     */
    setStage(container: PIXI.Container) {
        this._view.setStage(container);
    }
}
export default Game;
