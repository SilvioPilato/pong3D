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
    AUDIO_GOAL_SCORED,
    AUDIO_PADDLE_HIT,
    AUDIO_WALL_HIT, TAG_AMBIENT_LIGHT, TAG_BALL, TAG_BOTTOM_WALL, TAG_CAMERA, TAG_DIRECTIONAL_LIGHT,
    TAG_GOAL_SCORED, TAG_OUTSIDE,
    TAG_PADDLE_HIT, TAG_TOP_WALL,
    TAG_WALL_HIT
} from "./config/index.js";
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
const renderer = new WebGLRenderer({antialias: true});
const pixelRatio = Math.min(window.devicePixelRatio, 2)
renderer.setPixelRatio(pixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFShadowMap;

const game = new Game(renderer, camera);

const ballColor = "#FAB139"
const wallColor = "#719972";
const outsideColor = "#4087BB";
const courtColor = "#33546D";
const courtWidth = 46;
const courtHeight = 20;

const sphereGeometry = new SphereGeometry(0.5 );
const sMat = new MeshStandardMaterial({color: ballColor});
const sphere = new Mesh(sphereGeometry, sMat);

const outsideGeometry = new PlaneGeometry(10000, 10000, 10, 10);
const courtGeometry = new PlaneGeometry(courtWidth, courtHeight, 10, 10);

const outMat = new MeshStandardMaterial({color: outsideColor});
const outside = new Mesh(outsideGeometry, outMat);
const courtMat = new MeshStandardMaterial({color: courtColor});
const court = new Mesh(courtGeometry, courtMat);

const cGeometry = new CapsuleGeometry(0.3, 2);
const cMat = new MeshStandardMaterial({color: new Color("white")});
const playerCapsule = new Mesh(cGeometry, cMat);
const aiCapsule = new Mesh(cGeometry, cMat);

const ambientLight = new AmbientLight(new Color("white"), 1.5);
const directionalLight = new DirectionalLight(new Color("white"), 2);

const d = 32;
directionalLight.shadow.camera.left = - d;
directionalLight.shadow.camera.right = d;
directionalLight.shadow.camera.top = d;
directionalLight.shadow.camera.bottom = - d;
directionalLight.shadow.mapSize.set(1024, 1024);

const horWall = new BoxGeometry(courtWidth, 0.5,0.75);
const wMat = new MeshStandardMaterial({color: wallColor});

const topWall = new Mesh(horWall, wMat);
const bottomWall = new Mesh(horWall, wMat);

camera.rotateOnAxis(new Vector3(1, 0,0), degToRad(15));

outside.position.z = -0.7;
playerCapsule.position.x = -18;
topWall.position.y = 10;
bottomWall.position.y = -10;

camera.position.set(0, -5, 25)
aiCapsule.position.set(18, 0, 0);
directionalLight.position.set(0, 5, 10);

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
    const geometry = new TextGeometry( '0', {
        font: font,
        size: 6,
        height: 0.5,
        curveSegments: 2,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 2
    });
    const mat = new MeshStandardMaterial({color: new Color("DeepPink")});
    const playerScore = new Mesh(geometry, mat);
    const opponentScore = new Mesh(geometry, mat);
    playerScore.castShadow = true;
    opponentScore.castShadow = true;
    playerScore.position.x = -18;
    opponentScore.position.x = 12;
    playerScore.position.y = 12;
    opponentScore.position.y = 12;
    game.addObject(playerScore, game.playerScoreTag);
    game.addObject(opponentScore, game.opponentScoreTag);
}

const onCourtLoad = (gltf) => {
    const court = gltf.scene.children[0];
    court.position.z = -0.5;
    court.rotateOnAxis(new Vector3(1, 0,0), degToRad(90));
    court.receiveShadow = true;
    court.castShadow = false;
    game.addObject(gltf.scene, "court");
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
        "muted": true,
        "volume": 0.7,
    }
    new AudioHandler();
    const ballDrop = new Audio(AUDIO_WALL_HIT);
    const paddleHit = new Audio(AUDIO_PADDLE_HIT);
    const goal = new Audio(AUDIO_GOAL_SCORED);
    AudioHandler.addTrack(ballDrop, TAG_WALL_HIT);
    AudioHandler.addTrack(paddleHit, TAG_PADDLE_HIT);
    AudioHandler.addTrack(goal, TAG_GOAL_SCORED);
    AudioHandler.setMuted(true);
    let gui = new GUI();
    let audioFolder = gui.addFolder('Audio');
    audioFolder.add(audio, "muted").onChange(value => {
        AudioHandler.setMuted(value);
    });
    audioFolder.add(audio, "volume", 0, 1, 0.05).onChange(value => {
        AudioHandler.setVolume(value);
    });
}



Promise.all([
    LoadFont('helvetiker_regular.typeface.json').then(onFontLoad),
    LoadGLTF('court.glb').then(onCourtLoad),
]).then(() => {
    setupAudio();
    loop();
})