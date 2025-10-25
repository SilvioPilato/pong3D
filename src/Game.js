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
    TAG_PLAYER_ONE,
    TAG_PLAYER_TWO,
} from "./config/index.js";
/**
 * Game class now uses TAG_PLAYER_ONE and TAG_PLAYER_TWO instead of TAG_PLAYER and TAG_OPPONENT
 * This allows for flexible role assignment:
 * - Player One: typically the left paddle
 * - Player Two: typically the right paddle
 * 
 * Roles can be configured:
 * - humanPlayerTag: which player the human controls
 * - aiPlayerTag: which player the AI controls
 * 
 * This enables scenarios like:
 * - Player One human vs Player Two AI (default)
 * - Player Two human vs Player One AI
 * - Future: Both players human for local multiplayer
 */
export class Game {
    renderer = null;
    scene = null;
    camera = null;
    clock = null;
    // we use tag as component ids
    playerOneTag = TAG_PLAYER_ONE;
    playerTwoTag = TAG_PLAYER_TWO;
    ballTag = TAG_BALL;
    
    // Role configuration - determines which player is human vs AI
    humanPlayerTag = TAG_PLAYER_ONE;  // Default: player one is human
    aiPlayerTag = TAG_PLAYER_TWO;     // Default: player two is AI
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
        this.AISystem = new AISystem(this.aiPlayerTag);
        this.BallMoveSystem = new BallMovementSystem();
        this.ScoreSystem = new ScoreSystem();
        this.PlayerMoveSystem = new PlayerMovementSystem(this.humanPlayerTag);
        this.ColliderUpdateSystem = new ColliderUpdateSystem(this.colliders, this.threeObjs);
        this.AudioSystem = new AudioSystem();
    }

    addPlayerOne(object) {
        this.addObject(object, this.playerOneTag);
        this.addCollider(object, this.playerOneTag);
    }
    addPlayerTwo(object) {
        this.addObject(object, this.playerTwoTag);
        this.addCollider(object, this.playerTwoTag);
    }
    
    // Helper methods for backward compatibility and role-based access
    addHumanPlayer(object) {
        this.addObject(object, this.humanPlayerTag);
        this.addCollider(object, this.humanPlayerTag);
    }
    addAIPlayer(object) {
        this.addObject(object, this.aiPlayerTag);
        this.addCollider(object, this.aiPlayerTag);
    }
    
    // Configuration method to set player roles
    setPlayerRoles(humanTag, aiTag) {
        this.humanPlayerTag = humanTag;
        this.aiPlayerTag = aiTag;
        
        // Update systems with new player tags
        this.AISystem.agentTag = aiTag;
        this.PlayerMoveSystem.playerTag = humanTag;
    }
    
    // Helper methods for common role configurations
    setPlayerOneAsHuman() {
        this.setPlayerRoles(this.playerOneTag, this.playerTwoTag);
    }
    
    setPlayerTwoAsHuman() {
        this.setPlayerRoles(this.playerTwoTag, this.playerOneTag);
    }
    
    // For multiplayer mode where both players are human
    setBothPlayersHuman() {
        // In this case, we might need a second PlayerMovementSystem
        // This would require additional refactoring for multi-input support
        console.warn("Both players human mode requires additional input handling implementation");
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