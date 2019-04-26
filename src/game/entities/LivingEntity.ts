import Entity from './Entity';
import { Stats } from './statistics';
import Area from '../Area';

/**
 * Represents an entity that can fight and be hit
 */
abstract class LivingEntity extends Entity {
    abstract hit(attack: Stats): void;
    abstract fight(other: LivingEntity): void;
    abstract advance(area: Area): void;
}
export default LivingEntity;
