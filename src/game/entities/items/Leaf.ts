import Collectable from "../Collectable";
import { SpriteSheet } from "../../../sprites";

/**
 * A leaf that can be collected to restore health.
 */
class Leaf extends Collectable {
    constructor(sheet: SpriteSheet) {
        super(sheet.indexSprite(11, 15));
    }

    get name(): string {
        return 'Leaf';
    }

    get description(): string {
        return 'A refreshing green Leaf. Chew on it to restore some health.';
    }
}
export default Leaf;