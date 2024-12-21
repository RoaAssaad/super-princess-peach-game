class LevelManager extends Sprite {
    constructor(game) {
        super();
        this.game = game;
        this.currentLevelIndex = 1; // Start with Level 1
        this.score = new Score(75, 30, 0); // Score
        this.lives = new Lives(75, 60, 3); //  lives
        this.lives.onGameOver = this.displayGameOverScreen.bind(this); // Game Over Screen
        this.isGameOver = false; // Track game over state
        this.isLevelWon = false; // Track level won state
        this.gameOverScreen = new GameOverScreen(800, 500); // Initialize Game Over screen with canvas dimensions
        this.youWinScreen = new YouWinScreen(800, 500); // Initialize You Won screen with canvas dimensions
        this.mainMenuScreen = new MainMenuScreen(800, 500, this); // Initialize Main Menu screen
        this.textScreen = null; //  displaying text screens like (How to Play)
        this.backgroundMusic = new Audio('sounds/BackgroundMusic.mp3') // Background music
    }


    //Display the Game Over screen when the player loses all lives.
    displayGameOverScreen() {
        this.isGameOver = true; // Mark game as over
        this.game.sprites = []; // Clear all existing sprites
    }

     // Display the You Won screen when the player wins the level.
     
    displayYouWinScreen() {
        this.isLevelWon = true; // Mark level as won
        this.game.sprites = []; // Clear all existing sprites
    }

    displayTextScreen(title, message) {
        this.textScreen = new TextScreen(800, 500, title, message, this.mainMenuScreen);
        this.game.sprites = [];
        this.game.addSprite(this.textScreen);
    }


     //Load a specific level using index.
    loadLevel(levelIndex) {
        this.backgroundMusic.play();// Play the background music
        this.backgroundMusic.loop = true;// Loop the background music
        this.backgroundMusic.volume = 0.1;// Set the volume of the background music
        this.currentLevelIndex = levelIndex; // Update the current level index
        this.resetCurrentLevel(); // Reset and load the level
    }

    
     //Reset the current level, clearing and reinitializing all relevant elements.
     
    resetCurrentLevel() {
        // Prevent resetting if Game Over or You Won screen is active
        if (this.isGameOver || this.isLevelWon) return;

        // Clear all sprites in the game
        this.game.sprites = [];
        this.game.camera.reset(); // Reset the camera

        // Set level boundaries
        const levelWidth = 3000;
        const levelHeight = 800;
        this.game.setLevelBoundaries(levelWidth, levelHeight);

        // Instantiate common sprites
        const background = new Background("images/Background.png", levelWidth, levelHeight);
        const ground = new Ground(0, 450, levelWidth, 200);
        const player = new Player(50, ground.y - 50, 40, 60, this.score, this.lives, this);

        // Add common sprites
        this.game.addSprite(background);
        this.game.addSprite(ground);
        this.game.addSprite(player);

        // Load level-specific elements
        const levelSetupFunction = this[`setupLevel${this.currentLevelIndex}`];
        if (typeof levelSetupFunction === "function") {
            levelSetupFunction.call(this, this.game); // Call the setup function for the current level
        } else {
            console.error(`Level ${this.currentLevelIndex} does not exist.`);
        }

        // Add score and lives 
        this.game.addSprite(this.score);
        this.game.addSprite(this.lives);
    }

     // Reset the entire game, clearing states and restarting from level 1.
     
    resetGame() {
        this.isGameOver = false; // Exit Game Over state
        this.isLevelWon = false; // Exit You Won state
        this.lives.lives = 3; // Reset lives
        this.score.score = 0; // Reset score
        this.currentLevelIndex = 1; // Reset to Level 1
        this.resetCurrentLevel(); // Reload Level 1
    }


     //Level 1 setup: add platforms, coins,  enemies, and power-ups.
    setupLevel1(game) {
        const platforms = [
            new Platform(300, 355, 200, 30),  // Platform 1
            new Platform(650, 350, 180, 30), // Platform 2
            new Platform(1000, 320, 220, 30), // Platform 3
            new Platform(1350, 290, 200, 30), // Platform 4
            new Platform(1650, 260, 180, 30), // Platform 5
            new Platform(1950, 230, 200, 30), // Platform 6
            new Platform(2300, 200, 200, 30), // Platform 7
        ];
    
        // Add platforms to the game
        platforms.forEach(platform => {
            platform.setFrameType("default"); //type of platform
            game.addSprite(platform);
        });
    
        // Add enemies to platforms
        game.addSprite(new Enemy(320, 315, 40, 40, 2, 100)); // Enemy on Platform 1
        game.addSprite(new Enemy(1050, 280, 40, 40, 2, 100)); // Enemy on Platform 3
        game.addSprite(new Enemy(1670, 220, 40, 40, 2, 100)); // Enemy on Platform 5
        game.addSprite(new Enemy(2320, 160, 40, 40, 2, 100)); // Enemy on Platform 7
    
        // Add coins to platforms
        game.addSprite(new Coin(740, 320, 30)); // Coin on Platform 2
        game.addSprite(new Coin(1380, 250, 30)); // Coin on Platform 4
        game.addSprite(new Coin(2050, 200, 30)); // Coin on Platform 6

        // Add power-ups to the third and fourth platforms
        game.addSprite(new PowerUp(680, 310, 40, "mushroom")); // Mushroom above Platform 2
        game.addSprite(new PowerUp(1970, 190, 40, "star")); // Star above Platform 6

    
        // Add two enemies on the ground
        game.addSprite(new Enemy(400, 410, 40, 40, 2, 100)); // Ground Enemy 1
        game.addSprite(new Enemy(1800, 410, 40, 40, 2, 100)); // Ground Enemy 2
    }
    

     // Level 2 setup: add platforms, coins, enemies , and power-ups.
    setupLevel2(game) {
        // Platforms:
        const platforms = [
            new Platform(200, 360, 160, 30), // Platform 1
            new Platform(430, 340, 160, 30), // Platform 2 
            new Platform(700, 310, 180, 30), // Platform 3
            new Platform(910, 280, 180, 30), // Platform 4 
            new Platform(1250, 260, 150, 30), // Platform 5 
            new Platform(1500, 240, 200, 30), // Platform 6 
            new Platform(1800, 210, 180, 30), // Platform 7 
        ];
    
        // Add platforms to the game
        platforms.forEach(platform => {
            platform.setFrameType("green");//type of platform
            game.addSprite(platform);
        });
    
        // Add enemies to platforms 
        game.addSprite(new Enemy(450, 300, 40, 40, 2, 100)); // Enemy on Platform 2
        game.addSprite(new Enemy(930, 250, 40, 40, 3, 150)); // Enemy on Platform 4
        game.addSprite(new Enemy(1270, 230, 40, 40, 3, 150)); // Enemy on Platform 5
        game.addSprite(new Enemy(1820, 180, 40, 40, 3, 150)); // Enemy on Platform 7
    
        // Add coins above platforms 
        game.addSprite(new Coin(230, 360 - 35, 30)); // Coin above Platform 1
        game.addSprite(new Coin(780, 290 - 35, 30)); // Coin above Platform 3
        game.addSprite(new Coin(940, 240 - 35, 30)); // Coin above Platform 4
        game.addSprite(new Coin(1590, 240 - 35, 30)); // Coin above Platform 6
        game.addSprite(new Coin(1830, 200 - 35, 30)); // Coin above Platform 7

        game.addSprite(new PowerUp(720, 270, 40, "mushroom")); // Mushroom  above Platform 3
        game.addSprite(new PowerUp(1520, 200, 40, "star")); // Star above Platform 6
    
        // Add enemies on the ground 
        game.addSprite(new Enemy(350, 410, 40, 40, 3, 100)); // Ground Enemy 1
        game.addSprite(new Enemy(700, 410, 40, 40, 3, 100)); // Ground Enemy 2
        game.addSprite(new Enemy(2000, 410, 40, 40, 3, 100)); // Ground Enemy 4 
    
        // Add coins on the ground 
        game.addSprite(new Coin(600, 410 - 35, 30)); // Ground Coin 1
        game.addSprite(new Coin(1800, 410 - 35, 30)); // Ground Coin 2
    }
    
    
    
    
    
    // Draw the overlay elements: score, lives, and end screens.
    drawOverlay(ctx) {
        ctx.save(); // Save the current canvas state
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any transformations
        this.score.draw(ctx); // Draw the score 
        this.lives.draw(ctx); // Draw the lives 
        if (this.isGameOver) {
            this.gameOverScreen.draw(ctx);
        } else if (this.isLevelWon) {
            this.youWinScreen.draw(ctx);
        } else if (this.textScreen) {
            this.textScreen.draw(ctx);
        }
        ctx.restore(); 
    }
}
