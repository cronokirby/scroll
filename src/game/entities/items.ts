import * as Pos from "../position";
import GameWorld from "../model/GameWorld";
import PosSprite from "../components/PosSprite";
import { indexSprite, Color } from "../../sprites";
import { ViewType } from "../model";
import { Area } from "../dungeon/area";


type MakeItem = (world: GameWorld, area: Area, pos: Pos.Pos) => void;


/**
 * Represents a leaf we can consume to gain back health.
 */
export function greenLeaf(world: GameWorld, area: Area, pos: Pos.Pos) {
    const sprite = new PosSprite(indexSprite(11, 15, Color.Green));
    sprite.pos = pos;
    world.addGameSprite(sprite.sprite);
    world.world.add({
        collectable: null,
        viewType: ViewType.Playing | ViewType.Describing,
        area,
        name: 'a Green Leaf',
        description: 'A refreshing Green Leaf. Chew on it to restore health.',
        consume: { restoreHealth: 5 },
        sprite
    });
}


/**
 * Choose a random item given a specific difficulty.
 * 
 * The difficulty is used to inform how far we've progressed in the dungeon.
 * The further we've progressed, the more powerful the items.
 * 
 * @param difficulty the difficulty that item should have
 */
export function randomItem(difficulty: number): MakeItem {
    return greenLeaf;
}