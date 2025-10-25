# Multiplayer notes

The server should host a simulation of the world, coherent with the single player one.

## Client-Server communication

All server communication is perfomed using websockets and socket.io rooms.

An incoming client can request a room using the 'join_room' event.
The event can contain an optional 'roomId' string.
If the roomId exists, the player joins the existing room.
If the roomId does not exists, it gets created.
After that a 'join_room_success' event will be broadcasted with the whole room with all the players 'playerId' and their respective roles.
A player can be of role player_1, player_2 or spectator.
If the room join fails he will be sent a 'join_room_failed' with the reason of the failure.

## Server ticks

*needs review*
Every 100ms the server will cycle every active room to send updates to all clients, broadcasting a 'game_update' event in each room.
The game_update event will contain the ballX and ballY coordinates, player_1_x and player_2_x coordinates, a game_paused boolean and the game_winner which will be set to 0 (no winner still), 1 (player_1) or 2 (player_2) depending on player of the game that won and a timestamp for coordination.

## Ball movement

All of the colliders will be simulated numerically on the server. 
A collider hit on one of the axis will trigger an inversion of the velocity in the other axis.
The only exception is a GOAL hit, that will change the score and reset the ball position in the center.

## Ratchets movement

Player inputs will be sent at a fixed interval (100ms). The server will calculate the movement and send the result back to the consumers. Consumers will constantly interpolate between the last two received inputs.

## Configuration

Configuration should be ideally split into three: server, client and common.