import {Vector3} from "three";
import {TextGeometry} from "three/addons/geometries/TextGeometry.js";

export class ScoreSystem {
    THRESHOLD = 5;
    playerScore = 0;
    opponentScore = 0;
    playerScoreTag = null;
    opponentScoreTag = null;
    resetVelocity = new Vector3(-1,-1,0);
    constructor(ballTag, playerTag, opponentTag, playerScoreTag, opponentScoreTag) {
        this.opponentTag = opponentTag;
        this.ballTag = ballTag;
        this.playerTag = playerTag;
        this.playerScoreTag = playerScoreTag;
        this.opponentScoreTag = opponentScoreTag;
    }
    execute(threeObjs, ballVelocity) {
        const ballThree = threeObjs.get(this.ballTag);
        const playerThree = threeObjs.get(this.playerTag);
        const opponentThree = threeObjs.get(this.opponentTag);

        if (ballThree.position.x < playerThree.position.x - this.THRESHOLD) {
            this.opponentScore++;
            this.resetBall(ballThree);
            ballVelocity.x = this.resetVelocity.x;
            ballVelocity.y = this.resetVelocity.y;
            this.setScoreGeometry(threeObjs.get(this.opponentScoreTag), this.opponentScore.toString());
        }

        if (ballThree.position.x > opponentThree.position.x + this.THRESHOLD) {
            this.playerScore++;
            this.resetBall(ballThree);
            ballVelocity.x = this.resetVelocity.x;
            ballVelocity.y = this.resetVelocity.y;
            this.setScoreGeometry(threeObjs.get(this.playerScoreTag), this.playerScore.toString());
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