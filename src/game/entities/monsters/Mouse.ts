import LivingEntity from "../LivingEntity";
import { SpriteSheet } from '../../../sprites';
import Log from "../../Log";
import { Stats, getDamage } from "../statistics";
import Area from "../../Area";


interface Direction {
    x: number,
    y: number
}

class Mouse extends LivingEntity {
    private _stats = { attack: 2, defense: 2 };
    private _direction: Direction;

    constructor(sheet: SpriteSheet, private _log: Log) {
        super(sheet.indexSprite(0, 4));
        this.chooseDirection();
    }

    hit(attacking: Stats) {
        const damage = getDamage(attacking, this._stats);
        this._log.addMsg(`The Mouse takes ${damage} damage`);
    }

    fight(other: LivingEntity): void {
        this._log.addMsg('The Mouse bites with its tiny fangs!');
        other.hit(this._stats);
    }

    private chooseDirection(...banned: Direction[]) {
        const goodDirection = ({ x, y }) => {
            return !banned.find(v => v.x == x && v.y == y);
        };
        const directions = [
            { x: -1, y: 0 }, { x: 1, y: 0 },
            { x: 0, y: -1 }, { x: 0, y: 1 }
        ];
        const goodDirections = directions.filter(goodDirection);
        const index = Math.floor(Math.random() * goodDirections.length);
        this._direction = goodDirections[index];
    }

    advance(area: Area) {
        const rnd = Math.random();
        if (rnd < 0.1) {
            this.chooseDirection();
        }
        const newX = this.x + this._direction.x;
        const newY = this.y + this._direction.y;
        if (area.isWall(newX, newY)) {
            this.chooseDirection();
        }
        area.moveEntity(this, newX, newY);
    }
}
export default Mouse;