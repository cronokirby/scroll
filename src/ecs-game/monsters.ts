import { ViewType } from './model';
import { Fight, Attack } from './components/fight';
import PosSprite from './components/PosSprite';
import { indexSprite } from '../sprites';
import GameWorld from './model/GameWorld';
import Movement from './components/Movement';
import * as Pos from '../game/position';
import Area from './dungeon/Area';


const mouseFight: Fight = {
    stats: { 
        name: 'Mouse',
        health: 200,
        maxHealth: 13,
        attack: 2,
        defense: 2
    },

    chooseAttack(): Attack {
        return {
            description: 'The Mouse bites with its tiny fangs!',
            attack: this.stats.attack
        };
    },
    
    describeDamage(damage: number): string {
        return `The Mouse takes ${damage} damage`;
    }
}

const mouseMovement: Movement = {
    didMove: false,
    nextPos(current: Pos.Pos, player: Pos.Pos, area: Area): Pos.Pos {
        const next = Pos.moved(current, Pos.Direction.Left);
        return !area.isWall(next) ? next : current;
    }
}

export function mouse(world: GameWorld) {
    const sprite = new PosSprite(indexSprite(0, 4));
    sprite.pos = { x: 5, y: 5 };
    world.world.add({
        viewType: ViewType.Describing | ViewType.Playing,
        description: 'A Tiny Mouse. Mostly harmless.',
        sprite,
        fight: mouseFight,
        area: world.dungeon.currentArea,
        movement: mouseMovement
    });
    world.addGameSprite(sprite.sprite);
}
