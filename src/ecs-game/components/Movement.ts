import * as Pos from '../position';
import Area from '../dungeon/Area';


/**
 * This component allows us to move entities around.
 * 
 * This component is capable of making decisions on where to move
 * next based on the current player position, and other information
 * such as the area this entity is moving in.
 * 
 * Where an entity moves is also important for combat:
 * in order to attack another entity, an entity must move over that
 * position.
 */
interface Movement {
    didMove: boolean,
    nextPos(current: Pos.Pos, player: Pos.Pos, area: Area): Pos.Pos
}
export default Movement;