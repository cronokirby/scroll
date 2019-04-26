import LivingEntity from "../LivingEntity";
import { SpriteSheet } from '../../../sprites';
import Log from "../../Log";
import { Stats, getDamage } from "../statistics";
import Area from "../../Area";


class Mouse extends LivingEntity {
    private _stats = { attack: 2, defense: 2 };

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

    advance(area: Area) {
       area.moveEntity(this, this.x - 1, this.y);
    }
}
export default Mouse;