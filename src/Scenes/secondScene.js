class lvl2 extends Phaser.Scene {
    curve
    constructor() {
        super("second");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings
        this.playerHealth = 3; // Initialize player's health to 3
        this.playerSpeed = 10;
        this.my.sprite.emptyHearts = []; // Initialize empty array for empty hearts
        this.bulletCooldown = 50;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;
        this.bulletSpeed = 10;
        this.isPaused = false;
        this.scoreText = null;
        this.numEnemies = 9;
        this.deadEnemies = 0;

        this.bodyX = 500;
        this.bodyY = 850;
        this.canvasX = 512;
        this.canvasY = 512;
        this.heartX = 70;
        this.heartY = 975;

        this.points = [
            41, 171,
            902, 168,
            919, 306,
            63, 294,
            59, 424,
            911, 458
        ];
    }

    preload() {
        // Art
        this.load.setPath("./assets/Art/");
        this.load.image("avatar", "alienBlue_front.png");
        this.load.image("fireball", "fireball.png");
        this.load.image("bg", "backgroundColorForest.png")
        this.load.image("emptyHeart", "hudHeart_empty.png");
        this.load.image("fullHeart", "hudHeart_full.png");
        this.load.image("barn", "barnacle.png");
        // Animation
        this.load.image("yell1","paint_splat_1.png");
        this.load.image("yell2","paint_splat_2.png");
        this.load.image("yell3","paint_splat_3.png");
        this.load.image("yell4","paint_splat_4.png");
        // Sound
        this.load.setPath("./assets/Sound/");
        this.load.audio("squish", "LIQImpt_Goo Splatter_09.wav");
        this.load.audio("shoot", "LASRGun_Plasma Rifle Fire_03.wav")
        this.load.audio("theyShoot", "LASRGun_Particle Compressor Fire_01.wav");
        this.load.audio("playerHurt", "GUNTech_Sci Fi Shotgun Fire_04.wav");
        this.load.audio("gameOverSound","TAPE STOP_15.wav" );
        this.load.audio("levelComplete", "DSGNStngr_Kill Confirm Metallic_02.wav");
        // Update instruction text
        document.getElementById('description').innerHTML = '<h2>secondScene.js<br>Space - shoot<br>A - move left // D - move right</h2>'
    } 

    create() {
        let my = this.my;
        // Add sprites
        // background
        my.sprite.back = this.add.sprite(this.canvasX, this.canvasY, "bg");
        // hearts
        my.sprite.fullHearts = [];
        for (let i = 0; i < 3; i++) {
            my.sprite.fullHearts.push(this.add.sprite(this.heartX + i * 100, this.heartY, "fullHeart"));
        }

        // Add curve
        this.curve = new Phaser.Curves.Spline(this.points);

        // Array to hold fish enemies
        my.sprite.fishEnemies = [];
        console.log("Points:", this.points);

        this.createFishEnemies(0); // Start creating fish enemies at index 0

        // Add Game Over text
        this.gameOverText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'Game Over', { fontSize: '64px', fill: '#000000' });
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.setVisible(false); // Initially hide the text
        this.restartText = this.add.text(this.sys.game.config.width / 2, (this.sys.game.config.height / 2) + 100, 'Press "R" to restart', { fontSize: '64px', fill: '#000000' });
        this.restartText.setOrigin(0.5);
        this.restartText.setVisible(false);

        // Create Animation
        this.anims.create({
            key: "splat",
            frames: [
                { key: "yell1" },
                { key: "yell2" },
                { key: "yell3" },
                { key: "yell4" },
            ],
            frameRate: 20,
            repeat: 3,
            hideOnComplete: true
        });

        // Add score text
        this.scoreText = this.add.text(620, 950, "Score: " + myScore, {
            fontFamily: 'Times, serif',
            fontSize: 75,
            color: '#000000' // Black
        });
        this.scoreText.setDepth(3);

        // Bullets
        my.sprite.bulletGroup = this.add.group({
            defaultKey: "fireball",
            maxSize: 2,
            runChildUpdate: true,
        })

        my.sprite.bulletGroup.createMultiple({
            classType: Bullet,
            active: true,
            visible: false,
            key: my.sprite.bulletGroup.defaultKey,
            repeat: my.sprite.bulletGroup.maxSize-1
        })
        my.sprite.bulletGroup.propertyValueSet("speed", this.bulletSpeed);

        // Enemy Bullets
        my.sprite.enemyBulletGroup = this.add.group({
            defaultKey: "fireball",
            maxSize: 3,
            runChildUpdate: true
        });
        
        my.sprite.enemyBulletGroup.createMultiple({
            classType: EnemyBullet,
            active: false,
            visible: false,
            key: my.sprite.enemyBulletGroup.defaultKey,
            repeat: my.sprite.enemyBulletGroup.maxSize - 1
        });
        my.sprite.enemyBulletGroup.propertyValueSet("speed", this.bulletSpeed);

        // Inputs
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        let prevScore = myScore;
        this.input.keyboard.on('keydown-R', function () {
            this.scene.restart(); // Restart the scene
            myScore = prevScore;
            this.deadEnemies = 0;
            this.playerHealth = 3;
            this.isPaused = false;
        }, this);

        // Sound flags
        this.gameOverSoundPlayed = false;
        this.levelCompleteSoundPlayed = false;

        // Player
        my.sprite.player = new Player(this, this.bodyX, this.bodyY, "avatar", null, this.aKey, this.dKey, this.playerSpeed);
    }  


    update() {
        let my = this.my;
        this.bulletCooldownCounter--;
        // Check for bullet being fired
        if (this.spaceKey.isDown && !this.isPaused) {
            if (this.bulletCooldownCounter < 0) {
                // Get the first inactive bullet, and make it active
                let bullet = my.sprite.bulletGroup.getFirstDead();
                // bullet will be null if there are no inactive (available) bullets
                if (bullet != null) {
                    this.sound.play("shoot", {volume: 0.5});
                    this.bulletCooldownCounter = this.bulletCooldown;
                    bullet.x = my.sprite.player.x;
                    bullet.y = my.sprite.player.y - 40;
                    bullet.makeActive();
                }
            }
        }

        my.sprite.fishEnemies.forEach((fishEnemy) => {
            // player bullet collision with enemy
            my.sprite.bulletGroup.getChildren().forEach(bullet => {
                if (this.collides(fishEnemy, bullet)) {
                    // Start animation
                    this.splat = this.add.sprite(fishEnemy.x, fishEnemy.y, "yell1").play("splat");
                    bullet.y = -100;
                    fishEnemy.stopFollow();
                    this.sound.play("squish", {volume: 1});
                    // Update score
                    myScore += 125;
                    this.deadEnemies++;
                    this.updateScore();
                    // Remove the fish enemy from the game scene
                    fishEnemy.destroy();
                    // Remove the fish enemy from the fishEnemies array
                    my.sprite.fishEnemies.splice(my.sprite.fishEnemies.indexOf(fishEnemy), 1);
                }
            });
        });

        // Check collision between enemy bullets and player
        my.sprite.enemyBulletGroup.getChildren().forEach(enemyBullet => {
            if (enemyBullet.active && !this.isPaused && this.collides(my.sprite.player, enemyBullet)) {
                // Collision detected
                // Decrease player health only if the bullet is active and the game is not paused
                this.sound.play("playerHurt", {volume: 0.5});
                myScore -= 50;
                this.updateScore();
                this.playerHealth--;
                // Update the display of player health
                if (this.playerHealth >= 0) {
                    my.sprite.fullHearts[this.playerHealth].setVisible(false); // Hide the full heart
                    // Show empty heart in its place
                    my.sprite.emptyHearts.push(this.add.sprite(this.heartX + this.playerHealth * 100, this.heartY, "emptyHeart"));
                    console.log("Player health decreased");
                }
                if (this.playerHealth === 0){
                    this.splat = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "yell1").play("splat");
                    my.sprite.player.visible = false;
                    my.sprite.player.x = -100;
                }
                enemyBullet.makeInactive();
            }
        });

        // Check if player's health is 0
        if (this.playerHealth <= 0) {
            // Show Game Over text and play game over sound
            if (!this.gameOverSoundPlayed) {
                // Play game over sound only if it hasn't been played before
                this.sound.play("gameOverSound", {volume: 1});
                this.gameOverSoundPlayed = true; // Set the flag to true to indicate that the sound has been played
            }
            this.gameOverText.setVisible(true);
            this.restartText.setVisible(true);
            this.isPaused = true;
        } else {
            // Hide Game Over text if health is not 0
            this.gameOverText.setVisible(false);
            this.restartText.setVisible(false);
        }


        // Check if all enemies are dead
        if (this.deadEnemies === this.numEnemies) {
            if (!this.levelCompleteSoundPlayed) {
                // Play level complete sound only if it hasn't been played before
                this.sound.play("levelComplete", {volume: 1});
                this.levelCompleteSoundPlayed = true; // Set the flag to true to indicate that the sound has been played
            }
    
            if (this.levelCompleteSoundPlayed) {
                // Start a timer event to switch the scene after 3 seconds
                this.time.delayedCall(4000, () => {
                    this.scene.start("blackScreen", { levelText: "Level 3", nextScene: "third" });
                    this.playerHealth = 3;
                    this.deadEnemies = 0;
                });
            }
        }
        // update the player avatar by by calling the player's update()
        if (!this.isPaused) {
            my.sprite.fishEnemies.forEach((fishEnemy) => {
                // Resume fish movement
                fishEnemy.resumeFollow();
            });
            my.sprite.player.update();
            this.resumeEnemyBulletShooting();   
        }
        else {
            // Pause fish movement and enemy bullet shooting when the game is paused
            my.sprite.fishEnemies.forEach((fishEnemy) => {
                fishEnemy.pauseFollow();
            });
            this.pauseEnemyBulletShooting();
        }
    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        if (this.scoreText) {
            this.scoreText.setText("Score: " + myScore);
        }
    }

    // Method to pause enemy bullet shooting
    pauseEnemyBulletShooting() {
        this.my.sprite.fishEnemies.forEach((fishEnemy) => {
            if (fishEnemy.enemyBulletTimer) {
                fishEnemy.enemyBulletTimer.paused = true;
            }
        });
    }

    // Method to resume enemy bullet shooting
    resumeEnemyBulletShooting() {
        this.my.sprite.fishEnemies.forEach((fishEnemy) => {
            if (fishEnemy.enemyBulletTimer) {
                fishEnemy.enemyBulletTimer.paused = false;
            }
        });
    }

    createFishEnemies(index) {
        // Check if the maximum number of enemies has been reached
        if (index >= this.numEnemies) {
            return; // Exit the function if the maximum number is reached
        }
    
        // Get initial x and y coordinates from the points array
        let initX = this.points[0];
        let initY = this.points[1];
    
        // Create fish enemy at the initial position after a 1-second delay
        this.time.delayedCall(1000, () => {
            let fishEnemy = this.add.follower(this.curve, initX, initY, "barn");
            fishEnemy.startFollow({
                from: 0,
                to: 1,
                duration: 10000,
                ease: 'Linear',
                repeat: -1,
                yoyo: true,
                rotateToPath: false,
                rotationOffset: -90
            });
            // Push the newly created fish enemy into the array
            this.my.sprite.fishEnemies.push(fishEnemy);
            // Schedule bullet shooting for this fish enemy
            this.scheduleEnemyBulletShootingForFish(fishEnemy);
            // Create the next fish enemy after this one
            this.createFishEnemies(index + 1);
            console.log("Enemies:", this.my.sprite.fishEnemies);
        });
    }

    // Method to schedule enemy bullet shooting for a specific fish enemy
    scheduleEnemyBulletShootingForFish(fishEnemy) {
        fishEnemy.enemyBulletTimer = this.time.addEvent({
            delay: Phaser.Math.Between(1000, 3000), // Random delay between shots
            callback: () => {
                this.enemyShootBullet(fishEnemy); // Pass the fish enemy to shoot bullet
            },
            callbackScope: this,
            loop: true
        });
    }
    
    enemyShootBullet(fishEnemy) {
        if (fishEnemy.visible) {
            let bullet = this.my.sprite.enemyBulletGroup.getFirstDead();
            // If there is a bullet available, activate and shoot it
            if (bullet) {
                this.sound.play("theyShoot", { volume: 0.5 });
                bullet.x = fishEnemy.x;
                bullet.y = fishEnemy.y + 80;
                bullet.makeActive();
            }
        }
    }
}