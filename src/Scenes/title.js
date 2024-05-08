// Global scope
let myScore = 0;
let currScore;
class Title extends Phaser.Scene {

    constructor() {
        super("title");
        this.deadEnemies = 0;
    }
    // Preload function to load assets
    preload() {
        // Art
        this.load.setPath("./assets/Art/");
        this.load.image("button", "paint_arrow_right_double.png");
        // Sound
        this.load.setPath("./assets/Sound/");
        this.load.audio("proceed", "Holographic Tap Interaction.wav");
        this.load.audio("hoverMouse", "FUI Holographic Interaction Radiate.wav");
        // Update instruction text
        document.getElementById('description').innerHTML = '<h2>title.js<br>Space - shoot<br>A - move left // D - move right</h2>'
    }

    // Create function to set up the scene
    create() {
        // Add background color
        this.cameras.main.setBackgroundColor('#3498db');
        currScore = myScore;
        myScore = 0;
        // Define button positions, labels, and scenes
        const buttonData = [
            { x: 512, y: 350, label: 'Play', scene: 'blackScreen' },
            { x: 512, y: 570, label: 'High Score', scene: 'highScore' },
            { x: 512, y: 790, label: 'Credits', scene: 'credits' }
        ];
    
        this.titleText = this.add.text(this.sys.game.config.width / 2, 100, 'Not On My Planet', { fontSize: '64px', fill: '#000000' });
        this.titleText.setOrigin(0.5);
        // Add buttons
        buttonData.forEach(data => {
            const button = this.add.sprite(data.x, data.y, "button").setInteractive();
            // Scale down the button by half
            button.setScale(0.8);
            // Add text to the button
            const buttonText = this.add.text(button.x - 10, button.y - 20, data.label, {
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
                // Start the corresponding scene
                if (data.label === "Play") {
                    this.sound.play("proceed", {volume: 1});
                    this.scene.start("blackScreen", { levelText: "Level 1", nextScene: "first" });
                    this.deadEnemies = 0;
                }
                else {
                    console.log(data.label + ' button clicked!');
                    this.sound.play("proceed", {volume: 1});
                    this.scene.start(data.scene);
                }
            });
        });
    }
}