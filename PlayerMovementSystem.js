import {KeyboardHandler} from "./KeyboardHandler.js";

export class PlayerMovementSystem {
    playerTag = null;
    topWallTag = null;
    bottomWallTag = null;
    PLAYER_SPEED = 14;
    constructor(playerTag, topWallTag, bottomWallTag) {
        this.playerTag = playerTag;
        this.topWallTag = topWallTag;
        this.bottomWallTag = bottomWallTag;
    }
    execute(threeObjs, colliders, deltaTime) {
        const playerThree = threeObjs.get(this.playerTag);
        const playerCollider = colliders.get(this.playerTag);
        const topWallCollider = colliders.get(this.topWallTag);
        const bottomWallCollider = colliders.get(this.bottomWallTag);

        if (KeyboardHandler.isHold("ArrowUp") && !playerCollider.intersectsBox(topWallCollider)) {
            playerThree.position.y += this.PLAYER_SPEED * deltaTime;
        }
        if (KeyboardHandler.isHold("ArrowDown") && !playerCollider.intersectsBox(bottomWallCollider)) {
            playerThree.position.y -= this.PLAYER_SPEED * deltaTime;
        }
    }
}