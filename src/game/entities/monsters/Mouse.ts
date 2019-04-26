import LivingEntity from "../LivingEntity";
import { SpriteSheet } from '../../../sprites';
import Log from "../../Log";
import { Stats, getDamage } from "../statistics";
import Area from "../../Area";
import * as Pos from "../../position";


class Mouse extends LivingEntity {
    private _stats = { attack: 2, defense: 2 };
    private _direction: Pos.Direction;

    constructor(sheet: SpriteSheet, private _log: Log) {
        super(sheet.indexSprite(0, 4));
        this.chooseDirection();
        console.log('Mouse Direction', this._direction);
    }

    hit(attacking: Stats) {
        const damage = getDamage(attacking, this._stats);
        this._log.addMsg(`The Mouse takes ${damage} damage`);
    }

    fight(other: LivingEntity): void {
        this._log.addMsg('The Mouse bites with its tiny fangs!');
        other.hit(this._stats);
    }

    private chooseDirection(...banned: Pos.Direction[]) {
        const goodDirection = (d: Pos.Direction) => banned.indexOf(d) < 0;
        const goodDirections = Pos.DIRECTIONS.filter(goodDirection);
        const index = Math.floor(0.5 * goodDirections.length);
        this._direction = goodDirections[index];
    }

    advance(area: Area) {
        //const rnd = Math.random();
        const rnd = 0.5
        if (rnd < 0.1) {
            this.chooseDirection();
        }
        const nextPos = Pos.moved(this.pos, this._direction);
        console.log('Mouse next pos', nextPos);
        if (area.isWall(nextPos)) {
            this.chooseDirection(this._direction);
        }
        area.moveEntity(this, nextPos);
    }
}
export default Mouse;