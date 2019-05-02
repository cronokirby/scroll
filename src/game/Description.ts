const TEXT_STYLE = new PIXI.TextStyle({
    fontFamily: 'Iosevka, Courier New, monospace',
    fill: 'white',
    fontSize: 12,
    padding: 2,
    lineHeight: 20,
    wordWrap: true,
    wordWrapWidth: 300,
});

/**
 * Represents the component allowing us to describe things.
 * 
 * This holds a side bar containing the textual description
 * of whatever our cursor has moused over.
 */
class Description {
    private _text = new PIXI.Text('', TEXT_STYLE);

    constructor() {
        this._text.y = 40;
        this._text.x = 10;
    }

    /**
     * Add the graphical elements of this component into a given stage.
     * 
     * @param stage the stage to add this to
     */
    addTo(stage: PIXI.Container) {
        stage.addChild(this._text);
    }

    set text(newText: string) {
        this._text.text = newText;
    }

    set visible(isVisible: boolean) {
        this._text.visible = isVisible;
    }
}
export default Description;