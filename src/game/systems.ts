import { baseQuery, ViewType } from './model';
import * as Pos from './position';
import GameWorld from './model/GameWorld';
import { Fight, getDamage, heal } from './components/fight';
import Consume from './components/Consume';
import Area from './dungeon/Area';
import Destination from './components/Destination';


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

export function playerArea(world: GameWorld): Area {
    const query = baseQuery.select('isPlayer', 'area').first();
    let area;
    world.world.run(query.forEach(x => {
        area = x.area;
    }))
    return area;
}


function fight(world: GameWorld, fight1: Fight, fight2: Fight, ambush = false) {
    const attack = fight1.chooseAttack(fight2.stats);
    world.log.addMsg(attack.description);
    const damage2 = getDamage(attack, fight2.stats);
    fight2.stats.health -= damage2;
    world.log.addMsg(fight2.describeDamage(damage2));
    if (ambush || fight2.stats.health <= 0) return;
    const response = fight2.chooseAttack(fight1.stats);
    world.log.addMsg(response.description);
    const damage1 = getDamage(response, fight1.stats);
    fight1.stats.health -= damage1;
    world.log.addMsg(fight1.describeDamage(damage1));
}

function fightAt(world: GameWorld, fighter: Fight, pos: Pos.Pos, area: Area): boolean {
    const query = baseQuery
        .select('fight', 'area', 'movement', 'sprite')
        .filter(x => area.isSame(x.area) && Pos.same(x.sprite.pos, pos))
        .first();
    let didFight = false;
    world.world.run(query.forEach(x => {
        fight(world, fighter, x.fight);
        x.movement.didMove = true;
        didFight = true;
    }));
    return didFight;
}

function doorAt(world: GameWorld, area: Area, pos: Pos.Pos): Destination | undefined {
    const query = baseQuery
        .select('area', 'destination', 'sprite')
        .filter(x => area.isSame(x.area) && Pos.same(x.sprite.pos, pos))
        .first();
    let destination: Destination | undefined = undefined;
    world.world.run(query.forEach(x => destination = x.destination));
    return destination;
}

export function movePlayer(world: GameWorld, direction: Pos.Direction) {
    const query = baseQuery.select('isPlayer', 'sprite', 'area', 'fight').first();
    world.world.run(query.map(player => {
        const moved = Pos.moved(player.sprite.pos, direction);
        if (!Pos.inGrid(moved) || player.area.isWall(moved)) return;
        const destination = doorAt(world, player.area, moved);
        if (destination) {
            world.dungeon.moveTo(destination.areaID);
            player.area = world.dungeon.currentArea;
            player.sprite.pos = destination.position;
            const area = world.dungeon.currentArea;
            updateAreaVisibility(world, area);
            // This is necessary since the player isn't in the new area yet
            player.sprite.sprite.visible = true;
            return { area };
        }
        if (!fightAt(world, player.fight, moved, player.area)) {
            player.sprite.pos = moved;
        }
        advanceRest(world, player.sprite.pos, player.fight, player.area);
        return {};
    }));
}

export function updatePlayerStats(world: GameWorld) {
    const query = baseQuery.select('isPlayer', 'fight').first();
    world.world.run(query.forEach(player => {
        const { health, maxHealth } = player.fight.stats;
        world.shortStats.setStats(health, maxHealth);
    }));
}

export function playerIsDead(world: GameWorld): boolean {
    const query = baseQuery.select('isPlayer', 'fight').first();
    let isDead = false;
    world.world.run(query.forEach(player => {
        isDead = player.fight.stats.health <= 0;
    }));
    return isDead;
}

function advanceRest(world: GameWorld, playerPos: Pos.Pos, playerFight: Fight, playerArea: Area) {
    const query = baseQuery
        .select('movement', 'fight', 'area', 'sprite')
        .filter(x => playerArea.isSame(x.area) && !x.movement.didMove);
    world.world.run(query.forEach(x => {
        const nextPos = x.movement.nextPos(x.sprite.pos, playerPos, x.area);
        if (Pos.same(nextPos, playerPos)) {
            fight(world, x.fight, playerFight, true);
        } else {
            x.sprite.pos = nextPos;
        }
    }));
    const resetMovement = baseQuery.select('movement').forEach(x => {
        x.movement.didMove = false;
    });
    world.world.run(resetMovement);
    if (playerIsDead(world)) {
        world.setGameOver();
    }
    updatePlayerStats(world);
    removeDead(world);
}

