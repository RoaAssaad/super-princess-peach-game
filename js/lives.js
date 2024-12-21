class Lives extends Sprite {
    constructor(x, y, initialLives = 3) {
        super();
        this.screenX = x;// Screen x-coordinate
        this.screenY = y;// Screen y-coordinate
        this.lives = initialLives;// Number of lives 
        this.onGameOver = null; // Game Over
    }
    // Decrement the number of lives by 1
    decrement() { 
        this.lives = Math.max(0, this.lives - 1);
        if (this.lives === 0 && typeof this.onGameOver === "function") {
            this.onGameOver(); // Game Over 
        }
    }
    // Increment the number of lives by 1
    increment() { 
        this.lives += 1;
    }
    
// Get the current number of lives
    getLives() {
        return this.lives;
    }

    draw(ctx) {
        ctx.save(); // Save the canvas state
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformations
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(`Lives: ${this.lives}`, this.screenX, this.screenY);
        ctx.restore(); // Restore the canvas state
    }

    update() {
        return false; // No update logic for lives
    }
}
