import { ViewType } from '../model';
import { Fight, Attack } from '../components/fight';
import PosSprite from '../components/PosSprite';
import { indexSprite } from '../../sprites';
import GameWorld from '../model/GameWorld';
import Movement from '../components/Movement';
import * as Pos from '../position';
import { Area } from '../dungeon/area';


type MakeMonster = (world: GameWorld, area: Area, pos: Pos.Pos) => void;


class MouseFight implements Fight {
    public readonly stats = {
        name: 'Mouse',
        health: 13,
        maxHealth: 13,
        attack: 2,
        defense: 2
    };

    chooseAttack(): Attack {
        return {
            description: 'The Mouse bites with its tiny fangs!',
            attack: this.stats.attack
        };
    }

    describeDamage(damage: number): string {
        return `The Mouse takes ${damage} damage`;
    }
}

// We use a class here since we more state than usual.
class MouseMovement implements Movement {
    didMove = false;
    private _direction = Pos.Direction.Left;

    // Maybe change direction based on random input
    private changeDirection(change = 0.2) {
        if (Math.random() < change) {
            const dir = Pos.DIRECTIONS[Math.floor(Math.random() * 4)];
            this._direction = dir;
        }
    }

    nextPos(current: Pos.Pos, player: Pos.Pos, area: Area): Pos.Pos {
        let next: Pos.Pos;
        if (Pos.distance(current, player) <= 3) {
            next = Pos.naiveNext(current, player);
        } else {
            this.changeDirection();
            next = Pos.moved(current, this._direction);
        }
        return !area.isHard(next) ? next : current;
    }
}

export function mouse(world: GameWorld, area: Area, pos: Pos.Pos) {
    const sprite = new PosSprite(indexSprite(0, 4));
    sprite.pos = pos;
    world.world.add({
        viewType: ViewType.Describing | ViewType.Playing,
        description: 'A Tiny Mouse. Mostly harmless.',
        sprite,
        fight: new MouseFight(),
        area,
        movement: new MouseMovement()
    });
    world.addGameSprite(sprite.sprite);
}


/**
 * Choose a random monster to generate.
 * 
 * Since the danger indicates progression in the dungeon, we want
 * the monsters to get beefier and beefier.
 * 
 * @param danger how dangerous the monster should be
 */
export function randomMonster(danger: number): MakeMonster {
    return mouse;
}
