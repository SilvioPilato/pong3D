import {TAG_BALL, TAG_BOTTOM_WALL, TAG_OPPONENT, TAG_TOP_WALL} from "../config/index.js";

export class AISystem {
    agentTag = TAG_OPPONENT;
    ballTag = TAG_BALL;
    topWallTag = TAG_TOP_WALL;
    bottomWallTag = TAG_BOTTOM_WALL;
    OPPONENT_SPEED = 6;
    execute(entities, colliders, deltaTime) {
        const agentEntity = entities.get(this.agentTag);
        const ballEntity = entities.get(this.ballTag);

        const agentCollider = colliders.get(this.agentTag)
        const topWallCollider = colliders.get(this.topWallTag)
        const bottomWallCollider = colliders.get(this.bottomWallTag)

        if (ballEntity.position.y > agentEntity.position.y && !agentCollider.intersectsBox(topWallCollider)) {
            agentEntity.position.y += deltaTime * this.OPPONENT_SPEED;
        }

        if (ballEntity.position.y < agentEntity.position.y && !agentCollider.intersectsBox(bottomWallCollider)) {
            agentEntity.position.y -= deltaTime * this.OPPONENT_SPEED;
        }
    }
}