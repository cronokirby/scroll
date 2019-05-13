import { query } from 'micro-ecs';
import PosSprite from './components/PosSprite';
import { Fight } from './components/fight';
import Movement from './components/Movement';
import Area from './dungeon/area';
import Consume from './components/Consume';
import Destination from './components/Destination';


/**
 * Represents the type of view we might be having
 */
export enum ViewType { Playing = 0b1, Describing = 0b10, Inventory = 0b100 }

/**
 * Represents the possible components an entity can have.
 */
export interface Model {
    // Used to indicate that this can be controlled
    controlMarker: null,
    // Used to indicate that this entity can be collected
    collectable: null,
    // Used to indicate that this entity is the player
    isPlayer: null,
    // Used ot indicate that this entity is a cursor
    isCursor: null,
    viewType: ViewType,
    // The area this entity is in
    area: Area,
    sprite: PosSprite,
    // The name an entity might have
    name: string,
    // The description an entity might have
    description: string,
    // This allows us to consume an item
    consume: Consume,
    // This component allows an entity to fight
    fight: Fight,
    // This component allows an entity to move
    movement: Movement,
    // This component allows an entity to have a destination
    destination: Destination
}

/**
 * The basis for querying things about a Model.
 */
export const baseQuery = query<Model>();
