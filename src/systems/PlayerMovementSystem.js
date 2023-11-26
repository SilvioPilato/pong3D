import {KeyboardHandler} from "../KeyboardHandler.js";
import {TAG_BOTTOM_WALL, TAG_PLAYER, TAG_TOP_WALL} from "../config/index.js";

export class PlayerMovementSystem {
    playerTag = TAG_PLAYER;
    topWallTag = TAG_TOP_WALL;
    bottomWallTag = TAG_BOTTOM_WALL;
    PLAYER_SPEED = 14;
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