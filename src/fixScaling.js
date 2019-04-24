// This file exists to make typescript not complain about our shimming
import * as PIXI from 'pixi.js';

export default function () {
    PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
}