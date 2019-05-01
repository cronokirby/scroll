/**
 * Represents an attack a monster produces.
 */
export interface Attack {
    description: string
}

/**
 * Represents the stats an entity that can fight might have.
 */
export interface Stats {
    health: number
}

/**
 * Represents a component that we can fight.
 * 
 * The interface has the ability to choose an attack to use
 * against us. The interface also exposes its stats,
 * so we can do damage calculation against it.
 */
export interface Fight {
    readonly stats: Stats,
    // Choose which attack to use
    chooseAttack(): Attack
}