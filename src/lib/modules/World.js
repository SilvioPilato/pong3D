import {
    AmbientLight, BoxGeometry,
    CapsuleGeometry,
    Color, DirectionalLight,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    SphereGeometry,
    Vector3
    } from 'three';
import {GUI} from "dat.gui";
import {AudioHandler} from "../handlers/AudioHandler.js";
import {
    BALL_RADIUS,
    PLAYER_LEN,
    PLAYER_RADIUS,
    COURT_WIDTH,
    OUTSIDE_HEIGHT,
    OUTSIDE_WIDTH,
    TAG_GOAL_SCORED,
    TAG_PADDLE_HIT,
    TAG_WALL_HIT,
    WALL_DEPTH,
    WALL_HEIGHT,
    AUDIO_MUTED, AUDIO_VOLUME
} from "../../config/index.js";
import {
    COLOR_AMBIENT_LIGHT,
    COLOR_BALL,
    COLOR_CAPSULE,
    COLOR_DIRECTIONAL_LIGHT,
    COLOR_OUTSIDE,
    COLOR_WALL, 
    COLOR_FONT,
    MENU_AUDIO_FOLDER,
    MENU_AUDIO_MUTED,
    MENU_AUDIO_VOLUME,
    FILE_AUDIO_GOAL_SCORED,
    FILE_AUDIO_PADDLE_HIT,
    FILE_AUDIO_WALL_HIT,
    AMBIENT_LIGHT_INTENSITY, DIRECTIONAL_LIGHT_INTENSITY,
    DIRECTIONAL_LIGHT_MAPSIZE,
    DIRECTIONAL_LIGHT_SQUARE_SIDE,
    POSITION_BOTTOM_WALL, POSITION_OUTSIDE, POSITION_PLAYER_VEC, POSITION_TOP_WALL, 
    POSITION_AI_VEC,
    POSITION_DIRECTIONAL_LIGHT,
    POSITION_OPPONENT_SCORE,
    POSITION_PLAYER_SCORE,
    TEXT_BEVEL_ENABLED,
    TEXT_BEVEL_OFFSET,
    TEXT_BEVEL_SEGMENTS,
    TEXT_BEVEL_SIZE,
    TEXT_BEVEL_THICKNESS,
    TEXT_CURVE_SEGMENTS,
    TEXT_FONT_SIZE,
    TEXT_HEIGHT,
    POSITION_COURT,
    ROTATION_X_ANGLE_COURT,
    FILE_COURT_MODEL,
    FILE_FONT,
    TEXT_START_SCORE,
    CAMERA_FAR,
    CAMERA_FOV,
    CAMERA_NEAR,
    POSITION_CAMERA,
    ROTATION_X_ANGLE_CAMERA,
} from "../../config/client.js";
import { loadFont, loadGLTF } from './Loaders.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { degToRad } from 'three/src/math/MathUtils.js';

export function instantiateBall() {
    const sphereGeometry = new SphereGeometry(BALL_RADIUS );
    const sMat = new MeshStandardMaterial({color: COLOR_BALL});
    const sphere = new Mesh(sphereGeometry, sMat);
    sphere.castShadow = true;
    return sphere;
}

export function instantiateCourt() {
    const outsideGeometry = new PlaneGeometry(OUTSIDE_WIDTH, OUTSIDE_HEIGHT);
    const outMat = new MeshStandardMaterial({color: COLOR_OUTSIDE});
    const outside = new Mesh(outsideGeometry, outMat);
    const horWall = new BoxGeometry(COURT_WIDTH, WALL_HEIGHT,WALL_DEPTH);
    const wMat = new MeshStandardMaterial({color: COLOR_WALL});
    const topWall = new Mesh(horWall, wMat);
    const bottomWall = new Mesh(horWall, wMat);

    outside.position.copy(POSITION_OUTSIDE);
    topWall.position.copy(POSITION_TOP_WALL);
    bottomWall.position.copy(POSITION_BOTTOM_WALL);
    outside.receiveShadow = true;
    outside.castShadow = false;
    topWall.castShadow = true;
    bottomWall.castShadow = true;

    return {
        bottomWall,
        topWall,
        outside
    }
}

