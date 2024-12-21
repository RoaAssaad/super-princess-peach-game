class InfoScreen extends Sprite {
    constructor(width, height, title, message, onBack) {
        super();
        this.width = width;
        this.height = height;
        this.title = title;// Title of the screen
        this.message = message;// Message to display
        this.onBack = onBack; // go back to the previous screen
    }

    draw(ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformations
        ctx.fillStyle = "#90c9ed";
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.title, this.width / 2, 100);

        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        const lines = this.message.split("\n");
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], 50, 200 + i * 30);
        }

        ctx.font = "20px Arial";
        ctx.fillStyle = "yellow";
        ctx.textAlign = "center";
        ctx.fillText("Press Enter to go back", this.width / 2, this.height - 50);

        ctx.restore();
    }

    handleKeyPress(key) {
        if (key === "Enter") {
            this.onBack();
        }
    }
}
