import { Pos } from "../position";

/**
 * Represents a destination in the dungeon.
 * 
 * This is used to have a door that links to a specific
 * position in a specific area, for example.
 */
interface Destination {
    /**
     * The area that this destination leads to
     */
    readonly areaID: number;
    /**
     * The position this destination leads to
     */
    readonly position: Pos;
}
export default Destination;