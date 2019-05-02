import { World } from 'micro-ecs';
import { Model, ViewType } from './model';
import { Fight, Attack } from './components/fight';
import PosSprite from './components/PosSprite';
import { indexSprite } from '../sprites';
import GameWorld from './model/GameWorld';


const mouseFight: Fight = {
    stats: { health: 6, name: 'Mouse' },

    chooseAttack(): Attack {
        return { description: 'The Mouse bites with its tiny fangs!' };
    }
}

export function mouse(world: GameWorld) {
    const fight = mouseFight;
    const sprite = new PosSprite(indexSprite(0, 4));
    sprite.pos = {x: 5, y: 5};
    world.world.add({
        viewType: ViewType.Describing | ViewType.Playing,
        description: 'A Tiny Mouse. Mostly harmless.',
        sprite,
        fight
    });
    world.addGameSprite(sprite.sprite);
}
