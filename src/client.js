import '../style.css'
import {
    WebGLRenderer, PCFShadowMap
} from 'three';
import {OfflineEngine} from "./lib/modules/OfflineEngine.js";
import {
    AUDIO_MUTED,
    AUDIO_VOLUME,
    ROLE_PLAYER_1,
    TAG_AMBIENT_LIGHT,
    TAG_BALL,
    TAG_BOTTOM_WALL,
    TAG_CAMERA,
    TAG_COURT,
    TAG_DIRECTIONAL_LIGHT,
    TAG_OPPONENT,
    TAG_OPPONENT_SCORE,
    TAG_OUTSIDE,
    TAG_PLAYER,
    TAG_PLAYER_SCORE,
    TAG_TOP_WALL,
} from "./config/index.js";
import { instantiateBall, instantiateLights, instantiatePaddles, setupAudio, instantiateExternalResources, instantiateCourt, instantiateCamera } from './lib/modules/World.js';
import { handleResize } from './lib/modules/Utils.js';
import { OnlineEngine } from './lib/modules/OnlineEngine.js';
import { ServerConnection } from './lib/modules/ServerConnection.js';
import { GUI } from "dat.gui";
import { MENU_AUDIO_FOLDER, MENU_AUDIO_MUTED, MENU_AUDIO_VOLUME } from './config/client.js';
/** 
 * Camera and renderer
 */

function addResourcesToEngine(engine, {
        camera,
        ball,
        bottomWall,
        topWall,
        outside,
        playerOne,
        playerTwo,
        directionalLight,
        ambientLight,
        playerScore,
        opponentScore,
        court,
    },
    playerRole = ROLE_PLAYER_1
) {
    engine.addObject(ambientLight, TAG_AMBIENT_LIGHT);
    engine.addObject(directionalLight, TAG_DIRECTIONAL_LIGHT);
    engine.addObject(camera, TAG_CAMERA);
    engine.addObject(outside, TAG_OUTSIDE);
    engine.addObject(topWall, TAG_TOP_WALL);
    engine.addObject(bottomWall, TAG_BOTTOM_WALL);
    engine.addObject(playerScore, TAG_PLAYER_SCORE);
    engine.addObject(opponentScore, TAG_OPPONENT_SCORE);
    engine.addObject(ball, TAG_BALL);
    engine.addObject(court, TAG_COURT);
    const player = playerRole == ROLE_PLAYER_1 ? playerOne : playerTwo;
    const opponent = playerRole == ROLE_PLAYER_1 ? playerTwo : playerOne;
    engine.addObject(player, TAG_PLAYER);
    engine.addObject(opponent, TAG_OPPONENT);

}

async function instantiateGameResources() {
    const renderer = new WebGLRenderer({ antialias: true });
    const pixelRatio = Math.min(window.devicePixelRatio, 2)

    renderer.setPixelRatio(pixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;

    const ball = instantiateBall();
    const camera = instantiateCamera();
    const { bottomWall, topWall, outside } = instantiateCourt();
    const { playerOne, playerTwo } = instantiatePaddles();
    const { directionalLight, ambientLight } = instantiateLights();
    const externals = await instantiateExternalResources();
    const { playerScore, opponentScore } = externals[0];
    const court = externals[1];

    setupAudio();

    return {
        renderer,
        ball,
        camera,
        bottomWall,
        topWall,
        outside,
        playerOne,
        playerTwo,
        directionalLight,
        ambientLight,
        playerScore,
        opponentScore,
        court
    }
}

function instantiateSinglePlayerGame(renderer, resources) {
    const engine = new OfflineEngine(renderer);
    addResourcesToEngine(engine, resources);
    loopEngine(engine);
}

function instantiateMultiplayerPlayerGame(renderer, resources, serverConnection) {
    const engine = new OnlineEngine(renderer, serverConnection);
    addResourcesToEngine(engine, resources, serverConnection.role);
    loopEngine(engine);
}

function setupGUI(resources) {
    const { renderer, camera } = resources;
    const debugGUI = new GUI();
    const audio = {
        [MENU_AUDIO_MUTED]: AUDIO_MUTED,
        [MENU_AUDIO_VOLUME]: AUDIO_VOLUME,
    }

    let audioFolder = debugGUI.addFolder(MENU_AUDIO_FOLDER)
    audioFolder.add(audio, MENU_AUDIO_MUTED).onChange(value => {
        AudioHandler.setMuted(value);
    });
    audioFolder.add(audio, MENU_AUDIO_VOLUME, 0, 1, 0.05).onChange(value => {
        AudioHandler.setVolume(value);
    });

    window.addEventListener('resize', handleResize(camera, renderer))
    document.querySelector('#app').appendChild(renderer.domElement);
    return resources;
}


function loopEngine(engine, running = true) {
    function loop() {
        if (!running) return;
        engine.tick();
        requestAnimationFrame(loop);
    }
    return loop();
}

function setupSinglePlayer(resources) {
    const singlePlayerButton = document.getElementById("start_single_button");
    singlePlayerButton.onclick = ((e) => {
        e.preventDefault();
        instantiateSinglePlayerGame(renderer, resources);
    })
    singlePlayerButton.disabled = false;
    return resources;
}

async function setupMultiplayer(resources) {
    const { renderer } = resources;
    const serverConnection = new ServerConnection();
    await serverConnection.connect();
    const joinButton = document.getElementById("join_button");
    const roomForm = document.getElementById("room_form");
    serverConnection.subscribeToRooms(console.log);
    serverConnection.requestRooms();
    serverConnection.subscribeToGameStart((arg) => {
        console.log("game started", arg);
        instantiateMultiplayerPlayerGame(renderer, resources, serverConnection)
    });

    joinButton.onclick = ((e) => {
        e.preventDefault();
        serverConnection.joinGame(roomForm.value).then(() => {});
    })

    serverConnection.requestRooms(0);
    return resources;
}

instantiateGameResources()
    .then(setupGUI)
    .then(setupSinglePlayer)
    .then(setupMultiplayer);

