/**
 * Represents a readonly view of the stats of an entity.
 */
export interface Stats {
    readonly attack: number,
    readonly defense: number
}

/**
 * Calculate the damage an attacker would do to a defender.
 * 
 * @param attacking the stats of the attacker
 * @param defending the stats of the defender 
 */
export function getDamage(attacking: Stats, defending: Stats): number {
    const dmg = 2 * attacking.attack - defending.defense;
    return dmg < 1 ? 1 : dmg;
}
