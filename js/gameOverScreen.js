class GameOverScreen {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        if (!ctx) {
            return;
        }
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformations
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.fillStyle = "white";
        ctx.font = "50px  Bold Super Mario";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", this.width / 2, this.height / 2 - 20);
        ctx.fillText("Press R to Restart Level", this.width / 2, this.height / 2 + 20);
        ctx.restore();
    }
}
