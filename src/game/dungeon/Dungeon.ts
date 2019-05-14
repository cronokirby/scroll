import { Area, AreaID } from "./area";
import GameWorld from "../model/GameWorld";

/**
 * Represents a dungeon we can explore, filled with many areas.
 * 
 * This acts mainly as a way to organise and generate different areas,
 * abstracting away our current area.
 */
class Dungeon {
    private _stage = new PIXI.Container();
    private _areas: Map<string, Area> = new Map();
    private _currentArea: AreaID;

    constructor(private readonly _world: GameWorld) {
    }

    private createArea(id: AreaID) {
        let parentInfo;
        if (!id.isSame(AreaID.FIRST)) {
            const exitLink = this.currentArea.exitLink(id);
            if (exitLink) {
                parentInfo = { id: this._currentArea, link: exitLink };
            }
        }
        const area = new Area(id, this._world, parentInfo);
        this._areas.set(id.key, area);
        area.addTo(this._stage);
        area.visible = false;
    }

    /**
     * Add the visual components of this to a given stage.
     * 
     * @param stage the stage to add this to
     */
    addTo(stage: PIXI.Container) {
        stage.addChild(this._stage);
    }

    get currentArea(): Area {
        // Getting is always safe, since whenever we add an area,
        // we're sure that it's in the map
        return this._areas.get(this._currentArea.key) as Area;
    }

    /**
     * Move the current area to a different place.
     * 
     * This is useful to allow for doors, or portals, that move
     * the player between different areas.
     * 
     * @param newArea the ID of the new area to move to
     */
    moveTo(newArea: AreaID) {
        if (!this._areas.has(newArea.key)) {
            this.createArea(newArea);
        }
        if (this._currentArea) {
            this.currentArea.visible = false;
        }
        this._currentArea = newArea;
        this.currentArea.visible = true;
    }
}
export default Dungeon;