import '../style.css'
import {
    AmbientLight, BoxGeometry,
    CapsuleGeometry,
    Color, DirectionalLight,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera, PlaneGeometry,
    SphereGeometry, Vector3,
    WebGLRenderer, PCFShadowMap
} from 'three';
import {degToRad} from "three/src/math/MathUtils.js";
import {Game} from "./Game.js";
import {TextGeometry} from "three/addons/geometries/TextGeometry.js";
import {LoadFont, LoadGLTF} from "./Loaders.js";
import {GUI} from "dat.gui";
import {AudioHandler} from "./AudioHandler.js";
import {
    AMBIENT_LIGHT_INTENSITY,
    FILE_AUDIO_GOAL_SCORED,
    FILE_AUDIO_PADDLE_HIT,
    FILE_AUDIO_WALL_HIT,
    BALL_RADIUS,
    POSITION_BOTTOM_WALL,
    CAMERA_FAR,
    CAMERA_FOV,
    CAMERA_NEAR,
    ROTATION_X_ANGLE_CAMERA,
    CAPSULE_LEN,
    CAPSULE_RADIUS,
    COLOR_AMBIENT_LIGHT,
    COLOR_BALL,
    COLOR_CAPSULE,
    COLOR_DIRECTIONAL_LIGHT,
    COLOR_FONT,
    COLOR_OUTSIDE,
    COLOR_WALL,
    COURT_WIDTH,
    DIRECTIONAL_LIGHT_INTENSITY,
    DIRECTIONAL_LIGHT_MAPSIZE,
    DIRECTIONAL_LIGHT_SQUARE_SIDE,
    FILE_COURT_MODEL,
    FILE_FONT,
    MENU_AUDIO_FOLDER,
    MENU_AUDIO_MUTED,
    MENU_AUDIO_VOLUME,
    OUTSIDE_HEIGHT,
    POSITION_OUTSIDE,
    OUTSIDE_WIDTH,
    POSITION_PLAYER,
    TAG_AMBIENT_LIGHT,
    TAG_BALL,
    TAG_BOTTOM_WALL,
    TAG_CAMERA,
    TAG_COURT,
    TAG_DIRECTIONAL_LIGHT,
    TAG_GOAL_SCORED,
    TAG_OUTSIDE,
    TAG_PADDLE_HIT,
    TAG_TOP_WALL,
    TAG_WALL_HIT,
    TEXT_START_SCORE,
    POSITION_TOP_WALL,
    WALL_DEPTH,
    WALL_HEIGHT,
    POSITION_CAMERA,
    POSITION_AI,
    POSITION_DIRECTIONAL_LIGHT,
    POSITION_PLAYER_SCORE,
    POSITION_OPPONENT_SCORE,
    TAG_PLAYER_SCORE,
    TAG_OPPONENT_SCORE,
    POSITION_COURT,
    ROTATION_X_ANGLE_COURT,
    TEXT_FONT_SIZE,
    TEXT_HEIGHT,
    TEXT_CURVE_SEGMENTS,
    TEXT_BEVEL_ENABLED,
    TEXT_BEVEL_THICKNESS,
    TEXT_BEVEL_SIZE,
    TEXT_BEVEL_OFFSET, TEXT_BEVEL_SEGMENTS, AUDIO_MUTED, AUDIO_VOLUME
} from "./config/index.js";
const camera = new PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, CAMERA_NEAR, CAMERA_FAR)
const renderer = new WebGLRenderer({antialias: true});
const pixelRatio = Math.min(window.devicePixelRatio, 2)
renderer.setPixelRatio(pixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFShadowMap;

const game = new Game(renderer, camera);

const sphereGeometry = new SphereGeometry(BALL_RADIUS );
const sMat = new MeshStandardMaterial({color: COLOR_BALL});
const sphere = new Mesh(sphereGeometry, sMat);

const outsideGeometry = new PlaneGeometry(OUTSIDE_WIDTH, OUTSIDE_HEIGHT);
const outMat = new MeshStandardMaterial({color: COLOR_OUTSIDE});
const outside = new Mesh(outsideGeometry, outMat);

const cGeometry = new CapsuleGeometry(CAPSULE_RADIUS, CAPSULE_LEN);
const cMat = new MeshStandardMaterial({color: new Color(COLOR_CAPSULE)});
const playerCapsule = new Mesh(cGeometry, cMat);
const aiCapsule = new Mesh(cGeometry, cMat);

const ambientLight = new AmbientLight(new Color(COLOR_AMBIENT_LIGHT), AMBIENT_LIGHT_INTENSITY);
const directionalLight = new DirectionalLight(new Color(COLOR_DIRECTIONAL_LIGHT), DIRECTIONAL_LIGHT_INTENSITY);

const d = DIRECTIONAL_LIGHT_SQUARE_SIDE;
directionalLight.shadow.camera.left = - d;
directionalLight.shadow.camera.right = d;
directionalLight.shadow.camera.top = d;
directionalLight.shadow.camera.bottom = - d;
directionalLight.shadow.mapSize.set(DIRECTIONAL_LIGHT_MAPSIZE, DIRECTIONAL_LIGHT_MAPSIZE);

const horWall = new BoxGeometry(COURT_WIDTH, WALL_HEIGHT,WALL_DEPTH);
const wMat = new MeshStandardMaterial({color: COLOR_WALL});

const topWall = new Mesh(horWall, wMat);
const bottomWall = new Mesh(horWall, wMat);

camera.rotateOnAxis(new Vector3(1, 0,0), degToRad(ROTATION_X_ANGLE_CAMERA));

outside.position.copy(POSITION_OUTSIDE);
playerCapsule.position.copy(POSITION_PLAYER);
topWall.position.copy(POSITION_TOP_WALL);
bottomWall.position.copy(POSITION_BOTTOM_WALL);

camera.position.copy(POSITION_CAMERA);
aiCapsule.position.copy(POSITION_AI);
directionalLight.position.copy(POSITION_DIRECTIONAL_LIGHT);

game.addObject(ambientLight, TAG_AMBIENT_LIGHT);
game.addObject(directionalLight, TAG_DIRECTIONAL_LIGHT);
game.addObject(camera, TAG_CAMERA);
game.addObject(outside, TAG_OUTSIDE);

game.addObject(topWall, TAG_TOP_WALL);
game.addObject(bottomWall, TAG_BOTTOM_WALL);
game.addOpponent(aiCapsule);
game.addPlayer(playerCapsule);
game.addBall(sphere, TAG_BALL);
game.addCollider(topWall, TAG_TOP_WALL);
game.addCollider(bottomWall, TAG_BOTTOM_WALL);

directionalLight.castShadow = true;
sphere.castShadow = true;
outside.receiveShadow = true;
outside.castShadow = false;
topWall.castShadow = true;
bottomWall.castShadow = true;
aiCapsule.castShadow = true;
playerCapsule.castShadow = true;

document.querySelector('#app').appendChild(renderer.domElement);
function loop() {
    game.tick();
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
    game.addObject(playerScore, TAG_PLAYER_SCORE);
    game.addObject(opponentScore, TAG_OPPONENT_SCORE);
}

const onCourtLoad = (gltf) => {
    const court = gltf.scene.children[0];
    court.position.copy(POSITION_COURT);
    court.rotateOnAxis(new Vector3(1, 0,0), degToRad(ROTATION_X_ANGLE_COURT));
    court.receiveShadow = true;
    court.castShadow = false;
    game.addObject(gltf.scene, TAG_COURT);
}

window.addEventListener('resize', handleResize)

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)

    const pixelRatio = Math.min(window.devicePixelRatio, 2)
    renderer.setPixelRatio(pixelRatio)
}


