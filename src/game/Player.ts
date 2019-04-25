import Entity from './Entity';
import { SpriteSheet } from '../sprites';


class Player extends Entity {
    constructor(sheet: SpriteSheet) {
        super(sheet.indexSprite(0, 0));
    }
}
export default Player;