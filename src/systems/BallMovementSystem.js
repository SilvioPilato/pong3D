import {TAG_BALL, TAG_BOTTOM_WALL, TAG_PLAYER_ONE, TAG_PLAYER_TWO, TAG_TOP_WALL} from "../config/index.js";

export class BallMovementSystem {
    playerOneTag = TAG_PLAYER_ONE;
    playerTwoTag = TAG_PLAYER_TWO;
    ballTag = TAG_BALL;
    topWallTag = TAG_TOP_WALL;
    bottomWallTag = TAG_BOTTOM_WALL;
    BALL_SPEED = 10;

    execute(ballVelocity, threeObjs, colliders, deltaTime) {
        const ballThree = threeObjs.get(this.ballTag);
        const playerOneThree = threeObjs.get(this.playerOneTag);
        const playerTwoThree = threeObjs.get(this.playerTwoTag);
        const playerOneCollider = colliders.get(this.playerOneTag);
        const playerTwoCollider = colliders.get(this.playerTwoTag);
        const ballCollider = colliders.get(this.ballTag);
        const topWallCollider = colliders.get(this.topWallTag);
        const bottomWallCollider = colliders.get(this.bottomWallTag);

        // Check collision with player two (typically on the right side)
        if (ballVelocity.x > 0 && ballCollider.intersectsBox(playerTwoCollider)) {
            const paddleHalf = (playerTwoCollider.max.y - playerTwoCollider.min.y) / 2;
            ballVelocity.x = -ballVelocity.x;
            const yDifference = ballThree.position.y - playerTwoThree.position.y;
            ballVelocity.y = yDifference > 0 ?
                Math.min(yDifference / paddleHalf, 1) :
                Math.max(yDifference / paddleHalf, -1);
        }

        // Check collision with player one (typically on the left side)
        if((ballVelocity.x < 0 && ballCollider.intersectsBox(playerOneCollider))) {
            const paddleHalf = (playerOneCollider.max.y - playerOneCollider.min.y) / 2;
            ballVelocity.x = -ballVelocity.x;
            const yDifference = ballThree.position.y - playerOneThree.position.y;
            ballVelocity.y = yDifference > 0 ?
                Math.min(yDifference / paddleHalf, 1) :
                Math.max(yDifference / paddleHalf, -1);
        }

        if (
            (ballVelocity.y > 0 && ballCollider.intersectsBox(topWallCollider)) ||
            (ballVelocity.y < 0 && ballCollider.intersectsBox(bottomWallCollider))) {
            ballVelocity.y = -ballVelocity.y;
        }

        ballThree.position.x += ballVelocity.x * deltaTime * this.BALL_SPEED;
        ballThree.position.y += ballVelocity.y * deltaTime * this.BALL_SPEED;
        ballThree.position.z += ballVelocity.z * deltaTime * this.BALL_SPEED;
    }
}