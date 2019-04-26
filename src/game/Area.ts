import { Color, SpriteSheet } from '../sprites';
import LivingEntity from './entities/LivingEntity';
import * as Pos from './position';


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
    setTile({x, y}: Pos.Pos, sprite: PIXI.Sprite, isWall: boolean = false) {
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
    removeTile({x, y}: Pos.Pos) {
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
    isWall({x, y}: Pos.Pos): boolean {
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
    private _entities: LivingEntity[] = [];
    private _player: LivingEntity;
    private _tookTurn: Set<LivingEntity> = new Set([]);

    constructor(sheet: SpriteSheet) {
        const positions = [{ x: 1, y: 1 }, { x: 2, y: 4 }];
        for (let { x, y } of positions) {
            const sprite = sheet.indexSprite(0, 8, Color.Gray);
            this._grid.setTile({x, y}, sprite, true);
        }
        const sprite = sheet.indexSprite(3, 8, Color.Gray);
        this._grid.setTile({x: 10, y: 10}, sprite);
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
     * This adds a living entity both logically and visually.
     * 
     * @param entity the living entity to add
     */
    addEntity(entity: LivingEntity, {x, y}: Partial<Pos.Pos>) {
        this._entities.push(entity);
        entity.addTo(this._stage);
        if (x) entity.x = x;
        if (y) entity.y = y;
    }

    set player(newPlayer: LivingEntity) {
        this._player = newPlayer;
    }

    private move(entity: LivingEntity, player: boolean, pos: Pos.Pos) {
        if (this._grid.isWall(pos)) return;
        if (!player && Pos.same(this._player.pos, pos)) {
            entity.fight(this._player);
            return;
        }
        if (player) {
            const enemy = this._entities.find(e => Pos.same(e.pos, pos));
            if (enemy) {
                entity.fight(enemy);
                enemy.fight(entity);
                this._tookTurn.add(enemy);
                return;
            }
        }
        entity.pos = pos;
    }

    /**
     * Check whether or not a certain position has a wall.
     * This is useful to make decisions for enemy AI.
     */
    isWall(pos: Pos.Pos): boolean {
        return this._grid.isWall(pos);
    }

    /**
     * Try and move an entity to a new position.
     * 
     * @param entity the entity to move
     */
    moveEntity(entity: LivingEntity, pos: Pos.Pos) {
        this.move(entity, false, pos);
    }

    /**
     * Move the player to a new position.
     * 
     * This needs special handling in order to advance all the other entities.
     */
    movePlayer(pos: Pos.Pos) {
        this.move(this._player, true, pos);
        this.advance();
    }

    private advance(): void {
        for (let e of this._entities) {
            if (!this._tookTurn.has(e)) {
                e.advance(this);
            }
        }
        this._tookTurn = new Set([]);
    }
}
export default Area;