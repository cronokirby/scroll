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
        private readonly _pos: Pos.Pos
    ) { }

    follow() {
        this._floor.switchArea(this._area, this._pos);
    }
}


/**
 * Represents a collection of areas, linked together by doors
 */
export class Floor {
    private _stage = new PIXI.Container();
    private _area: Area;

    constructor(sheet: SpriteSheet, log: Log, private _player: Player) {
        this.createArea(new Area(sheet));
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
        this._area.movePlayer(pos);
    }

    private createArea(area: Area) {
        this._area = area;
        this._area.addTo(this._stage);
    }
}