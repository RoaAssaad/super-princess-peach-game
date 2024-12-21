class Player extends Sprite {
    constructor(x, y, width, height, score, lives, levelManager) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.defaultWidth = width; // Store original size for resetting
        this.defaultHeight = height;// Store original size for resetting
        this.score = score; // Score instance
        this.lives = lives; // Lives instance
        this.levelManager = levelManager; // LevelManager instance
        this.isPoweredUp = false;// Power-up state
        this.powerUpTimer = 0; // Timer for power-up immunity
        this.immuneToLifeLoss = false; // Immune to losing lives when powered up
        this.jumpSoundEffect = new Audio('sounds/jump.wav');// Jump sound effect
        this.coinSoundEffect = new Audio('sounds/coin.wav');// Coin collecting sound effect
        this.squashSoundEffect = new Audio('sounds/squash.wav'); // Enemy squash sound effect
        this.powerUpSoundEffect = new Audio('sounds/powerup.wav'); // Power-up sound effect

        this.image = new Image();
        this.image.src = "images/princess.png"; // Path to Princess Peach sprite sheet

        // Frame data for animations
        this.frames = {
            idle: [{ x: 7, y: 5, width: 23, height: 36 }],
            walk: [
                { x: 8, y: 230, width: 24, height: 35 },
                { x: 31, y: 230, width: 24, height: 36 },
                { x: 57, y: 231, width: 26, height: 35 },
                { x: 87, y: 232, width: 26, height: 33 },
                { x: 116, y: 232, width: 26, height: 34 },
                { x: 148, y: 230, width: 24, height: 35 }
                
            ],

            left: [{ x: 305, y: 53, width: 25, height: 40 },
                { x: 359, y: 56, width: 25, height: 37 }],

            jump: [
                { x: 9, y: 359, width: 24, height: 33 },
                { x: 36, y: 357, width: 26, height: 36 }
            ]
        };

        this.currentAnimation = "idle";
        this.frameIndex = 0;
        this.lastUpdate = Date.now();
        this.timePerFrame = 100; // Animation speed in milliseconds

        this.dy = 0; // Vertical velocity
        this.gravity = 0.6; // Gravity strength
        this.isOnGround = false; // Grounded state
        this.jumpSpeed = -12; // Initial jump speed
        this.speed = 5;// Horizontal speed
    }

    // Activate power-up effect
    activatePowerUp() {
        if (!this.isPoweredUp) {
            this.isPoweredUp = true;// Set power-up state
            this.immuneToLifeLoss = true;// Immune to losing lives
            this.width = this.defaultWidth * 1.5; // Increase width
            this.height = this.defaultHeight * 1.5;// Increase height
            this.score.increment(50); // Increment score by 50
            this.powerUpTimer = 300; // Duration of power-up effect in frames per second
            // Adjust the position to keep the player on the ground/platform
            this.y -= (this.height - this.defaultHeight);
        }
    }

    update(sprites, keys) {
        // Handle movement
        if (keys["ArrowLeft"]) {
            this.x -= this.speed;// Move left
            if (this.isOnGround) this.changeAnimation("left");// Change to left animation
        } else if (keys["ArrowRight"]) { 
            this.x += this.speed;// Move right
            if (this.isOnGround) this.changeAnimation("walk"); // Change to walk animation
        } else if (this.isOnGround) {
            this.changeAnimation("idle");// Change to idle animation
        }

        // Handle jumping
        if (keys[" "] && this.isOnGround) {
            this.jumpSoundEffect.play(); // Play jump sound
            this.dy = this.jumpSpeed;// Set vertical velocity
            this.isOnGround = false;// Update grounded state
            this.changeAnimation("jump"); // Change to jump animation
        }

        // Apply gravity
        this.dy += this.gravity;
        this.y += this.dy;

        // Reset ground state before checking collisions
        this.isOnGround = false;

        if (this.isPoweredUp) {
            this.powerUpTimer--;
            if (this.powerUpTimer <= 0) {
                this.isPoweredUp = false;
                this.immuneToLifeLoss = false;
                this.width = this.defaultWidth;
                this.height = this.defaultHeight;
                this.y += (this.defaultHeight - this.height); // Adjust to keep player aligned
            }
        }

        // Collision detection
        for (let sprite of sprites) {
            if (sprite instanceof Ground) {
                if (this.y + this.height >= sprite.y && this.dy >= 0) {
                    this.y = sprite.y - this.height; // Align with ground
                    this.dy = 0; // Stop downward motion
                    this.isOnGround = true; // Mark player as on the ground
                }
            }
            // Check for platform collisions
            if (sprite instanceof Platform) {
                if (this.handlePlatformCollision(sprite)) {
                    this.isOnGround = true;
                }
            }

            // Check for coin collisions
            if (sprite instanceof Coin) {
                if (
                    !sprite.collected &&
                    this.isCollidingWith(sprite)
                ) {
                    this.coinSoundEffect.play();// Play coin sound
                    sprite.collected = true;
                    this.score.increment(10); // Increment score
                }
            }
            // Check for power-up collisions
            if (sprite instanceof PowerUp) {
                if (!sprite.collected && this.isCollidingWith(sprite)) {
                    this.powerUpSoundEffect.play();// Play power-up sound
                    sprite.collected = true;
                    this.activatePowerUp(); // Activate power-up
                }
            }
            //Check for enemy collisions
             for (let sprite of sprites) {
            if (sprite instanceof Enemy && this.isCollidingWith(sprite)) {
                this.handleEnemyCollision(sprite);
            }
        }
        
        }

        // Prevent player from leaving the canvas horizontally
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > 3000) this.x = 3000 - this.width;

        // Reset player if they fall off the screen
        if (this.y > 500) {
            this.resetPosition();
        }

        if (this.x + this.width >= 3000) { // Check if player reaches end of canvas
            this.levelManager.displayYouWinScreen(); // Display You Win screen
        }
        

        this.animate(); // Update animation
    }

    handleEnemyCollision(enemy) {
        if (this.dy > 0 && this.y + this.height <= enemy.y + enemy.height / 2) {
            // Check if player lands on top of the enemy
            this.squashSoundEffect.play(); // Play squash sound
            enemy.defeat(); // Squash the enemy
            this.dy = -5; // Bounce slightly
        } else if (!enemy.isDefeated) {
            // Side collisions with an undefeated enemy
            if (
                this.x + this.width > enemy.x && // Right side of player with left side of enemy
                this.x < enemy.x + enemy.width // Left side of player with right side of enemy
            ) {
                if (this.isPoweredUp) {
                    // If the player is powered up, remove the power-up
                    this.isPoweredUp = false; // Disable power-up
                    this.immuneToLifeLoss = false; // Disable life loss immunity
                    this.width = this.defaultWidth; // Reset width
                    this.height = this.defaultHeight;// Reset height
                    this.y += (this.defaultHeight - this.height); // Adjust position
                } else if (!this.immuneToLifeLoss) {
                    this.resetPosition(); // Lose a life if not immune and reset position
                }
            }
        }
    }
    
    