export function instantiateTerrain(gltf) {
    const court = gltf.scene.children[0];
    court.position.copy(POSITION_COURT);
    court.rotateOnAxis(new Vector3(1, 0, 0), degToRad(ROTATION_X_ANGLE_COURT));
    court.receiveShadow = true;
    court.castShadow = false;
    return gltf.scene;
}

export function instantiatePaddles() {
    const cGeometry = new CapsuleGeometry(PLAYER_RADIUS, PLAYER_LEN);
    const cMat = new MeshStandardMaterial({color: new Color(COLOR_CAPSULE)});
    const playerOne = new Mesh(cGeometry, cMat);
    const playerTwo = new Mesh(cGeometry, cMat);
    playerOne.position.copy(POSITION_PLAYER_VEC);
    playerTwo.position.copy(POSITION_AI_VEC);
    playerTwo.castShadow = true;
    playerOne.castShadow = true;

    return {
        playerOne,
        playerTwo
    }
}

export function instantiateLights() {
    const ambientLight = new AmbientLight(new Color(COLOR_AMBIENT_LIGHT), AMBIENT_LIGHT_INTENSITY);
        const directionalLight = new DirectionalLight(new Color(COLOR_DIRECTIONAL_LIGHT), DIRECTIONAL_LIGHT_INTENSITY);
        const d = DIRECTIONAL_LIGHT_SQUARE_SIDE;
        directionalLight.shadow.camera.left = - d;
        directionalLight.shadow.camera.right = d;
        directionalLight.shadow.camera.top = d;
        directionalLight.shadow.camera.bottom = - d;
        directionalLight.shadow.mapSize.set(DIRECTIONAL_LIGHT_MAPSIZE, DIRECTIONAL_LIGHT_MAPSIZE);
        directionalLight.position.copy(POSITION_DIRECTIONAL_LIGHT);
        directionalLight.castShadow = true;
        
        return {
            directionalLight,
            ambientLight
        }
}

export function setupAudio() {
    new AudioHandler();
    const ballDrop = new Audio(FILE_AUDIO_WALL_HIT);
    const paddleHit = new Audio(FILE_AUDIO_PADDLE_HIT);
    const goal = new Audio(FILE_AUDIO_GOAL_SCORED);
    AudioHandler.addTrack(ballDrop, TAG_WALL_HIT);
    AudioHandler.addTrack(paddleHit, TAG_PADDLE_HIT);
    AudioHandler.addTrack(goal, TAG_GOAL_SCORED);
    AudioHandler.setMuted(AUDIO_MUTED);
}

export function instantiateScores(font) {
    const geometry = new TextGeometry(TEXT_START_SCORE, {
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

    const mat = new MeshStandardMaterial({ color: new Color(COLOR_FONT) });
    const playerScore = new Mesh(geometry, mat);
    const opponentScore = new Mesh(geometry, mat);
    playerScore.castShadow = true;
    opponentScore.castShadow = true;
    playerScore.position.copy(POSITION_PLAYER_SCORE);
    opponentScore.position.copy(POSITION_OPPONENT_SCORE);
    return {
        playerScore,
        opponentScore
    };   
}

export function instantiateExternalResources() {
    return Promise.all([
        loadFont(FILE_FONT).then(instantiateScores),
        loadGLTF(FILE_COURT_MODEL).then(instantiateTerrain),
    ]);
}

export function instantiateCamera() {
    const camera = new PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, CAMERA_NEAR, CAMERA_FAR);
    camera.rotateOnAxis(new Vector3(1, 0, 0), degToRad(ROTATION_X_ANGLE_CAMERA));
    camera.position.copy(POSITION_CAMERA);
    return camera;
}

