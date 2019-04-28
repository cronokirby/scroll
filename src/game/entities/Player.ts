import { SpriteSheet } from '../../sprites';
import LivingEntity from './LivingEntity';
import Log from '../Log';
import { Stats, getDamage } from './statistics';
import Area from '../Area';
import ShortStats from '../ShortStats';
import Collectable from './Collectable';
import Inventory from '../Inventory';


class Player extends LivingEntity {
    private _stats = { attack: 4, defense: 4 };
    private _maxHealth = 20;
    private _health = this._maxHealth;

    constructor(
        sheet: SpriteSheet,
        private _log: Log,
        private _statView: ShortStats,
        private _inventory: Inventory
    ) {
        super(sheet.indexSprite(0, 0));
        this.setStats();
    }

    get description(): string {
        return 'You! The Player! The Protagonist! The Hero!';
    }

    private setStats() {
        this._statView.setStats(this._health, this._maxHealth);
    }

    hit(attacking: Stats) {
        const damage = getDamage(attacking, this._stats);
        this._health -= damage;
        this.setStats();
        this._log.addMsg(`You take ${damage} damage`);
    }

    fight(other: LivingEntity): void {
        this._log.addMsg('You attack!')
        other.hit(this._stats);
    }

    advance(area: Area) {

    }

    isDead(): boolean {
        return this._health <= 0;
    }

    die() {
        this._log.addMsg('You die!');
    }

    collect(collectable: Collectable): boolean {
        if (!this._inventory.canAdd()) {
            this._log.addMsg('Your inventory is full');
            return false;
        }
        this._inventory.add(collectable);
        this._log.addMsg(`You picked up ${collectable.name}`);
        return true;
    }
}
export default Player;