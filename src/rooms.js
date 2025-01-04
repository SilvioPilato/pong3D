import { io } from "socket.io-client";
import { JOIN_ROOM, PUBLISH_GAME_STATE } from "./config";

const DEFAULT_PORT = 8080;
const DEFAULT_ADDRESS = "ws://localhost";
const socket = io(`${DEFAULT_ADDRESS}:${DEFAULT_PORT}`);
const button = document.getElementById("join_button");
const roomForm = document.getElementById("room_form");

button.onclick = ((e) => {
    e.preventDefault();
    console.log(roomForm.value);
    socket.emit(JOIN_ROOM, {roomId: roomForm.value});
    socket.on(PUBLISH_GAME_STATE, (args) => {
        console.log(args);
    }); 
})


