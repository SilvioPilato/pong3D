import '../style.css'
import {
    AmbientLight, BoxGeometry,
    CapsuleGeometry,
    Color, DirectionalLight,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera, PlaneGeometry,
    SphereGeometry, Vector3,
    WebGLRenderer, MeshLambertMaterial, PCFShadowMap
} from 'three';
import {degToRad} from "three/src/math/MathUtils.js";
import {Game} from "./Game.js";
import {FontLoader} from "three/addons/loaders/FontLoader.js";
import {TextGeometry} from "three/addons/geometries/TextGeometry.js";
const loader = new FontLoader();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFShadowMap;

const game = new Game(renderer, camera);
const ballColor = "#FAB139"
const wallColor = "#719972";
const outsideColor = "#4087BB";
const courtColor = "#33546D";
const courtWidth = 45;
const courtHeight = 20;

const sphereGeometry = new SphereGeometry(0.5 );
const sMat = new MeshStandardMaterial({color: ballColor});
const sphere = new Mesh(sphereGeometry, sMat);

const outsideGeometry = new PlaneGeometry(10000, 10000, 10, 10);
const courtGeometry = new PlaneGeometry(courtWidth, courtHeight, 10, 10);
const outMat = new MeshStandardMaterial({color: outsideColor});
const courtMat = new MeshStandardMaterial({color: courtColor});
const outside = new Mesh(outsideGeometry, outMat);
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

const horWall = new BoxGeometry(45, 1,0.75);
const wMat = new MeshStandardMaterial({color: wallColor});

const topWall = new Mesh(horWall, wMat);
const bottomWall = new Mesh(horWall, wMat);

camera.rotateOnAxis(new Vector3(1, 0,0), degToRad(15));

outside.position.z = -0.6;
court.position.z = -0.5;
playerCapsule.position.x = -18;
topWall.position.y = 10;
bottomWall.position.y = -10;

camera.position.set(0, -5, 25)
aiCapsule.position.set(18, 0, 0);
directionalLight.position.set(0, 5, 10);

game.addObject(ambientLight, "ambientLight");
game.addObject(directionalLight, "directionalLight");
game.addObject(camera, "camera");
game.addObject(outside, "outside");
game.addObject(court, "court");
game.addObject(topWall, game.topWallTag);
game.addObject(bottomWall, game.bottomWallTag);
game.addOpponent(aiCapsule);
game.addPlayer(playerCapsule);
game.addBall(sphere, game.ballTag);
game.addCollider(topWall, game.topWallTag);
game.addCollider(bottomWall, game.bottomWallTag);

directionalLight.castShadow = true;
sphere.castShadow = true;
outside.receiveShadow = true;
outside.castShadow = false;
court.receiveShadow = true;
court.castShadow = false;
topWall.castShadow = true;
bottomWall.castShadow = true;
aiCapsule.castShadow = true;
playerCapsule.castShadow = true;

document.querySelector('#app').appendChild(renderer.domElement);
function loop() {
    game.tick();
    requestAnimationFrame(loop);
}
loader.load( 'helvetiker_regular.typeface.json', function ( font ) {
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
    loop();
});