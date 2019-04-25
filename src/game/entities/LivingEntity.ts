import Entity from './Entity';

/**
 * Represents an entity that can fight and be hit
 */
abstract class LivingEntity extends Entity {
    abstract hit(): void;
    abstract fight(other: LivingEntity): void;
}
export default LivingEntity;
