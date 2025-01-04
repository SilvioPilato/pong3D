import {TAG_OPPONENT, BOTTOM_WALL_POS, TOP_WALL_POS, WALL_HEIGHT, WALL_MARGIN, TAG_BALL, PLAYER_LEN} from "../../../config/index.js";

export class AISystem {
    topWallYBoundary = TOP_WALL_POS.y - WALL_HEIGHT - WALL_MARGIN;
    bottomWallYBoundary = BOTTOM_WALL_POS.y + WALL_HEIGHT + WALL_MARGIN;
    
    OPPONENT_SPEED = 6;
    execute(threeObjs, deltaTime) {
        const agentEntity = threeObjs.get(TAG_OPPONENT);
        const ballEntity = threeObjs.get(TAG_BALL);
        const agentYTopBoundary = agentEntity.position.y + PLAYER_LEN / 2;
        const agentYBottomBoundary = agentEntity.position.y - PLAYER_LEN / 2;

        if (ballEntity.position.y > agentEntity.position.y && !(agentYTopBoundary >= this.topWallYBoundary)) {
            agentEntity.position.y += this.OPPONENT_SPEED * deltaTime;
        }
        if (ballEntity.position.y < agentEntity.position.y && !(agentYBottomBoundary <= this.bottomWallYBoundary)) {
            agentEntity.position.y -= this.OPPONENT_SPEED * deltaTime;
        }
    }
}