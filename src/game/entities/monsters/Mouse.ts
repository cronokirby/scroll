import LivingEntity from "../LivingEntity";
import { SpriteSheet } from '../../../sprites';
import Log from "../../Log";
import { Stats, getDamage } from "../statistics";
import Area from "../../Area";
import * as Pos from "../../position";


class Mouse extends LivingEntity {
    private _stats = { attack: 2, defense: 2 };
    private _health = 14;
    private _direction: Pos.Direction;

    constructor(sheet: SpriteSheet, private _log: Log) {
        super(sheet.indexSprite(0, 4));
        this.chooseDirection();
    }

    hit(attacking: Stats) {
        const damage = getDamage(attacking, this._stats);
        this._health -= damage;
        this._log.addMsg(`The Mouse takes ${damage} damage`);
    }

    fight(other: LivingEntity): void {
        this._log.addMsg('The Mouse bites with its tiny fangs!');
        other.hit(this._stats);
    }

    private chooseDirection(...banned: Pos.Direction[]) {
        const goodDirection = (d: Pos.Direction) => banned.indexOf(d) < 0;
        const goodDirections = Pos.DIRECTIONS.filter(goodDirection);
        const index = Math.floor(Math.random() * goodDirections.length);
        this._direction = goodDirections[index];
    }

    advance(area: Area) {
        const rnd = Math.random();
        if (rnd < 0.1) {
            this.chooseDirection();
        }
        const playerPos = area.playerPos;
        if (Pos.distance(this.pos, playerPos) <= 3) {
            area.moveEntity(this, Pos.naiveNext(this.pos, playerPos));
            return;
        }
        const nextPos = Pos.moved(this.pos, this._direction);
        if (area.isWall(nextPos)) {
            this.chooseDirection(this._direction);
        }
        area.moveEntity(this, nextPos);
    }

    isDead(): boolean {
        return this._health <= 0;
    }

    die() {
        this._sprite.destroy();
        this._log.addMsg('The Mouse dies');
    }
}
export default Mouse;