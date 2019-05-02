import { ViewType } from './model';
import { Fight, Attack } from './components/fight';
import PosSprite from './components/PosSprite';
import { indexSprite } from '../sprites';
import GameWorld from './model/GameWorld';
import Movement from './components/Movement';
import * as Pos from '../game/position';


const mouseFight: Fight = {
    stats: { health: 6, name: 'Mouse' },

    chooseAttack(): Attack {
        return { description: 'The Mouse bites with its tiny fangs!' };
    }
}

const mouseMovement: Movement = {
    didMove: false,
    nextPos(current: Pos.Pos, player: Pos.Pos): Pos.Pos {
        const next = Pos.moved(current, Pos.Direction.Left);
        return Pos.inGrid(next) ? next : current;
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
        movement: mouseMovement
    });
    world.addGameSprite(sprite.sprite);
}
