import { Color, SpriteSheet } from '../sprites';
import LivingEntity from './entities/LivingEntity';
import * as Pos from './position';
import { Door } from './floor';


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
    private _doors: Door[] = [];
    private _entities: LivingEntity[] = [];
    private _player: LivingEntity;
    private _tookTurn: Set<LivingEntity> = new Set([]);

    constructor(private _sheet: SpriteSheet, ...walls: Pos.Pos[]) {
        for (let { x, y } of walls) {
            const sprite = this._sheet.indexSprite(0, 8, Color.Gray);
            this._grid.setTile({x, y}, sprite, true);
        }
    }

    addDoors(...doors: Door[]) {
        this._doors = doors;
        for (let door of doors) {
            const sprite = this._sheet.indexSprite(13, 8, Color.Gray);
            this._grid.setTile(door.pos, sprite, true);
        }
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
        this.move(entity, pos, false);
    }

    /**
     * Move the player to a new position.
     * 
     * This needs special handling in order to advance all the other entities.
     */
    movePlayer(pos: Pos.Pos, force=false) {
        if (force) {
            this._player.pos = pos;
            return;
        }
        this.move(this._player, pos, true);
        this.advance();
    }

    set player(newPlayer: LivingEntity) {
        this._player = newPlayer;
    }

    /**
     * Get the current position of the player.
     * This is necessary for the AI of many monsters, since they might
     * want to follow or attack the player.
     */
    get playerPos(): Pos.Pos {
        return this._player.pos;
    }

    /**
     * Set the visibility of this area.
     */
    set visible(isVisible: boolean) {
        this._stage.visible = isVisible;
    }


    private move(entity: LivingEntity, pos: Pos.Pos, player: boolean) {
        if (player) {
            const door = this._doors.find(d => Pos.same(d.pos, pos));
            if (door) {
                door.follow();
                return;
            }
        }
        if (this._grid.isWall(pos)) return;
        if (!player && Pos.same(this._player.pos, pos)) {
            entity.fight(this._player);
            return;
        }
        const enemy = this._entities.find(e => Pos.same(e.pos, pos));
        if (enemy) {
            if (player) {
                entity.fight(enemy);
                if (enemy.isDead()) {
                    this.removeDeadEntities();
                    return;
                }
                enemy.fight(entity);
                this._tookTurn.add(enemy);
            }
            return;
        }
        entity.pos = pos;
    }

    private removeDeadEntities() {
        this._entities = this._entities.filter(e => {
            if (e.isDead()) {
                e.die();
                return false;
            } else {
                return true;
            }
        });
    }
    
    private advance(): void {
        for (let e of this._entities) {
            if (!this._tookTurn.has(e)) {
                e.advance(this);
            }
        }
        this._tookTurn = new Set([]);
        this.removeDeadEntities();
    }
}
export default Area;