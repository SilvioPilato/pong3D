import '../style.css'
import {
    Color, 
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera, 
    Vector3,
    WebGLRenderer, PCFShadowMap
} from 'three';
import {degToRad} from "three/src/math/MathUtils.js";
import {OfflineEngine} from "./lib/modules/OfflineEngine.js";
import {TextGeometry} from "three/addons/geometries/TextGeometry.js";
import {LoadFont, LoadGLTF} from "./lib/modules/Loaders.js";
import {
    TAG_AMBIENT_LIGHT,
    TAG_BALL,
    TAG_BOTTOM_WALL,
    TAG_CAMERA,
    TAG_COURT,
    TAG_DIRECTIONAL_LIGHT,
    TAG_OUTSIDE,
    TAG_TOP_WALL,
    TEXT_START_SCORE,
    TAG_PLAYER_SCORE,
    TAG_OPPONENT_SCORE} from "./config/index.js";
import {
    TEXT_FONT_SIZE,
    TEXT_HEIGHT,
    TEXT_CURVE_SEGMENTS,
    TEXT_BEVEL_ENABLED,
    TEXT_BEVEL_THICKNESS,
    TEXT_BEVEL_SIZE,
    TEXT_BEVEL_OFFSET, TEXT_BEVEL_SEGMENTS,
    POSITION_CAMERA,
    POSITION_PLAYER_SCORE,
    POSITION_OPPONENT_SCORE, POSITION_COURT,
    CAMERA_FAR,
    CAMERA_FOV,
    CAMERA_NEAR,
    ROTATION_X_ANGLE_CAMERA, ROTATION_X_ANGLE_COURT,
    COLOR_FONT,
    FILE_COURT_MODEL,
    FILE_FONT
} from "./config/client.js";
import { instantiateBall, instantiateCourt, instantiateLights, instantiatePaddles, setupAudio } from './lib/modules/World.js';

/** 
 * Camera and renderer
 */
const camera = new PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, CAMERA_NEAR, CAMERA_FAR)
const renderer = new WebGLRenderer({antialias: true});
const pixelRatio = Math.min(window.devicePixelRatio, 2)
camera.rotateOnAxis(new Vector3(1,0,0), degToRad(ROTATION_X_ANGLE_CAMERA));
camera.position.copy(POSITION_CAMERA);

renderer.setPixelRatio(pixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFShadowMap;
document.querySelector('#app').appendChild(renderer.domElement);

/**
 * engine instantiation
 */
const engine = new OfflineEngine(renderer, camera);
/**
 * Game scene instantiation
 */
const ball = instantiateBall();
const { bottomWall, topWall, outside } = instantiateCourt();
const { playerOne, playerTwo } = instantiatePaddles();
const { directionalLight, ambientLight } = instantiateLights();

// add objects to engine
engine.addObject(ambientLight, TAG_AMBIENT_LIGHT);
engine.addObject(directionalLight, TAG_DIRECTIONAL_LIGHT);
engine.addObject(camera, TAG_CAMERA);
engine.addObject(outside, TAG_OUTSIDE);
engine.addObject(topWall, TAG_TOP_WALL);
engine.addObject(bottomWall, TAG_BOTTOM_WALL);
engine.addOpponent(playerTwo);
engine.addPlayer(playerOne);
engine.addBall(ball, TAG_BALL);

// game loop
function loop() {
    engine.tick();
    requestAnimationFrame(loop);
}

const onFontLoad = (font) => {
    const geometry = new TextGeometry( TEXT_START_SCORE, {
        font: font,
        size: TEXT_FONT_SIZE,
        height: TEXT_HEIGHT,
        curveSegments: TEXT_CURVE_SEGMENTS,
        bevelEnabled: TEXT_BEVEL_ENABLED,
        bevelThickness: TEXT_BEVEL_THICKNESS,
        bevelSize: TEXT_BEVEL_SIZE,
        bevelOffset: TEXT_BEVEL_OFFSET,
        bevelSegments: TEXT_BEVEL_SEGMENTS
    });

    const mat = new MeshStandardMaterial({color: new Color(COLOR_FONT)});
    const playerScore = new Mesh(geometry, mat);
    const opponentScore = new Mesh(geometry, mat);
    playerScore.castShadow = true;
    opponentScore.castShadow = true;
    playerScore.position.copy(POSITION_PLAYER_SCORE);
    opponentScore.position.copy(POSITION_OPPONENT_SCORE);
    engine.addObject(playerScore, TAG_PLAYER_SCORE);
    engine.addObject(opponentScore, TAG_OPPONENT_SCORE);
}

const onCourtLoad = (gltf) => {
    const court = gltf.scene.children[0];
    court.position.copy(POSITION_COURT);
    court.rotateOnAxis(new Vector3(1, 0,0), degToRad(ROTATION_X_ANGLE_COURT));
    court.receiveShadow = true;
    court.castShadow = false;
    engine.addObject(gltf.scene, TAG_COURT);
}

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)

    const pixelRatio = Math.min(window.devicePixelRatio, 2)
    renderer.setPixelRatio(pixelRatio)
}

window.addEventListener('resize', handleResize)

Promise.all([
    LoadFont(FILE_FONT).then(onFontLoad),
    LoadGLTF(FILE_COURT_MODEL).then(onCourtLoad),
]).then(() => {
    setupAudio();
    loop();
})