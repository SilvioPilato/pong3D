import {KeyboardHandler} from "../../handlers/KeyboardHandler.js";
import {TAG_PLAYER, BOTTOM_WALL_POS, TOP_WALL_POS, WALL_HEIGHT, PLAYER_LEN, PLAYER_SPEED, WALL_MARGIN} from "../../../config/index.js";

export class OfflinePlayerMovementSystem {
    playerTag = TAG_PLAYER;
    topWallYBoundary = TOP_WALL_POS.y - WALL_HEIGHT - WALL_MARGIN;
    bottomWallYBoundary = BOTTOM_WALL_POS.y + WALL_HEIGHT + WALL_MARGIN;

    execute(positions, deltaTime) {
        const player = positions.get(TAG_PLAYER);
        const playerYTopBoundary = player.position.y + PLAYER_LEN / 2;
        const playerYBottomBoundary = player.position.y - PLAYER_LEN / 2;

        if (KeyboardHandler.isHold("ArrowUp") && !(playerYTopBoundary >= this.topWallYBoundary)) {
            player.position.y += PLAYER_SPEED * deltaTime;
            console.log(player.position.y);
        }
        if (KeyboardHandler.isHold("ArrowDown") && !(playerYBottomBoundary <= this.bottomWallYBoundary)) {
            player.position.y -= PLAYER_SPEED * deltaTime;
        }
    }
}