import { INVALID_ROLE, ROLE_INACTIVE, ROLE_PLAYER_1, ROLE_PLAYER_2, ROLE_SPECTATOR, USER_NOT_FOUND } from "../../config/index.js";

export class ServerRoom {
    users = new Map();

    name = ""; 

    #playerOneId = null;
    #playerTwoId = null;
    #id;
    #valid_roles = [
        ROLE_INACTIVE,
        ROLE_PLAYER_1,
        ROLE_PLAYER_2,
        ROLE_SPECTATOR
    ]

    constructor(id) {
        this.#id = id;
    }

    getState(playerPositions) {
        const playerOnePosition = playerPositions.get(this.playerOne);
        const playerTwoPosition = playerPositions.get(this.playerTwo);
        if (!playerOnePosition || !playerTwoPosition) return null;

        return {
            running: true,
            [ROLE_PLAYER_1]: playerOnePosition.y,
            [ROLE_PLAYER_2]: playerTwoPosition.y,
            ballX: 0,
            ballY: 0
        }
    }

    addUser(userId) {
        this.users.set(userId, new ServerUser());
    };
    
    setUserRole(userId, role) {
        if (!this.#valid_roles.includes(role)) {
            return {
                success: false,
                reason: INVALID_ROLE
            }
        }

        const user = this.users.get(userId);
        if (!user) {
            return {
                success: false,
                reason: USER_NOT_FOUND
            }
        }

        if (role == ROLE_PLAYER_1) {
            this.#playerOneId = userId;
        }

        if (role == ROLE_PLAYER_2) {
            this.#playerTwoId = userId;
        }
        
        user.role = role;
        return {
            success: true,
            reason: null
        }
    }

    get roomId() {
        return this.#id;
    }

    get playerOne() {
        return this.#playerOneId;
    }

    get playerTwo() {
        return this.#playerTwoId;
    }
}

export class ServerUser {
    name = "";
    role = ROLE_INACTIVE;
}
