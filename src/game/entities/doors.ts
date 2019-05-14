import GameWorld from "../model/GameWorld";
import Destination from "../components/Destination";
import { ViewType } from "../model";
import PosSprite from "../components/PosSprite";
import { indexSprite, Color } from "../../sprites";
import { Pos } from "../position";
import { Area } from "../dungeon/area";

/**
 * Create a new door, linking to a given destination.
 * 
 * This creates the door in the world's current area.
 * 
 * @param world the world to create the door in
 */
export function door(world: GameWorld, area: Area, pos: Pos, destination: Destination) {
    const sprite = new PosSprite(indexSprite(12, 8, Color.Gray));
    sprite.pos = pos;
    world.world.add({
        viewType: ViewType.Describing | ViewType.Playing,
        description: 'A Door leading to another room of the dungeon',
        sprite,
        area,
        destination
    });
    area.setDoor(pos);
    world.addGameSprite(sprite.sprite);
}