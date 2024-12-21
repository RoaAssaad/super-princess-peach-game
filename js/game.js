class Camera {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;

    // Camera behavior configuration
    this.leftOffset = 160; // Distance from left edge where player should stay
    this.rightOffset = 160; // Distance from right edge where player should stop camera
    this.verticalDeadzone = 50; // Vertical deadzone for smooth platform transitions
    this.horizontalSmoothing = 0.1; // Camera smoothing factor for horizontal movement
    this.verticalSmoothing = 0.05; // Camera smoothing factor for vertical movement

    // Level boundaries
    this.maxX = 0;
    this.maxY = 0;
  }

  setLevelBoundaries(width, height) {
    this.maxX = Math.max(0, width - this.canvas.width);
    this.maxY = Math.max(0, height - this.canvas.height);
  }

  update(player) {
    if (!player) return;

    // Calculate target camera position
    let targetX = player.x - this.leftOffset;
    let targetY = player.y - this.height / 2;

    // Prevent backward scrolling
    targetX = Math.max(targetX, this.x);

    // Apply level boundaries
    targetX = Math.max(0, Math.min(targetX, this.maxX));
    targetY = Math.max(0, Math.min(targetY, this.maxY));

    // Smooth camera movement
    this.x += (targetX - this.x) * this.horizontalSmoothing;

    // Only adjust vertical position if change is significant
    if (Math.abs(targetY - this.y) > this.verticalDeadzone) {
      this.y += (targetY - this.y) * this.verticalSmoothing;
    }
  }

  reset() {
    // Reset camera to its initial position
    this.x = 0;
    this.y = 0;
}
  worldToScreen(x, y) {
    return {
      x: x - this.x,
      y: y - this.y,
    };
  }

  screenToWorld(x, y) {
    return {
      x: x + this.x,
      y: y + this.y,
    };
  }

  isVisible(sprite) {
    return (
      sprite.x + sprite.width > this.x &&
      sprite.x < this.x + this.width &&
      sprite.y + sprite.height > this.y &&
      sprite.y < this.y + this.height
    );
  }

  // Apply camera transform to context
  begin(ctx) {
    ctx.save();
    ctx.translate(-this.x, -this.y);
  }

  // Restore context state
  end(ctx) {
    ctx.restore();
  }
}


//game.js
class Sprite {
  constructor() {}

  update() {}

  draw(ctx) {}
}

class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.sprites = [];
    this.keys = {}; // Store active keys
    this.camera = new Camera(this.canvas);
    this.paused = false; // Initial pause state
    this.bindKeyboardEvents();
  }

  setLevelBoundaries(width, height) {
    this.camera.setLevelBoundaries(width, height);
  }

  addSprite(sprite) {
    this.sprites.push(sprite);
  }

  update() {
    if (this.paused) return; // Skip updating if paused

    let updatedSprites = [];
    let player = null; // Track the player sprite

    for (let i = 0; i < this.sprites.length; i++) {
      let sprite = this.sprites[i];

      if (sprite instanceof Player) {
        player = sprite; // Assign the player
      }

      if (!sprite.update(this.sprites, this.keys)) {
        updatedSprites.push(sprite); // Only keep non-removed sprites
      }
    }

    this.camera.update(player); // Update camera based on the player
    this.sprites = updatedSprites;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.camera.begin(this.ctx);

    for (let i = 0; i < this.sprites.length; i++) {
      const sprite = this.sprites[i];
      if (this.camera.isVisible(sprite)) {
        sprite.draw(this.ctx);
      }
    }

    this.camera.end(this.ctx);
  }

  animate() {
    if (!this.paused) {
      this.update();
      this.draw();
    }
    requestAnimationFrame(() => this.animate());
  }

  bindKeyboardEvents() {
    // Handle keydown event
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true; // Mark the key as active

      // Pause and continue logic
      if (e.key === "p") {
        this.paused = true; // Pause the game
      }
      if (e.key === "c") {
        this.paused = false; // Resume the game
      }
    });

    // Handle keyup event
    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false; // Mark the key as inactive
    });
  }
}
