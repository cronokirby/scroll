import { query } from 'micro-ecs';
import PosSprite from './components/PosSprite';


/**
 * Represents the type of view we might be having
 */
export enum ViewType { Playing, Exploring, Inventory }

/**
 * Represents the possible components an entity can have.
 */
export interface Model {
    // Used to indicate that this can be controlled
    controlMarker: null,
    viewType: ViewType,
    sprite: PosSprite
}

/**
 * The basis for querying things about a Model.
 */
export const baseQuery = query<Model>();
