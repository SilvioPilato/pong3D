import {TAG_BALL, TAG_BOTTOM_WALL, TAG_OPPONENT, TAG_PLAYER, TAG_TOP_WALL} from "../../../config/index.js";
import {AABB, getPlayerCollider, getWallCollider, getBallCollider} from "../../modules/Utils.js";
export class BallMovementSystem {
    BALL_SPEED = 10;

    execute(ballVelocity, threeObjs, deltaTime) {
        const ballThree = threeObjs.get(TAG_BALL);
        const playerThree = threeObjs.get(TAG_PLAYER);
        const opponentThree = threeObjs.get(TAG_OPPONENT);
        const topWall = threeObjs.get(TAG_TOP_WALL);
        const bottomWall = threeObjs.get(TAG_BOTTOM_WALL);

        const playerCollider = getPlayerCollider(playerThree.position.x, playerThree.position.y);
        const ballCollider = getBallCollider(ballThree.position.x, ballThree.position.y);
        const opponentCollider = getPlayerCollider(opponentThree.position.x, opponentThree.position.y);
        const topWallCollider = getWallCollider(topWall.position.x, topWall.position.y);
        const bottomWallCollider = getWallCollider(bottomWall.position.x, bottomWall.position.y);

        if (ballVelocity.x > 0 && AABB(ballCollider, opponentCollider)) {
            const paddleHalf = opponentThree.position.y;
            ballVelocity.x = -ballVelocity.x;
            const yDifference = ballThree.position.y - paddleHalf;
            ballVelocity.y = yDifference > 0 ?
                Math.min(yDifference / paddleHalf, 1) :
                Math.max(yDifference / paddleHalf, -1);
        }

        if(ballVelocity.x < 0 && AABB(ballCollider, playerCollider)) {
            const paddleHalf = playerThree.position.y;
            ballVelocity.x = -ballVelocity.x;
            const yDifference = ballThree.position.y - paddleHalf;
            ballVelocity.y = yDifference > 0 ?
                Math.min(yDifference / paddleHalf, 1) :
                Math.max(yDifference / paddleHalf, -1);
        }

        if (
            (ballVelocity.y > 0 && AABB(ballCollider, topWallCollider)) ||
            (ballVelocity.y < 0 && AABB(ballCollider, bottomWallCollider))) {
            ballVelocity.y = -ballVelocity.y;
        }

        ballThree.position.x += ballVelocity.x * deltaTime * this.BALL_SPEED;
        ballThree.position.y += ballVelocity.y * deltaTime * this.BALL_SPEED;
        ballThree.position.z += ballVelocity.z * deltaTime * this.BALL_SPEED;
    }
}