import {ROLE_PLAYER_2, ROLE_PLAYER_1, TAG_OPPONENT} from "../../../config/index.js";
import { lerp } from "three/src/math/MathUtils.js";

export class OnlinePlayerMovementSystem {
    DELAY = 200;
    serverOrigin = 0;
    execute(serverPositions, threeObjs, clock) {
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
        const otherPlayer = TAG_OPPONENT; 
        const otherPlayerPosA = posA[otherPlayer];
        const otherPlayerPosB = posB[otherPlayer];
        const t = (posB.timestamp - time) / (posB.timestamp - posA.timestamp);
        const clientPosition = threeObjs.get(otherPlayer);
        clientPosition.position.y = lerp(otherPlayerPosA, otherPlayerPosB, t);
    }
}

/**
 * [
 *  {timestamp, positions: Positions}
 * ]
 * Positions {}
 */
