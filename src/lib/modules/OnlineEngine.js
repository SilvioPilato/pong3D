import { ThreeEngine } from "./ThreeEngine";
import { Vector3 } from "three";
import { OnlineInputSystem } from "../systems/client/OnlineInputSystem";
import { OnlinePlayerMovementSystem } from "../systems/client/OnlinePlayerMovementSystem";
import { BallMovementSystem } from "../systems/client/BallMovementSystem"
import { ROLE_PLAYER_1, ROLE_PLAYER_2, TAG_CAMERA } from "../../config";

export class OnlineEngine extends ThreeEngine {
    serverPositions = [];
    serverConnection;
    ballVelocity = new Vector3(-1, -1, 0);
    threeObjs = new Map();
    BallMovementSystem = new BallMovementSystem();
    
    OnlinePlayerMovementSystem = new OnlinePlayerMovementSystem();
    OnlyneInputSystem = new OnlineInputSystem();
    constructor(renderer, serverConnection) {
        super(renderer);
        this.serverConnection = serverConnection;
        this.serverConnection.subscribeToUpdates(this.#updateServerPositions.bind(this));
    }
    
    #updateServerPositions(position) {
        this.serverPositions.push(position);
    }

    tick() {
        if (!this.clock.running) this.clock.start();
        const deltaTime = this.clock.getDelta();
        this.BallMovementSystem.execute(this.ballVelocity, this.threeObjs, this.colliders, deltaTime);
        this.AudioSystem.execute(this.threeObjs,this.colliders);
        this.OnlinePlayerMovementSystem.execute(this.serverPositions, this.threeObjs, this.serverConnection.role);
        this.OnlyneInputSystem.execute(this.serverConnection);
        this.renderer.render( this.scene, this.threeObjs.get(TAG_CAMERA));
    }
}
