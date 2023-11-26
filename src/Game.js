import {Box3, Clock, Scene, Vector3} from "three";
import {KeyboardHandler} from "./KeyboardHandler.js";
import {AISystem} from "./systems/AISystem.js";
import {BallMovementSystem} from "./systems/BallMovementSystem.js";
import {ScoreSystem} from "./systems/ScoreSystem.js";
import {PlayerMovementSystem} from "./systems/PlayerMovementSystem.js";
import {ColliderUpdateSystem} from "./systems/ColliderUpdateSystem.js";
import {AudioSystem} from "./systems/AudioSystem.js";
import {
    TAG_BALL,
    TAG_BOTTOM_WALL,
    TAG_OPPONENT,
    TAG_OPPONENT_SCORE,
    TAG_PLAYER,
    TAG_PLAYER_SCORE,
    TAG_TOP_WALL
} from "./config/index.js";
export class Game {
    renderer = null;
    scene = null;
    camera = null;
    clock = null;
    // we use tag as component ids
    playerTag = TAG_PLAYER;
    opponentTag = TAG_OPPONENT;
    bottomWallTag = TAG_BOTTOM_WALL;
    topWallTag = TAG_TOP_WALL;
    ballTag = TAG_BALL;
    opponentScoreTag = TAG_OPPONENT_SCORE;
    playerScoreTag = TAG_PLAYER_SCORE;
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
    AudioSystem = null;
    constructor(renderer, camera) {
        this.scene = new Scene();
        this.renderer = renderer;
        this.camera = camera;
        this.clock = new Clock();
        new KeyboardHandler();
        this.AISystem = new AISystem(this.opponentTag, this.ballTag, this.topWallTag, this.bottomWallTag);
        this.BallMoveSystem = new BallMovementSystem(this.ballTag, this.playerTag, this.opponentTag, this.topWallTag, this.bottomWallTag);
        this.ScoreSystem = new ScoreSystem(this.ballTag, this.playerTag, this.opponentTag, this.playerScoreTag, this.opponentScoreTag);
        this.PlayerMoveSystem = new PlayerMovementSystem(this.playerTag, this.topWallTag, this.bottomWallTag);
        this.ColliderUpdateSystem = new ColliderUpdateSystem(this.colliders, this.threeObjs);
        this.AudioSystem = new AudioSystem(this.ballTag, this.playerTag, this.opponentTag, this.topWallTag, this.bottomWallTag);
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
        this.AudioSystem.execute(this.threeObjs,this.colliders);
        this.ScoreSystem.execute(this.threeObjs, this.ballVelocity);

        this.renderer.render( this.scene, this.camera );
    }
}