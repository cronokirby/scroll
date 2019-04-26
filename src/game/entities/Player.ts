import { SpriteSheet } from '../../sprites';
import LivingEntity from './LivingEntity';
import Log from '../Log';
import { Stats, getDamage } from './statistics';


class Player extends LivingEntity {
    private _stats = { attack: 4, defense: 4 };

    constructor(sheet: SpriteSheet, private _log: Log) {
        super(sheet.indexSprite(0, 0));
    }

    hit(attacking: Stats) {
        const damage = getDamage(attacking, this._stats);
        this._log.addMsg(`You take ${damage} damage`);
    }

    fight(other: LivingEntity): void {
        this._log.addMsg('You attack!')
        other.hit(this._stats);
    }
}
export default Player;