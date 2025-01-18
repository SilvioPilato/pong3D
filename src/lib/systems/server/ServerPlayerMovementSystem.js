import { PLAYER_LEN, PLAYER_SPEED, WALL_HEIGHT, WALL_MARGIN } from "../../../config/index.js";
import { BOTTOM_WALL_POS, TOP_WALL_POS } from "../../../config/index.js";

export class ServerPlayerMovementSystem {

    topWallYBoundary = TOP_WALL_POS.y - WALL_HEIGHT + WALL_MARGIN;
    bottomWallYBoundary = BOTTOM_WALL_POS.y + WALL_HEIGHT + WALL_MARGIN;

    execute(inputQueue, positions, deltaTime) {
        for(let {direction, playerId} of inputQueue) {
            const playerPosition = positions.get(playerId);
            const playerYTopBoundary = playerPosition.y + PLAYER_LEN / 2;
            const playerYBottomBoundary = playerPosition.y - PLAYER_LEN / 2;
            console.log(deltaTime);
            if (direction == "up" && !(playerYTopBoundary >= this.topWallYBoundary)) {
                playerPosition.y += PLAYER_SPEED/100 * deltaTime;
            }
            if (direction == "down" && !(playerYBottomBoundary <= this.bottomWallYBoundary)) {
                playerPosition.y -= PLAYER_SPEED/100 * deltaTime;
            }
        }
    }
}
