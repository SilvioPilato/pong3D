import {ROLE_PLAYER_1, ROLE_PLAYER_2, TAG_OPPONENT} from "../../../config/index.js";
import { lerp } from "three/src/math/MathUtils.js";

export class OnlinePlayerMovementSystem {
    DELAY = 200;
    serverOrigin = 0;
    execute(serverPositions, threeObjs, role) {
        if (!serverPositions || serverPositions.length < 1) return;
        const time = performance.now() - this.DELAY;
        let i = 0;
        while(serverPositions[i].time < time) {
            i++;
        }
        if (i == 0) return;
        let posA = serverPositions[i - 1];
        let posB = serverPositions[i];
        // other player movement interpolation
        const otherPlayer = role == ROLE_PLAYER_1 ? ROLE_PLAYER_2 : ROLE_PLAYER_1; 
        const otherPlayerPosA = posA[otherPlayer];
        const otherPlayerPosB = posB[otherPlayer];
        const t = (posB.time - time) / (posB.time - posA.time);
        const clientPosition = threeObjs.get(TAG_OPPONENT);
        clientPosition.position.y = lerp(otherPlayerPosA, otherPlayerPosB, t);
        serverPositions.splice(0, i-1);  
    }
}

/**
 * [
 *  {timestamp, positions: Positions}
 * ]
 * Positions {}
 */
