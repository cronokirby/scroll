import * as PIXI from 'pixi.js';
import { query } from 'micro-ecs';
import PosSprite from './components/PosSprite';


/**
 * Represents the possible components an entity can have.
 */
export interface Model {
    sprite: PosSprite;
}

/**
 * The basis for querying things about a Model.
 */
export const baseQuery = query<Model>();
