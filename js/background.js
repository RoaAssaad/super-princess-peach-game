class Background extends Sprite {
    constructor(src, levelWidth, levelHeight) {
        super();
        this.image = new Image();
        this.image.src = src; // Path to the background image
        this.x = 0; // Start at the origin
        this.y = 0; // Start at the origin
        this.width = levelWidth; // Match the level width
        this.height = levelHeight; // Match the level height
    }

    draw(ctx) {
        // Draw the background to cover the entire level
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    update() {
        // Background remains static and does not require updates
    }
}
