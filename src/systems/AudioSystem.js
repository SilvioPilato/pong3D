import {AudioHandler} from "../AudioHandler.js";

export class AudioSystem {
    opponentTag = null;
    ballTag = null;
    playerTag = null;
    topWallTag = null;
    bottomWallTag = null;
    ballDropId = "ball_drop";
    paddleHitId = "paddle_hit";
    goalScoredId = "goal_scored";
    GOAL_THRESHOLD = 5;
    constructor(ballTag, playerTag, opponentTag, topWallTag, bottomWallTag) {
        this.opponentTag = opponentTag;
        this.ballTag = ballTag;
        this.playerTag = playerTag;
        this.topWallTag = topWallTag;
        this.bottomWallTag = bottomWallTag;
    }
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