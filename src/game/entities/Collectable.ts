import Entity from "./Entity";
import Player from "./Player";

/**
 * Represents an item that can be collected by a Player.
 * The item is found in the area, and getCollected is then called,
 * allowing the the item to call a more specific method on Player if necessary.
 */
abstract class Collectable extends Entity {
    abstract get name(): string;

    getCollectedBy(player: Player) {
        player.collect(this);
    }
}
export default Collectable;