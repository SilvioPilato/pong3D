# Multiplayer notes

The game simulation will be hosted by the player creating the match.
Cheating prevention is out of scope in this implementation.

## P2P communication

P2P communication is enforced via WEBRTC.
All of the two clients will create an RTCConnection, speaking independently to the respective ICE STUN servers.
Signaling will happen manually on the first iteration:
- the hosting player will create an offer and set it up as it's local description;
- the hosted player will copy the offer and set it up as a remote description;
- the hosted player will create an answer, which will be imported by the hosting player, which will set it up as its remote description;

All communication will happen then on a `game_channel` datachannel in JSON format.

## Update ticks

*needs review*
Every 50ms the hosting player will calculate the state of the game and sent it to the second player.
The game_update payload will contain the ballX and ballY coordinates, player_1_x and player_2_x coordinates, a game_paused boolean and the game_winner which will be set to 0 (no winner still), 1 (player_1) or 2 (player_2) depending on player of the game that won and a timestamp for coordination.

## Ball and ratchets movements

Each player will control it's movement and send it periodically to the other client.
The ball movement will be controlled by the hosting player.

## Configuration

Configuration should be ideally split into three: server, client and common.