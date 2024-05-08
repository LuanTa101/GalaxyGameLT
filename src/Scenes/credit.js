class Credits extends Phaser.Scene {

    constructor() {
        super("credits");
    }

    preload() {
        // Art
        this.load.setPath("./assets/Art/");
        this.load.image("button", "paint_arrow_right_double.png");
        // Sound
        this.load.setPath("./assets/Sound/");
        this.load.audio("proceed", "Holographic Tap Interaction.wav");
        this.load.audio("hoverMouse", "FUI Holographic Interaction Radiate.wav");
        this.load.audio("back", "Holographic Interaction-32.wav");
        // Update instruction text
        document.getElementById('description').innerHTML = '<h2>credit.js<br>Space - shoot<br>A - move left // D - move right</h2>'
    }

    create() {
        // Add background color
        this.cameras.main.setBackgroundColor('#3498db');
        // Add text
        this.creditText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.width / 2, 'Created by: Luan Ta', { fontSize: '64px', fill: '#000000' });
        this.creditText.setOrigin(0.5);
        // Creat button
        const button = this.add.sprite(this.sys.game.config.width / 2, 900, "button").setInteractive();
        // Scale down the button by half
        button.flipX = true;
        button.setScale(0.8);
        // Add text to the button
        const buttonText = this.add.text(button.x + 20, button.y - 25, "Return", {
            fontFamily: 'Times',
            fontSize: '55px',
            color: '#3498db'
        }).setOrigin(0.5);

        // Set up pointer events for the button
        button.on('pointerover', () => {
            this.sound.play("hoverMouse", {volume: 1});
            buttonText.setColor('#ff0000'); // Change color of the text
        });
        button.on('pointerout', () => {
            buttonText.setColor('#3498db'); // Revert color of the text
        });
        button.on('pointerdown', () => {
            this.sound.play("back", {volume: 1});
            this.scene.start("title");
        });
    }
}