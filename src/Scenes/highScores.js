class HS extends Phaser.Scene {

    constructor() {
        super("highScore");
        // Initialize high scores array with initial scores as 0
        this.highScores = [
            { score: 0 },
            { score: 0 },
            { score: 0 }
        ];
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
        this.load.audio("back", "Holographic Interaction-32.wav");
        // Update instruction text
        document.getElementById('description').innerHTML = '<h2>highScores.js<br>Space - shoot<br>A - move left // D - move right</h2>'
    }

    create() {
        // Add background color
        this.cameras.main.setBackgroundColor('#3498db');
        let keepScore = currScore;

        // Check if the current score is higher than any of the high scores
        for (let i = 0; i < this.highScores.length; i++) {
            if (keepScore > this.highScores[i].score) {
                // Insert the current score at the current position and remove the last element
                this.highScores.splice(i, 0, { score: keepScore });
                this.highScores.pop();
                break; // Exit the loop since the score is inserted
            }
        }

        // Display high scores on the screen
        for (let i = 0; i < this.highScores.length; i++) {
            const scoreText = this.add.text(this.sys.game.config.width / 2, 400 + i * 100, 
                `${i + 1}. ${this.highScores[i].score}`, 
                { fontSize: '40px', fill: '#000000' });
            scoreText.setOrigin(0.5);
        }
        // Add return button
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