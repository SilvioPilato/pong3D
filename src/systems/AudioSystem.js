import {AudioHandler} from "../AudioHandler.js";
import {
    TAG_BALL,
    TAG_BOTTOM_WALL, TAG_GOAL_SCORED,
    TAG_PADDLE_HIT,
    TAG_PLAYER_ONE,
    TAG_PLAYER_TWO,
    TAG_TOP_WALL,
    TAG_WALL_HIT
} from "../config/index.js";

export class AudioSystem {
    playerOneTag = TAG_PLAYER_ONE;
    playerTwoTag = TAG_PLAYER_TWO;
    ballTag = TAG_BALL;
    topWallTag = TAG_TOP_WALL;
    bottomWallTag = TAG_BOTTOM_WALL;
    ballDropId = TAG_WALL_HIT;
    paddleHitId = TAG_PADDLE_HIT;
    goalScoredId = TAG_GOAL_SCORED;
    GOAL_THRESHOLD = 5;
    execute(threeObjs, colliders) {
        const topWallCollider = colliders.get(this.topWallTag);
        const bottomWallCollider = colliders.get(this.bottomWallTag);
        const playerOneCollider = colliders.get(this.playerOneTag);
        const playerTwoCollider = colliders.get(this.playerTwoTag);
        const ballCollider = colliders.get(this.ballTag);

        const ballThree = threeObjs.get(this.ballTag);
        const playerOneThree = threeObjs.get(this.playerOneTag);
        const playerTwoThree = threeObjs.get(this.playerTwoTag);

        if (ballCollider.intersectsBox(topWallCollider) ||
            ballCollider.intersectsBox(bottomWallCollider)
        ) {
            AudioHandler.play(this.ballDropId);
        }

        if (ballCollider.intersectsBox(playerOneCollider) ||
            ballCollider.intersectsBox(playerTwoCollider)
        ) {
            AudioHandler.play(this.paddleHitId);
        }

        if ((ballThree.position.x > playerTwoThree.position.x + this.GOAL_THRESHOLD) ||
            (ballThree.position.x < playerOneThree.position.x - this.GOAL_THRESHOLD)
        ) {
            AudioHandler.play(this.goalScoredId);
        }
    }
}