import {Box3, Box3Helper, Clock, Scene, Vector3} from "three";
import {KeyboardHandler} from "./KeyboardHandler.js";
import {AISystem} from "./AISystem.js";
import {BallMovementSystem} from "./BallMovementSystem.js";
import {ScoreSystem} from "./ScoreSystem.js";
import {PlayerMovementSystem} from "./PlayerMovementSystem.js";
import {ColliderUpdateSystem} from "./ColliderUpdateSystem.js";
export class Game {
    renderer = null;
    scene = null;
    camera = null;
    clock = null;
    // we use tag as component ids
    playerTag = "player";
    opponentTag = "opponent";
    bottomWallTag = "bottomWall";
    topWallTag = "topWall";
    ballTag = "ball";
    opponentScoreTag = "opponentScore";
    playerScoreTag = "playerScore";
    // components
    threeObjs = new Map();
    colliders = new Map();
    ballVelocity = new Vector3(-1,-1,0);
    // systems
    AISystem = null;
    BallMoveSystem = null;
    ScoreSystem = null;
    PlayerMoveSystem = null;
    ColliderUpdateSystem = null;

    constructor(renderer, camera) {
        this.scene = new Scene();
        this.renderer = renderer;
        this.camera = camera;
        this.clock = new Clock();
        new KeyboardHandler();
        this.AISystem = new AISystem(this.opponentTag, this.ballTag, this.playerTag, this.topWallTag, this.bottomWallTag);
        this.BallMoveSystem = new BallMovementSystem(this.ballTag, this.playerTag, this.opponentTag, this.topWallTag, this.bottomWallTag);
        this.ScoreSystem = new ScoreSystem(this.ballTag, this.playerTag, this.opponentTag, this.playerScoreTag, this.opponentScoreTag);
        this.PlayerMoveSystem = new PlayerMovementSystem(this.playerTag, this.topWallTag, this.bottomWallTag);
        this.ColliderUpdateSystem = new ColliderUpdateSystem(this.colliders, this.threeObjs);
    }

    addPlayer(object) {
        this.addObject(object, this.playerTag);
        this.addCollider(object, this.playerTag);
    }
    addOpponent(object) {
        this.addObject(object, this.opponentTag);
        this.addCollider(object, this.opponentTag);
    }
    addBall(object) {
        this.addObject(object, this.ballTag);
        this.addCollider(object, this.ballTag);
    }
    addCollider(object, id) {
        this.colliders.set(id, new Box3());
        object.geometry.computeBoundingBox();
    }
    addObject(object, id) {
        this.scene.add(object);
        this.threeObjs.set(id, object);
    }

    tick() {
        if (!this.clock.running) this.clock.start();
        const deltaTime = this.clock.getDelta();

        this.ColliderUpdateSystem.execute();
        this.PlayerMoveSystem.execute(this.threeObjs, this.colliders, deltaTime);
        this.BallMoveSystem.execute(this.ballVelocity, this.threeObjs, this.colliders, deltaTime);
        this.AISystem.execute(this.threeObjs, this.colliders, deltaTime);
        this.ScoreSystem.execute(this.threeObjs, this.ballVelocity);

        this.renderer.render( this.scene, this.camera );
    }
}