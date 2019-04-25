import * as PIXI from 'pixi.js';

/**
 * Represents an Entity that can move around in a grid.
 * An entity has a sprite, as well as an x and y position.
 * The sprite automatically moves with the x and y position
 */
abstract class Entity {
    private _x: number = 0;
    private _y: number = 0;

    constructor(private _sprite: PIXI.Sprite) {}

    get x(): number {
        return this._x;
    }

    set x(newX: number) {
        this._x = newX;
        this._sprite.x = 32 * newX;
    }

    get y(): number {
        return this._y;
    }

    set y(newY: number) {
        this._y = newY;
        this._sprite.y = 32 * newY;
    }

    get pos(): {x: number, y: number} {
        return {x: this._x, y: this._y};
    }

    set pos({x, y}: {x: number, y: number}) {
        this._x = x;
        this._y = y;
    }

    /**
     * Add this entity to a given stage.
     * 
     * @param stage the stage to add this entity to
     */
    addTo(stage: PIXI.Container) {
        stage.addChild(this._sprite);
    }
}
export default Entity;