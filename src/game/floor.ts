import Area from "./Area";
import * as Pos from './position';
import Player from "./entities/Player";
import { SpriteSheet } from "../sprites";
import Log from "./Log";
import Mouse from "./entities/monsters/Mouse";


/**
 * Represents a door linking to a specific point.
 */
export class Door {
    constructor(
        private readonly _floor: Floor,
        private readonly _area: Area,
        private readonly _linkPos: Pos.Pos,
        readonly pos: Pos.Pos
    ) { }

    follow() {
        this._floor.switchArea(this._area, this._linkPos);
    }
}


/**
 * Represents a collection of areas, linked together by doors
 */
export class Floor {
    private _stage = new PIXI.Container();
    private _area: Area;

    constructor(sheet: SpriteSheet, log: Log, private _player: Player) {
        let walls: Pos.Pos[] = []
        for (let x = 1; x < 15; ++x) {
            walls.push({x, y: 0}, {x, y: 15});
        }
        walls.push({x: 15, y: 0});
        walls.push({x: 0, y: 15});
        const areaA = new Area(sheet, {x: 0, y: 0}, ...walls);
        const areaB = new Area(sheet, {x: 15, y: 15}, ...walls);
        areaA.addDoors(new Door(this, areaB, {x: 0, y: 0}, {x: 15, y: 15}));
        areaB.addDoors(new Door(this, areaA, {x: 15, y: 15}, {x: 0, y: 0}));
        this.createArea(areaA);
        this.createArea(areaB);
        this._area.addEntity(new Mouse(sheet, log), { x: 10, y: 8 });
        this._area.addEntity(new Mouse(sheet, log), { x: 10, y: 2 });
        this._area.player = this._player;
    }

    /**
     * Add this floor to display in a given stage.
     */
    addTo(stage: PIXI.Container) {
        stage.addChild(this._stage);
    }
    
    /**
     * Move the player in a certain direction in this floor.
     */
    movePlayer(direction: Pos.Direction) {
        const nextPos = Pos.moved(this._player.pos, direction);
        this._area.movePlayer(nextPos);
    }

    /**
     * Switch the player to a new position in an area.
     */
    switchArea(area: Area, pos: Pos.Pos) {
        this._area.visible = false;
        area.visible = true;
        this._area = area;
        this._area.player = this._player;
        this._area.movePlayer(pos, true);
    }

    getDescription(pos: Pos.Pos): string {
        return this._area.getDescription(pos);
    }

    private createArea(area: Area) {
        if (this._area) this._area.visible = false;
        this._area = area;
        this._area.addTo(this._stage);
    }
}