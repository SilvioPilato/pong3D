import {ROLE_PLAYER_2, ROLE_PLAYER_1} from "../../../config/index.js";
import { lerp } from "three/src/math/MathUtils.js";

export class OnlinePlayerMovementSystem {
    DELAY = 200;
    execute(serverPositions, clientPositions, playerRole) {
        const time = currentTime - this.DELAY;
        let i = 0;
        while(serverPositions[i].time < time) {
            i++;
        }
        if (i == 0) return;
        let posA = serverPositions[i - 1];
        let posB = serverPositions[i];
        // other player movement interpolation
        const otherPlayer = playerRole == ROLE_PLAYER_1 ? ROLE_PLAYER_2 : ROLE_PLAYER_1;
        const otherPlayerPosA = posA[otherPlayer];
        const otherPlayerPosB = posB[otherPlayer];
        const t = (posB.timestamp - time) / (posB.timestamp - posA.timestamp);
        const clientPosition = clientPositions.get(otherPlayer);
        clientPosition.y = lerp(otherPlayerPosA, otherPlayerPosB, t);
    }
}

/**
 * [
 *  {timestamp, positions: Positions}
 * ]
 * Positions {}
 */