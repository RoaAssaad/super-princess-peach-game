class Score extends Sprite {
    constructor(x, y, initialScore = 0) {
        super();
        this.screenX = x;
        this.screenY = y;
        this.score = initialScore; // Initial score value =0
    }
    // Increment the score by the given number of points
    increment(points) {
        this.score += points;
    }

    getScore() {
        return this.score;
    }

    draw(ctx) {
        ctx.save(); // Save the canvas state
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformations
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(`Score: ${this.score}`, this.screenX, this.screenY);
        ctx.restore(); // Restore the canvas state
    }

    update() {
        return false; // No update logic for score
    }
}
