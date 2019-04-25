import { SpriteSheet } from '../../sprites';
import LivingEntity from './LivingEntity';


class Player extends LivingEntity {
    constructor(sheet: SpriteSheet) {
        super(sheet.indexSprite(0, 0));
    }

    hit() {
        console.log('Player was hit');
    }

    fight(other: LivingEntity): void {
        console.log('Player attacks!');
        other.hit();
    }
}
export default Player;