function setupAudio() {
    const audio = {
        [MENU_AUDIO_MUTED]: AUDIO_MUTED,
        [MENU_AUDIO_VOLUME]: AUDIO_VOLUME,
    }
    new AudioHandler();
    const ballDrop = new Audio(FILE_AUDIO_WALL_HIT);
    const paddleHit = new Audio(FILE_AUDIO_PADDLE_HIT);
    const goal = new Audio(FILE_AUDIO_GOAL_SCORED);
    AudioHandler.addTrack(ballDrop, TAG_WALL_HIT);
    AudioHandler.addTrack(paddleHit, TAG_PADDLE_HIT);
    AudioHandler.addTrack(goal, TAG_GOAL_SCORED);
    AudioHandler.setMuted(AUDIO_MUTED);
    let gui = new GUI();
    let audioFolder = gui.addFolder(MENU_AUDIO_FOLDER)
    audioFolder.add(audio, MENU_AUDIO_MUTED).onChange(value => {
        AudioHandler.setMuted(value);
    });
    audioFolder.add(audio, MENU_AUDIO_VOLUME, 0, 1, 0.05).onChange(value => {
        AudioHandler.setVolume(value);
    });
}

Promise.all([
    LoadFont(FILE_FONT).then(onFontLoad),
    LoadGLTF(FILE_COURT_MODEL).then(onCourtLoad),
]).then(() => {
    setupAudio();
    loop();
})