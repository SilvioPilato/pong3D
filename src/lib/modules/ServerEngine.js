import { ServerPlayerMovementSystem } from "../systems/server/ServerPlayerMovementSystem.js";
export class ServerEngine {
    #activePlayers = new Set();
    #inputQueue = [];
    // components
    #positions = new Map();
    // systems
    serverPlayerMovementSystem = new ServerPlayerMovementSystem()

    addPlayer(userId, position) {
        this.#positions.set(userId, position)
        this.activeUsers.add(userId);
    }

    removePlayer(userId) {
        this.#positions.delete(userId);
        this.activeUsers.delete(userId);
    }

    get activeUsers() {
        return this.#activePlayers;
    }

    get inputQueue() {
        return this.#inputQueue;
    }

    get playerPositions() {
        return this.#positions;
    }

    purgeInputQueue() {
        this.#inputQueue = [];
    }

    tick(deltaTime) {
        this.serverPlayerMovementSystem.execute(this.inputQueue, this.#positions, deltaTime);
    }
}