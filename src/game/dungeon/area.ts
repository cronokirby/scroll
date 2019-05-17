import * as PIXI from 'pixi.js';
import { GRID_SIZE } from '../../dimensions';
import { indexSprite, Color } from '../../sprites';
import PosSprite from '../components/PosSprite';
import * as Pos from '../position';
import GameWorld from '../model/GameWorld';
import { door } from '../entities/doors';
import { shuffle } from '../../utils';
import { randomItem } from '../entities/items';
import { randomMonster } from '../entities/monsters';


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


/**
 * Holds information about a link between two points.
 * 
 * This is useful in order to make sure areas can create doors
 * corresponding to the exits that lead back into that area.
 */
export interface Link {
    /**
     * The location this door comes from
     */
    readonly from: Pos.Pos;
    /**
     * The location this door leads to
     */
    readonly to: Pos.Pos;
}

/**
 * Represents information about the parent of an area.
 * 
 * This is useful so that children of an area can create
 * doors leading to the right place.
 */
export interface ParentInfo {
    /**
     * What id did the parent have?
     */
    readonly id: AreaID;
    /**
     * What location did the parent lead to?
     */
    readonly link: Link;
    /**
     * How dangerous was our parent?
     */
    readonly danger: number;
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


function wallSides(): Pos.Pos[] {
    const walls: Pos.Pos[] = [];
    for (let i = 0; i < GRID_SIZE; ++i) {
        walls.push({ x: i, y: 0 });
        walls.push({ x: i, y: 15 });
        walls.push({ x: 0, y: i });
        walls.push({ x: 15, y: i });
    }
    return walls;
}

// Returns the free slots in the middle
function freeTiles(): Pos.Pos[] {
    const free: Pos.Pos[] = [];
    for (let x = 1; x < GRID_SIZE - 1; ++x) {
        for (let y = 1; y < GRID_SIZE - 1; ++y) {
            free.push({ x, y });
        }
    }
    return free;
}

// Find a good place to put a door
function doorPos(dir: Pos.Direction): Pos.Pos {
    switch (dir) {
        case Pos.Direction.Left:
            return { x: 0, y: GRID_SIZE / 2 };
        case Pos.Direction.Right:
            return { x: GRID_SIZE - 1, y: GRID_SIZE / 2 };
        case Pos.Direction.Up:
            return { x: GRID_SIZE / 2, y: 0 };
        case Pos.Direction.Down:
            return { x: GRID_SIZE / 2, y: GRID_SIZE - 1 };
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
    private _exits: Map<string, Link> = new Map();
    public readonly danger: number = 0;

    constructor(private readonly _id: AreaID, private readonly _world: GameWorld, parent?: ParentInfo) {
        let availableDirs = Pos.DIRECTIONS;
        const placedDoors: Pos.Pos[] = [];

        if (parent) {
            this.danger = parent.danger + 1;
            const pos = parent.link.to;
            this.createDoor(pos, parent.link.from, parent.id);
            placedDoors.push(pos);
            availableDirs = availableDirs.filter(dir => !Pos.same(doorPos(dir), pos));
        }

        shuffle(availableDirs);
        const toTake = Math.floor(Math.random() * availableDirs.length) + 1;
        let i = 0;
        for (const dir of availableDirs.slice(0, toTake)) {
            const opDir = Pos.oppositeDir(dir);
            const pos = doorPos(dir);
            this.createDoor(pos, doorPos(opDir), this._id.next(i));
            placedDoors.push(pos);
            ++i;
        }

        const wallTiles = wallSides().filter(x => !placedDoors.find(y => Pos.same(x, y)));
        for (let pos of wallTiles) {
            this.createWall(pos);
        }

        const free: Pos.Pos[] = freeTiles();
        shuffle(free);

        const itemAmount = Math.floor(Math.random() * 4);
        for (let i = 0; i < itemAmount; ++i) {
            const pos = free.pop();
            if (pos) {
                randomItem(this.danger)(this._world, this, pos);
            }
        }

        const monsterAmount = Math.floor(Math.random() * 4);
        for (let i = 0; i < monsterAmount; ++i) {
            const pos = free.pop();
            if (pos) {
                randomMonster(this.danger)(this._world, this, pos);
            }
        }
    }

    private createWall(pos: Pos.Pos) {
        const sprite = new PosSprite(indexSprite(0, 8, Color.Gray));
        sprite.pos = pos;
        this._stage.addChild(sprite.sprite);
        this._wallGrid.set(pos, Tile.Wall);
    }

    private createDoor(pos: Pos.Pos, to: Pos.Pos, areaID: AreaID) {
        const destination = { areaID, position: to };
        this._wallGrid.set(pos, Tile.Door);
        door(this._world, this, pos, destination);
        this._exits.set(areaID.key, { from: pos, to });
    }

    /**
     * Add the visual elements of this area to a stage.
     * 
     * @param stage the stage to add this area to
     */
    addTo(stage: PIXI.Container) {
        stage.addChild(this._stage);
    }

    /**
     * Change the visibility of this area.
     */
    set visible(newVisible: boolean) {
        this._stage.visible = newVisible;
    }


    exitLink(area: AreaID): Link | undefined {
        return this._exits.get(area.key);
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