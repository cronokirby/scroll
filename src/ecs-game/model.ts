import * as PIXI from 'pixi.js';
import { query } from 'micro-ecs';


/**
 * Represents the possible components an entity can have.
 */
export interface Model {
    sprite: PIXI.Sprite
}

/**
 * The basis for querying things about a Model.
 */
export const baseQuery = query<Model>();
