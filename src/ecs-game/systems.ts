import { baseQuery, ViewType } from './model';
import * as Pos from './position';
import GameWorld from './model/GameWorld';


/**
 * Move the first sprite with controls in a given direction.
 * 
 * This can be used to move cursors, as well as the player itself
 * 
 * @param direction the direction to move in
 * @param viewType the type of view this moveable should be in
 */
export function moveSprites(direction: Pos.Direction, viewType: ViewType) {
    const moveable = baseQuery
        .select('controlMarker', 'sprite', 'viewType')
        .first()
        .filter(x => x.viewType === viewType);
    return moveable.forEach(x => {
        const pos = x.sprite.pos;
        const newPos = Pos.moved(pos, direction);
        if (Pos.inGrid(newPos)) {
            x.sprite.pos = newPos;
        }
    });
}

function playerPos(world: GameWorld): Pos.Pos {
    const query = baseQuery.select('isPlayer', 'sprite').first();
    let pos;
    world.world.run(query.forEach(x => {
        pos = x.sprite.pos;
    }))
    return pos;
}


function cursor(viewType: ViewType) {
    return baseQuery.select('isCursor', 'sprite', 'viewType')
        .filter(x => x.viewType === viewType);
}

const inventoryCursor = cursor(ViewType.Inventory);

function moveCursor(world: GameWorld, viewType: ViewType, pos: Pos.Pos) {
    world.world.run(cursor(viewType).forEach(x => x.sprite.pos = pos));
}


const collectables = baseQuery.select('collectable', 'sprite', 'viewType');

function collectablesAt(pos: Pos.Pos, viewType: ViewType) {
    return collectables.filter(x => {
        const rightView = x.viewType === viewType;
        const rightPos = Pos.same(pos, x.sprite.pos);
        return rightView && rightPos;
    })
}

/**
 * Make the player pick up all items at the same position as it,
 * and move them to the inventory if possible.
 */
export function pickUpCollectables(world: GameWorld) {
    const pos = playerPos(world);
    world.world.run(collectablesAt(pos, ViewType.Playing).map(item => {
        if (world.inventory.add(item.sprite)) {
            world.removeGameSprite(item.sprite.sprite);
            moveCursor(world, ViewType.Inventory, item.sprite.pos);
            return { viewType: ViewType.Inventory };
        }
        return {};
    }));
}