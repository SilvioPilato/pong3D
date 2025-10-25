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
import {AudioHandler} from "./AudioHandler.js";
import {GUIManager} from "./GUIManager.js";
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
    TEXT_BEVEL_OFFSET, 
    TEXT_BEVEL_SEGMENTS, 
    AUDIO_MUTED, 
} from "./config/index.js";

export class GameInitializer {
    constructor() {
        this.camera = null;
        this.renderer = null;
        this.game = null;
        this.guiManager = new GUIManager();
    }

    /**
     * Initialize the renderer with proper settings
     */
    initRenderer() {
        this.renderer = new WebGLRenderer({antialias: true});
        const pixelRatio = Math.min(window.devicePixelRatio, 2);
        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFShadowMap;
        
        // Append to DOM
        document.querySelector('#app').appendChild(this.renderer.domElement);
        
        return this.renderer;
    }

    /**
     * Initialize the camera with proper settings
     */
    initCamera() {
        this.camera = new PerspectiveCamera(
            CAMERA_FOV, 
            window.innerWidth / window.innerHeight, 
            CAMERA_NEAR, 
            CAMERA_FAR
        );
        this.camera.rotateOnAxis(new Vector3(1, 0, 0), degToRad(ROTATION_X_ANGLE_CAMERA));
        this.camera.position.copy(POSITION_CAMERA);
        
        return this.camera;
    }

    /**
     * Initialize the game instance
     */
    initGame() {
        if (!this.renderer || !this.camera) {
            throw new Error('Renderer and camera must be initialized before game');
        }
        
        this.game = new Game(this.renderer, this.camera);
        return this.game;
    }

    /**
     * Create and configure the ball
     */
    createBall() {
        const sphereGeometry = new SphereGeometry(BALL_RADIUS);
        const sMat = new MeshStandardMaterial({color: COLOR_BALL});
        const sphere = new Mesh(sphereGeometry, sMat);
        sphere.castShadow = true;
        
        return sphere;
    }

    /**
     * Create and configure the outside plane
     */
    createOutside() {
        const outsideGeometry = new PlaneGeometry(OUTSIDE_WIDTH, OUTSIDE_HEIGHT);
        const outMat = new MeshStandardMaterial({color: COLOR_OUTSIDE});
        const outside = new Mesh(outsideGeometry, outMat);
        outside.position.copy(POSITION_OUTSIDE);
        outside.receiveShadow = true;
        outside.castShadow = false;
        
        return outside;
    }

    /**
     * Create and configure player paddles
     */
    createPaddles() {
        const cGeometry = new CapsuleGeometry(CAPSULE_RADIUS, CAPSULE_LEN);
        const cMat = new MeshStandardMaterial({color: new Color(COLOR_CAPSULE)});
        
        const playerCapsule = new Mesh(cGeometry, cMat);
        const aiCapsule = new Mesh(cGeometry, cMat);
        
        playerCapsule.position.copy(POSITION_PLAYER);
        aiCapsule.position.copy(POSITION_AI);
        
        playerCapsule.castShadow = true;
        aiCapsule.castShadow = true;
        
        return { playerCapsule, aiCapsule };
    }

    /**
     * Create and configure lighting
     */
    createLighting() {
        const ambientLight = new AmbientLight(new Color(COLOR_AMBIENT_LIGHT), AMBIENT_LIGHT_INTENSITY);
        const directionalLight = new DirectionalLight(new Color(COLOR_DIRECTIONAL_LIGHT), DIRECTIONAL_LIGHT_INTENSITY);
        
        // Configure shadow camera
        const d = DIRECTIONAL_LIGHT_SQUARE_SIDE;
        directionalLight.shadow.camera.left = -d;
        directionalLight.shadow.camera.right = d;
        directionalLight.shadow.camera.top = d;
        directionalLight.shadow.camera.bottom = -d;
        directionalLight.shadow.mapSize.set(DIRECTIONAL_LIGHT_MAPSIZE, DIRECTIONAL_LIGHT_MAPSIZE);
        directionalLight.position.copy(POSITION_DIRECTIONAL_LIGHT);
        directionalLight.castShadow = true;
        
        return { ambientLight, directionalLight };
    }

    /**
     * Create and configure walls
     */
    createWalls() {
        const horWall = new BoxGeometry(COURT_WIDTH, WALL_HEIGHT, WALL_DEPTH);
        const wMat = new MeshStandardMaterial({color: COLOR_WALL});
        
        const topWall = new Mesh(horWall, wMat);
        const bottomWall = new Mesh(horWall, wMat);
        
        topWall.position.copy(POSITION_TOP_WALL);
        bottomWall.position.copy(POSITION_BOTTOM_WALL);
        
        topWall.castShadow = true;
        bottomWall.castShadow = true;
        
        return { topWall, bottomWall };
    }

    /**
     * Create text geometry for scores
     */
    createScoreText(font) {
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

        const mat = new MeshStandardMaterial({color: new Color(COLOR_FONT)});
        const playerScore = new Mesh(geometry, mat);
        const opponentScore = new Mesh(geometry, mat);
        
        playerScore.castShadow = true;
        opponentScore.castShadow = true;
        playerScore.position.copy(POSITION_PLAYER_SCORE);
        opponentScore.position.copy(POSITION_OPPONENT_SCORE);
        
        return { playerScore, opponentScore };
    }

