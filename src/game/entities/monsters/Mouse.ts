import LivingEntity from "../LivingEntity";
import { SpriteSheet } from '../../../sprites';


class Mouse extends LivingEntity {
    constructor(sheet: SpriteSheet) {
        super(sheet.indexSprite(1, 1));
    }

    hit() {
        console.log('Mouse was hit');
    }

    fight(other: LivingEntity): void {
        console.log('Mouse bites back!');
        other.hit();
    }
}
export default Mouse;