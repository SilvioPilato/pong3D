import { io, Socket } from "socket.io-client";
import { ENQUEUE_ACTION, JOIN_FAILURE, JOIN_SUCCESS, PUBLISH_GAME_STATE, ROLE_INACTIVE } from "../../config";
const DEFAULT_PORT = 8080;
const DEFAULT_ADDRESS = "ws://localhost";
export class ServerConnection {
    socket = null;

    #assignedRole = ROLE_INACTIVE;
    #roomId = null;

    connect() {
        return Promise((resolve, reject) => {
            this.socket = io(`${DEFAULT_ADDRESS}:${DEFAULT_PORT}`);
            this.socket.on("connection", resolve);
            this.socket.on("connect_error", reject);
        })
    }

    joinGame(id) {
        return Promise((resolve, reject) => {
            if (!this.socket || !this.socket.connected) {
                reject("You are not connected to server");
            }

            this.socket.on(JOIN_SUCCESS, (args) => {
                this.#assignedRole = args.role;
                this.#roomId = args.roomId;
                resolve(args);
            });
            this.socket.on(JOIN_FAILURE, reject);
            this.socket.emit(JOIN_ROOM, { roomId: id });
        })
    }

    subscribeToUpdates(callback) {
        if (!this.socket || !this.socket.connected) return null;
        return this.socket.on(PUBLISH_GAME_STATE, callback);
    }

    sendAction(payload) {
        if (!this.socket || !this.socket.connected) return null;
        return this.socket.emit(ENQUEUE_ACTION, payload);
    }

    get roomId() {
        return this.#roomId;
    }

    get assignedRole() {
        return this.#assignedRole;
    }
}