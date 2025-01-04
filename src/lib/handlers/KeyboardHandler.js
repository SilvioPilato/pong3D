export class KeyboardHandler {
    constructor(anchor = window){
        KeyboardHandler.inputHoldSink = new Set();
        KeyboardHandler.inputPressedSink = new Set();
        KeyboardHandler.inputUpSink = new Set();
        anchor.addEventListener("keydown", (event) => {
            if (event.repeat) return;
            KeyboardHandler.inputHoldSink.add(event.code);
            KeyboardHandler.inputPressedSink.add(event.code);
        })
        anchor.addEventListener("keyup", (event) => {
            KeyboardHandler.inputHoldSink.delete(event.code);
            KeyboardHandler.inputUpSink.add(event.code);
        })
    }
    static inputHoldSink;
    static inputPressedSink;
    static inputUpSink;

    static isHold(keyCode) {
        return KeyboardHandler.inputHoldSink.has(keyCode);
    }

    static isUp(keyCode) {
        return KeyboardHandler.inputUpSink.has(keyCode);
    }

    static isPressed(keyCode) {
        return KeyboardHandler.inputPressedSink.has(keyCode);
    }

    clear() {
        // this is designed to be called on the post update phase
        KeyboardHandler.inputUpSink.clear();
        KeyboardHandler.inputPressedSink.clear();
    }
}