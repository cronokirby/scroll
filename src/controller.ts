export type PressCallback = () => void;

interface Trigger {
    isUp: boolean;
    readonly onPress: PressCallback;
}

function makeTrigger(cb: PressCallback): Trigger {
    return { isUp: true, onPress: cb }
}

/**
 * Represents the types of controls available to us.
 * 
 * This enum is used to register callbacks when this control is triggered.
 */
export enum Control { Left, Right, Up, Down, Inspect, Interact };

function controlFromKey(key: string): Control | null {
    switch (key) {
        case 'ArrowLeft':
        case 'a':
            return Control.Left;
        case 'ArrowRight':
        case 'd':
            return Control.Right;
        case 'ArrowUp':
        case 'w':
            return Control.Up;
        case 'ArrowDown':
        case 's':
            return Control.Down;
        case 'x':
            return Control.Inspect;
        case 'Enter':
            return Control.Interact;
    }
    return null;
}


/**
 * Represents a controller allowing us to register callbacks for user actions.
 * 
 * The controller can handle a finite set of control actions provided
 * by the Control enum.
 */
export class Controller {
    private readonly _callbacks: Partial<Record<Control, Trigger>> = {};

    constructor() {
        const downListener = this.onDown.bind(this);
        window.addEventListener('keydown', downListener, false);
        const upListener = this.onUp.bind(this);
        window.addEventListener('keyup', upListener, false);
    }

    /**
     * Register a callback for a certain control input.
     * 
     * @param control the control action for this callback
     * @param cb the function to call when this action is triggered
     */
    onPress(control: Control, cb: PressCallback) {
        this._callbacks[control] = makeTrigger(cb);
    }

    private onDown(event: KeyboardEvent) {
        const control = controlFromKey(event.key);
        if (control === null) return;
        const trigger = this._callbacks[control];
        if (!trigger) return;
        if (trigger.isUp) trigger.onPress();
        trigger.isUp = false;
    }

    private onUp(event: KeyboardEvent) {
        const control = controlFromKey(event.key);
        if (control === null) return;
        const trigger = this._callbacks[control];
        if (!trigger) return;
        trigger.isUp = true;
    }
}
