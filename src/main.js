import '../style.css'
import {GameInitializer} from "./GameInitializer.js";
// Initialize the game using the GameInitializer class
const gameInitializer = new GameInitializer();

function loop(game) {
    game.tick();
    requestAnimationFrame(() => loop(game));
}

// Initialize everything and start the game loop
gameInitializer.initialize().then(game => {
    loop(game);
}).catch(error => {
    console.error('Failed to initialize game:', error);
});