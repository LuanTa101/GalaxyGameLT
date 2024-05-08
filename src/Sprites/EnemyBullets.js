class EnemyBullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);
        this.visible = false;
        this.active = false;
        this.setScale(3);
        this.flipY = true;
        scene.add.existing(this);
        // Create a graphics object to draw the outline
        // this.graphics = scene.add.graphics({ lineStyle: { color: 0xffffff } });

        // Call drawPlayerOutline to initially draw the outline
        // this.drawFireOutline();
        return this;
    }

    update() {
        // Moves bullet downwards
        if (this.active && !this.scene.isPaused) {
            this.y += this.speed;
            // this.drawFireOutline();
            // Check if bullet is off-screen
            if (this.y > this.scene.sys.game.config.height) {
                this.makeInactive();
            }
        } else {
            this.makeInactive();
        }
    }

    makeActive() {
        this.visible = true;
        this.active = true;
        this.scene.soundFlag = true;
    }

    makeInactive() {
        this.visible = false;
        this.active = false;
        this.scene.soundFlag = false;
    }
    drawOriginPoint() {
        // Draw a small circle at the origin
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0xFF0000, 1);
        graphics.fillCircle(this.originX, this.originY, 10); // Assumes originY is 0
        graphics.setDepth(999); // Ensure it's above other sprites
    }
    // Method to draw the player outline
    drawFireOutline() {
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
