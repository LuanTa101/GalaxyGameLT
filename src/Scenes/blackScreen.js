class BlackScreen extends Phaser.Scene {
    constructor() {
        super("blackScreen");
    }

    init(data) {
        this.levelText = data.levelText || "Level 1"; // Default text is "Level"
        this.nextScene = data.nextScene || "first"; // Default scene to transition to
    }

    create() {
        // Create a black rectangle covering the entire canvas
        let rect = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, this.cameras.main.width, this.cameras.main.height, 0x000000);
        rect.setDepth(1);

        // Add level text
        let text = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, this.levelText, { fontSize: '64px', fill: '#ffffff' });
        text.setOrigin(0.5);
        text.setDepth(2);

        // Fade out the black screen and the text after 2 seconds
        this.tweens.add({
            targets: [rect, text],
            alpha: 0,
            duration: 2000,
            onComplete: () => {
                // Start the next scene after the fade-out animation completes
                this.scene.start(this.nextScene);
            }
        });
    }
}