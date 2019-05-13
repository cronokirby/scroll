import * as PIXI from 'pixi.js';
import { GRID_SIZE } from '../../dimensions';
import { indexSprite, Color } from '../../sprites';
import PosSprite from '../components/PosSprite';
import * as Pos from '../position';


enum Tile { Wall, Door, Free };

class Grid<T> {
    private _data: T[][];

    constructor(makeVal: () => T) {
        this._data = Array(GRID_SIZE);
        for (let x = 0; x < GRID_SIZE; ++x) {
            this._data[x] = Array(GRID_SIZE);
            for (let y = 0; y < GRID_SIZE; ++y) {
                this._data[x][y] = makeVal();
            }
        }
    }

    get({x, y}: Pos.Pos) {
        return this._data[x][y];
    }

    set({x, y}: Pos.Pos, val: T) {
        this._data[x][y] = val;
    }
}

/**
 * Represents an Area of a dungeon, where entities reside, and we can move.
 * 
 * This contains tile elements, and allows us to query to know whether
 * or not we can move to certain tiles.
 */
class Area {
    private _stage = new PIXI.Container();
    private _wallGrid = new Grid<Tile>(() => Tile.Free);

    constructor(private readonly _id: number) {
        for (let x = 0; x < GRID_SIZE; ++x) {
            const sprite1 = new PosSprite(indexSprite(0, 8, Color.Gray));
            const sprite2 = new PosSprite(indexSprite(0, 8, Color.Gray));
            sprite1.pos = { x, y: 0 };
            sprite2.pos = { x, y: 15 };
            this._stage.addChild(sprite1.sprite);
            this._stage.addChild(sprite2.sprite);
            this._wallGrid.set({x, y: 0}, Tile.Door);
            this._wallGrid.set({x, y: 15}, Tile.Door);
        }
    }

    /**
     * Add the visual elements of this area to a stage.
     * 
     * @param stage the stage to add this area to
     */
    addTo(stage: PIXI.Container) {
        stage.addChild(this._stage);
    }

    setDoor(pos: Pos.Pos) {
        this._wallGrid.set(pos, Tile.Door);
    }

    /**
     * Check if there's a wall at a given position.
     * 
     * @param pos the position to check
     */
    isWall(pos: Pos.Pos): boolean {
        if (!Pos.inGrid(pos)) return true;
        return this._wallGrid.get(pos) === Tile.Wall;
    }

    /**
     * Check if there's a wall or a door at a given position.
     * 
     * This is useful in addition to isWall, since enemies
     * aren't able to walk over doors.
     * 
     * @param pos the position to check
     */
    isHard(pos: Pos.Pos): boolean {
        if (!Pos.inGrid(pos)) return true;
        const tile = this._wallGrid.get(pos);
        return tile === Tile.Wall || tile === Tile.Door;
    }

    /**
     * Check whether or not this area is the same as another area.
     * 
     * This is useful to only advance entities in the same area as another,
     * for example.
     * 
     * @param that the other area
     */
    isSame(that: Area) {
        return this._id === that._id;
    }
}
export default Area;