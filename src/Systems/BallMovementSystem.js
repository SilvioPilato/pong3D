export class BallMovementSystem {
    opponentTag = null;
    ballTag = null;
    playerTag = null;
    topWallTag = null;
    bottomWallTag = null;
    BALL_SPEED = 10;
    constructor(ballTag, playerTag, opponentTag, topWallTag, bottomWallTag) {
        this.opponentTag = opponentTag;
        this.ballTag = ballTag;
        this.playerTag = playerTag;
        this.topWallTag = topWallTag;
        this.bottomWallTag = bottomWallTag;
    }
    execute(ballVelocity, threeObjs, colliders, deltaTime) {
        const ballThree = threeObjs.get(this.ballTag);
        const playerThree = threeObjs.get(this.playerTag);
        const opponentThree = threeObjs.get(this.opponentTag);
        const playerCollider = colliders.get(this.playerTag);
        const ballCollider = colliders.get(this.ballTag);
        const opponentCollider = colliders.get(this.opponentTag);
        const topWallCollider = colliders.get(this.topWallTag);
        const bottomWallCollider = colliders.get(this.bottomWallTag);

        if (ballVelocity.x > 0 && ballCollider.intersectsBox(opponentCollider)) {
            const paddleHalf = (opponentCollider.max.y - opponentCollider.min.y) / 2;
            ballVelocity.x = -ballVelocity.x;
            const yDifference = ballThree.position.y - opponentThree.position.y;
            ballVelocity.y = yDifference > 0 ?
                Math.min(yDifference / paddleHalf, 1) :
                Math.max(yDifference / paddleHalf, -1);
        }

        if((ballVelocity.x < 0 && ballCollider.intersectsBox(playerCollider))) {
            const paddleHalf = (playerCollider.max.y - playerCollider.min.y) / 2;
            ballVelocity.x = -ballVelocity.x;
            const yDifference = ballThree.position.y - playerThree.position.y;
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