function removeDead(world: GameWorld) {
    const query = baseQuery
        .select('fight', 'sprite')
        .filter(x => x.fight.stats.health <= 0);
    world.world.run(query.map(x => {
        x.sprite.sprite.destroy();
        return undefined;
    }));
}

// Make so that only sprites in the current area are visible
function updateAreaVisibility(world: GameWorld, area: Area) {
    const query = baseQuery
        .select('sprite', 'viewType', 'area')
        .filter(x => Boolean(x.viewType & ViewType.Playing));
    world.world.run(query.forEach(x => {
        x.sprite.sprite.visible = area.isSame(x.area);
    }))
}


function cursor(viewType: ViewType) {
    return baseQuery.select('isCursor', 'sprite', 'viewType').first()
        .filter(x => Boolean(x.viewType & viewType));
}

export function moveCursor(world: GameWorld, viewType: ViewType, pos: Pos.Pos) {
    world.world.run(cursor(viewType).forEach(x => x.sprite.pos = pos));
}


const collectables = baseQuery.select('collectable', 'sprite', 'area', 'name', 'viewType');

function collectablesAt(area: Area, pos: Pos.Pos, viewType: ViewType) {
    return collectables.filter(x => {
        const rightView = Boolean(x.viewType & viewType);
        const rightPos = Pos.same(pos, x.sprite.pos);
        const rightArea = area.isSame(x.area);
        return rightArea && rightView && rightPos;
    })
}

/**
 * Make the player pick up all items at the same position as it,
 * and move them to the inventory if possible.
 */
export function pickUpCollectables(world: GameWorld) {
    const pos = playerPos(world);
    const area = playerArea(world);
    world.world.run(collectablesAt(area, pos, ViewType.Playing).map(item => {
        if (world.inventory.add(item.sprite)) {
            world.removeGameSprite(item.sprite.sprite);
            moveCursor(world, ViewType.Inventory, item.sprite.pos);
            world.log.addMsg(`You picked up ${item.name}`);
            return { viewType: ViewType.Inventory };
        }
        return {};
    }));
}


const describeables = baseQuery.select('description', 'sprite', 'area', 'viewType');

function descriptionAt(world: GameWorld, area: Area, pos: Pos.Pos, viewType: ViewType): string {
    const query = describeables.filter(x => {
        const rightView = Boolean(x.viewType & viewType);
        const rightPos = Pos.same(x.sprite.pos, pos);
        const rightArea = viewType === ViewType.Inventory || area.isSame(x.area);
        return rightArea && rightView && rightPos;
    });
    let description = '';
    world.world.run(query.first().forEach(item => {
        description = item.description;
    }));
    return description;
}

export function setDescription(world: GameWorld, viewType: ViewType) {
    world.description.text = '';
    const area = playerArea(world);
    world.world.run(cursor(viewType).forEach(cursor => {
        const description = descriptionAt(world, area, cursor.sprite.pos, viewType);
        world.description.text = description;
    }));
}


function consumeAt(world: GameWorld, pos: Pos.Pos): Consume | undefined {
    const shouldConsume = x => {
        const inInventory = x.viewType === ViewType.Inventory;
        return inInventory && Pos.same(x.sprite.pos, pos);
    };
    const query = baseQuery
        .select('viewType', 'sprite', 'name', 'consume')
        .filter(shouldConsume)
        .first();
    let consume: Consume | undefined;
    world.world.run(query.map(x => {
        world.log.addMsg(`You consume ${x.name}`);
        consume = x.consume
        x.sprite.sprite.destroy();
        return undefined;
    }));
    return consume;
}

export function consume(world: GameWorld) {
    const selectPlayer = baseQuery.select('isPlayer', 'fight').first();
    world.world.run(cursor(ViewType.Inventory).forEach(cursor => {
        const consume = consumeAt(world, cursor.sprite.pos);
        if (!consume) return;
        world.world.run(selectPlayer.forEach(player => {
            world.log.addMsg(`You gain ${consume.restoreHealth} health`);
            heal(player.fight.stats, consume.restoreHealth);
        }))
    }));
}
