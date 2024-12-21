const game = new Game();
const levelManager = new LevelManager(game);

let gameState = "MAIN_MENU"; // Game states: MAIN_MENU, INFO_SCREEN, GAME, GAME_OVER, YOU_WIN
let activeScreen = null;

// Main Menu instance
const mainMenu = new MainMenuScreen(
    800,
    500,
    function () {
        gameState = "GAME"; // Transition to GAME state
        levelManager.loadLevel(1);
    },
    function () {
        gameState = "INFO_SCREEN";
        activeScreen = new InfoScreen(
            800,
            500,
            "How to Play",
            "Use Arrow Keys to Move.\nCollect the Coins!\nCollect the Power-Ups!\nPress Space to Jump\nJump from platform to another!\nJump on enemies to defeat them!\nPress P to Pause, C to Continue, R to Restart.",
            function () {
                gameState = "MAIN_MENU"; // Return to Main Menu
                activeScreen = null;
            }
        );
    },
    function () {
        gameState = "INFO_SCREEN";
        activeScreen = new InfoScreen(
            800,
            500,
            "Story",
            "Princess Peach's Blossom Kingdom is under attack!\nMischievous enemies have unleashed chaos.\nHelp Peach jump, collect coins, power-ups and defeat enemies\non her quest to restore peace to the kingdom!",
            function () {
                gameState = "MAIN_MENU"; // Return to Main Menu
                activeScreen = null;
            }
        );
    },
    function () {
        gameState = "INFO_SCREEN";
        activeScreen = new InfoScreen(
            800,
            500,
            "Keys",
            "Arrow Keys: Move\nSpace: Jump\nP: Pause\nC: Continue\nR: Restart",
            function () {
                gameState = "MAIN_MENU"; // Return to Main Menu
                activeScreen = null;
            }
        );
    }
);

// Keyboard event listener
document.addEventListener("keydown", function (e) {
    switch (gameState) {
        case "MAIN_MENU":
            mainMenu.handleKeyPress(e.key);
            break;

        case "INFO_SCREEN":
            if (activeScreen) {
                activeScreen.handleKeyPress(e.key);
            }
            break;

        case "GAME":
            if (e.key === "r") {
                if (levelManager.isGameOver) {
                    levelManager.resetGame(); // Restart game
                } else {
                    levelManager.resetCurrentLevel(); // Restart level
                }
            } else if (e.key === "n" && levelManager.isLevelWon) {
                levelManager.isLevelWon = false; // Exit You Win state
                levelManager.loadLevel(levelManager.currentLevelIndex + 1); // Load next level
            }
            break;

        default:
            console.warn(`Unhandled game state: ${gameState}`);
            break;
    }
});

// Animation loop using gameState
function animateGame() {
    switch (gameState) {
        case "MAIN_MENU":
            game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
            mainMenu.draw(game.ctx);
            break;

        case "INFO_SCREEN":
            if (activeScreen) {
                game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
                activeScreen.draw(game.ctx);
            }
            break;

        case "GAME":
            if (!game.paused) {
                game.update();
                game.draw();
                levelManager.drawOverlay(game.ctx); // Draw score, lives ,and end screens
            }
            break;
    }
    requestAnimationFrame(animateGame);
}

// Start the animation loop
animateGame();
