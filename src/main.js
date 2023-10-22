import '../style.css'
import {
    AmbientLight, BoxGeometry,
    CapsuleGeometry,
    Color, DirectionalLight,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera, PlaneGeometry,
    SphereGeometry, Vector3,
    WebGLRenderer,PCFSoftShadowMap
} from 'three';
import {color} from "three/nodes";
import {degToRad} from "three/src/math/MathUtils.js";
import {Game} from "./Game.js";
import {FontLoader} from "three/addons/loaders/FontLoader.js";
import {TextGeometry} from "three/addons/geometries/TextGeometry.js";
const loader = new FontLoader();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
const game = new Game(renderer, camera);

const sphereGeometry = new SphereGeometry(0.5 );
const sMat = new MeshStandardMaterial({color: new Color("darkviolet")});
const sphere = new Mesh(sphereGeometry, sMat);

const planeGeometry = new PlaneGeometry(10000, 10000);
const pMat = new MeshStandardMaterial({color: new Color("cornflowerblue")});
const plane = new Mesh(planeGeometry, pMat);

const cGeometry = new CapsuleGeometry(0.3, 2);
const cMat = new MeshStandardMaterial({color: new Color("white")});
const playerCapsule = new Mesh(cGeometry, cMat);
const aiCapsule = new Mesh(cGeometry, cMat);

const ambientLight = new AmbientLight(new Color("white"), 1.5);
const directionalLight = new DirectionalLight(color, 3);

const horWall = new BoxGeometry(50, 1,0.75);
const wMat = new MeshStandardMaterial({color: new Color("DarkSlateBlue")});

const topWall = new Mesh(horWall, wMat);
const bottomWall = new Mesh(horWall, wMat);




camera.rotateOnAxis(new Vector3(1, 0,0), degToRad(15));
camera.position.z = 25;
camera.position.y = -5;
plane.position.z = -1;
playerCapsule.position.x = -18;
aiCapsule.position.x = 18;
aiCapsule.position.z = 0;
topWall.position.y = 10;
bottomWall.position.y = -10;

directionalLight.position.z = 10;
directionalLight.position.y = -0.5;
directionalLight.position.x = 0;

directionalLight.rotateOnWorldAxis(new Vector3(1,0,1), degToRad(45) );

game.addObject(ambientLight, "ambientLight");
game.addObject(directionalLight, "directionalLight");
game.addObject(camera, "camera");
game.addObject(plane, "plane");
game.addObject(topWall, game.topWallTag);
game.addObject(bottomWall, game.bottomWallTag);
game.addOpponent(aiCapsule);
game.addPlayer(playerCapsule);
game.addBall(sphere, game.ballTag);
game.addCollider(topWall, game.topWallTag);
game.addCollider(bottomWall, game.bottomWallTag);

directionalLight.castShadow = true;
topWall.castShadow = true;
bottomWall.castShadow = true;
sphere.castShadow = true;
aiCapsule.castShadow = true;
playerCapsule.castShadow = true;
plane.receiveShadow = true;

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
    playerScore.position.x = -18;
    opponentScore.position.x = 12;
    playerScore.position.y = 12;
    opponentScore.position.y = 12;
    game.addObject(playerScore, game.playerScoreTag);
    game.addObject(opponentScore, game.opponentScoreTag);
    loop();
});