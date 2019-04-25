import { SpriteSheet } from '../../sprites';
import LivingEntity from './LivingEntity';
import Log from '../Log';


class Player extends LivingEntity {
    constructor(sheet: SpriteSheet, private _log: Log) {
        super(sheet.indexSprite(0, 0));
    }

    hit() {
        this._log.addMsg('You take ? damage');
    }

    fight(other: LivingEntity): void {
        this._log.addMsg('You attack!')
        other.hit();
    }
}
export default Player;