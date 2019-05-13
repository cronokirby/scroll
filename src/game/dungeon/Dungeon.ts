import Area from "./Area";

/**
 * Represents a dungeon we can explore, filled with many areas.
 * 
 * This acts mainly as a way to organise and generate different areas,
 * abstracting away our current area.
 */
class Dungeon {
    private _stage = new PIXI.Container();
    private _areas: Map<number, Area> = new Map();
    private _currentArea: number;

    constructor() {
        this.moveTo(0);
        this.currentArea.addTo(this._stage);
    }

    private createArea(id: number) {
        this._areas.set(id, new Area(id));
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
        return this._areas.get(this._currentArea) as Area;
    }

    /**
     * Move the current area to a different place.
     * 
     * This is useful to allow for doors, or portals, that move
     * the player between different areas.
     * 
     * @param newArea the ID of the new area to move to
     */
    moveTo(newArea: number) {
        if (!this._areas.has(newArea)) {
            this.createArea(newArea);
        }
        this._currentArea = newArea;
    }
}
export default Dungeon;