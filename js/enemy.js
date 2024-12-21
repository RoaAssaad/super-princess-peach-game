class Enemy extends Sprite {
    constructor(x, y, width, height, speed, range) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed; // Horizontal speed
        this.startX = x; // Starting x-coordinate
        this.range = range; // Movement range
        this.direction = 1; // 1 for right, -1 for left
        this.isDefeated = false; // Status to track if defeated
        this.defeatTimer = 0; // Timer to handle defeat duration
        this.remove = false; // Mark for removal

        // Sprite sheet setup
        this.image = new Image();
        this.image.src = "images/Goomba.png"; // Sprite sheet path
        this.frames = {
            walk: [
                { x: 8, y: 6, width: 18, height: 20 },
                { x: 30, y: 7, width: 19, height: 19 },
                { x: 51, y: 6, width: 20, height: 20 },
                { x: 74, y: 7, width: 19, height: 19 },
            ],

            squashed: [{ x: 77, y: 34, width: 20, height: 18 },],
            
        };
        this.currentAnimation = "walk"; // Default animation
        this.frameIndex = 0;
        this.lastUpdate = Date.now();
        this.timePerFrame = 200;
    }

    update(sprites, levelManager) {
        // If the enemy is marked for removal, stop updating
        if (this.remove) {
            return;
        }

        // Handle defeat logic
        if (this.isDefeated) {
            this.defeatTimer++;
            if (this.defeatTimer > 60) { // Enemy disappears after 60 frames
                this.remove = true; // Mark for removal
            }
            return; // Skip normal updates for defeated enemies
        }

        // Normal enemy movement
        this.x += this.speed * this.direction;
        if (this.x <= this.startX || this.x >= this.startX + this.range) {
            this.direction *= -1; // Reverse direction at range limits
        }

        this.animate();
    }

    defeat() {
        if (!this.isDefeated) {
            this.isDefeated = true;
            this.currentAnimation = "squashed"; // Switch to squashed animation
            this.frameIndex = 0; // Reset animation frame
            this.defeatTimer = 0; // Start the timer for removal
            this.speed = 0; // Stop movement after being squashed
        }
    }

    draw(ctx) {
        // If the enemy is marked for removal, do not draw
        if (this.remove) {
            return;
        }

        const frames = this.frames[this.currentAnimation];
        const frame = frames ? frames[this.frameIndex] : null;

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

    animate() {
        const now = Date.now();
        if (now - this.lastUpdate >= this.timePerFrame) {
            const frames = this.frames[this.currentAnimation];
            if (frames && frames.length > 0) {
                this.frameIndex = (this.frameIndex + 1) % frames.length; // Loop through frames
                this.lastUpdate = now;
            }
        }
    }
}
