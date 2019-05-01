import { query } from 'micro-ecs';
import PosSprite from './components/PosSprite';


/**
 * Represents the type of view we might be having
 */
export enum ViewType { Playing, Describing, Inventory }

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
    sprite: PosSprite,
    name: string
}

/**
 * The basis for querying things about a Model.
 */
export const baseQuery = query<Model>();
