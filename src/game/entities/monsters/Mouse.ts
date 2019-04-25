import LivingEntity from "../LivingEntity";
import { SpriteSheet } from '../../../sprites';
import Log from "../../Log";


class Mouse extends LivingEntity {
    constructor(sheet: SpriteSheet, private _log: Log) {
        super(sheet.indexSprite(0, 4));
    }

    hit() {
        this._log.addMsg('The Mouse takes ? damage');
    }

    fight(other: LivingEntity): void {
        this._log.addMsg('The Mouse bites with its tiny fangs!');
        other.hit();
    }
}
export default Mouse;