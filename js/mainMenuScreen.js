class MainMenuScreen {
    constructor(width, height, startGameCallback, howToPlayCallback, storyCallback, keysCallback) {
        this.width = width;
        this.height = height;
        this.startGameCallback = startGameCallback;
        this.howToPlayCallback = howToPlayCallback;
        this.storyCallback = storyCallback;
        this.keysCallback = keysCallback;

        this.options = ["Play", "How to Play", "Story", "Keys"];
        this.selectedIndex = 0; // Track which option is selected
    }

    draw(ctx) {
        // Draw light blue background
        ctx.fillStyle = "#90c9ed";
        ctx.fillRect(0, 0, this.width, this.height);

        // Draw title
        ctx.fillStyle = "#eb62a2";
        ctx.font = "bold 36px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Super Princess Peach 3", this.width / 2, 100);

        // Draw helper text
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText("Use Arrow Keys to choose an option, Press Enter to select.", this.width / 2, 140);

        // Draw menu options
        for (let i = 0; i < this.options.length; i++) {
            ctx.fillStyle = i === this.selectedIndex ? "yellow" : "white";
            ctx.font = i === this.selectedIndex ? "bold 24px Arial" : "20px Arial";
            ctx.fillText(this.options[i], this.width / 2, 200 + i * 40);
        }
    }

    handleKeyPress(key) {
        if (key === "ArrowUp") {
            this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
        } else if (key === "ArrowDown") {
            this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
        } else if (key === "Enter") {
            // Trigger the appropriate callback
            switch (this.selectedIndex) {
                case 0:
                    this.startGameCallback();//start game
                    break;
                case 1:
                    this.howToPlayCallback();//how to play
                    break;
                case 2:
                    this.storyCallback();//story
                    break;
                case 3:
                    this.keysCallback(); //keys
                    break;
                default:
                    break;
            }
        }
    }
}
