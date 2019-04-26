/**
 * Represents a static position on a 2d grid
 */
export interface Pos {
    readonly x: number,
    readonly y: number
}

/**
 * Represents a direction adjacent to a position.
 */
export enum Direction {
    Left,
    Right,
    Up,
    Down
}
export const DIRECTIONS = [Direction.Left, Direction.Right, Direction.Up, Direction.Down];

/**
 * Check whether or not 2 positions are the same.
 */
export function same(p1: Pos, p2: Pos): boolean {
    return p1.x === p2.x && p1.y === p2.y;
}

/**
 * Returns the position adjacent to a given one in a certain direction.
 */
export function moved({ x, y }: Pos, direction: Direction): Pos {
    switch (direction) {
        case Direction.Left:
            return { x: x - 1, y }
        case Direction.Right:
            return { x: x + 1, y };
        case Direction.Up:
            return { x, y: y - 1 };
        case Direction.Down:
            return { x, y: y + 1 };
    }
}

/**
 * Get the position to the left of this one.
 */
export function left(pos: Pos): Pos {
    return moved(pos, Direction.Left);
}

/**
 * Get the position to the right of this one.
 */
export function right(pos: Pos): Pos {
    return moved(pos, Direction.Right);
}

/**
 * Get the position above this one.
 */
export function up(pos: Pos): Pos {
    return moved(pos, Direction.Up);
}

/**
 * Get the position below this one.
 */
export function down(pos: Pos): Pos {
    return moved(pos, Direction.Down);
}
