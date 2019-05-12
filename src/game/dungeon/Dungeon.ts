import Area from "./Area";

/**
 * Represents a dungeon we can explore, filled with many areas.
 * 
 * This acts mainly as a way to organise and generate different areas,
 * abstracting away our current area.
 */
class Dungeon {
    private _stage = new PIXI.Container();
    private _currentArea: Area;

    constructor() {
        this._currentArea = new Area(0);
        this._currentArea.addTo(this._stage);
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
        return this._currentArea;
    }
}
export default Dungeon;