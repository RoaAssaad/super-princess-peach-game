class Platform extends Sprite {
    constructor(x, y, width, height) {
        super();
        this.x = x;// X-coordinate of the platform
        this.y = y;// Y-coordinate of the platform
        this.width = width;// Width of the platform
        this.height = height;// Height of the platform

        // Sprite sheet properties
        this.image = new Image();
        this.image.src = "images/Bricks.png"; // Path to Bricks sprite sheet

        // Frame data for platform styles
        this.frames = {
            default: [{ x: 272, y: 113, width: 33, height: 15 }],
            green:   [{ x: 271, y: 159, width: 33, height: 17 }],
        };

        // Animation state
        this.currentFrame = this.frames.default[0]; // Use the first frame of the "default" type by default
    }

    setFrameType(type) {
        if (this.frames[type]) {
            this.currentFrame = this.frames[type][0]; // Set to the first frame of the given type
        } else {
            console.error(`Invalid frame type: ${type}`);
            this.currentFrame = this.frames.default[0]; // Fallback to default
        }
    }

    update() {
        return false; // Platforms do not move
    }

    draw(ctx) {
        // Draw the sprite for the platform
        ctx.drawImage(
            this.image,
            this.currentFrame.x, this.currentFrame.y, // Source x, y
            this.currentFrame.width, this.currentFrame.height, // Source width, height
            this.x, this.y, // Destination x, y
            this.width, this.height // Destination width, height
        );
    }
}
