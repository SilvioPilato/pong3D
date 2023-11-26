import {AudioHandler} from "../AudioHandler.js";
import {
    TAG_BALL,
    TAG_BOTTOM_WALL, TAG_GOAL_SCORED,
    TAG_OPPONENT,
    TAG_PADDLE_HIT,
    TAG_PLAYER,
    TAG_TOP_WALL,
    TAG_WALL_HIT
} from "../config/index.js";

export class AudioSystem {
    opponentTag = TAG_OPPONENT;
    ballTag = TAG_BALL;
    playerTag = TAG_PLAYER;
    topWallTag = TAG_TOP_WALL;
    bottomWallTag = TAG_BOTTOM_WALL;
    ballDropId = TAG_WALL_HIT;
    paddleHitId = TAG_PADDLE_HIT;
    goalScoredId = TAG_GOAL_SCORED;
    GOAL_THRESHOLD = 5;
    execute(threeObjs, colliders) {
        const topWallCollider = colliders.get(this.topWallTag);
        const bottomWallCollider = colliders.get(this.bottomWallTag);
        const playerCollider = colliders.get(this.playerTag);
        const opponentCollider = colliders.get(this.opponentTag);
        const ballCollider = colliders.get(this.ballTag);

        const ballThree = threeObjs.get(this.ballTag);
        const playerThree = threeObjs.get(this.playerTag);
        const opponentThree = threeObjs.get(this.opponentTag);

        if (ballCollider.intersectsBox(topWallCollider) ||
            ballCollider.intersectsBox(bottomWallCollider)
        ) {
            AudioHandler.play(this.ballDropId);
        }

        if (ballCollider.intersectsBox(playerCollider) ||
            ballCollider.intersectsBox(opponentCollider)
        ) {
            AudioHandler.play(this.paddleHitId);
        }

        if ((ballThree.position.x > opponentThree.position.x + this.GOAL_THRESHOLD) ||
            (ballThree.position.x < playerThree.position.x - this.GOAL_THRESHOLD)
        ) {
            AudioHandler.play(this.goalScoredId);
        }
    }
}