import GameWorld from "./model/GameWorld";
import { Fight, Attack, Stats } from './components/fight';
import { ViewType } from "./model";
import PosSprite from "./components/PosSprite";
import { indexSprite } from "../sprites";


const playerFight: Fight = {
    stats: { health: 20, name: 'You' },
    chooseAttack(stats: Stats): Attack {
        return { description: `You hit the ${stats.name}!` };
    }
}

/**
 * Create a new player in a given world.
 * 
 * @param world the world to create the player in
 */
export function createPlayer(world: GameWorld) {
    const sprite = new PosSprite(indexSprite(0, 0));
    world.addGameSprite(sprite.sprite, true);
    world.world.add({
        controlMarker: null,
        isPlayer: null,
        viewType: ViewType.Playing,
        fight: playerFight,
        sprite
    });
}
