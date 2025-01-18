import { io } from "socket.io-client";
import { ENQUEUE_ACTION, JOIN_FAILURE, JOIN_ROOM, JOIN_SUCCESS, PUBLISH_GAME_STATE, REQUEST_ROOMS, ROLE_INACTIVE, ROOMS_LIST, START_GAME } from "../../config";
const DEFAULT_PORT = 8080;
const DEFAULT_ADDRESS = "ws://localhost";
export class ServerConnection {
    socket = null;

    #assignedRole = ROLE_INACTIVE;
    #roomId = null;

    connect() {
        return new Promise((resolve, reject) => {
            this.socket = io(`${DEFAULT_ADDRESS}:${DEFAULT_PORT}`);
            this.socket.on("connect",() => resolve(this));
            this.socket.on("connect_error", reject);
        })
    }

    joinGame(id) {
        return new Promise((resolve, reject) => {
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

    subscribeToRooms(callback) {
        if (!this.socket || !this.socket.connected) return null;
        this.socket.on(ROOMS_LIST, callback);
    }

    subscribeToGameStart(callback) {
        if (!this.socket || !this.socket.connected) return null;
        this.socket.on(START_GAME, callback);
    }

    requestRooms(page = 0) {
        if (!this.socket || !this.socket.connected) return null;
        this.socket.emit(REQUEST_ROOMS, { page });
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
