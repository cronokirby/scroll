import * as PIXI from 'pixi.js';
import { GRID_SIZE } from '../../dimensions';
import { indexSprite, Color } from '../../sprites';
import PosSprite from '../components/PosSprite';
import * as Pos from '../position';
import GameWorld from '../model/GameWorld';
import { door } from '../entities/doors';


/**
 * Represents a unique ID for an Area.
 * 
 * Note that this is a completely immutable class. Generating new IDs
 * comes with no side-effects.
 * 
 * This class exists in order to easily ensure that the IDs we use to
 * identify different Areas stay unique. Outside of this file, this class
 * shouldn't be interacted with that much, even though its methods are publics.
 * When comparing Areas, the comparison is done via this class, but a method exists
 * on Area to do so. Generating new Area IDs is also something that
 * only needs to be done in this file.
 */
export class AreaID {
    /**
     * This should be the first ID used for an Area, and all other
     * IDs should be generated either directly from this one, or from descendants
     * of this one.
     */
    static readonly FIRST = new AreaID('0');

    private constructor(private readonly _id: string) { }

    /**
     * Get a string representation of this Area ID.
     * 
     * This is safe to be used as a unique key, e.g. in HashMaps.
     */
    get key(): string {
        return this._id;
    }

    /**
     * Check whether or not this AreaID is the same as another.
     * 
     * @param that the other area id to compare to
     */
    isSame(that: AreaID): boolean {
        return this._id === that._id;
    }

    /**
     * Construct a new Area ID given a sub ID.
     * 
     * Given 2 distinct Area IDs, calling next with any number will still be distinct.
     * Calling next on the same base area id with distinct numbers
     * will yield distinct Area IDs
     * 
     * This is useful when constructing new IDs based on a root one.
     * For example, when constructing the ids of rooms next to a starting room,
     * we want to make sure that IDs are unique, which is why we make sure to tie
     * the newly generated IDs back to an original area ID.
     * 
     * @param id the ID to add on to this area ID
     */
    next(id: number): AreaID {
        return new AreaID(this._id + id);
    }
}


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

    get({ x, y }: Pos.Pos) {
        return this._data[x][y];
    }

    set({ x, y }: Pos.Pos, val: T) {
        this._data[x][y] = val;
    }
}

/**
 * Represents an Area of a dungeon, where entities reside, and we can move.
 * 
 * This contains tile elements, and allows us to query to know whether
 * or not we can move to certain tiles.
 */
export class Area {
    private _stage = new PIXI.Container();
    private _wallGrid = new Grid<Tile>(() => Tile.Free);

    constructor(private readonly _id: AreaID, private readonly _world: GameWorld) {
        for (let i = 0; i < GRID_SIZE; ++i) {
            this.createWall({ x: i, y: 0 });
            this.createWall({ x: i, y: 15 });
            this.createWall({ x: 0, y: i });
            this.createWall({ x: 15, y: i });
        }
        this.createDoor({ x: 5, y: 5 }, { x: 4, y: 4 }, 1);
    }

    private createWall(pos: Pos.Pos) {
        const sprite = new PosSprite(indexSprite(0, 8, Color.Gray));
        sprite.pos = pos;
        this._stage.addChild(sprite.sprite);
        this._wallGrid.set(pos, Tile.Wall);
    }

    private createDoor(pos: Pos.Pos, to: Pos.Pos, sub: number) {
        const destination = { areaID: this._id.next(sub), position: to };
        this._wallGrid.set(pos, Tile.Door);
        door(this._world, this, pos, destination);
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
        return this._id.isSame(that._id);
    }
}