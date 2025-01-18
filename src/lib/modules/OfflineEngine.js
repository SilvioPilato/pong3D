
import { Vector3 } from "three";
import { TAG_PLAYER, TAG_OPPONENT, TAG_BALL, TAG_CAMERA } from "../../config";
import { AISystem } from "../systems/client/AISystem";
import { BallMovementSystem } from "../systems/client/BallMovementSystem";
import { OfflinePlayerMovementSystem } from "../systems/client/OfflinePlayerMovementSystem";
import { ScoreSystem } from "../systems/client/ScoreSystem";
import { ThreeEngine } from "./ThreeEngine";

export class OfflineEngine extends ThreeEngine {
    // components
    threeObjs = new Map();
    ballVelocity = new Vector3(-1, -1, 0);
    // systems
    AISystem = null;
    BallMovementSystem = null;
    ScoreSystem = null;
    PlayerMovementSystem = null;

    constructor(renderer) {
        super(renderer);
        this.AISystem = new AISystem();
        this.BallMovementSystem = new BallMovementSystem();
        this.ScoreSystem = new ScoreSystem();
        this.PlayerMovementSystem = new OfflinePlayerMovementSystem();
    }

    tick() {
        if (!this.clock.running) this.clock.start();
        const deltaTime = this.clock.getDelta();
        this.PlayerMovementSystem.execute(this.threeObjs, deltaTime);
        this.BallMovementSystem.execute(this.ballVelocity, this.threeObjs, deltaTime);
        this.AISystem.execute(this.threeObjs, deltaTime);
        this.AudioSystem.execute(this.threeObjs);
        this.ScoreSystem.execute(this.threeObjs, this.ballVelocity);

        this.renderer.render(this.scene, this.threeObjs.get(TAG_CAMERA));
    }
}
