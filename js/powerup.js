class PowerUp extends Sprite {
    constructor(x, y, size, type) {
        super();
        this.x = x;
        this.y = y;
        this.size = size;
        this.width = size; // Camera uses width for isVisible() function
        this.height = size; //  Camera uses height for isVisible() function
        this.collected = false;
        this.type = type; // "mushroom" or "star"

        // Sprite sheet properties
        this.image = new Image();
        this.image.src = "images/powerup.png"; // Path to the power-up sprite sheet

        // Animation frames based on type
        this.frames = this.getFramesForType(type);
        this.frameIndex = 0;
        this.lastUpdate = Date.now();
        this.timePerFrame = 150; // Animation speed in milliseconds
    }

    // Get the animation frames based on the power-up type
    getFramesForType(type) {
        if (type === "mushroom") {
            return [
                { x: 0, y: 8, width: 17, height: 18 },
                { x: 0, y: 25, width: 17, height: 19 }
            ];
        } else if (type === "star") {
            return [
                { x: 141, y: 8, width: 18, height: 17 },
                { x: 160, y: 8, width: 16, height: 17 }
            ];
        }
        return [];
    }

    update(sprites) {
        if (this.collected) return true;

        const now = Date.now();
        if (now - this.lastUpdate >= this.timePerFrame) {
            this.frameIndex = (this.frameIndex + 1) % this.frames.length;
            this.lastUpdate = now;
        }
        // Check for collision with the player
        for (let sprite of sprites) {
            if (sprite instanceof Player && this.isCollidingWith(sprite)) {
                this.collected = true;
                sprite.activatePowerUp(); // Apply the power-up effect
                break;
            }
        }

        return false; // Power-up remains in the game until collected
    }

    draw(ctx) {
        if (!this.collected) {
            const frame = this.frames[this.frameIndex];
            ctx.drawImage(
                this.image,
                frame.x,
                frame.y,
                frame.width,
                frame.height,
                this.x,
                this.y,
                this.size,
                this.size
            );
        }
    }
//check for collision with the player
    isCollidingWith(sprite) {
        return (
            this.x < sprite.x + sprite.width &&
            this.x + this.width > sprite.x &&
            this.y < sprite.y + sprite.height &&
            this.y + this.height > sprite.y
        );
    }
}
