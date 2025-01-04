import { Server } from "socket.io";
import http from "http"
import express from "express";
import { v4 } from "uuid";
import { ENQUEUE_ACTION, JOIN_ROOM, JOIN_SUCCESS, PLAYER_ONE_START_POS, PLAYER_TWO_START_POS, ROLE_PLAYER_1, ROLE_PLAYER_2, ROLE_SPECTATOR, PUBLISH_GAME_STATE } from "./config/index.js";
import { ServerRoom } from "./lib/modules/ServerRoom.js";
import { ServerEngine } from "./lib/modules/ServerEngine.js";
import { SERVER_TICK_INTERVAL_IN_MS } from "./config/server.js";

const SERVER_PORT = 8080;
const app = new express();
const httpServer = http.createServer(app);
const rooms = new Map(); 
const io = new Server(httpServer, {
    cors: {
        origin: `http://localhost:5173`,
    }
});
const engine = new ServerEngine();
const users = new Map();
let lastExecution = performance.now();

io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`);
    users.set(socket.id, {room: null, role: null});
    socket.on(JOIN_ROOM,(arg) => {
        let roomId = arg.roomId || v4();
        let room = rooms.get(roomId);
        if (!room) {
            room = new ServerRoom(roomId);
            rooms.set(roomId, room);
        }
        room.addUser(socket.id);
        const userRole = assignUserToRoom(socket.id, room);
        addPlayerToEngine(socket.id, userRole);
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId} with role ${userRole}`);
        socket.emit(JOIN_SUCCESS, {role: userRole, roomId });
    });

    socket.on(ENQUEUE_ACTION, (arg) => {
        if (!engine.activeUsers.has(socket.id)) return;
        if (!arg.direction) return;
        const actionData = {
            direction: arg.direction,
            playerId: socket.id,
            timestamp: performance.now(),
        }
        engine.inputQueue.push(actionData);
    })
})

const addPlayerToEngine = (userId, role) => {
    switch (role) {
        case ROLE_PLAYER_1:
            engine.addPlayer(userId, PLAYER_ONE_START_POS);
            break;
        case ROLE_PLAYER_2:
            engine.addPlayer(userId, PLAYER_TWO_START_POS);
            break;
        default:
            break;
    }
}

const assignUserToRoom = (userId, room) => {
    if(!room.playerOne) {
        room.setUserRole(userId, ROLE_PLAYER_1);
        return ROLE_PLAYER_1;
    }
    if (!room.playerTwo) {
        room.setUserRole(userId, ROLE_PLAYER_2);
        return ROLE_PLAYER_2;
    }

    room.setUserRole(userId, ROLE_SPECTATOR);
    return ROLE_SPECTATOR;
}

const tick = () => {
    if (engine.activeUsers.size <= 0 ) return;
    const newExecutionTime = performance.now();
    const delta = newExecutionTime - lastExecution;
    lastExecution = newExecutionTime;
    engine.tick(delta);
    for (let [id, room] of rooms) {
        const gameState = room.getState(engine.playerPositions);
        if (!gameState) continue;
        io.to(id).emit(PUBLISH_GAME_STATE, room.getState(engine.playerPositions))
    }
    engine.purgeInputQueue();
}

setInterval(tick, SERVER_TICK_INTERVAL_IN_MS);

httpServer.listen(SERVER_PORT, () => {
    console.log(`Server LIVE on port ${SERVER_PORT}`);
});
