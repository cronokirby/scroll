import Entity from "./Entity";
import Player from "./Player";

/**
 * Represents an item that can be collected by a Player.
 * The item is found in the area, and getCollected is then called,
 * allowing the the item to call a more specific method on Player if necessary.
 */
abstract class Collectable extends Entity {
    abstract get name(): string;

    /**
     * Make this item get collected. The player can refuse to collect this item,
     * in which case this function returns false.
     * @param player the player to collect this item
     */
    getCollectedBy(player: Player): boolean {
        return player.collect(this);
    }
}
export default Collectable;