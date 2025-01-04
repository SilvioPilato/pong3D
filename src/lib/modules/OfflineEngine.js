
import { Vector3, Clock, Box3 } from "three";
import { Scene } from "three/src/Three.js";
import { TAG_PLAYER, TAG_OPPONENT, TAG_BALL } from "../../config";
import { KeyboardHandler } from "../handlers/KeyboardHandler";
import { AISystem } from "../systems/client/AISystem";
import { AudioSystem } from "../systems/client/AudioSystem";
import { BallMovementSystem } from "../systems/client/BallMovementSystem";
import { ColliderUpdateSystem } from "../systems/client/ColliderUpdateSystem";
import { OfflinePlayerMovementSystem } from "../systems/client/OfflinePlayerMovementSystem";
import { ScoreSystem } from "../systems/client/ScoreSystem";

export class OfflineEngine {
    renderer = null;
    scene = null;
    camera = null;
    clock = null;
    // we use tag as component ids
    playerTag = TAG_PLAYER;
    opponentTag = TAG_OPPONENT;
    ballTag = TAG_BALL;
    // components
    threeObjs = new Map();
    ballVelocity = new Vector3(-1, -1, 0);
    // systems
    AISystem = null;
    BallMoveSystem = null;
    ScoreSystem = null;
    PlayerMoveSystem = null;
    AudioSystem = null;

    constructor(renderer, camera) {
        this.scene = new Scene();
        this.renderer = renderer;
        this.camera = camera;
        this.clock = new Clock();
        new KeyboardHandler();
        this.AISystem = new AISystem();
        this.BallMoveSystem = new BallMovementSystem();
        this.ScoreSystem = new ScoreSystem();
        this.PlayerMoveSystem = new OfflinePlayerMovementSystem();
        this.AudioSystem = new AudioSystem();
    }

    addPlayer(object) {
        this.addObject(object, this.playerTag);
    }
    addOpponent(object) {
        this.addObject(object, this.opponentTag);
    }
    addBall(object) {
        this.addObject(object, this.ballTag);
    }
    addObject(object, id) {
        this.scene.add(object);
        this.threeObjs.set(id, object);
    }

    tick() {
        if (!this.clock.running) this.clock.start();
        const deltaTime = this.clock.getDelta();
        this.PlayerMoveSystem.execute(this.threeObjs, deltaTime);
        this.BallMoveSystem.execute(this.ballVelocity, this.threeObjs, deltaTime);
        this.AISystem.execute(this.threeObjs, deltaTime);
        this.AudioSystem.execute(this.threeObjs);
        this.ScoreSystem.execute(this.threeObjs, this.ballVelocity);

        this.renderer.render(this.scene, this.camera);
    }
}
