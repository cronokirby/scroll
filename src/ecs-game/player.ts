import GameWorld from "./model/GameWorld";
import { Fight, Attack, Stats } from './components/fight';
import { ViewType } from "./model";
import PosSprite from "./components/PosSprite";
import { indexSprite } from "../sprites";


const playerFight: Fight = {
    stats: {
        name: 'You',
        health: 20,
        maxHealth: 20,
        attack: 4,
        defense: 4,
    },

    chooseAttack(stats: Stats): Attack {
        return {
            description: `You hit the ${stats.name}!`,
            attack: this.stats.attack
        };
    },

    describeDamage(damage: number): string {
        return `You take ${damage} damage`;
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
