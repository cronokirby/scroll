import { SpriteSheet } from '../sprites';

interface Tile {
    sprite: PIXI.Sprite | null,
    isWall: boolean
}


class SpriteGrid {
    private _tiles: Tile[][];

    constructor(xSize: number, ySize: number, private _stage: PIXI.Container) {
        const size = xSize * ySize;
        this._tiles = Array(xSize);
        for (let x = 0; x < xSize; ++x) {
            const arr = Array(ySize);
            this._tiles[x] = arr;
            for (let y = 0; y < ySize; ++y) {
                arr[y] = { sprite: null, isWall: false };
            }
        }
    }

    setTile(x: number, y: number, sprite: PIXI.Sprite, isWall: boolean = false) {
        this._tiles[x][y] = { sprite, isWall };
        sprite.x = 32 * x;
        sprite.y = 32 * y;
        this._stage.addChild(sprite);
        console.log(sprite);
    }

    removeTile(x: number, y: number) {
        const sprite = this._tiles[x][y].sprite;
        if (sprite) {
            sprite.destroy();
        }
        this._tiles[x][y] = { sprite: null, isWall: false };
    }

    isWall(x: number, y: number): boolean {
        return this._tiles[x][y].isWall;
    }
}


class Area {
    private _stage = new PIXI.Container();
    private _grid = new SpriteGrid(16, 16, this._stage);

    constructor(sheet: SpriteSheet) {
        const positions = [{ x: 1, y: 1 }, { x: 2, y: 4 }];
        for (let { x, y } of positions) {
            this._grid.setTile(x, y, sheet.indexSprite(0, 8), true);
        }
        this._grid.setTile(10, 10, sheet.indexSprite(3, 15))
    }

    addTo(stage: PIXI.Container) {
        stage.addChild(this._stage);
    }
}
export default Area;