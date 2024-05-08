class Player extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame, leftKey, rightKey, playerSpeed) {
        super(scene, x, y, texture, frame);
        this.left = leftKey;
        this.right = rightKey;
        this.playerSpd = playerSpeed;
        scene.add.existing(this);
        this.setOrigin(0.5);
        this.setScale(0.8);
        // Create a graphics object to draw the outline
        this.graphics = scene.add.graphics({ lineStyle: { color: 0xffffff } });
        // Call drawPlayerOutline to initially draw the outline
        // this.drawPlayerOutline();
        return this;
    }

    update() {
        // Moving left
        if (this.left.isDown && this.x > 50) {
                this.x -= this.playerSpd;
        }
        // Moving right
        if (this.right.isDown && this.x < game.config.width - 50) {
            this.x += this.playerSpd;
        }
        // Redraw the player outline every update to keep it constant
        // this.drawPlayerOutline();
    }

    // Method to draw the player outline
    drawPlayerOutline() {
        // Clear the graphics object
        this.graphics.clear();
        // Get player's bounding box
        const bounds = this.getBounds();
        // Calculate dimensions and position for the outline
        const width = bounds.width;
        const height = bounds.height;
        const offsetX = bounds.x + width / 2;
        const offsetY = bounds.y + height;
        // Draw the outline
        this.graphics.strokeRect(offsetX - width / 2, offsetY - height, width, height);
    }
}