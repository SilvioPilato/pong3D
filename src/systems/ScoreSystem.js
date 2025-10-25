import {Vector3} from "three";
import {TextGeometry} from "three/addons/geometries/TextGeometry.js";
import {TAG_BALL, TAG_OPPONENT_SCORE, TAG_PLAYER_ONE, TAG_PLAYER_SCORE, TAG_PLAYER_TWO} from "../config/index.js";

export class ScoreSystem {
    THRESHOLD = 5;
    playerOneScore = 0;
    playerTwoScore = 0;
    playerScoreTag = TAG_PLAYER_SCORE;
    opponentScoreTag = TAG_OPPONENT_SCORE;
    playerOneTag = TAG_PLAYER_ONE;
    playerTwoTag = TAG_PLAYER_TWO;
    ballTag = TAG_BALL;
    resetVelocity = new Vector3(-1,-1,0);
    execute(threeObjs, ballVelocity) {
        const ballThree = threeObjs.get(this.ballTag);
        const playerOneThree = threeObjs.get(this.playerOneTag);
        const playerTwoThree = threeObjs.get(this.playerTwoTag);

        // Ball went past player one (left side) - player two scores
        if (ballThree.position.x < playerOneThree.position.x - this.THRESHOLD) {
            this.playerTwoScore++;
            this.resetBall(ballThree);
            ballVelocity.x = this.resetVelocity.x;
            ballVelocity.y = this.resetVelocity.y;
            this.setScoreGeometry(threeObjs.get(this.opponentScoreTag), this.playerTwoScore.toString());
        }

        // Ball went past player two (right side) - player one scores
        if (ballThree.position.x > playerTwoThree.position.x + this.THRESHOLD) {
            this.playerOneScore++;
            this.resetBall(ballThree);
            ballVelocity.x = this.resetVelocity.x;
            ballVelocity.y = this.resetVelocity.y;
            this.setScoreGeometry(threeObjs.get(this.playerScoreTag), this.playerOneScore.toString());
        }
    }

    setScoreGeometry(threeObj, text) {
        const font = threeObj.geometry.parameters.options.font;
        threeObj.geometry = new TextGeometry(text, {
            font: font,
            size: 6,
            height: 0.5,
            curveSegments: 2,
            bevelEnabled: true,
            bevelThickness: 0.5,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 2
        });
    }

    resetBall(ballObj) {
        ballObj.position.x = 0;
        ballObj.position.y = 0;
    }
}