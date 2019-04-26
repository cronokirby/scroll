import Entity from './Entity';
import { Stats } from './statistics';

/**
 * Represents an entity that can fight and be hit
 */
abstract class LivingEntity extends Entity {
    abstract hit(attack: Stats): void;
    abstract fight(other: LivingEntity): void;
}
export default LivingEntity;
