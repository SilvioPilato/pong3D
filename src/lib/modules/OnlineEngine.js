import { OfflineGame } from "./OfflineGame";
import { OnlineInputSystem } from "../systems/client/OnlineInputSystem";
import { OnlinePlayerMovementSystem } from "../systems/client/OnlinePlayerMovementSystem";

export class OnlineEngine extends OfflineGame {
    serverPositions = new Map();
    serverConnection;
    threeObjs = new Map();

    OnlinePlayerMovementSystem = new OnlinePlayerMovementSystem();
    OnlyneInputSystem = new OnlineInputSystem();
    constructor(renderer, camera, serverConnection) {
        this.scene = new Scene();
        this.renderer = renderer;
        this.camera = camera;
        this.clock = new Clock();
        new KeyboardHandler();
        this.BallMoveSystem = new BallMovementSystem();
        this.AudioSystem = new AudioSystem();
        this.serverConnection = serverConnection;
    }

    tick() {
        if (!this.clock.running) this.clock.start();
        const deltaTime = this.clock.getDelta();
        // fetch data from IOSink
        // modify player pos and ballpos accordingly

        this.BallMoveSystem.execute(this.ballVelocity, this.threeObjs, this.colliders, deltaTime);
        this.AudioSystem.execute(this.threeObjs,this.colliders);
        this.OnlinePlayerMovementSystem.execute(this.serverPositions, this.threeObjs, this.serverConnection.role);
        this.OnlyneInputSystem.execute(this.serverConnection);
        this.renderer.render( this.scene, this.camera );
    }
}