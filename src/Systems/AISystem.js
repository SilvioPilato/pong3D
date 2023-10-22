export class AISystem {
    agentTag = null;
    ballTag = null;
    playerTag = null;
    topWallTag = null;
    bottomWallTag = null;
    OPPONENT_SPEED = 5;
    constructor(agentTag, ballTag, playerTag, topWallTag, bottomWallTag) {
        this.agentTag = agentTag;
        this.ballTag = ballTag;
        this.playerTag = playerTag;
        this.topWallTag = topWallTag;
        this.bottomWallTag = bottomWallTag;
    }
    execute(entities, colliders, deltaTime) {
        // const playerEntity = entities.get(this.playerTag);
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