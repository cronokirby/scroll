import LivingEntity from "../LivingEntity";
import { SpriteSheet } from '../../../sprites';
import Log from "../../Log";
import { Stats, getDamage } from "../statistics";


class Mouse extends LivingEntity {
    private _stats = { attack: 2, defense: 2};

    constructor(sheet: SpriteSheet, private _log: Log) {
        super(sheet.indexSprite(0, 4));
    }

    hit(attacking: Stats) {
        const damage = getDamage(attacking, this._stats);
        this._log.addMsg(`The Mouse takes ${damage} damage`);
    }

    fight(other: LivingEntity): void {
        this._log.addMsg('The Mouse bites with its tiny fangs!');
        other.hit(this._stats);
    }
}
export default Mouse;