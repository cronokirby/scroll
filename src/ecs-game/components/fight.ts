/**
 * Represents an attack a monster produces.
 */
export interface Attack {
    // A string used to describe this attack
    readonly description: string,
    // How powerful this attack is
    readonly attack: number
}

/**
 * Represents the stats an entity that can fight might have.
 */
export interface Stats {
    health: number,
    readonly maxHealth: number,
    // e.g. You hit the Mouse
    readonly name: string,
    // How powerful this entity can attack
    readonly attack: number,
    // How well this entity can resist attack
    readonly defense: number,
}

/**
 * Calculate how much damage an attack does against an entity's stats.
 * 
 * @param attack the attack hitting this entity
 * @param defense the stats of this entity
 */
export function getDamage(attack: Attack, defense: Stats): number {
    const dmg = 2 * attack.attack - defense.defense;
    return dmg < 1 ? 1 : dmg;
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
    chooseAttack(stats: Stats): Attack,
    describeDamage(damage: number): string
}