import GameView from './GameView';


interface Pos {
    x: number,
    y: number
}

/**
 * Represents the possible actions a player can take
 * in the normal exploration mode.
 */
export enum Action {
    MoveLeft,
    MoveRight,
    MoveUp,
    MoveDown
}

/**
 * Represents the state of the game on any given turn.
 * 
 * The turn state changes whenever the player takes an action.
 */
export class TurnState {
    private _playerPos: Pos = { x: 0, y: 0 };

    /**
     * Advance the state of the game by having the player take an action.
     * 
     * @param action the action the player takes this turn
     */
    advance(action: Action) {
        switch (action) {
            case Action.MoveLeft:
                this._playerPos.x--;
                break;
            case Action.MoveRight:
                this._playerPos.x++;
                break;
            case Action.MoveUp:
                this._playerPos.y--;
                break;
            case Action.MoveDown:
                this._playerPos.y++;
                break;
        }
    }

    /**
     * Update the view of the game based on the current turn state.
     * 
     * @param view the game view to modify
     */
    update(view: GameView) {
        view.player.x = 32 * this._playerPos.x;
        view.player.y = 32 * this._playerPos.y;
    }
}
