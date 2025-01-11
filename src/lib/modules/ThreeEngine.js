import { Clock, Scene } from "three";
import { KeyboardHandler } from "../handlers/KeyboardHandler";
import { AudioSystem } from "./../systems/client/AudioSystem";
export class ThreeEngine {
    renderer = null;
    scene = null;
    clock = null;
    AudioSystem = null;
    constructor(renderer) {
        this.scene = new Scene();
        this.renderer = renderer;
        this.clock = new Clock();
        new KeyboardHandler();
        this.AudioSystem = new AudioSystem();
    }
    
    addObject(object, id) {
        this.scene.add(object);
        this.threeObjs.set(id, object);
    }
}
