import {AudioHandler} from "../../handlers/AudioHandler.js"
import {
    TAG_BALL,
    TAG_BOTTOM_WALL, TAG_GOAL_SCORED,
    TAG_OPPONENT,
    TAG_PADDLE_HIT,
    TAG_PLAYER,
    TAG_TOP_WALL,
    TAG_WALL_HIT
} from "../../../config/index.js";
import { getPlayerCollider, getWallCollider, AABB, getBallCollider } from "../../modules/Utils.js";

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
    execute(threeObjs) {

        const ballThree = threeObjs.get(TAG_BALL);
        const playerThree = threeObjs.get(TAG_PLAYER);
        const opponentThree = threeObjs.get(TAG_OPPONENT);
        const topWallThree = threeObjs.get(TAG_TOP_WALL);
        const bottomWallThree = threeObjs.get(TAG_BOTTOM_WALL);

        const topWallCollider = getWallCollider(topWallThree.position.x, topWallThree.position.y);
        const bottomWallCollider = getWallCollider(bottomWallThree.position.x, bottomWallThree.position.y);
        const playerCollider = getPlayerCollider(playerThree.position.x, playerThree.position.y);
        const opponentCollider = getPlayerCollider(opponentThree.position.x, opponentThree.position.y);
        const ballCollider = getBallCollider(ballThree.position.x, ballThree.position.y);


        if (AABB(ballCollider, topWallCollider) || 
            AABB(ballCollider, bottomWallCollider)
        ) {
            AudioHandler.play(this.ballDropId);
        }

        if (AABB(ballCollider, playerCollider) ||
            AABB(ballCollider, opponentCollider)
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