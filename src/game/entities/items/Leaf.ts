import Collectable from "../Collectable";
import { SpriteSheet, Color } from "../../../sprites";

/**
 * A leaf that can be collected to restore health.
 */
class Leaf extends Collectable {
    constructor(sheet: SpriteSheet) {
        super(sheet.indexSprite(11, 15, Color.Green));
    }

    get name(): string {
        return 'Leaf';
    }

    get description(): string {
        return 'A refreshing green Leaf. Chew on it to restore some health.';
    }
}
export default Leaf;