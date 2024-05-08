class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);
        this.visible = false;
        this.active = false;
        scene.add.existing(this);
        this.setScale(3);
        return this;
    }

    update() {
        // moves bullet
        if (this.active && !this.scene.isPaused) {
            this.y -= this.speed;
            if (this.y < -(this.displayHeight/2)) {
                this.makeInactive();
            }
        }
        else {
            this.makeInactive();
        }
    }

    makeActive() {
        this.visible = true;
        this.active = true;
    }

    makeInactive() {
        this.visible = false;
        this.active = false;
    }

}