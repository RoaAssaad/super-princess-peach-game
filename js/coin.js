class Coin extends Sprite {
    constructor(x, y, size) {
        super();
        this.x = x;
        this.y = y;
        this.size = size;
        this.width = size; // Camera uses width fot isVisible() function
        this.height = size; // Camera uses height fot isVisible() function
        this.collected = false;

        // Sprite sheet properties  
        this.image = new Image();
        this.image.src  = "images/coins.png";// Path to the coin sprite sheet

        // Animation frames 
        this.frames = [
            { x: 37, y: 2, width: 15, height: 16 },
            { x: 55, y: 2, width: 17, height: 18 },
            { x: 75, y: 0, width: 4, height: 18 },
            { x: 80, y: 1, width: 16, height: 17 }
        ];
        this.frameIndex = 0;
        this.lastUpdate = Date.now();
        this.timePerFrame = 150; // Animation speed in milliseconds
    }

    update() {
        // If collected, remove coin
        if (this.collected) return true;

        // Animate the coin
        const now = Date.now();
        if (now - this.lastUpdate >= this.timePerFrame) {
            this.frameIndex = (this.frameIndex + 1) % this.frames.length;
            this.lastUpdate = now;
        }
        return false;
    }

    draw(ctx) {
        if (!this.collected) {
            const frame = this.frames[this.frameIndex];
            if (frame) {
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
            } else {
                console.error("Invalid frame data:", this.frames[this.frameIndex]);
            }
        }
    }
    
}
