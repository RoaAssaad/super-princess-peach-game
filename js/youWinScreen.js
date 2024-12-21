class YouWinScreen  {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformations
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.fillStyle = "white";
        ctx.font = "50px  Bold Super Mario";
        ctx.textAlign = "center";
        ctx.fillText("Level Complete!", this.width / 2, this.height / 2 - 20);
        ctx.fillText("Press N for Next Level", this.width / 2, this.height / 2 + 20);
        ctx.restore();
    }
}
