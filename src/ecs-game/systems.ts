import { baseQuery, ViewType } from './model';
import * as Pos from './position';
import GameWorld from './model/GameWorld';
import { Attack } from './components/fight';


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
        .filter(x => Boolean(x.viewType === viewType));
    return moveable.forEach(x => {
        const pos = x.sprite.pos;
        const newPos = Pos.moved(pos, direction);
        if (Pos.inGrid(newPos)) {
            x.sprite.pos = newPos;
        }
    });
}

export function playerPos(world: GameWorld): Pos.Pos {
    const query = baseQuery.select('isPlayer', 'sprite').first();
    let pos;
    world.world.run(query.forEach(x => {
        pos = x.sprite.pos;
    }))
    return pos;
}


function fightAt(world: GameWorld, attack: Attack, pos: Pos.Pos): boolean {
    const query = baseQuery
        .select('fight', 'sprite')
        .filter(x => Pos.same(x.sprite.pos, pos))
        .first();
    let didFight = false;
    world.world.run(query.forEach(x => {
        world.log.addMsg(attack.description);
        const response = x.fight.chooseAttack();
        world.log.addMsg(response.description);
        didFight = true;
    }));
    return didFight;
}

export function movePlayer(world: GameWorld, direction: Pos.Direction) {
    const query = baseQuery.select('isPlayer', 'sprite', 'fight').first();
    world.world.run(query.forEach(player => {
        const moved = Pos.moved(player.sprite.pos, direction);
        const attack = player.fight.chooseAttack();
        if (!fightAt(world, attack, moved)) {
            player.sprite.pos = moved;
        }
    }));
}


function cursor(viewType: ViewType) {
    return baseQuery.select('isCursor', 'sprite', 'viewType').first()
        .filter(x => Boolean(x.viewType & viewType));
}

const inventoryCursor = cursor(ViewType.Inventory);

export function moveCursor(world: GameWorld, viewType: ViewType, pos: Pos.Pos) {
    world.world.run(cursor(viewType).forEach(x => x.sprite.pos = pos));
}


const collectables = baseQuery.select('collectable', 'sprite', 'name', 'viewType');

function collectablesAt(pos: Pos.Pos, viewType: ViewType) {
    return collectables.filter(x => {
        const rightView = Boolean(x.viewType & viewType);
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
            world.log.addMsg(`You picked up ${item.name}`);
            return { viewType: ViewType.Inventory };
        }
        return {};
    }));
}


const describeables = baseQuery.select('description', 'sprite', 'viewType');

function descriptionAt(world: GameWorld, pos: Pos.Pos, viewType: ViewType): string {
    const query = describeables.filter(x => {
        const rightView = Boolean(x.viewType & viewType);
        const rightPos = Pos.same(x.sprite.pos, pos);
        return rightView && rightPos;
    });
    let description = '';
    world.world.run(query.first().forEach(item => {
        description = item.description;
    }));
    return description;
}

export function setDescription(world: GameWorld, viewType: ViewType) {
    world.description.text = '';
    world.world.run(cursor(viewType).forEach(cursor => {
        const description = descriptionAt(world, cursor.sprite.pos, viewType);
        world.description.text = description;
    }));
}