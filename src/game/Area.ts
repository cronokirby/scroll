import { Color, SpriteSheet } from '../sprites';
import Entity from './Entity';


interface Tile {
    sprite: PIXI.Sprite | null,
    isWall: boolean
}


/**
 * Represents a grid that can contain a tile in every slot.
 * 
 * This is useful to represent the tiles of an area, such as walls
 * and floors. This isn't so useful in the case where we have entities moving
 * around, or that we can interact with.
 */
class TileGrid {
    private _tiles: Tile[][];

    constructor(
        private _xSize: number,
        private _ySize: number,
        private _stage: PIXI.Container
    ) {
        const size = this._xSize * this._ySize;
        this._tiles = Array(this._xSize);
        for (let x = 0; x < this._xSize; ++x) {
            const arr = Array(this._ySize);
            this._tiles[x] = arr;
            for (let y = 0; y < this._ySize; ++y) {
                arr[y] = { sprite: null, isWall: false };
            }
        }
    }

    /**
     * Set a specific tile in the grid to a certain sprite.
     * 
     * This will automatically change the position of the sprite to be in
     * the right place in the larger container.
     */
    setTile(x: number, y: number, sprite: PIXI.Sprite, isWall: boolean = false) {
        this._tiles[x][y] = { sprite, isWall };
        sprite.x = 32 * x;
        sprite.y = 32 * y;
        this._stage.addChild(sprite);
    }

    /**
     * Remove the tile in a given slot.
     * 
     * This will automatically clean up the slot from the container.
     */
    removeTile(x: number, y: number) {
        const sprite = this._tiles[x][y].sprite;
        if (sprite) {
            sprite.destroy();
        }
        this._tiles[x][y] = { sprite: null, isWall: false };
    }

    /**
     * Check whether or not a certain slot is a wall.
     * Out of bounds is considered a wall.
     */
    isWall(x: number, y: number): boolean {
        if (x < 0 || x >= this._xSize) return true;
        if (y < 0 || y >= this._ySize) return true;
        return this._tiles[x][y].isWall;
    }
}

/**
 * Represents an Area we can explore, containing a finite grid.
 * The grid contains floors and walls, as well as different entites we
 * can interact with.
 */
class Area {
    private _stage = new PIXI.Container();
    private _grid = new TileGrid(16, 16, this._stage);

    constructor(sheet: SpriteSheet) {
        const positions = [{ x: 1, y: 1 }, { x: 2, y: 4 }];
        for (let { x, y } of positions) {
            const sprite = sheet.indexSprite(0, 8, Color.Gray);
            this._grid.setTile(x, y, sprite, true);
        }
        const sprite = sheet.indexSprite(3, 8, Color.Gray);
        this._grid.setTile(10, 10, sprite);
    }

    /**
     * Add this area to a given stage.
     * 
     * @param stage the stage to add this area to 
     */
    addTo(stage: PIXI.Container) {
        stage.addChild(this._stage);
    }

    /**
     * Move an entity in this area, stopping for walls.
     * 
     * @param entity the entity to try and move
     */
    moveEntity(entity: Entity, x: number, y: number) {
        if (!this._grid.isWall(x, y)) {
            entity.x = x;
            entity.y = y;
        }
    }
}
export default Area;