    /**
     * Configure court model
     */
    configureCourt(gltf) {
        const court = gltf.scene.children[0];
        court.position.copy(POSITION_COURT);
        court.rotateOnAxis(new Vector3(1, 0, 0), degToRad(ROTATION_X_ANGLE_COURT));
        court.receiveShadow = true;
        court.castShadow = false;
        
        return gltf.scene;
    }

    /**
     * Setup audio system
     */
    setupAudio() {
        new AudioHandler();
        
        const ballDrop = new Audio(FILE_AUDIO_WALL_HIT);
        const paddleHit = new Audio(FILE_AUDIO_PADDLE_HIT);
        const goal = new Audio(FILE_AUDIO_GOAL_SCORED);
        
        AudioHandler.addTrack(ballDrop, TAG_WALL_HIT);
        AudioHandler.addTrack(paddleHit, TAG_PADDLE_HIT);
        AudioHandler.addTrack(goal, TAG_GOAL_SCORED);
        AudioHandler.setMuted(AUDIO_MUTED);
    }

    /**
     * Setup GUI controls
     */
    setupGUI() {
        this.guiManager.setupAudioControls();
        return this.guiManager;
    }

    /**
     * Get the GUI manager instance
     */
    getGUIManager() {
        return this.guiManager;
    }

    /**
     * Setup window resize handler
     */
    setupResizeHandler() {
        const handleResize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);

            const pixelRatio = Math.min(window.devicePixelRatio, 2);
            this.renderer.setPixelRatio(pixelRatio);
        };

        window.addEventListener('resize', handleResize);
        return handleResize;
    }

    /**
     * Add all game objects to the game instance
     */
    addObjectsToGame(gameObjects) {
        const { 
            ball, 
            outside, 
            playerCapsule, 
            aiCapsule, 
            ambientLight, 
            directionalLight, 
            topWall, 
            bottomWall 
        } = gameObjects;

        // Add basic objects
        this.game.addObject(ambientLight, TAG_AMBIENT_LIGHT);
        this.game.addObject(directionalLight, TAG_DIRECTIONAL_LIGHT);
        this.game.addObject(this.camera, TAG_CAMERA);
        this.game.addObject(outside, TAG_OUTSIDE);
        this.game.addObject(topWall, TAG_TOP_WALL);
        this.game.addObject(bottomWall, TAG_BOTTOM_WALL);

        // Add game-specific objects
        this.game.addPlayerTwo(aiCapsule);    // Player two (AI by default)
        this.game.addPlayerOne(playerCapsule); // Player one (Human by default)
        this.game.addBall(ball, TAG_BALL);
        
        // Add colliders
        this.game.addCollider(topWall, TAG_TOP_WALL);
        this.game.addCollider(bottomWall, TAG_BOTTOM_WALL);
    }

    /**
     * Add score objects to the game
     */
    addScoresToGame(scoreObjects) {
        const { playerScore, opponentScore } = scoreObjects;
        this.game.addObject(playerScore, TAG_PLAYER_SCORE);
        this.game.addObject(opponentScore, TAG_OPPONENT_SCORE);
    }

    /**
     * Add court to the game
     */
    addCourtToGame(courtScene) {
        this.game.addObject(courtScene, TAG_COURT);
    }

    /**
     * Main initialization method that orchestrates the entire setup
     */
    async initialize() {
        // Initialize core components
        this.initRenderer();
        this.initCamera();
        this.initGame();

        // Create game objects
        const ball = this.createBall();
        const outside = this.createOutside();
        const { playerCapsule, aiCapsule } = this.createPaddles();
        const { ambientLight, directionalLight } = this.createLighting();
        const { topWall, bottomWall } = this.createWalls();

        // Add objects to game
        this.addObjectsToGame({
            ball,
            outside,
            playerCapsule,
            aiCapsule,
            ambientLight,
            directionalLight,
            topWall,
            bottomWall
        });

        // Setup resize handler
        this.setupResizeHandler();

        // Load assets and setup additional components
        const fontPromise = LoadFont(FILE_FONT).then(font => {
            const scores = this.createScoreText(font);
            this.addScoresToGame(scores);
        });

        const courtPromise = LoadGLTF(FILE_COURT_MODEL).then(gltf => {
            const courtScene = this.configureCourt(gltf);
            this.addCourtToGame(courtScene);
        });

        // Wait for all assets to load
        await Promise.all([fontPromise, courtPromise]);

        // Setup audio and GUI
        this.setupAudio();
        this.setupGUI();

        return this.game;
    }
    
    /**
     * Configure player roles after initialization
     * @param {'player-one-human' | 'player-two-human'} config - Player configuration
     */
    configurePlayerRoles(config = 'player-one-human') {
        if (!this.game) {
            throw new Error('Game must be initialized before configuring player roles');
        }
        
        switch (config) {
            case 'player-one-human':
                this.game.setPlayerOneAsHuman();
                break;
            case 'player-two-human':
                this.game.setPlayerTwoAsHuman();
                break;
            default:
                console.warn(`Unknown player configuration: ${config}. Using default.`);
                this.game.setPlayerOneAsHuman();
        }
    }
}