// Handle player collision with platforms
    handlePlatformCollision(platform) {
        if (
            this.dy > 0 && // Player is falling
            this.y + this.height <= platform.y + this.dy && // Player's bottom is just above platform
            this.y + this.height > platform.y && // Player's bottom overlaps platform's top
            this.x + this.width > platform.x && // Horizontally within platform
            this.x < platform.x + platform.width // Horizontally within platform
        ) {
            this.y = platform.y - this.height; // Align player with top of platform
            this.dy = 0; // Stop downward motion
            return true;
        }

        // Prevent jumping through the platform
        if (
            this.dy < 0 && // Player is moving upward
            this.y <= platform.y + platform.height && // Player's top is below platform's bottom
            this.y + this.height > platform.y && // Player overlaps platform vertically
            this.x + this.width > platform.x && // Player is horizontally within the platform
            this.x < platform.x + platform.width // Player is horizontally within the platform
        ) {
            this.dy = 0; // Cancel upward velocity
            this.y = platform.y + platform.height; // Push player below the platform
            return false; // Player doesn't land on the platform
        }

        return false;
    }
// Reset player position and decrement lives
    resetPosition() {
        if (this.lives.getLives() > 0) {
            this.lives.decrement(); // Lose a life
            this.x = 50; // Reset player position
            this.y = 400;
            this.dy = 0;
            this.levelManager.resetCurrentLevel(); // Reset level
        } 
    }

// Check if the player is colliding with another sprite
    isCollidingWith(sprite) {
        return (
            this.x < sprite.x + sprite.width &&
            this.x + this.width > sprite.x &&
            this.y < sprite.y + sprite.height &&
            this.y + this.height > sprite.y
        );
    }

    draw(ctx) {
        const frames = this.frames[this.currentAnimation];
        const frame = frames ? frames[this.frameIndex] : this.frames["idle"][0];

        if (!frame) {
            return;
        }

        ctx.drawImage(
            this.image,
            frame.x, // Source x
            frame.y, // Source y
            frame.width, // Source width
            frame.height, // Source height
            this.x, // Destination x
            this.y, // Destination y
            this.width, // Destination width
            this.height // Destination height
        );
    }
    // Animate the player sprite
    animate() {
        const now = Date.now();
        if (now - this.lastUpdate >= this.timePerFrame) {
            const frames = this.frames[this.currentAnimation];
            if (frames && frames.length > 0) {
                this.frameIndex = (this.frameIndex + 1) % frames.length;
                this.lastUpdate = now;
            }
        }
    }
    // Change the current animation
    changeAnimation(animation) {
        if (this.currentAnimation !== animation) {
            this.currentAnimation = animation;
            this.frameIndex = 0;
        }
    }
}
